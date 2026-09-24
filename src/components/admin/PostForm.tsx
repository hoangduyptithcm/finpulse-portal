"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost, updatePost } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import TipTapEditor from "./TipTapEditor";
import CoverImageUploader from "./CoverImageUploader";
import { PostStatus } from "@prisma/client";
import {
  Save,
  ArrowLeft,
  Loader2,
  Share2,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="p-1.5 rounded-sm bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              {isEditing ? "Chỉnh sửa bài viết" : "Soạn bài viết mới"}
            </h2>
            <p className="text-xs text-stone-500">
              Định dạng chuẩn SEO bài báo, tự động tạo preview chia sẻ Facebook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/posts"
            className="px-3.5 py-2 rounded-sm border border-stone-300 bg-white text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-sm bg-stone-900 hover:bg-stone-800 px-4 py-2 text-xs font-medium text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{isEditing ? "Cập nhật bài viết" : "Xuất bản bài viết"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-sm border border-red-200 bg-red-50 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* 2 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Main Content (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800">
              Tiêu đề bài viết *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="VD: Tổng quan thị trường Crypto và chu kỳ mới năm 2026..."
              required
              className="w-full rounded-sm border border-stone-300 bg-white px-3.5 py-2.5 text-base font-semibold text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-500">
              <span>Đường dẫn URL SEO (Slug)</span>
              {!isSlugManual && <span className="text-blue-700">Tự động sinh</span>}
            </div>
            <div className="flex items-center rounded-sm border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-mono text-stone-500">
              <span className="shrink-0">/posts/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugManual(true);
                  setSlug(e.target.value);
                }}
                className="w-full bg-transparent text-stone-900 outline-none pl-1"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-700" />
                <span>Tóm tắt bài viết (Mô tả Facebook Preview)</span>
              </label>
              <span className="text-[11px] text-stone-400 font-mono">
                {excerpt.length}/250 ký tự
              </span>
            </div>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Nhập 1-2 câu tóm tắt nội dung để hiển thị trên Facebook Preview..."
              className="w-full rounded-sm border border-stone-300 bg-white p-3 text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-stone-800 resize-none leading-relaxed"
            />
          </div>

          {/* TipTap Editor */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-stone-600" />
              <span>Nội dung chi tiết bài viết</span>
            </label>
            <TipTapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Right Column: Settings & Media (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Cover Image */}
          <div className="border border-stone-200 bg-white p-4 rounded-sm space-y-2">
            <label className="block text-xs font-semibold text-stone-800">
              Ảnh bìa bài viết
            </label>
            <CoverImageUploader value={coverImage} onChange={setCoverImage} />
          </div>

          {/* Settings Box */}
          <div className="border border-stone-200 bg-white p-4 rounded-sm space-y-4">
            <h3 className="text-xs font-semibold text-stone-800 uppercase tracking-wider pb-2 border-b border-stone-100">
              Cài đặt Xuất bản
            </h3>

            {/* Category Select */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-600">
                Chuyên mục *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 outline-none focus:border-stone-800 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-stone-600">
                Trạng thái hiển thị
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus(PostStatus.PUBLISHED)}
                  className={`py-1.5 px-3 rounded-sm text-xs font-medium border transition-colors cursor-pointer ${
                    status === PostStatus.PUBLISHED
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Xuất bản ngay
                </button>
                <button
                  type="button"
                  onClick={() => setStatus(PostStatus.DRAFT)}
                  className={`py-1.5 px-3 rounded-sm text-xs font-medium border transition-colors cursor-pointer ${
                    status === PostStatus.DRAFT
                      ? "bg-stone-900 border-stone-900 text-white"
                      : "bg-white border-stone-300 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  Lưu bản nháp
                </button>
              </div>
            </div>

            {/* Featured Post Toggle */}
            <div className="pt-2 border-t border-stone-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-stone-800">
                    Bài viết tiêu điểm (Hero)
                  </span>
                  <p className="text-[10px] text-stone-400">
                    Hiển thị ở vị trí lớn nhất đầu trang chủ
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-800 border-stone-300 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
