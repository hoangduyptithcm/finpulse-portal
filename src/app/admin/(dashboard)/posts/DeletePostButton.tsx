"use client";

import { useState } from "react";
import { deletePost } from "@/app/admin/actions";
import { Trash2, Loader2 } from "lucide-react";

export default function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết:\n"${title}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePost(id);
    } catch (err) {
      alert("Lỗi khi xóa bài viết: " + (err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
      title="Xóa bài viết"
    >
      {isDeleting ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
