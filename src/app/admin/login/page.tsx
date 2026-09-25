import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Đăng nhập Quản trị | FinPulse",
  description: "Trang đăng nhập quản trị dành riêng cho tác giả FinPulse",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-6 selection:bg-[#E0E7FF]">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* Brand header */}
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="font-serif font-bold text-[28px] text-[#111827] hover:text-[#1E40AF] transition-colors leading-none"
          >
            FinPulse
          </Link>
          <span className="text-[15px] text-[#6B7280]">
            Đăng nhập quản trị
          </span>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-[#E5E7EB] p-7 flex flex-col gap-4.5 rounded-[4px] shadow-sm">
          <LoginForm />
        </div>

        <Link
          href="/"
          className="text-[14px] text-[#5E636B] hover:text-[#16181D] transition-colors self-start"
        >
          ← Quay lại trang đọc
        </Link>
      </div>
    </div>
  );
}
