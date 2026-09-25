import Link from "next/link";
import { CATEGORIES } from "@/data/portalData";

export default function Footer() {
  return (
    <footer className="border-t border-[#16181D] mt-auto bg-[#F7F5F0]">
      <div className="max-w-[1240px] mx-auto px-6 py-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-[14px]">
        {/* Brand Column */}
        <div className="flex flex-col gap-2">
          <span className="font-serif font-bold text-[22px] tracking-[-0.01em] text-[#16181D]">
            FinPulse
          </span>
          <span className="text-[#5E636B] leading-[1.5]">
            Sổ phân tích cá nhân. Không phải cơ quan báo chí.
          </span>
        </div>

        {/* Categories Column */}
        <div className="flex flex-col gap-2">
          <strong className="text-[#16181D]">Chuyên mục</strong>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* About Column */}
        <div className="flex flex-col gap-2">
          <strong className="text-[#16181D]">Về trang</strong>
          <Link
            href="/about"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Giới thiệu
          </Link>
          <Link
            href="/about#nguon-so-lieu"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Nguyên tắc nguồn số liệu
          </Link>
          <Link
            href="/about#mien-tru"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Miễn trừ trách nhiệm
          </Link>
          <Link
            href="/about#lien-he"
            className="text-[#2B2F36] hover:text-[#133A63] transition-colors"
          >
            Liên hệ
          </Link>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 py-4 border-t border-[#E3E1DC] text-[13px] leading-[1.6] text-[#5E636B]">
        © 2026 FinPulse. Nội dung do tác giả biên soạn với hỗ trợ công cụ AI, mang tính trao đổi kiến thức. Không phải thông tin báo chí, không phải khuyến nghị mua/bán. Số liệu lấy từ nguồn công bố; nhà đầu tư tự kiểm chứng.
      </div>
    </footer>
  );
}
