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
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all hover:opacity-95 hover:shadow-emerald-500/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          <span>Đang xác thực...</span>
        </>
      ) : (
        <>
          <span>Đăng nhập Quản trị</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-5">
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Email Quản trị
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="admin@finpulse.vn"
            required
            defaultValue="admin@finpulse.vn"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          Mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••••••"
            required
            defaultValue="AdminPassword@2026"
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
