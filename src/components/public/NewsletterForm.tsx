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
        <div className="bg-[#EEEAE2] border border-[#16181D] p-3 text-[14px] text-[#16181D] font-medium">
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
            className="border border-[#C9C5BC] bg-[#FCFBF8] px-3.5 py-3 text-[15px] w-[280px] max-w-full rounded-[2px] outline-none focus:border-[#16181D] transition-colors"
          />
          <button
            type="submit"
            className="border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white px-5 py-3 text-[15px] font-semibold cursor-pointer rounded-[2px] transition-colors whitespace-nowrap"
          >
            Nhận bài mỗi Chủ nhật
          </button>
        </form>
      )}
      <span className="text-[13px] text-[#5E636B]">
        Một email mỗi tuần. Hủy bất cứ lúc nào.
      </span>
    </div>
  );
}
