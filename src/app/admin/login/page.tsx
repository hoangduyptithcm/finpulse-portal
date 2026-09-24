import Link from "next/link";
import LoginForm from "./LoginForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Đăng nhập Quản trị viên | FinPulse",
  description: "Trang đăng nhập hệ thống quản lý tin tức tài chính FinPulse",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center px-4 relative selection:bg-stone-200">
      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 transition-colors py-1.5 px-3 rounded-sm border border-stone-200 bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-1">
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-stone-900 block">
            FinPulse
          </Link>
          <p className="text-xs text-stone-500">
            Hệ thống Quản lý Tin tức Tài chính (CMS)
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-sm border border-stone-200 bg-white p-6 sm:p-7 shadow-sm space-y-5">
          <LoginForm />

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Bảo mật 2 lớp NextAuth</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
