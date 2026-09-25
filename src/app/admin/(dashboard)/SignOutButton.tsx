"use client";

import { handleSignOut } from "../login/actions";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="border-0 bg-transparent p-0 text-[14px] text-[#5E636B] hover:text-[#16181D] cursor-pointer text-left transition-colors"
      >
        Đăng xuất
      </button>
    </form>
  );
}
