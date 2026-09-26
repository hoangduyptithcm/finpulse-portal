"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface TopArticleItem {
  id: string;
  n: string;
  title: string;
  slug: string;
  cat: string;
  views: string;
  numColor: string;
}

export default function Top10Widget() {
  const [range, setRange] = useState<"month" | "all">("month");
  const [articles, setArticles] = useState<TopArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/top-posts?range=${range}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setArticles(data.items || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [range]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-between items-baseline gap-x-3 gap-y-1 pb-2.5 border-b-2 border-[#111827]">
        <h2 className="m-0 text-[15px] font-bold whitespace-nowrap text-[#111827]">
          Top được đọc nhiều
        </h2>
        <span className="flex gap-3">
          <button
            type="button"
            onClick={() => setRange("month")}
            className={`border-0 bg-transparent p-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold transition-colors ${
              range === "month"
                ? "text-[#111827] underline underline-offset-4"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            30 ngày
          </button>
          <button
            type="button"
            onClick={() => setRange("all")}
            className={`border-0 bg-transparent p-0 cursor-pointer whitespace-nowrap text-[13px] font-semibold transition-colors ${
              range === "all"
                ? "text-[#111827] underline underline-offset-4"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            Mọi lúc
          </button>
        </span>
      </div>

      <div className="flex flex-col min-h-[140px]">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-[#6B7280]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="py-6 text-center text-[13px] text-[#6B7280]">
            Chưa có bài viết nào trong danh sách.
          </div>
        ) : (
          articles.map((p) => (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="flex gap-3 py-3 border-b border-[#E5E7EB] text-[#111827] hover:text-[#1E40AF] hover:no-underline transition-colors group"
            >
              <span
                className="font-serif font-bold text-[20px] leading-[1.1] w-[24px] flex-shrink-0 tabular-nums"
                style={{ color: p.numColor }}
              >
                {p.n}
              </span>
              <span className="flex flex-col gap-[3px] min-w-0">
                <span className="text-[14px] font-semibold leading-[1.4] group-hover:text-[#1E40AF] line-clamp-2">
                  {p.title}
                </span>
                <span className="text-[12px] text-[#6B7280]">
                  {p.cat} · {p.views} lượt xem
                </span>
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
