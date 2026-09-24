"use client";

import { handleSignOut } from "../login/actions";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-400 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Đăng xuất</span>
      </button>
    </form>
  );
}
