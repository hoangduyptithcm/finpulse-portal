import Link from "next/link";

export default function AdminBottomBar() {
  return (
    <div className="border-t border-stone-800 bg-stone-900 text-stone-300 text-[11px] py-1 px-4 sticky bottom-0 z-50 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3 sm:space-x-5 whitespace-nowrap">
        <Link href="/" className="hover:text-white transition-colors">
          Trang chủ
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/categories/crypto" className="hover:text-white transition-colors">
          Chuyên mục
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/posts/tong-quan-thi-truong-crypto-va-chu-ky-moi-nam-2026" className="hover:text-white transition-colors">
          Bài viết
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/admin/login" className="hover:text-white transition-colors">
          Đăng nhập
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
          Admin: Tổng quan
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/admin/posts" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
          Admin: Bài viết
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/admin/posts/new" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
          Admin: Soạn bài
        </Link>
        <span className="text-stone-600">|</span>
        <Link href="/admin/categories" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
          Admin: Chuyên mục
        </Link>
      </div>
    </div>
  );
}
