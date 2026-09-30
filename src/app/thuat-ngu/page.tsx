import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import GlossaryExplorer from "@/components/public/GlossaryExplorer";
import { GLOSSARY_ITEMS } from "@/data/glossaryData";
import { ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Từ điển thuật ngữ Đọc BCTC & Chứng khoán | Nhịp đập tài chính",
  description:
    "Tra cứu nhanh định nghĩa, công thức và mức tham chiếu thực tế của các chỉ số tài chính cốt lõi: NIM, CASA, NPL, P/E, P/B, ROE, FCF...",
  alternates: {
    canonical: "https://finpulse.aas.ai.vn/thuat-ngu",
  },
};

export default function GlossaryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar />
      <MarketTickerBar />

      <main className="w-full max-w-[1200px] mx-auto px-4 sm:px-8 py-9 pb-20 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#6B7280]">
          <Link href="/" className="hover:text-[#111827] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-bold text-[#111827]">Từ điển thuật ngữ BCTC</span>
        </nav>

        {/* Hero Title Header */}
        <div className="flex flex-col gap-3 pb-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[#1E40AF] tracking-wide uppercase">
            <BookOpen className="w-4 h-4" />
            Sổ tay kiến thức phân tích
          </div>
          <h1 className="m-0 font-serif font-bold text-[32px] sm:text-[42px] leading-[1.15] tracking-[-0.02em] text-[#111827]">
            Từ điển thuật ngữ BCTC & Định giá
          </h1>
          <p className="m-0 text-[16px] sm:text-[18px] leading-[1.6] text-[#4B5563] max-w-[780px]">
            Hệ thống giải nghĩa súc tích, thực chiến dành cho nhà đầu tư cá nhân. Không sa đà vào lý thuyết giáo trình, mỗi thuật ngữ đều đi kèm <strong>công thức tính</strong> và <strong>mức tham chiếu an toàn</strong> trên thị trường chứng khoán Việt Nam.
          </p>
        </div>

        {/* Interactive Explorer Component */}
        <GlossaryExplorer items={GLOSSARY_ITEMS} />

        {/* Bottom Banner: Connect to Series "Đọc BCTC từ con số 0" */}
        <div className="p-8 bg-[#F9FAFB] border-2 border-[#111827] rounded-[3px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-[5px_5px_0_#111827]">
          <div className="flex flex-col gap-2 max-w-[620px]">
            <span className="text-[13px] font-bold text-[#1E40AF] uppercase tracking-wide">
              Chuỗi hướng dẫn chuyên sâu
            </span>
            <h2 className="m-0 font-serif font-bold text-[22px] text-[#111827]">
              Chuỗi bài: Đọc BCTC từ con số 0
            </h2>
            <p className="m-0 text-[15px] text-[#4B5563]">
              Áp dụng các chỉ số trên vào bóc tách thực tế các doanh nghiệp niêm yết: VCB, Hòa Phát (HPG), Vinamilk (VNM)...
            </p>
          </div>
          <Link
            href="/categories/doc-bctc"
            className="px-5 py-3 bg-[#111827] hover:bg-[#1E40AF] text-white font-bold text-[14px] rounded transition-colors no-underline shrink-0"
          >
            Đọc chuỗi bài ngay →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
