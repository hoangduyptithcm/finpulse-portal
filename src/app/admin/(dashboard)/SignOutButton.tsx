"use client";

import { handleSignOut } from "../login/actions";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 rounded-sm hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Đăng xuất</span>
      </button>
    </form>
  );
}
