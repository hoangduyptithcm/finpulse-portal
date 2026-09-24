"use client";

import { useState } from "react";
import { createCategory, deleteCategory } from "@/app/admin/actions";
import { Plus, Trash2, Loader2, FolderTree } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  _count: { posts: number };
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await createCategory({ name, description, order: Number(order) });
      setName("");
      setDescription("");
      setOrder(0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string, postCount: number) => {
    if (postCount > 0) {
      alert(`Không thể xóa chuyên mục "${catName}" vì đang có ${postCount} bài viết trực thuộc.`);
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên mục "${catName}"?`)) return;

    try {
      setDeletingId(id);
      await deleteCategory(id);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Create form (5 cols) */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleCreate}
          className="border border-stone-200 bg-white p-5 rounded-sm space-y-4"
        >
          <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-sm pb-2 border-b border-stone-100">
            <Plus className="w-4 h-4 text-stone-700" />
            <span>Thêm Chuyên mục mới</span>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-sm border border-red-200">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-800">
              Tên chuyên mục *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Phân tích Kỹ thuật"
              required
              className="w-full rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-800">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về chủ đề..."
              className="w-full rounded-sm border border-stone-300 bg-white p-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-stone-800 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-800">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-sm border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-stone-800"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1.5 rounded-sm bg-stone-900 hover:bg-stone-800 py-2 px-4 text-xs font-medium text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Lưu Chuyên mục</span>
            )}
          </button>
        </form>
      </div>

      {/* Categories List (7 cols) */}
      <div className="lg:col-span-7">
        <div className="border border-stone-200 bg-white rounded-sm overflow-hidden">
          <div className="p-3.5 border-b border-stone-200 flex items-center gap-2 font-serif font-bold text-xs text-stone-900">
            <FolderTree className="w-4 h-4 text-stone-500" />
            <span>Danh sách Chuyên mục hiện có</span>
          </div>

          <div className="divide-y divide-stone-100">
            {initialCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-3.5 flex items-center justify-between hover:bg-stone-50/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-stone-900">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-sm border border-stone-200">
                      /{cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-stone-400">
                    <span>Thứ tự: {cat.order}</span>
                    <span>•</span>
                    <span>{cat._count.posts} bài viết</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name, cat._count.posts)}
                    disabled={deletingId === cat.id}
                    className="p-1.5 rounded-sm text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Xóa chuyên mục"
                  >
                    {deletingId === cat.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
