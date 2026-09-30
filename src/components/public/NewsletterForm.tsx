"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
  };

  return (
    <div id="newsletter" className="flex flex-col gap-2">
      {status === "success" ? (
        <div className="bg-[#F3F4F6] border border-[#111827] p-3 text-[14px] text-[#111827] font-medium">
          ✓ Đã đăng ký thành công! Bạn sẽ nhận bài phân tích mới vào mỗi Chủ nhật.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="border border-[#D1D5DB] bg-white px-3.5 py-3 text-[15px] w-[280px] max-w-full rounded-[2px] outline-none focus:border-[#111827] transition-colors"
          />
          <button
            type="submit"
            className="border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white px-5 py-3 text-[15px] font-semibold cursor-pointer rounded-[2px] transition-colors whitespace-nowrap"
          >
            Nhận bài mỗi Chủ nhật
          </button>
        </form>
      )}
      <div className="flex items-center gap-2 text-[13px] text-[#4B5563] pt-0.5">
        <div className="flex -space-x-1.5 overflow-hidden">
          <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#0A7A45] text-white text-[9px] font-bold text-center leading-5">MA</span>
          <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#133A63] text-white text-[9px] font-bold text-center leading-5">HN</span>
          <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-[#D97706] text-white text-[9px] font-bold text-center leading-5">VT</span>
        </div>
        <span>
          <strong>1.250+</strong> nhà đầu tư & chuyên viên đang theo dõi · Hủy bất cứ lúc nào.
        </span>
      </div>
    </div>
  );
}
