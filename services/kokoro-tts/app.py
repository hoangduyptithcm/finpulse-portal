import os
import io
import re
import hashlib
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import soundfile as sf
import torch

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("kokoro-vietnamese-service")

app = FastAPI(
    title="Kokoro Vietnamese TTS Service",
    description="High-quality Vietnamese Text-To-Speech microservice based on Kokoro architecture (iamdinhthuan/Kokoro-Vietnamese)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device selection: CUDA if available, otherwise CPU
DEVICE = os.getenv("DEVICE", "cuda" if torch.cuda.is_available() else "cpu")
DEFAULT_VOICE = os.getenv("DEFAULT_VOICE", "diem_trinh")
SAMPLE_RATE = 24000

# Cache storage
AUDIO_CACHE = {}
MAX_CACHE_ITEMS = int(os.getenv("MAX_CACHE_ITEMS", "300"))

# Global TTS pipeline instance
tts_pipelines = {}

def get_tts_pipeline(voice: str = DEFAULT_VOICE):
    """Lazy load pipeline for requested voice"""
    if voice not in tts_pipelines:
        logger.info(f"Loading Kokoro-Vietnamese model for voice '{voice}' on device '{DEVICE}'...")
        try:
            from kokoro_vietnamese import KokoroVietnamese
            tts_pipelines[voice] = KokoroVietnamese(device=DEVICE, voice=voice)
            logger.info(f"Model for voice '{voice}' loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load Kokoro-Vietnamese voice '{voice}': {e}")
            raise HTTPException(status_code=500, detail=f"Không thể tải mô hình giọng đọc '{voice}': {str(e)}")
    return tts_pipelines[voice]


def int_to_vietnamese(n: int) -> str:
    """Chuyển đổi số nguyên dương sang chuỗi chữ Tiếng Việt chuẩn ngữ âm"""
    if n == 0:
        return "không"
    units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]

    def read_three_digits(num: int, is_highest: bool = False) -> str:
        h = num // 100
        t = (num % 100) // 10
        u = num % 10
        res = []
        if h > 0:
            res.append(units[h] + " trăm")
        elif not is_highest:
            res.append("không trăm")

        if t > 1:
            res.append(units[t] + " mươi")
            if u == 1:
                res.append("mốt")
            elif u == 4:
                res.append("tư")
            elif u == 5:
                res.append("lăm")
            elif u > 0:
                res.append(units[u])
        elif t == 1:
            res.append("mười")
            if u == 5:
                res.append("lăm")
            elif u > 0:
                res.append(units[u])
        elif t == 0:
            if u > 0:
                if not is_highest or h > 0:
                    res.append("lẻ " + units[u])
                else:
                    res.append(units[u])
        return " ".join(res).strip()

    scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"]
    parts = []
    scale_idx = 0
    temp = n
    while temp > 0:
        chunk = temp % 1000
        if chunk > 0:
            is_highest = temp < 1000
            text = read_three_digits(chunk, is_highest=is_highest)
            if scales[scale_idx]:
                text += " " + scales[scale_idx]
            parts.insert(0, text)
        temp //= 1000
        scale_idx += 1
    return " ".join(parts).strip()


def read_decimal_part(dec_str: str) -> str:
    """Đọc phần thập phân sau dấu phẩy (ví dụ .40 -> bốn mươi, .5 -> năm, .05 -> không năm)"""
    if not dec_str:
        return ""
    if dec_str.startswith("0"):
        return " ".join([int_to_vietnamese(int(d)) for d in dec_str])
    return int_to_vietnamese(int(dec_str))


