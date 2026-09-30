"use client";

import { useState } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, X, Send } from "lucide-react";

export type ArticleType = "ORIGINAL_ANALYSIS" | "MARKET_DIGEST" | "OBSERVATION";

interface ArticleSourceBadgeProps {
  type?: ArticleType;
  correctedDate?: string;
  sourceName?: string;
  sourceUrl?: string;
}

export default function ArticleSourceBadge({
  type = "ORIGINAL_ANALYSIS",
  correctedDate,
  sourceName,
  sourceUrl,
}: ArticleSourceBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wrongNumber, setWrongNumber] = useState("");
  const [sourceProof, setSourceProof] = useState("");

  const badgeConfig = {
    ORIGINAL_ANALYSIS: {
      label: "Phân tích độc lập",
      desc: "Bóc tách trực tiếp từ BCTC kiểm toán & dữ liệu sàn HOSE/HNX",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-500",
    },
    MARKET_DIGEST: {
      label: "Điểm tin & Sự kiện",
      desc: "Chắt lọc từ nguồn báo chí chính thống uy tín (có ghi rõ link nguồn)",
      bg: "bg-blue-50 text-blue-800 border-blue-300",
      dot: "bg-blue-500",
    },
    OBSERVATION: {
      label: "Nhật ký quan sát",
      desc: "Góc nhìn và ghi chép thực tế của tác giả",
      bg: "bg-amber-50 text-amber-900 border-amber-300",
      dot: "bg-amber-500",
    },
  }[type];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wrongNumber.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setWrongNumber("");
      setSourceProof("");
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[3px] text-[13px]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[12px] font-bold ${badgeConfig.bg}`}
            title={badgeConfig.desc}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badgeConfig.dot}`} />
            {badgeConfig.label}
          </span>

          <span className="text-[#6B7280] hidden sm:inline">|</span>
          <span className="text-[#4B5563] text-[12px]">
            {type === "ORIGINAL_ANALYSIS" ? (
              "Bóc tách số liệu độc lập · Không phím hàng"
            ) : sourceName ? (
              <span>
                Nguồn tham chiếu:{" "}
                {sourceUrl ? (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1E40AF] underline"
                  >
                    {sourceName}
                  </a>
                ) : (
                  sourceName
                )}
              </span>
            ) : (
              "Tổng hợp từ dữ liệu công bố chính thức"
            )}
          </span>

          {correctedDate && (
            <span className="text-[11px] font-medium px-2 py-0.5 bg-amber-100 text-amber-800 rounded border border-amber-300">
              Đã đính chính ngày {correctedDate}
            </span>
          )}
        </div>

        {/* Nút báo lỗi số liệu */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-[#1E40AF] hover:text-[#1E3A8A] hover:underline font-semibold text-[13px] flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />
          Báo số liệu sai / Góp ý
        </button>
      </div>

      {/* Modal báo số liệu sai */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#111827] rounded-[4px] p-6 max-w-[500px] w-full shadow-[6px_6px_0_#111827] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1E40AF]" />
                <h3 className="m-0 font-bold text-[16px] text-[#111827]">
                  Góp ý đính chính số liệu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#9CA3AF] hover:text-[#111827] cursor-pointer border-0 bg-transparent p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 flex flex-col items-center text-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-12 h-12" />
                <strong className="text-[16px]">Đã ghi nhận góp ý của bạn!</strong>
                <p className="m-0 text-[13px] text-[#4B5563]">
                  Tác giả sẽ đối chiếu lại BCTC gốc và cập nhật nhật ký đính chính công khai nếu có sai lệch. Cảm ơn bạn đã đồng hành giúp giữ vững chất lượng số liệu!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <p className="m-0 text-[13px] text-[#4B5563] leading-[1.5]">
                  Chúng tôi cam kết tính chuẩn xác tuyệt đối của từng con số. Nếu bạn phát hiện số liệu nào bị nhầm lẫn hoặc chưa cập nhật, vui lòng thông báo để tác giả đối chiếu:
                </p>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#374151]">
                    Đoạn số liệu cần đính chính <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={wrongNumber}
                    onChange={(e) => setWrongNumber(e.target.value)}
                    placeholder="Ví dụ: Ở bảng mục 2, nợ xấu quý 2/2026 của VCB ghi 1.2% nhưng thực tế thuyết minh trang 32 là 1.15%..."
                    className="p-2.5 text-[13px] border border-[#D1D5DB] rounded text-[#111827] focus:outline-none focus:border-[#1E40AF]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#374151]">
                    Link nguồn kiểm chứng (nếu có)
                  </label>
                  <input
                    type="url"
                    value={sourceProof}
                    onChange={(e) => setSourceProof(e.target.value)}
                    placeholder="Link file PDF BCTC hoặc link trang HOSE..."
                    className="p-2 text-[13px] border border-[#D1D5DB] rounded text-[#111827] focus:outline-none focus:border-[#1E40AF]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#4B5563] hover:bg-gray-100 rounded cursor-pointer border border-[#D1D5DB] bg-white"
                  >
                    Đóng
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-[13px] font-bold text-white bg-[#111827] hover:bg-[#1E40AF] rounded cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Gửi phản hồi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
