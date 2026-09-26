"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleView, { DynamicPostData } from "@/components/public/ArticleView";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import { ArrowLeft, Eye, Sparkles } from "lucide-react";

export default function PostPreviewPage() {
  const [previewPost, setPreviewPost] = useState<DynamicPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("finpulse_preview_post");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreviewPost({
          id: parsed.id || "preview-temp",
          title: parsed.title || "Bài viết xem trước",
          slug: parsed.slug || "bai-viet-xem-truoc",
          excerpt: parsed.excerpt || "",
          content: parsed.content || "<p>Chưa có nội dung bài viết.</p>",
          coverImage: parsed.coverImage || null,
          category: parsed.category || { name: "Đọc BCTC", slug: "doc-bctc" },
          author: parsed.author || { name: "Minh Anh" },
          createdAt: parsed.createdAt || new Date().toISOString(),
          views: 0,
        });
      }
    } catch (e) {
      console.error("Lỗi khi đọc dữ liệu xem trước:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* Sticky Preview Header Notification */}
      <aside aria-label="Thông báo chế độ xem trước" className="sticky top-0 z-50 bg-[#1E40AF] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 text-[14px]">
          <span className="bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            Xem trước
          </span>
          <span className="font-medium text-white/90">
            Đây là giao diện hiển thị thực tế cho độc giả trước khi bài viết được xuất bản.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-1 text-[13px] bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors font-medium cursor-pointer border-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại soạn thảo</span>
          </button>
          <Link
            href="/admin/posts"
            className="text-[13px] text-white/80 hover:text-white underline font-medium"
          >
            Về trang quản trị
          </Link>
        </div>
      </aside>

      <TopBar />
      <Navbar />
      <MarketTickerBar />

      {isLoading ? (
        <div className="py-24 text-center text-[#6B7280]">
          Đang tải dữ liệu bài viết xem trước...
        </div>
      ) : (
        <ArticleView post={previewPost || undefined} />
      )}

      <Footer />
    </div>
  );
}