def normalize_vietnamese_numbers(text: str) -> str:
    """
    Quy đổi toàn bộ số (ngày tháng, phần trăm, số nghìn/tỷ, số thập phân, tiền tệ) sang chữ Tiếng Việt
    để mô hình AI Kokoro và bộ phiên âm vig2p đọc chuẩn 100% âm tiết
    """
    # 0. Chuẩn hoá ký tự toán học, dấu âm, dấu xấp xỉ & Unicode đặc biệt
    text = text.replace("−", "-").replace("–", "-").replace("—", ", ")
    text = text.replace("≈", " xấp xỉ ").replace("~", " khoảng ").replace("→", " sang ")

    # Ký hiệu khoa học: 4.29e-06 -> khoảng không
    text = re.sub(r"\b\d+(?:[.,]\d+)?e-\d+\b", "khoảng không", text, flags=re.IGNORECASE)

    # 1. Tiền tệ $ và € và đơn vị đồng
    def replace_dollar(match):
        num = match.group(1)
        scale = match.group(2) or ""
        if scale:
            return f"{num} {scale} đô la Mỹ"
        return f"{num} đô la Mỹ"

    text = re.sub(r"\$(\d+(?:[.,]\d+)?)\s*(triệu|tỷ|nghìn)?\s*(?:USD|usd)?", replace_dollar, text)
    text = re.sub(r"(\d+(?:[.,]\d+)?)\s*\$", r"\1 đô la Mỹ", text)
    text = re.sub(r"€(\d+(?:[.,]\d+)?)\s*(triệu|tỷ|nghìn)?\s*(?:EUR|eur)?", replace_dollar, text)
    text = re.sub(r"(\d+(?:[.,]\d+)?)\s*€", r"\1 ơ rô", text)
    text = re.sub(r"(\d+(?:[.,]\d+)?)\s*(?:đ|₫|vnđ|vnd|VNĐ|VND)(?=[^\w]|$)", r"\1 đồng", text)
    text = re.sub(r"\b(tỷ|triệu|nghìn)\s*(?:VND|VNĐ|vnd|vnđ)\b", r"\1 đồng", text)

    # 2. Tỷ lệ/phần trăm có khoảng: 10-15% hoặc 10% - 15%
    text = re.sub(r"\b(\d+(?:[.,]\d+)?)\s*[-–—]\s*(\d+(?:[.,]\d+)?)\s*%", r"\1 đến \2 phần trăm", text)

    # 3. Khoảng giữa hai số: 10 - 20 tỷ, 1-2 ngày, 1.200 - 1.300, 83.900-84.650
    text = re.sub(r"(?<=\d)\s*[-–—]\s*(?=\d)", " đến ", text)

    # 4. Ngày tháng năm
    # Nhận diện ngày tháng có từ chỉ thời gian: sáng 3/10, chiều 3/10, ngày 3/10, phiên 3/10, hôm 3/10
    text = re.sub(
        r"(?i)\b(sáng|trưa|chiều|tối|ngày|hôm|phiên|thứ|snapshot)\s+(\d{1,2})/(\d{1,2})\b",
        r"\1 ngày \2 tháng \3",
        text,
    )
    # Dạng 3/10 đứng trước dấu hai chấm hoặc ICT: 3/10: hoặc 3/10 ICT
    text = re.sub(
        r"\b(\d{1,2})/(\d{1,2})\s*(?=:|ICT\b|–|-|,)",
        r"ngày \1 tháng \2",
        text,
    )

    def replace_date_full(match):
        d = int(match.group(1))
        m = int(match.group(2))
        y = match.group(3) if match.lastindex and match.lastindex >= 3 else None
        if 1 <= d <= 31 and 1 <= m <= 12:
            res = f"ngày {int_to_vietnamese(d)} tháng {int_to_vietnamese(m)}"
            if y:
                res += f" năm {int_to_vietnamese(int(y))}"
            return res
        return match.group(0)

    # Có tiền tố "ngày"
    text = re.sub(r"(?i)\bngày\s+(\d{1,2})[/\-](\d{1,2})(?:[/\-](\d{4}))?\b", replace_date_full, text)
    # Có đủ dd/mm/yyyy
    text = re.sub(r"\b(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})\b", replace_date_full, text)

    # Dạng dd/mm không có tiền tố: nếu có số 0 ở đầu (09, 01) hoặc ngày > 12 -> ngày tháng, còn lại phân số
    def replace_short_date_or_fraction(match):
        d_str, m_str = match.group(1), match.group(2)
        d, m = int(d_str), int(m_str)
        if 1 <= d <= 31 and 1 <= m <= 12 and (
            (len(d_str) == 2 and d_str.startswith("0")) or
            (len(m_str) == 2 and m_str.startswith("0")) or
            d > 12
        ):
            return f"ngày {int_to_vietnamese(d)} tháng {int_to_vietnamese(m)}"
        return f"{int_to_vietnamese(d)} phần {int_to_vietnamese(m)}"

    text = re.sub(r"\b(\d{1,2})/(\d{1,2})\b", replace_short_date_or_fraction, text)

    # Tháng/năm: tháng 9/2024
    text = re.sub(
        r"(?i)\btháng\s+(\d{1,2})[/](\d{4})\b",
        lambda m: f"tháng {int_to_vietnamese(int(m.group(1)))} năm {int_to_vietnamese(int(m.group(2)))}",
        text,
    )

    # Giờ phút: 9h30, 9h, 14:30, 08:40
    text = re.sub(
        r"\b(\d{1,2})h(\d{1,2})\b",
        lambda m: f"{int_to_vietnamese(int(m.group(1)))} giờ {int_to_vietnamese(int(m.group(2)))}",
        text,
    )
    text = re.sub(r"\b(\d{1,2})h\b", lambda m: f"{int_to_vietnamese(int(m.group(1)))} giờ", text)
    text = re.sub(
        r"\b(\d{1,2}):(\d{2})\b",
        lambda m: f"{int_to_vietnamese(int(m.group(1)))} giờ {int_to_vietnamese(int(m.group(2)))}",
        text,
    )

    # 5. Quý trong năm (hỗ trợ cả chữ số và số La Mã)
    quarter_names = {
        "1": "một", "2": "hai", "3": "ba", "4": "bốn",
        "i": "một", "ii": "hai", "iii": "ba", "iv": "bốn",
        "I": "một", "II": "hai", "III": "ba", "IV": "bốn",
    }
    text = re.sub(
        r"(?i)\bquý\s+([1-4]|I{1,3}|IV)\b",
        lambda m: f"quý {quarter_names[m.group(1)]}",
        text,
    )
    text = re.sub(
        r"(?i)\bQ([1-4]|I{1,3}|IV)\b",
        lambda m: f"quý {quarter_names[m.group(1)]}",
        text,
    )

    # 6. Ký hiệu nghìn (k/K) và triệu (tr) hỗ trợ cả số nguyên và số thập phân: 84.6k, 84,6k, 1.5tr, 1,5tr
    def replace_k(match):
        num_part = match.group(1)
        if "," in num_part or "." in num_part:
            w, d = re.split(r"[.,]", num_part)
            return f"{int_to_vietnamese(int(w))} phẩy {read_decimal_part(d)} nghìn"
        return f"{int_to_vietnamese(int(num_part))} nghìn"

    text = re.sub(r"\b(\d+(?:[.,]\d+)?)\s*[kK]\b", replace_k, text)

    def replace_tr(match):
        num_part = match.group(1)
        if "," in num_part or "." in num_part:
            w, d = re.split(r"[.,]", num_part)
            return f"{int_to_vietnamese(int(w))} phẩy {read_decimal_part(d)} triệu"
        return f"{int_to_vietnamese(int(num_part))} triệu"

    text = re.sub(r"\b(\d+(?:[.,]\d+)?)\s*tr\b", replace_tr, text)

    # 7. Phần trăm: +0,84% hoặc -0,67% hoặc 18,2% hoặc 18%
    text = re.sub(r"(?i)\b(tăng|đạt|lên)\s*\+\s*", r"\1 ", text)
    text = re.sub(r"(?i)\b(giảm|xuống|mất)\s*-\s*", r"\1 ", text)

    def replace_percent(match):
        sign = match.group(1) or ""
        num_part = match.group(2)
        prefix = "âm " if sign == "-" else ("dương " if sign == "+" else "")
        if "," in num_part or "." in num_part:
            w, d = re.split(r"[.,]", num_part)
            num_text = f"{int_to_vietnamese(int(w))} phẩy {read_decimal_part(d)}"
        else:
            num_text = int_to_vietnamese(int(num_part))
        return f"{prefix}{num_text} phần trăm"

    text = re.sub(r"([+-])?(\d+(?:[.,]\d+)?)\s*%", replace_percent, text)

    # 8. Phân cách hàng nghìn kiểu Việt Nam: 1.292,40 hoặc 4.900 hoặc 1.000.000 hoặc 84.600
    def replace_vn_thousands(match):
        whole = match.group(1).replace(".", "")
        dec = match.group(2)
        whole_text = int_to_vietnamese(int(whole))
        if dec:
            dec_digits = dec[1:]
            dec_text = read_decimal_part(dec_digits) if dec_digits else ""
            return f"{whole_text} phẩy {dec_text}".strip()
        return whole_text

    text = re.sub(r"\b(\d{1,3}(?:\.\d{3})+)(,\d+)?\b", replace_vn_thousands, text)

    # 9. Phân cách hàng nghìn kiểu Mỹ: 1,292.40 hoặc 4,900 hoặc 84,633
    def replace_us_thousands(match):
        whole = match.group(1).replace(",", "")
        dec = match.group(2)
        whole_text = int_to_vietnamese(int(whole))
        if dec:
            dec_digits = dec[1:]
            dec_text = read_decimal_part(dec_digits) if dec_digits else ""
            return f"{whole_text} phẩy {dec_text}".strip()
        return whole_text

    text = re.sub(r"\b(\d{1,3}(?:,\d{3})+)(\.\d+)?\b", replace_us_thousands, text)

    # 10. Số thập phân đơn giản còn lại: 10,5 hoặc 10.5 hoặc 84.6 hoặc 84,6
    def replace_decimal(match):
        whole = int(match.group(1))
        dec = match.group(2)
        return f"{int_to_vietnamese(whole)} phẩy {read_decimal_part(dec)}"

    text = re.sub(r"\b(\d+)[.,](\d+)\b", replace_decimal, text)

    # 11. Thứ hạng / Thứ trong tuần
    day_map = {"2": "hai", "3": "ba", "4": "tư", "5": "năm", "6": "sáu", "7": "bảy"}
    text = re.sub(r"(?i)\btop\s+(\d+)\b", lambda m: f"tóp {int_to_vietnamese(int(m.group(1)))}", text)
    text = re.sub(r"(?i)\blần\s+thứ\s+(\d+)\b", lambda m: f"lần thứ {int_to_vietnamese(int(m.group(1)))}", text)
    text = re.sub(r"(?i)\bthứ\s+([2-7])\b", lambda m: f"thứ {day_map[m.group(1)]}", text)

    # 12. Số điện thoại (bắt đầu bằng 0, độ dài 10 số): đọc từng số
    text = re.sub(
        r"\b(0\d{9})\b",
        lambda m: " ".join([int_to_vietnamese(int(c)) for c in m.group(1)]),
        text,
    )

    # 13. Dấu âm/dương đứng trước số nguyên
    text = re.sub(r"(?<![a-zA-Z0-9])-(\d+)\b", lambda m: f"âm {int_to_vietnamese(int(m.group(1)))}", text)
    text = re.sub(r"(?<![a-zA-Z0-9])\+(\d+)\b", lambda m: f"dương {int_to_vietnamese(int(m.group(1)))}", text)

    # 14. Số nguyên còn lại: 800, 15, 2026, 4,...
    text = re.sub(r"\b(\d+)\b", lambda m: int_to_vietnamese(int(m.group(1))), text)

    # 15. Dấu gạch chéo tỉ lệ đơn vị
    text = re.sub(r"/cp\b", " trên cổ phiếu", text)
    text = re.sub(r"/cổ phiếu\b", " trên cổ phiếu", text)
    text = re.sub(r"/lít\b", " trên lít", text)
    text = re.sub(r"/kg\b", " trên ki lô gam", text)

    return text


