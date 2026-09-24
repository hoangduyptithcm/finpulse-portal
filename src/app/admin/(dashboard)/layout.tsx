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
  PlusCircle,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-5 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black text-sm">
                FP
              </div>
              <div>
                <span className="font-bold text-sm tracking-wider text-white">
                  FINPULSE
                </span>
                <span className="block text-[10px] font-mono text-emerald-400">
                  CMS PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Action */}
          <Link
            href="/admin/posts/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Viết bài mới</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Tổng quan Dashboard</span>
            </Link>
            <Link
              href="/admin/posts"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Quản lý Bài viết</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FolderTree className="w-4 h-4 text-slate-400" />
              <span>Quản lý Chuyên mục</span>
            </Link>
          </nav>
        </div>

        {/* User Card & SignOut */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 rounded-lg hover:bg-slate-800/50 hover:text-slate-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem trang ngoài web</span>
            </span>
          </Link>

          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              {session.user.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium text-slate-200 truncate">
                {session.user.name || "Admin"}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
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
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <span className="font-bold text-sm text-emerald-400">FINPULSE</span>
            </div>
            <h1 className="text-sm font-semibold text-slate-300 hidden sm:block">
              Hệ thống Quản lý Tin tức Tài chính
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
              <Shield className="w-3 h-3" />
              <span>Quyền Quản trị viên (Admin)</span>
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
