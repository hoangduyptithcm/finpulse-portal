"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

interface CategoryNav {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar({ categories }: { categories: CategoryNav[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-stone-900 hover:opacity-90">
              FinPulse
            </Link>

            {/* Desktop Categories Menu */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-stone-700">
              <Link href="/categories/crypto" className="hover:text-stone-950 transition-colors">
                Crypto
              </Link>
              <Link href="/categories/chung-khoan" className="hover:text-stone-950 transition-colors">
                Chứng khoán
              </Link>
              <Link href="/categories/vi-mo" className="hover:text-stone-950 transition-colors">
                Vĩ mô
              </Link>
              <Link href="/categories/kien-thuc-dau-tu" className="hover:text-stone-950 transition-colors">
                Kiến thức đầu tư
              </Link>
            </nav>
          </div>

          {/* Right: Search */}
          <div className="flex items-center gap-3">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin tức, cổ phiếu, crypto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-1 text-xs text-stone-900 outline-none focus:border-stone-800 w-48 sm:w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-950 cursor-pointer font-medium"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm kiếm</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-stone-600 hover:text-stone-950"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 text-sm font-medium text-stone-800">
          <Link
            href="/categories/crypto"
            onClick={() => setIsOpen(false)}
            className="block py-1.5 hover:text-stone-950"
          >
            Crypto
          </Link>
          <Link
            href="/categories/chung-khoan"
            onClick={() => setIsOpen(false)}
            className="block py-1.5 hover:text-stone-950"
          >
            Chứng khoán
          </Link>
          <Link
            href="/categories/vi-mo"
            onClick={() => setIsOpen(false)}
            className="block py-1.5 hover:text-stone-950"
          >
            Vĩ mô
          </Link>
          <Link
            href="/categories/kien-thuc-dau-tu"
            onClick={() => setIsOpen(false)}
            className="block py-1.5 hover:text-stone-950"
          >
            Kiến thức đầu tư
          </Link>
        </div>
      )}
    </header>
  );
}
