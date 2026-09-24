"use client";

import { useState } from "react";

export default function NewsletterBox() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <section id="newsletter" className="border border-stone-200 bg-stone-50/70 p-6 sm:p-8 rounded-sm">
      <div className="max-w-xl space-y-2">
        <h3 className="font-serif font-bold text-lg text-stone-900">
          Bản tin 7 giờ sáng
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Năm tin cần biết trước giờ mở cửa, gửi vào email mỗi ngày giao dịch. Đọc trong 3 phút.
        </p>

        {subscribed ? (
          <div className="pt-2 text-xs font-semibold text-emerald-700">
            ✓ Cảm ơn bạn! Chúng tôi đã lưu email và sẽ gửi bản tin 7h sáng mỗi ngày.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="pt-2 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email của bạn"
              className="flex-1 rounded-sm border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-sm bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
            >
              Đăng ký
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
