"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/portalData";
import { Search, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-b border-[#16181D] bg-[#F7F5F0] sticky top-0 z-20">
      <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between gap-6 sm:gap-8 h-[66px]">
        {/* Brand */}
        <Link
          href="/"
          className="flex flex-col text-[#16181D] no-underline flex-shrink-0 group"
        >
          <span className="font-serif font-bold text-[26px] tracking-[-0.02em] leading-none group-hover:text-[#133A63] transition-colors">
            FinPulse
          </span>
          <span className="text-[12px] text-[#5E636B] mt-[3px]">
            Sổ phân tích của Minh Anh
          </span>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden md:flex items-center gap-[22px] flex-1 overflow-x-auto scrollbar-none whitespace-nowrap">
          {CATEGORIES.map((cat) => {
            const href = `/categories/${cat.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`text-[15px] font-semibold text-[#16181D] py-[21px] transition-colors border-b-[3px] hover:text-[#133A63] hover:no-underline ${
                  isActive ? "border-[#133A63]" : "border-transparent"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {showSearch ? (
            <div className="flex items-center bg-[#FCFBF8] border border-[#16181D] rounded-[2px] px-2 py-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã cổ phiếu, bài viết..."
                autoFocus
                className="text-[14px] bg-transparent outline-none w-48 sm:w-60 text-[#16181D] placeholder:text-[#5E636B]"
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="text-[#5E636B] hover:text-[#16181D] p-1"
                aria-label="Đóng tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="border-0 bg-transparent cursor-pointer text-[14px] font-semibold text-[#16181D] hover:text-[#133A63] py-2 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Tìm kiếm</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center gap-4 overflow-x-auto px-6 py-2 border-t border-[#E3E1DC] scrollbar-none whitespace-nowrap bg-[#F7F5F0]">
        {CATEGORIES.map((cat) => {
          const href = `/categories/${cat.slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={cat.slug}
              href={href}
              className={`text-[13px] font-semibold text-[#16181D] py-1 border-b-2 ${
                isActive ? "border-[#133A63] text-[#133A63]" : "border-transparent"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
