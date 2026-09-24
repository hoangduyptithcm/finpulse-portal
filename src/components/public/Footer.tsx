import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="font-serif text-lg font-bold text-stone-900 block">
              FinPulse
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
              Tin tức và phân tích tài chính cho nhà đầu tư Việt Nam.
            </p>
          </div>

          {/* Chuyên mục */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 text-xs">Chuyên mục</h4>
            <ul className="space-y-1.5 text-stone-600 text-xs">
              <li>
                <Link href="/categories/crypto" className="hover:text-stone-950 transition-colors">
                  Crypto
                </Link>
              </li>
              <li>
                <Link href="/categories/chung-khoan" className="hover:text-stone-950 transition-colors">
                  Chứng khoán
                </Link>
              </li>
              <li>
                <Link href="/categories/vi-mo" className="hover:text-stone-950 transition-colors">
                  Vĩ mô
                </Link>
              </li>
              <li>
                <Link href="/categories/kien-thuc-dau-tu" className="hover:text-stone-950 transition-colors">
                  Kiến thức đầu tư
                </Link>
              </li>
            </ul>
          </div>

          {/* FinPulse info */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 text-xs">FinPulse</h4>
            <ul className="space-y-1.5 text-stone-600 text-xs">
              <li>
                <Link href="/" className="hover:text-stone-950 transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-stone-950 transition-colors">
                  Liên hệ tòa soạn
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-stone-950 transition-colors">
                  Chính sách biên tập
                </Link>
              </li>
            </ul>
          </div>

          {/* Theo dõi */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 text-xs">Theo dõi</h4>
            <ul className="space-y-1.5 text-stone-600 text-xs">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Fanpage Facebook
                </a>
              </li>
              <li>
                <a href="#newsletter" className="hover:text-stone-950 transition-colors">
                  Bản tin email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 border-t border-stone-200 text-center sm:text-left text-[11px] text-stone-400">
          <p>© 2026 FinPulse. Thông tin chỉ mang tính tham khảo, không phải khuyến nghị đầu tư.</p>
        </div>
      </div>
    </footer>
  );
}
