"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [currentDate, setCurrentDate] = useState("Thứ Năm, 24/09/2026");

  useEffect(() => {
    try {
      const now = new Date();
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[now.getDay()];
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDate(`${dayName}, ${day}/${month}/${year}`);
    } catch {
      // Fallback
    }
  }, []);

  return (
    <div className="border-b border-stone-200 bg-white text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
        <span className="font-serif text-[11px] text-stone-500">
          {currentDate}
        </span>

        <div className="flex items-center space-x-4 text-[11px]">
          <a
            href="#newsletter"
            className="hover:text-stone-900 transition-colors"
          >
            Bản tin email
          </a>
          <span className="text-stone-300">•</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors font-medium"
          >
            Fanpage
          </a>
        </div>
      </div>
    </div>
  );
}
