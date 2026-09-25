"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminBottomBar() {
  const pathname = usePathname();

  const screens = [
    { label: "Trang chủ", href: "/" },
    { label: "Chuyên mục", href: "/categories/doc-bctc" },
    { label: "Bài viết", href: "/posts/vcb-co-dat-sau-bao-cao-quy-2" },
    { label: "Giới thiệu", href: "/about" },
    { label: "Đăng nhập", href: "/admin/login" },
    { label: "Admin: Tổng quan", href: "/admin" },
    { label: "Admin: Bài viết", href: "/admin/posts" },
    { label: "Admin: Soạn bài", href: "/admin/posts/new" },
    { label: "Admin: Chuyên mục", href: "/admin/categories" },
  ];

  return (
    <div
      role="navigation"
      aria-label="Screen Switcher"
      className="fixed left-1/2 -translate-x-1/2 bottom-3.5 z-[100] flex gap-0.5 p-1 bg-[#16181D] rounded-[6px] shadow-[0_6px_20px_rgba(0,0,0,0.28)] max-w-[calc(100vw-24px)] overflow-x-auto scrollbar-none"
    >
      {screens.map((s) => {
        const isActive =
          pathname === s.href ||
          (s.href === "/admin" && pathname === "/admin") ||
          (s.href.startsWith("/categories/") && pathname?.startsWith("/categories/")) ||
          (s.href.startsWith("/posts/") && pathname?.startsWith("/posts/"));

        return (
          <Link
            key={s.href}
            href={s.href}
            className={`px-2.5 py-1.5 rounded-[4px] text-[12px] font-semibold whitespace-nowrap transition-colors no-underline ${
              isActive
                ? "bg-white text-[#111827]"
                : "bg-transparent text-[#D8D6D0] hover:text-white"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