def preprocess_financial_text(text: str) -> str:
    """
    Chuẩn hoá văn bản tài chính & ký tự đặc biệt để giọng đọc tự nhiên, chuẩn âm tiết
    """
    if not text:
        return ""

    # Xoá thẻ HTML và Markdown
    t = re.sub(r"<[^>]+>", " ", text)
    t = re.sub(r"[#*_`>]", " ", t)

    # Xoá lặp nếu viết kèm từ viết tắt: tỷ lệ nợ xấu NPL -> tỷ lệ nợ xấu
    t = re.sub(r"(?i)\btỷ lệ nợ xấu\s+NPL\b", "tỷ lệ nợ xấu", t)

    # Chuyển đổi toàn bộ số thành chữ Tiếng Việt trước khi đọc
    t = normalize_vietnamese_numbers(t)

    # Chuẩn hoá từ viết tắt tài chính & crypto phổ biến
    replacements = [
        (r"\bVN-Index\b", "Vi en In đéc"),
        (r"\bVN30\b", "Vi en ba mươi"),
        (r"\bHNX-Index\b", "Hắt nờ ích In đéc"),
        (r"\bHNX\b", "Hắt nờ ích"),
        (r"\bUPCoM\b", "Úp com"),
        (r"\bBTC\b", "Bê Tê Cê"),
        (r"\bETH\b", "E Tê Hắt"),
        (r"\bSOL\b", "Son"),
        (r"\bDOGE\b", "Đô-giơ"),
        (r"\bPEPE\b", "Pê-pê"),
        (r"\bICT\b", "I C T"),
        (r"\bEDT\b", "E Đê Tê"),
        (r"\bETF\b", "E Tê Ép"),
        (r"\bUS10Y\b", "Lợi suất trái phiếu mười năm Mỹ"),
        (r"\bAUM\b", "A U M"),
        (r"\bBCTC\b", "Báo cáo tài chính"),
        (r"\bĐHĐCĐ\b", "Đại hội đồng cổ đông"),
        (r"\bP/E\b", "P trên E"),
        (r"\bP/B\b", "P trên B"),
        (r"\bROE\b", "R ô E"),
        (r"\bROA\b", "R ô A"),
        (r"\bEPS\b", "E P S"),
        (r"\bEBITDA\b", "E bít đa"),
        (r"\bNIM\b", "Nim"),
        (r"\bCASA\b", "Ca sa"),
        (r"\bNPL\b", "Tỷ lệ nợ xấu"),
        (r"\bHRC\b", "Thép cuộn cán nóng H R C"),
        (r"\bGDP\b", "Gê đê pê"),
        (r"\bCPI\b", "Cê pê i"),
        (r"\bFED\b", "Phét"),
        (r"\bNHNN\b", "Ngân hàng Nhà nước"),
        (r"\bUSD\b", "đô la Mỹ"),
        (r"\bVND\b", "đồng"),
        (r"/", " trên "),
    ]

    for pattern, rep in replacements:
        t = re.sub(pattern, rep, t, flags=re.IGNORECASE)

    # Thu gọn khoảng trắng thừa
    t = re.sub(r"\s+", " ", t).strip()
    return t


