"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/data/portalData";
import { Search, X, ArrowRight } from "lucide-react";

interface CategoryNav {
  id?: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryNav[]>(CATEGORIES);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearch(false);
  };

  return (
    <header className="border-b border-[#E5E7EB] bg-white sticky top-0 z-20">
      <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between gap-6 sm:gap-8 h-[66px]">
        {/* Brand */}
        <Link
          href="/"
          className="flex flex-col text-[#111827] no-underline flex-shrink-0 group"
        >
          <span className="font-serif font-bold text-[26px] tracking-[-0.02em] leading-none group-hover:text-[#1E40AF] transition-colors">
            FinPulse
          </span>
          <span className="text-[12px] text-[#6B7280] mt-[3px]">
            Sổ phân tích của Minh Anh
          </span>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden md:flex items-center gap-[22px] flex-1 overflow-x-auto scrollbar-none whitespace-nowrap">
          {categories.map((cat) => {
            const href = `/categories/${cat.slug}`;
            const isActive = pathname === href;
            return (
              <Link
                key={cat.slug}
                href={href}
                className={`text-[15px] font-semibold text-[#111827] py-[21px] transition-colors border-b-[3px] hover:text-[#1E40AF] hover:no-underline ${
                  isActive ? "border-[#1E40AF] text-[#1E40AF]" : "border-transparent"
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
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white border border-[#111827] rounded-[4px] px-2.5 py-1.5 shadow-sm"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài viết, mã CP..."
                autoFocus
                className="text-[14px] bg-transparent outline-none w-48 sm:w-60 text-[#111827] placeholder:text-[#9CA3AF]"
              />
              <button
                type="submit"
                className="text-[#1E40AF] hover:text-[#1E3A8A] p-1 border-0 bg-transparent cursor-pointer"
                title="Tìm kiếm"
                aria-label="Tìm kiếm"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="text-[#9CA3AF] hover:text-[#111827] p-1 border-0 bg-transparent cursor-pointer"
                aria-label="Đóng tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              className="border-0 bg-transparent cursor-pointer text-[14px] font-semibold text-[#111827] hover:text-[#1E40AF] py-2 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4 text-[#4B5563]" />
              <span>Tìm kiếm</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center gap-4 overflow-x-auto px-6 py-2.5 border-t border-[#E5E7EB] scrollbar-none whitespace-nowrap bg-white">
        {categories.map((cat) => {
          const href = `/categories/${cat.slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={cat.slug}
              href={href}
              className={`text-[13px] font-semibold text-[#111827] py-1 border-b-2 ${
                isActive ? "border-[#1E40AF] text-[#1E40AF]" : "border-transparent"
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
