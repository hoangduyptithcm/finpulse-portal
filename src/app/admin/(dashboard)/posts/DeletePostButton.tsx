"use client";

import { useState } from "react";
import { deletePost } from "@/app/admin/actions";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await deletePost(id);
      setShowConfirm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="p-1.5 rounded-sm text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border-0 bg-transparent"
        title="Xóa bài viết"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 max-w-[380px] w-full shadow-xl border border-[#E5E7EB]">
            <h4 className="text-[16px] font-bold text-[#111827] mb-2 font-sans">
              Xác nhận xóa
            </h4>
            <p className="text-[13px] text-[#4B5563] mb-4 leading-relaxed">
              Bạn có chắc muốn xóa bài viết: <strong>&quot;{title}&quot;</strong>?
            </p>
            {error && (
              <div className="p-2 mb-3 bg-red-50 text-red-700 text-[12px] rounded flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-[13px] font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] rounded border-0 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-3 py-1.5 text-[13px] font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded border-0 cursor-pointer flex items-center gap-1 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