def split_sentences(text: str, max_chars: int = 120) -> list[str]:
    """
    Chia nhỏ văn bản đảm bảo không bao giờ vượt quá giới hạn 510 phonemes của Kokoro.
    Tách ưu tiên theo:
    1. Dấu câu kết thúc câu: [.!?\n]
    2. Dấu ngắt câu: [,;:—–()\[\]{}]
    3. Khoảng trắng giữa các từ nếu vẫn còn quá dài
    """
    if not text:
        return []

    raw_sentences = re.split(r"(?<=[.!?\n])\s+", text)
    chunks = []

    for s in raw_sentences:
        s = s.strip()
        if not s:
            continue

        if len(s) <= max_chars:
            chunks.append(s)
            continue

        # Tách tiếp theo dấu ngắt câu
        clauses = re.split(r"(?<=[,;:—–\(\)\[\]])\s+", s)
        curr_clause = ""
        for c in clauses:
            c = c.strip()
            if not c:
                continue
            if len(curr_clause) + len(c) + 1 <= max_chars:
                curr_clause = f"{curr_clause} {c}".strip() if curr_clause else c
            else:
                if curr_clause:
                    chunks.append(curr_clause)
                    curr_clause = ""
                if len(c) <= max_chars:
                    curr_clause = c
                else:
                    # Nếu một mệnh đề vẫn quá dài (không có dấu phẩy), tách theo từng từ
                    words = c.split(" ")
                    curr_word = ""
                    for w in words:
                        if not w:
                            continue
                        if len(curr_word) + len(w) + 1 <= max_chars:
                            curr_word = f"{curr_word} {w}".strip() if curr_word else w
                        else:
                            if curr_word:
                                chunks.append(curr_word)
                            curr_word = w
                    if curr_word:
                        curr_clause = curr_word

        if curr_clause:
            chunks.append(curr_clause)

    # Ghép các mẩu quá ngắn (< 25 ký tự) với câu trước nếu không vượt quá max_chars
    merged = []
    for ch in chunks:
        if merged and len(merged[-1]) + len(ch) + 1 <= max_chars and not merged[-1].endswith((".", "!", "?")):
            merged[-1] = f"{merged[-1]} {ch}"
        else:
            merged.append(ch)

    return [m for m in merged if m.strip()]


