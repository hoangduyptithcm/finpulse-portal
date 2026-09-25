"use client";

import { useState } from "react";
import Link from "next/link";
import { getTopArticles } from "@/data/portalData";

export default function Top10Widget() {
  const [range, setRange] = useState<"month" | "all">("month");
  const articles = getTopArticles(range);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 pb-2 border-b-2 border-[#16181D]">
        <h2 className="m-0 text-[14px] font-bold whitespace-nowrap text-[#16181D]">
          Top 10 được đọc nhiều
        </h2>
        <span className="flex gap-3">
          <button
            type="button"
            onClick={() => setRange("month")}
            className={`border-0 bg-transparent p-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold transition-colors ${
              range === "month"
                ? "text-[#16181D] underline underline-offset-4"
                : "text-[#5E636B] hover:text-[#16181D]"
            }`}
          >
            30 ngày
          </button>
          <button
            type="button"
            onClick={() => setRange("all")}
            className={`border-0 bg-transparent p-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold transition-colors ${
              range === "all"
                ? "text-[#16181D] underline underline-offset-4"
                : "text-[#5E636B] hover:text-[#16181D]"
            }`}
          >
            Mọi lúc
          </button>
        </span>
      </div>

      <div className="flex flex-col">
        {articles.map((p) => (
          <Link
            key={p.n}
            href={`/posts/${p.slug}`}
            className="flex gap-3 py-[11px] border-b border-[#E3E1DC] text-[#16181D] hover:text-[#133A63] hover:no-underline transition-colors group"
          >
            <span
              className="font-serif font-bold text-[21px] leading-[1.1] w-[26px] flex-shrink-0 tabular-nums"
              style={{ color: p.numColor }}
            >
              {p.n}
            </span>
            <span className="flex flex-col gap-[3px]">
              <span className="text-[15px] font-semibold leading-[1.4] group-hover:text-[#133A63]">
                {p.title}
              </span>
              <span className="text-[12px] text-[#5E636B]">
                {p.cat} · {p.views} lượt đọc
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
