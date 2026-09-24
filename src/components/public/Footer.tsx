import Link from "next/link";
import { ShieldAlert, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm">
                FP
              </div>
              <span className="text-base font-black tracking-wider text-white">
                FINPULSE PORTAL
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Kênh thông tin cập nhật biến động thị trường Tiền mã hóa (Crypto), Chứng khoán Việt Nam (VN-Index) và kiến thức đầu tư thực chiến dành cho cộng đồng nhà đầu tư.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Chuyên mục
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories/crypto" className="hover:text-emerald-400 transition-colors">
                  Tiền mã hóa (Crypto)
                </Link>
              </li>
              <li>
                <Link href="/categories/chung-khoan-vn" className="hover:text-emerald-400 transition-colors">
                  Chứng khoán Việt Nam
                </Link>
              </li>
              <li>
                <Link href="/categories/kinh-te-vi-mo" className="hover:text-emerald-400 transition-colors">
                  Kinh tế Vĩ mô
                </Link>
              </li>
              <li>
                <Link href="/categories/kien-thuc-dau-tu" className="hover:text-emerald-400 transition-colors">
                  Kiến thức Đầu tư
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Community */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kênh Truyền Thông
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <span>Fanpage Facebook Tin Tức</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
                >
                  <span>Kênh Telegram Thảo luận</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-slate-300 transition-colors">
                  Khu vực Quản trị (Admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Warning */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start gap-3 text-[11px] text-slate-500 leading-relaxed">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400/80 mt-0.5" />
          <p>
            <strong className="text-slate-400">Tuyên bố miễn trừ trách nhiệm:</strong> Toàn bộ nội dung, phân tích và số liệu trên FinPulse Portal chỉ nhằm mục đích cung cấp thông tin và học tập, không cấu thành lời khuyên đầu tư tài chính. Đầu tư Crypto và Chứng khoán luôn tiềm ẩn rủi ro biến động vốn.
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FinPulse Portal. Vận hành độc lập trên VPS tiết kiệm 100% chi phí.</p>
          <p className="font-mono text-emerald-400/80">Next.js 16 • PostgreSQL • Optimized for Facebook</p>
        </div>
      </div>
    </footer>
  );
}
