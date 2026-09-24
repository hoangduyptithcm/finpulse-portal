"use client";

import { useState } from "react";
import { createCategory, deleteCategory } from "@/app/admin/actions";
import { Plus, Trash2, Loader2, FolderTree, Hash } from "lucide-react";

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
      {/* Create form (4 cols) */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-xl"
        >
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Thêm Chuyên mục mới</span>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Tên chuyên mục *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Phân tích Kỹ thuật"
              required
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về chủ đề của chuyên mục..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 px-4 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Lưu Chuyên mục</span>
            )}
          </button>
        </form>
      </div>

      {/* Categories List (7 cols) */}
      <div className="lg:col-span-7">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800/80 flex items-center gap-2 font-bold text-xs text-slate-300">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>Danh sách Chuyên mục hiện có</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {initialCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-200">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                      /{cat.slug}
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
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
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Xóa chuyên mục"
                  >
                    {deletingId === cat.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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
