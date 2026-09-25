import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Đăng nhập Quản trị | FinPulse",
  description: "Trang đăng nhập quản trị dành riêng cho tác giả FinPulse",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#EEEAE2] flex items-center justify-center p-6 selection:bg-[#C9D6E6]">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        {/* Brand header */}
        <div className="flex flex-col gap-1">
          <Link
            href="/"
            className="font-serif font-bold text-[28px] text-[#16181D] hover:text-[#133A63] transition-colors leading-none"
          >
            FinPulse
          </Link>
          <span className="text-[15px] text-[#5E636B]">
            Đăng nhập quản trị
          </span>
        </div>

        {/* Card Form */}
        <div className="bg-[#FCFBF8] border border-[#E3E1DC] p-7 flex flex-col gap-4.5 rounded-[2px] shadow-sm">
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
