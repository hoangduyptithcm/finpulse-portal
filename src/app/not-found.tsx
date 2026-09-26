import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import { ArrowLeft, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar />
      <MarketTickerBar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center max-w-[640px] mx-auto">
        <span className="text-[72px] sm:text-[96px] font-bold text-[#1E40AF] leading-none mb-3 font-serif">
          404
        </span>
        <h1 className="text-[24px] sm:text-[28px] font-bold text-[#111827] mb-3 font-serif">
          Không tìm thấy bài viết hoặc trang này
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#4B5563] leading-[1.6] mb-8 font-sans">
          Đường dẫn có thể đã thay đổi, bài viết đang ở chế độ xem trước chưa lưu, hoặc chưa được xuất bản. Vui lòng kiểm tra lại địa chỉ hoặc quay về trang chủ.
        </p>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-5 py-2.5 rounded-[4px] font-semibold text-[14px] no-underline transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
          <Link
            href="/admin/posts"
            className="inline-flex items-center gap-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] px-5 py-2.5 rounded-[4px] font-semibold text-[14px] no-underline transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Quản lý bài viết</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
