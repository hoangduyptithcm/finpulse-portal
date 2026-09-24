"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowUpRight, ShieldCheck, Flame } from "lucide-react";

interface CategoryNav {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar({ categories }: { categories: CategoryNav[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20">
                FP
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-white">
                  FINPULSE
                </span>
                <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold -mt-1">
                  Crypto & VN Market
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className="px-3 py-2 text-xs font-semibold text-white rounded-lg hover:bg-slate-900 transition-colors"
              >
                Trang chủ
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="px-3 py-2 text-xs font-medium text-slate-300 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Fanpage CTA */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>Cộng đồng Fanpage</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* Admin entry shortcut */}
            <Link
              href="/admin"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
              title="Quản trị viên"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm font-semibold text-emerald-400 rounded-lg hover:bg-slate-900"
          >
            Trang chủ
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-900"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 text-xs font-semibold"
            >
              <span>Theo dõi Fanpage Facebook</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-slate-500 text-xs hover:text-slate-300"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Đăng nhập Quản trị viên</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
