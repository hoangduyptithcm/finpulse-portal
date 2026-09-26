"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory } from "@/app/admin/actions";
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, X, Layers } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  _count?: {
    posts: number;
  };
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await createCategory({
        name: name.trim(),
        description: desc.trim() || undefined,
        order: categories.length + 1,
      });

      if (res.success && res.category) {
        setCategories((prev) => [
          ...prev,
          {
            ...res.category,
            _count: { posts: 0 },
          },
        ]);
        setName("");
        setDesc("");
        showToast("success", `Đã thêm chuyên mục "${name.trim()}" thành công!`);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tạo chuyên mục";
      showToast("error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(deleteTarget.id);
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("success", `Đã xóa chuyên mục "${deleteTarget.name}" thành công!`);
      setDeleteTarget(null);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa chuyên mục";
      showToast("error", msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      data-screen-label="08 Chuyên mục"
      className="flex flex-col gap-6 max-w-[1080px]"
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-[14px] font-medium bg-white border-[#E5E7EB] text-[#111827] animate-in fade-in slide-in-from-top-4 duration-200">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-[#9CA3AF] hover:text-[#111827] border-0 bg-transparent cursor-pointer p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="m-0 text-[26px] font-bold text-[#111827]">Chuyên mục</h1>
        <p className="m-0 mt-1 text-[14px] text-[#6B7280]">
          Quản lý danh mục phân loại bài viết và cấu trúc menu hiển thị
        </p>
      </div>

      <div className="flex flex-wrap gap-7 items-start">
        {/* Table of categories */}
        <div className="flex-[1_1_560px] min-w-0 bg-white border border-[#E5E7EB] overflow-x-auto rounded-[4px] shadow-sm">
          <table className="w-full border-collapse text-[14px] min-w-[520px]">
            <thead>
              <tr className="text-left text-[#6B7280] text-[13px] bg-[#F9FAFB]">
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] w-14">
                  Thứ tự
                </th>
                <th className="py-2.5 px-4 font-semibold border-b border-[#E5E7EB]">
                  Tên chuyên mục
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Đường dẫn (Slug)
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] text-right">
                  Số bài
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] text-right w-16">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6B7280]">
                    Chưa có chuyên mục nào. Hãy tạo chuyên mục đầu tiên ở bên phải.
                  </td>
                </tr>
              ) : (
                categories.map((c, index) => (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#6B7280]">
                      {c.order || index + 1}
                    </td>
                    <td className="py-3.5 px-4 border-b border-[#F3F4F6]">
                      <span className="flex flex-col gap-0.5">
                        <strong className="text-[#111827] font-semibold">
                          {c.name}
                        </strong>
                        {c.description && (
                          <span className="text-[12px] text-[#6B7280] line-clamp-1">
                            {c.description}
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#6B7280] font-mono text-[13px]">
                      /{c.slug}
                    </td>
                    <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-right tabular-nums text-[#111827] font-medium">
                      {c._count?.posts ?? 0}
                    </td>
                    <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
                        className="border-0 bg-transparent p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer transition-colors"
                        title="Xóa chuyên mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAdd}
          className="flex-[1_1_280px] bg-white border border-[#E5E7EB] p-5 flex flex-col gap-4 rounded-[4px] shadow-sm"
        >
          <strong className="text-[15px] text-[#111827] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#1E40AF]" />
            <span>Thêm chuyên mục mới</span>
          </strong>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
            Tên chuyên mục
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Phân tích ngành"
              required
              className="border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-normal rounded-[4px] outline-none text-[#111827] focus:border-[#1E40AF] transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
            Mô tả
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Mô tả ngắn về chủ đề chuyên mục..."
              className="border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] font-normal rounded-[4px] resize-y outline-none text-[#111827] focus:border-[#1E40AF] transition-colors"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white py-2.5 px-4 text-[14px] font-semibold cursor-pointer rounded-[4px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSubmitting ? "Đang tạo..." : "Thêm chuyên mục"}</span>
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg p-6 max-w-[400px] w-full shadow-2xl border border-[#E5E7EB] animate-in zoom-in-95 duration-200">
            <h4 className="text-[17px] font-bold text-[#111827] mb-2 font-sans">
              Xác nhận xóa chuyên mục
            </h4>
            <p className="text-[14px] text-[#4B5563] mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa chuyên mục:{" "}
              <strong className="text-[#111827]">&quot;{deleteTarget.name}&quot;</strong>?
              Các bài viết thuộc chuyên mục này có thể cần được phân loại lại.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-[14px] font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded-[4px] border-0 cursor-pointer transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={confirmDelete}
                className="px-4 py-2 text-[14px] font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-[4px] border-0 cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {deletingId === deleteTarget.id && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
