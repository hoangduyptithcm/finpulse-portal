"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import TipTapEditor from "./TipTapEditor";
import CoverImageUploader from "./CoverImageUploader";
import {
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
  Share2,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

import { PostStatus } from "@prisma/client";

interface CategoryOption {
  id: string;
  name: string;
}

interface PostData {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  categoryId: string;
  status: PostStatus;
  featured: boolean;
}

interface PostFormProps {
  initialData?: PostData;
  categories: CategoryOption[];
}

export default function PostForm({ initialData, categories }: PostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [status, setStatus] = useState<PostStatus>(
    initialData?.status || PostStatus.PUBLISHED
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề bài viết");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn chuyên mục");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        status,
        featured,
      };

      if (isEditing && initialData?.id) {
        await updatePost(initialData.id, payload);
      } else {
        await createPost(payload);
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>
            <p className="text-xs text-slate-400">
              Định dạng chuẩn SEO bài báo, tự động tạo preview chia sẻ Facebook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>{isEditing ? "Cập nhật bài viết" : "Xuất bản bài viết"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Giá Bitcoin vượt mốc 100,000 USD sau dòng tiền ETF kỷ lục..."
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-base font-semibold text-white placeholder-slate-600 outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-medium text-slate-400">
                Đường dẫn URL SEO (Slug)
              </label>
              {!isSlugManual && (
                <span className="text-[10px] text-emerald-400">Tự động sinh từ tiêu đề</span>
              )}
            </div>
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs font-mono text-slate-400">
              <span className="text-slate-600 shrink-0">/posts/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(e.target.value);
                }}
                className="w-full bg-transparent text-emerald-400 outline-none pl-1"
              />
            </div>
          </div>

          {/* Excerpt / Tóm tắt */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tóm tắt bài viết (Mô tả Facebook Preview)</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {excerpt.length}/250 ký tự
              </span>
            </div>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Nhập 1-2 câu tóm tắt hấp dẫn. Nội dung này sẽ hiển thị làm phần mô tả khi dán link lên Fanpage Facebook."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-emerald-500/60 resize-none leading-relaxed"
            />
          </div>

          {/* TipTap Rich Text Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nội dung chi tiết bài viết</span>
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right Column: Settings & Media (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image Upload */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Ảnh bìa bài viết (Cover Image)
            </label>
            <CoverImageUploader value={coverImage} onChange={setCoverImage} />
          </div>

          {/* Publishing Settings */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cài đặt Xuất bản
            </h3>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">
                Chuyên mục bài viết *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-400">
                Trạng thái hiển thị
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("PUBLISHED")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    status === "PUBLISHED"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Xuất bản ngay
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("DRAFT")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    status === "DRAFT"
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Lưu bản nháp
                </button>
              </div>
            </div>

            {/* Featured Post Toggle */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bài viết tiêu điểm (Featured)</span>
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Hiển thị ở vị trí to nhất đầu trang chủ
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-800 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
