# 🎙️ Hướng dẫn triển khai Kokoro-Vietnamese AI TTS lên VPS (Systemd Service / PM2 - Không dùng Docker)

Tài liệu này hướng dẫn bạn đưa microservice tạo giọng đọc AI tiếng Việt lên VPS chạy Linux (Ubuntu/Debian) **không cần cài Docker**, chạy ngầm 24/7 dưới dạng **Linux System Service (systemd)** hoặc **PM2**, tự khởi động lại khi reboot VPS.

---

## 📋 Yêu cầu cấu hình VPS
- **Hệ điều hành:** Ubuntu 20.04 / 22.04 / 24.04 hoặc Debian 11 / 12
- **Cấu hình khuyên dùng:** Tối thiểu 2 vCPU, 4GB RAM (để load model ~300MB và xử lý âm thanh trơn tru). Nếu có GPU NVIDIA thì càng tốt.
- **Quyền:** Root hoặc user có quyền `sudo`.

---

## 🚀 Cách 1: Cài đặt tự động bằng script 1-Click (Khuyên dùng)

### Bước 1: Copy thư mục `services/kokoro-tts` lên VPS
Từ máy tính cá nhân của bạn, mở terminal và chạy lệnh `rsync` hoặc `scp`:
```bash
# Thay your-vps-ip và root bằng thông tin VPS của bạn
rsync -avz --exclude '__pycache__' ./services/kokoro-tts/ root@YOUR_VPS_IP:/opt/kokoro-tts/
```

*(Hoặc nén zip rồi tải lên VPS giải nén vào `/opt/kokoro-tts`)*:
```bash
# Trên máy tính:
tar -czvf kokoro-tts.tar.gz -C services/kokoro-tts .
scp kokoro-tts.tar.gz root@YOUR_VPS_IP:/opt/
# Trên VPS:
mkdir -p /opt/kokoro-tts && tar -xzvf /opt/kokoro-tts.tar.gz -C /opt/kokoro-tts/
```

### Bước 2: Chạy script cài đặt tự động
SSH vào VPS của bạn và chạy script [setup-vps.sh](file:///Users/duyhoang/finpulse-portal/services/kokoro-tts/setup-vps.sh):
```bash
cd /opt/kokoro-tts
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

Script sẽ tự động:
1. Cài đặt các gói hệ thống: `python3`, `python3-venv`, `ffmpeg`, `libsndfile1`, `espeak-ng`, `git`.
2. Tạo môi trường ảo Python `venv` độc lập.
3. Tự phát hiện CPU / GPU NVIDIA và cài PyTorch + dependencies phù hợp.
4. Đăng ký và bật **systemd service** `kokoro-tts`.
5. Tự động kiểm tra API hoạt động.

---

## 🛠️ Cách 2: Cài đặt thủ công từng bước (Manual Systemd Service)

Nếu bạn muốn tự tay cấu hình từng lệnh:

### 1. Cài đặt các thư viện hệ thống
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv build-essential ffmpeg libsndfile1 espeak-ng git curl
```

### 2. Tạo môi trường ảo và cài đặt thư viện
```bash
cd /opt/kokoro-tts

# Tạo virtualenv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip

# Cài PyTorch CPU (hoặc CUDA nếu VPS có GPU)
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu || pip install torch torchaudio

# Cài đặt requirements
pip install -r requirements.txt
```

### 3. Cài đặt file Systemd Service
Copy file cấu hình service vào thư mục hệ thống:
```bash
sudo cp /opt/kokoro-tts/kokoro-tts.service /etc/systemd/system/kokoro-tts.service
```

Nội dung file `/etc/systemd/system/kokoro-tts.service`:
```ini
[Unit]
Description=Kokoro-Vietnamese AI TTS Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/kokoro-tts
Environment="PATH=/opt/kokoro-tts/venv/bin:/usr/local/bin:/usr/bin:/bin"
Environment="PORT=8880"
Environment="DEVICE=cpu"
Environment="DEFAULT_VOICE=diem_trinh"
Environment="PYTHONUNBUFFERED=1"
ExecStart=/opt/kokoro-tts/venv/bin/uvicorn app:app --host 0.0.0.0 --port 8880 --workers 1

Restart=always
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### 4. Bật và khởi chạy Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable kokoro-tts
sudo systemctl start kokoro-tts
```

---

## ⚡ Cách 3: Chạy bằng PM2 (Nếu VPS của bạn đang dùng PM2 quản lý Node.js)

Nếu trên VPS bạn đã có sẵn `pm2`:
```bash
cd /opt/kokoro-tts
source venv/bin/activate

# Khởi chạy bằng pm2
pm2 start "venv/bin/uvicorn app:app --host 0.0.0.0 --port 8880" --name "kokoro-tts"

# Lưu lại trạng thái để reboot không bị mất
pm2 save
pm2 startup
```

---

## 🔍 Kiểm tra dịch vụ hoạt động

1. **Kiểm tra trạng thái Service:**
```bash
sudo systemctl status kokoro-tts
```

2. **Xem logs thời gian thực:**
```bash
sudo journalctl -u kokoro-tts -f
```

3. **Test API Healthcheck:**
```bash
curl http://localhost:8880/health
```
Kết quả trả về:
```json
{
  "status": "healthy",
  "service": "Kokoro-Vietnamese TTS",
  "device": "cpu",
  "available_voices": [
    {"id": "duet", "name": "🎙️ Song ca Nam & Nữ (Xen kẽ)"},
    {"id": "diem_trinh", "name": "👩 Diễm Trinh (Nữ - Truyền cảm)"},
    {"id": "hung_thinh", "name": "👨 Hưng Thịnh (Nam - Trầm ấm)"},
    {"id": "mai_linh", "name": "👩 Mai Linh (Nữ - Trong trẻo)"},
    {"id": "duc_an", "name": "👨 Đức An (Nam - Phát thanh viên)"}
  ]
}
```

4. **Test tạo âm thanh thử nghiệm:**
```bash
curl -X POST http://localhost:8880/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Sáng 3/10: BTC quanh 84.6k USD, VN-Index tăng 10,5 điểm.", "voice": "diem_trinh"}' \
  --output test.wav

ls -lh test.wav
```

---

## 🌐 Cấu hình Nginx Reverse Proxy (Có Domain / HTTPS - Tùy chọn)

Nếu bạn muốn gọi API qua domain dạng `https://tts.domain.com/api/tts`:

Thêm block cấu hình trong `/etc/nginx/sites-available/tts`:
```nginx
server {
    server_name tts.yourdomain.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:8880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Tăng timeout cho file bài viết dài
        proxy_connect_timeout 60s;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
}
```
Sau đó kích hoạt và cài SSL Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/tts /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d tts.yourdomain.com
```

---

## 🔗 Cấu hình ứng dụng Next.js Portal kết nối tới VPS

Trong file `.env.local` (hoặc cấu hình biến môi trường production của Next.js):
```env
# Nếu gọi thẳng qua IP VPS:
KOKORO_TTS_URL="http://YOUR_VPS_IP:8880/api/tts"
KOKORO_TTS_VOICE="duet"

# Hoặc nếu qua Nginx domain có HTTPS:
# KOKORO_TTS_URL="https://tts.yourdomain.com/api/tts"
```

Khi Next.js render hoặc người dùng bấm **"Đọc bài viết"**, Next.js backend sẽ gọi trực tiếp sang VPS để nhận file âm thanh AI chuẩn 100% ngữ âm và số liệu tài chính.