VOICES_CATALOG = [
    {"id": "duet", "name": "🎙️ Song ca Nam & Nữ (Xen kẽ)", "gender": "duet"},
    {"id": "diem_trinh", "name": "👩 Diễm Trinh (Nữ - Truyền cảm)", "gender": "female"},
    {"id": "hung_thinh", "name": "👨 Hưng Thịnh (Nam - Trầm ấm)", "gender": "male"},
    {"id": "mai_linh", "name": "👩 Mai Linh (Nữ - Trong trẻo)", "gender": "female"},
    {"id": "duc_an", "name": "👨 Đức An (Nam - Phát thanh viên)", "gender": "male"},
]

def split_turns_for_duet(text: str) -> list[str]:
    """
    Tách bài viết thành các lượt nói (turns) để giọng Nam & Nữ thay phiên nhau dẫn dắt
    """
    # 1. Tách theo đoạn văn nếu có
    paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
    
    turns = []
    for p in paragraphs:
        # Nếu đoạn dài hơn 150 ký tự, tách tiếp theo câu
        if len(p) > 150:
            sentences = split_sentences(p, max_chars=120)
            turns.extend(sentences)
        else:
            turns.append(p)
            
    # Nếu chỉ có 1 lượt duy nhất nhưng đủ dài, tách làm đôi để có cả Nam & Nữ
    if len(turns) == 1 and len(turns[0]) > 80:
        sentences = split_sentences(turns[0], max_chars=100)
        if len(sentences) >= 2:
            turns = sentences

    return turns if turns else [text]


