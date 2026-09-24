"use client";

import Link from "next/link";
import { useState } from "react";

interface TrendingArticle {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  views: number;
}

export default function TopTrending({ articles }: { articles: TrendingArticle[] }) {
  const [tab, setTab] = useState<"today" | "week">("today");

  // Hiển thị danh sách top 10
  const list = articles.slice(0, 10);

  return (
    <div className="border border-stone-200 bg-white p-4 rounded-sm space-y-3">
      {/* Header with tabs */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <h3 className="font-serif font-bold text-sm text-stone-900">
          Top 10 tin hay nhất
        </h3>
        <div className="flex items-center space-x-2 text-[11px]">
          <button
            type="button"
            onClick={() => setTab("today")}
            className={`cursor-pointer transition-colors ${
              tab === "today"
                ? "font-bold text-stone-900 border-b border-stone-900 pb-0.5"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            Hôm nay
          </button>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={() => setTab("week")}
            className={`cursor-pointer transition-colors ${
              tab === "week"
                ? "font-bold text-stone-900 border-b border-stone-900 pb-0.5"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            7 ngày
          </button>
        </div>
      </div>

      {/* Numbered list */}
      <div className="divide-y divide-stone-100">
        {list.map((item, index) => (
          <Link
            key={item.id}
            href={`/posts/${item.slug}`}
            className="group py-2.5 flex items-start space-x-3 block hover:bg-stone-50/60 transition-colors"
          >
            {/* Big Rank Number */}
            <span
              className={`font-serif font-bold text-base w-4 shrink-0 leading-tight ${
                index < 3 ? "text-stone-900" : "text-stone-400"
              }`}
            >
              {index + 1}
            </span>

            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-semibold text-stone-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                {item.title}
              </h4>
              <p className="text-[11px] text-stone-500 font-sans">
                <span>{item.categoryName}</span>
                <span className="mx-1">·</span>
                <span>{item.views.toLocaleString("vi-VN")} lượt đọc</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
