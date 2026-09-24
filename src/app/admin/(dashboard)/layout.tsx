import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  ExternalLink,
  Shield,
  Plus,
} from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex font-sans selection:bg-stone-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-stone-200 bg-white flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <Link href="/admin" className="block">
              <span className="font-serif text-xl font-bold tracking-tight text-stone-900 block">
                FinPulse
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block -mt-0.5">
                Admin CMS
              </span>
            </Link>
          </div>

          {/* Quick Action */}
          <Link
            href="/admin/posts/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-sm bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Soạn bài viết mới</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-stone-500" />
              <span>Tổng quan Dashboard</span>
            </Link>
            <Link
              href="/admin/posts"
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-stone-500" />
              <span>Quản lý Bài viết</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2 rounded-sm text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
            >
              <FolderTree className="w-4 h-4 text-stone-500" />
              <span>Quản lý Chuyên mục</span>
            </Link>
          </nav>
        </div>

        {/* User Card & SignOut */}
        <div className="p-4 border-t border-stone-200 space-y-3 bg-stone-50/50">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-1.5 text-xs text-stone-600 rounded-sm hover:bg-stone-100 hover:text-stone-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trang ngoài web</span>
            </span>
          </Link>

          <div className="p-2.5 rounded-sm border border-stone-200 bg-white flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs font-serif">
              {session.user.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-stone-900 truncate">
                {session.user.name || "Admin"}
              </p>
              <p className="text-[10px] text-stone-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          <SignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-stone-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-stone-900">FinPulse</span>
            </div>
            <h1 className="text-xs font-semibold text-stone-600 hidden sm:block">
              Hệ thống Quản lý Tin tức Tài chính
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-stone-100 border border-stone-200 text-[11px] font-medium text-stone-700">
              <Shield className="w-3 h-3 text-stone-500" />
              <span>Admin</span>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