class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "duet"  # duet, diem_trinh, hung_thinh, mai_linh, duc_an
    speed: Optional[float] = 1.0
    response_format: Optional[str] = "wav"  # wav hoặc mp3


@app.get("/health")
@app.get("/api/voices")
def health_check():
    return {
        "status": "healthy",
        "service": "Kokoro-Vietnamese TTS",
        "device": DEVICE,
        "available_voices": VOICES_CATALOG,
        "cache_entries": len(AUDIO_CACHE),
    }


@app.post("/api/tts")
@app.post("/v1/audio/speech")
async def generate_speech(payload: TTSRequest):
    raw_text = payload.text or ""
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Văn bản không được để trống")

    voice = (payload.voice or DEFAULT_VOICE).lower().strip()
    speed = payload.speed or 1.0

    # Chuẩn hoá văn bản tài chính
    clean_text = preprocess_financial_text(raw_text)
    if not clean_text:
        raise HTTPException(status_code=400, detail="Văn bản không hợp lệ sau khi lọc")

    # Giới hạn 4500 ký tự cho một request
    clean_text = clean_text[:4500]

    # Kiểm tra Cache
    cache_key = hashlib.md5(f"{clean_text}_{voice}_{speed}".encode("utf-8")).hexdigest()
    if cache_key in AUDIO_CACHE:
        logger.info(f"Serving audio from cache ({cache_key})")
        return Response(
            content=AUDIO_CACHE[cache_key],
            media_type="audio/wav",
            headers={
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                "X-Cache": "HIT",
                "X-TTS-Voice": voice
            }
        )

    try:
        combined_audio = []

        # ==========================================
        # CHẾ ĐỘ 1: XEN KẼ GIỌNG NAM & NỮ (DUET)
        # ==========================================
        if voice in ["duet", "alternate", "song_ca", "duet_nam_nu"]:
            turns = split_turns_for_duet(clean_text)
            logger.info(f"Synthesizing DUET mode ({len(turns)} turns) alternating Diễm Trinh (Nữ) & Hưng Thịnh (Nam)...")

            pipeline_female = get_tts_pipeline("diem_trinh")
            pipeline_male = get_tts_pipeline("hung_thinh")

            silence_speaker_switch = np.zeros(int(SAMPLE_RATE * 0.35), dtype=np.float32)  # 350ms nghỉ khi đổi giọng
            silence_sentence_gap = np.zeros(int(SAMPLE_RATE * 0.20), dtype=np.float32)    # 200ms nghỉ trong cùng 1 giọng

            for t_idx, turn in enumerate(turns):
                # Chẵn: Nữ (Diễm Trinh), Lẻ: Nam (Hưng Thịnh)
                is_female = (t_idx % 2 == 0)
                current_pipeline = pipeline_female if is_female else pipeline_male

                turn_sentences = split_sentences(turn, max_chars=220)
                for s_idx, sentence in enumerate(turn_sentences):
                    audio, _ = current_pipeline.synthesize(sentence)
                    if audio is not None and len(audio) > 0:
                        combined_audio.append(audio)
                        if s_idx < len(turn_sentences) - 1:
                            combined_audio.append(silence_sentence_gap)

                # Khoảng nghỉ khi đổi người đọc
                if t_idx < len(turns) - 1:
                    combined_audio.append(silence_speaker_switch)

        # ==========================================
        # CHẾ ĐỘ 2: ĐƠN GIỌNG (SINGLE VOICE)
        # ==========================================
        else:
            chunks = split_sentences(clean_text)
            if not chunks:
                raise HTTPException(status_code=400, detail="Không thể phân đoạn văn bản")

            logger.info(f"Synthesizing {len(chunks)} chunks with voice '{voice}' on {DEVICE}...")
            pipeline = get_tts_pipeline(voice)
            silence_gap = np.zeros(int(SAMPLE_RATE * 0.25), dtype=np.float32)

            for idx, chunk in enumerate(chunks):
                audio, _ = pipeline.synthesize(chunk)
                if audio is not None and len(audio) > 0:
                    combined_audio.append(audio)
                    if idx < len(chunks) - 1:
                        combined_audio.append(silence_gap)

        if not combined_audio:
            raise HTTPException(status_code=500, detail="Không tạo được âm thanh từ mô hình")

        final_waveform = np.concatenate(combined_audio)

        # Xuất ra định dạng WAV (PCM 16-bit 24kHz)
        buffer = io.BytesIO()
        sf.write(buffer, final_waveform, SAMPLE_RATE, format="WAV", subtype="PCM_16")
        wav_bytes = buffer.getvalue()

        # Lưu cache
        if len(AUDIO_CACHE) >= MAX_CACHE_ITEMS:
            # Xoá bớt 20% item cũ nhất
            keys_to_remove = list(AUDIO_CACHE.keys())[:int(MAX_CACHE_ITEMS * 0.2)]
            for k in keys_to_remove:
                AUDIO_CACHE.pop(k, None)

        AUDIO_CACHE[cache_key] = wav_bytes

        return Response(
            content=wav_bytes,
            media_type="audio/wav",
            headers={
                "Content-Type": "audio/wav",
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
                "X-Cache": "MISS"
            }
        )
    except Exception as e:
        logger.error(f"Error during synthesis: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Lỗi tạo giọng đọc: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8880"))
    uvicorn.run(app, host="0.0.0.0", port=port)
