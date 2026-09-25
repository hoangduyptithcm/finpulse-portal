import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-[#111827] font-sans selection:bg-[#E0E7FF]">
      {/* Sidebar matching FinPulse design */}
      <aside className="w-[216px] shrink-0 bg-white border-r border-[#E5E7EB] p-5 px-3 flex flex-col gap-5 sticky top-0 h-screen hidden md:flex">
        {/* Brand */}
        <div className="px-2.5 flex items-baseline gap-2">
          <Link
            href="/admin"
            className="font-serif font-bold text-[21px] text-[#111827] hover:text-[#1E40AF] transition-colors leading-none"
          >
            FinPulse
          </Link>
          <span className="text-[12px] text-[#6B7280]">Quản trị</span>
        </div>

        {/* Quick Action */}
        <Link
          href="/admin/posts/new"
          className="border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white py-2.5 px-3 text-[14px] font-semibold cursor-pointer rounded-[4px] text-center transition-colors !no-underline block"
        >
          Viết bài mới
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5">
          <Link
            href="/admin"
            className="flex justify-between items-center py-2 px-2.5 rounded-[4px] text-[14px] text-[#111827] font-medium hover:bg-[#F3F4F6] transition-colors no-underline"
          >
            <span>Tổng quan</span>
          </Link>
          <Link
            href="/admin/posts"
            className="flex justify-between items-center py-2 px-2.5 rounded-[4px] text-[14px] text-[#111827] font-medium hover:bg-[#F3F4F6] transition-colors no-underline"
          >
            <span>Bài viết</span>
            <span className="text-[#6B7280] font-normal text-[13px]">7</span>
          </Link>
          <Link
            href="/admin/categories"
            className="flex justify-between items-center py-2 px-2.5 rounded-[4px] text-[14px] text-[#111827] font-medium hover:bg-[#F3F4F6] transition-colors no-underline"
          >
            <span>Chuyên mục</span>
            <span className="text-[#6B7280] font-normal text-[13px]">4</span>
          </Link>
        </nav>

        {/* Footer Profile & Links */}
        <div className="mt-auto flex flex-col gap-2.5 pt-3 px-2.5 border-t border-[#E5E7EB] text-[14px]">
          <Link
            href="/"
            className="text-[#1E40AF] hover:underline"
          >
            Xem trang web
          </Link>
          <span className="flex flex-col">
            <strong className="text-[14px] text-[#111827]">Minh Anh</strong>
            <span className="text-[#6B7280] text-[13px]">Quản trị viên</span>
          </span>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-7 sm:p-9 pb-20">
        {children}
      </main>
    </div>
  );
}
