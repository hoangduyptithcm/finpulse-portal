"use client";

import { useEffect } from "react";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Next.js runtime application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar />
      <MarketTickerBar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-[640px] mx-auto">
        <span className="text-[13px] font-bold text-[#DC2626] bg-rose-50 px-3 py-1 rounded-full border border-rose-200 mb-4 tracking-wide uppercase">
          Tải trang không thành công
        </span>

        <h1 className="font-serif font-bold text-[28px] sm:text-[34px] text-[#111827] mb-3 leading-tight">
          Đã xảy ra sự cố khi tải trang này
        </h1>

        <p className="text-[15px] sm:text-[16px] text-[#4B5563] leading-[1.6] mb-8 font-sans">
          Trình duyệt có thể đã lưu bộ nhớ đệm cũ hoặc kết nối mạng tạm thời bị gián đoạn. Bạn có thể bấm nút thử lại dưới đây hoặc quay về trang chủ.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                reset();
              }
            }}
            className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-5 py-2.5 rounded-[4px] font-semibold text-[14px] cursor-pointer transition-colors shadow-sm border-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Làm mới & Thử lại</span>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-[4px] font-semibold text-[14px] no-underline transition-colors border border-[#E5E7EB]"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
