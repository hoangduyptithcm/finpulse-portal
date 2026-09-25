"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/app/admin/actions";
import { Loader2, Plus, Trash2, Edit3, ExternalLink } from "lucide-react";

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  category?: { id: string; name: string; slug: string } | null;
  status: string;
  featured: boolean;
  views: number;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

interface PostsManagerProps {
  initialPosts?: PostItem[];
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export default function PostsManager({
  initialPosts = [],
  categories = [],
}: PostsManagerProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | "pub" | "draft">("all");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [postsList, setPostsList] = useState<PostItem[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const nPub = postsList.filter((r) => r.status === "PUBLISHED").length;
  const nDraft = postsList.filter((r) => r.status === "DRAFT").length;

  const filtered = postsList.filter((r) => {
    if (tab === "pub" && r.status !== "PUBLISHED") return false;
    if (tab === "draft" && r.status !== "DRAFT") return false;
    if (selectedCat !== "all" && r.category?.id !== selectedCat) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa bài viết: "${title}"?`)) return;

    try {
      setDeletingId(id);
      await deletePost(id);
      setPostsList((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi xóa bài viết";
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (d: Date | string) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return String(d);
    }
  };

  return (
    <div
      data-screen-label="06 Quản lý bài viết"
      className="flex flex-col gap-5 max-w-[1080px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="m-0 text-[26px] font-bold text-[#16181D]">Bài viết</h1>
          <p className="m-0 mt-1 text-[14px] text-[#5E636B]">
            Dữ liệu kết nối trực tiếp với Supabase Database
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white py-2 px-4 text-[14px] font-semibold cursor-pointer rounded-[4px] transition-colors !no-underline inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Viết bài mới</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 border-b border-[#E5E7EB] text-[14px]">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "all"
              ? "text-[#111827] border-[#111827]"
              : "text-[#6B7280] border-transparent hover:text-[#111827]"
          }`}
        >
          Tất cả <span className="font-normal text-[#6B7280]">({postsList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("pub")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "pub"
              ? "text-[#111827] border-[#111827]"
              : "text-[#6B7280] border-transparent hover:text-[#111827]"
          }`}
        >
          Đã xuất bản <span className="font-normal text-[#6B7280]">({nPub})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("draft")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "draft"
              ? "text-[#111827] border-[#111827]"
              : "text-[#6B7280] border-transparent hover:text-[#111827]"
          }`}
        >
          Bản nháp <span className="font-normal text-[#6B7280]">({nDraft})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-2.5 flex-wrap items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tiêu đề"
          className="border border-[#D1D5DB] bg-white px-3 py-2 text-[14px] w-60 rounded-[4px] outline-none text-[#111827] focus:border-[#111827]"
        />

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="border border-[#D1D5DB] bg-white px-2.5 py-2 text-[14px] rounded-[4px] outline-none text-[#111827] focus:border-[#111827]"
        >
          <option value="all">Mọi chuyên mục</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[14px] text-[#6B7280]">
          {filtered.length} bài
        </span>
      </div>

      {/* Table Data */}
      <div className="bg-white border border-[#E5E7EB] overflow-x-auto rounded-[4px] shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6B7280] flex flex-col items-center justify-center gap-3">
            <p className="text-[16px] font-serif">Chưa có bài viết nào trong danh mục này.</p>
            <Link
              href="/admin/posts/new"
              className="border border-[#1E40AF] text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white px-4 py-1.5 text-[13px] font-semibold rounded-[4px] transition-colors"
            >
              Soạn bài viết đầu tiên ngay
            </Link>
          </div>
        ) : (
          <table className="w-full border-collapse text-[14px] min-w-[960px]">
            <thead>
              <tr className="text-left text-[#6B7280] text-[13px] bg-[#F9FAFB]">
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Tiêu đề
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Chuyên mục
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Trạng thái
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] text-right">
                  Lượt xem
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Ngày tạo
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-[#F9FAFB] transition-colors"
                >
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] min-w-[360px]">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/posts/edit/${r.id}`}
                        className="font-semibold text-[#111827] text-[15px] leading-[1.4] hover:text-[#1E40AF]"
                      >
                        {r.title}
                      </Link>
                      <span className="flex gap-3 text-[13px]">
                        <Link
                          href={`/admin/posts/edit/${r.id}`}
                          className="text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Sửa</span>
                        </Link>
                        <Link
                          href={`/posts/${r.slug}`}
                          target="_blank"
                          className="text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Xem</span>
                        </Link>
                        {r.featured && (
                          <span className="text-[#8A5A00] font-semibold">
                            · Tiêu điểm
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#374151] whitespace-nowrap">
                    {r.category?.name || "Chưa phân loại"}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] whitespace-nowrap">
                    <span
                      className={`inline-block py-0.5 px-2 rounded-[2px] text-[12px] font-semibold ${
                        r.status === "PUBLISHED"
                          ? "bg-[#E6F4EA] text-[#0A7A45]"
                          : "bg-[#F3F4F6] text-[#6B7280]"
                      }`}
                    >
                      {r.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-right tabular-nums text-[#374151]">
                    {r.views.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#6B7280] whitespace-nowrap text-[13px]">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={deletingId === r.id}
                      onClick={() => handleDelete(r.id, r.title)}
                      className="border-0 bg-transparent p-1 text-[#C0271D] hover:bg-red-50 rounded cursor-pointer transition-colors disabled:opacity-50"
                      title="Xóa bài viết"
                    >
                      {deletingId === r.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#C0271D]" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
