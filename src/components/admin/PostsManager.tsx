"use client";

import { useState } from "react";
import Link from "next/link";
import { ADMIN_POSTS_DATA, CATEGORIES } from "@/data/portalData";

export default function PostsManager() {
  const [tab, setTab] = useState<"all" | "pub" | "draft">("all");
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [postsList, setPostsList] = useState(ADMIN_POSTS_DATA);

  const nPub = postsList.filter((r) => r.st === "pub").length;
  const nDraft = postsList.filter((r) => r.st === "draft").length;

  const filtered = postsList.filter((r) => {
    if (tab === "pub" && r.st !== "pub") return false;
    if (tab === "draft" && r.st !== "draft") return false;
    if (selectedCat !== "all" && r.cat !== selectedCat) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa bài viết: "${title}"?`)) {
      setPostsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div
      data-screen-label="06 Quản lý bài viết"
      className="flex flex-col gap-5 max-w-[1080px]"
    >
      {/* Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h1 className="m-0 text-[26px] font-bold text-[#16181D]">Bài viết</h1>
        <Link
          href="/admin/posts/new"
          className="border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white py-2 px-4 text-[14px] font-semibold cursor-pointer rounded-[3px] transition-colors !no-underline inline-block"
        >
          Viết bài mới
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-5 border-b border-[#E3E1DC] text-[14px]">
        <button
          type="button"
          onClick={() => setTab("all")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "all"
              ? "text-[#16181D] border-[#16181D]"
              : "text-[#5E636B] border-transparent hover:text-[#16181D]"
          }`}
        >
          Tất cả <span className="font-normal text-[#5E636B]">({postsList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("pub")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "pub"
              ? "text-[#16181D] border-[#16181D]"
              : "text-[#5E636B] border-transparent hover:text-[#16181D]"
          }`}
        >
          Đã xuất bản <span className="font-normal text-[#5E636B]">({nPub})</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("draft")}
          className={`border-0 bg-transparent cursor-pointer py-2.5 px-0 text-[14px] font-semibold -mb-px border-b-2 transition-colors ${
            tab === "draft"
              ? "text-[#16181D] border-[#16181D]"
              : "text-[#5E636B] border-transparent hover:text-[#16181D]"
          }`}
        >
          Bản nháp <span className="font-normal text-[#5E636B]">({nDraft})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex gap-2.5 flex-wrap items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tiêu đề"
          className="border border-[#C9C5BC] bg-[#FCFBF8] px-3 py-2 text-[14px] w-60 rounded-[3px] outline-none text-[#16181D] focus:border-[#16181D]"
        />

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="border border-[#C9C5BC] bg-[#FCFBF8] px-2.5 py-2 text-[14px] rounded-[3px] outline-none text-[#16181D] focus:border-[#16181D]"
        >
          <option value="all">Mọi chuyên mục</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[14px] text-[#5E636B]">
          {filtered.length} bài
        </span>
      </div>

      {/* Table Data */}
      <div className="bg-[#FCFBF8] border border-[#E3E1DC] overflow-x-auto rounded-[2px]">
        <table className="w-full border-collapse text-[14px] min-w-[960px]">
          <thead>
            <tr className="text-left text-[#5E636B] text-[13px] bg-[#F1EEE8]">
              <th className="py-2.5 pl-4 w-8 border-b border-[#E3E1DC]">
                <input type="checkbox" className="rounded-[2px]" />
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                Tiêu đề
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                Nguồn số liệu
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                Chuyên mục
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                Trạng thái
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC] text-right">
                Lượt xem
              </th>
              <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                Ngày
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-[#F1EEE8] transition-colors"
              >
                <td className="py-3.5 pl-4 border-b border-[#EFEDE8] align-top">
                  <input type="checkbox" className="rounded-[2px]" />
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] min-w-[360px]">
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/admin/posts/new"
                      className="font-semibold text-[#16181D] text-[15px] leading-[1.4] hover:text-[#133A63]"
                    >
                      {r.title}
                    </Link>
                    <span className="flex gap-3 text-[13px]">
                      <Link
                        href="/admin/posts/new"
                        className="text-[#133A63] hover:underline"
                      >
                        Sửa
                      </Link>
                      <Link
                        href={`/posts/${r.slug}`}
                        className="text-[#133A63] hover:underline"
                      >
                        Xem
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.title)}
                        className="border-0 bg-transparent p-0 text-[#C0271D] hover:underline cursor-pointer"
                      >
                        Xóa
                      </button>
                      {r.featured && (
                        <span className="text-[#8A5A00] font-semibold">
                          · Tiêu điểm
                        </span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] whitespace-nowrap align-top">
                  {r.src > 0 ? (
                    <span className="text-[#2B2F36]">{r.src} nguồn</span>
                  ) : (
                    <span className="text-[#C0271D] font-semibold">
                      Chưa có
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] whitespace-nowrap align-top text-[#2B2F36]">
                  {r.cat}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] whitespace-nowrap align-top">
                  {r.st === "pub" ? (
                    <span className="text-[#0A7A45] font-semibold">
                      Đã xuất bản
                    </span>
                  ) : (
                    <span className="text-[#8A5A00] font-semibold">
                      Bản nháp
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] text-right tabular-nums align-top text-[#16181D]">
                  {r.views}
                </td>
                <td className="py-3.5 px-4 border-b border-[#EFEDE8] whitespace-nowrap text-[#5E636B] align-top">
                  {r.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="m-0 p-9 text-center text-[#5E636B] text-[14px]">
            Không có bài viết phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
