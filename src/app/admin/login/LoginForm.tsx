"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "./actions";
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 rounded-sm bg-stone-900 hover:bg-stone-800 py-2.5 px-4 text-xs font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Đang xác thực...</span>
        </>
      ) : (
        <>
          <span>Đăng nhập Quản trị</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-stone-700"
        >
          Email Quản trị
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="admin@finpulse.vn"
            required
            defaultValue="admin@finpulse.vn"
            className="w-full rounded-sm border border-stone-300 bg-white pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-stone-700"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••••••"
            required
            defaultValue="AdminPassword@2026"
            className="w-full rounded-sm border border-stone-300 bg-white pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
