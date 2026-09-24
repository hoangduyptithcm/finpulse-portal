import Link from "next/link";
import LoginForm from "./LoginForm";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Đăng nhập Quản trị viên | FinPulse Portal",
  description: "Trang đăng nhập hệ thống quản lý tin tức tài chính FinPulse",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Top back button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors py-2 px-3 rounded-lg border border-slate-800/80 bg-slate-900/60 backdrop-blur"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20 text-slate-950 mb-2">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            FinPulse Admin Portal
          </h1>
          <p className="text-xs text-slate-400">
            Hệ thống quản trị nội dung bài viết và phân tích tài chính
          </p>
        </div>

        {/* Card Box */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 backdrop-blur-xl p-7 shadow-2xl space-y-6">
          <LoginForm />

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Bảo mật 2 lớp NextAuth</span>
            <span className="font-mono text-emerald-400/80">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
