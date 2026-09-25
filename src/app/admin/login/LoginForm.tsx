"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "./actions";
import { AlertCircle, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white p-3 text-[15px] font-semibold cursor-pointer rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Đang xác thực...</span>
        </>
      ) : (
        <span>Đăng nhập</span>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4.5">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-[2px] border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
        Email
        <input
          id="email"
          type="email"
          name="email"
          placeholder="admin@finpulse.vn"
          required
          defaultValue="admin@finpulse.vn"
          className="border border-[#D1D5DB] bg-white px-3 py-2.5 text-[15px] font-normal rounded-[4px] outline-none focus:border-[#111827] text-[#111827]"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
        <span className="flex justify-between items-center">
          <span>Mật khẩu</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Mật khẩu mặc định trong .env: AdminPassword@2026");
            }}
            className="text-[13px] font-medium text-[#1E40AF] hover:underline"
          >
            Quên mật khẩu?
          </a>
        </span>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••••••"
          required
          defaultValue="AdminPassword@2026"
          className="border border-[#D1D5DB] bg-white px-3 py-2.5 text-[15px] font-normal rounded-[4px] outline-none focus:border-[#111827] text-[#111827]"
        />
      </label>

      <label className="flex gap-2 items-center text-[14px] text-[#374151] cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          className="rounded-[2px] text-[#1E40AF] focus:ring-[#1E40AF]"
        />
        <span>Ghi nhớ đăng nhập</span>
      </label>

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
