"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/portalData";

export default function CategoryManager() {
  const [categories, setCategories] = useState(
    CATEGORIES.map((c, i) => ({
      order: i + 1,
      name: c.name,
      slug: c.slug,
      count: c.count,
    }))
  );
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    setCategories((prev) => [
      ...prev,
      {
        order: prev.length + 1,
        name: name.trim(),
        slug,
        count: 0,
      },
    ]);
    setName("");
    setDesc("");
  };

  const handleDelete = (slug: string, catName: string) => {
    if (confirm(`Bạn có chắc muốn xóa chuyên mục: "${catName}"?`)) {
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
    }
  };

  return (
    <div
      data-screen-label="08 Chuyên mục"
      className="flex flex-col gap-5 max-w-[1080px]"
    >
      <h1 className="m-0 text-[26px] font-bold text-[#16181D]">
        Chuyên mục
      </h1>

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
                  Tên
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB]">
                  Đường dẫn
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E5E7EB] text-right">
                  Số bài
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#6B7280]">
                    {c.order}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6]">
                    <span className="flex flex-col gap-1">
                      <strong className="text-[#111827] font-semibold">
                        {c.name}
                      </strong>
                      <span className="flex gap-3 text-[13px]">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            const newName = prompt("Đổi tên chuyên mục:", c.name);
                            if (newName) {
                              setCategories((prev) =>
                                prev.map((item) =>
                                  item.slug === c.slug
                                    ? { ...item, name: newName }
                                    : item
                                )
                              );
                            }
                          }}
                          className="text-[#1E40AF] hover:underline"
                        >
                          Sửa
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.slug, c.name)}
                          className="border-0 bg-transparent p-0 text-[#DC2626] hover:underline cursor-pointer"
                        >
                          Xóa
                        </button>
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-[#6B7280]">
                    /{c.slug}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#F3F4F6] text-right tabular-nums text-[#111827] font-medium">
                    {c.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Category Form */}
        <form
          onSubmit={handleAdd}
          className="flex-[1_1_260px] bg-white border border-[#E5E7EB] p-5 flex flex-col gap-3.5 rounded-[4px] shadow-sm"
        >
          <strong className="text-[15px] text-[#111827]">
            Thêm chuyên mục
          </strong>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
            Tên
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Vàng và hàng hóa"
              required
              className="border border-[#D1D5DB] bg-white px-2.5 py-2 text-[14px] font-normal rounded-[4px] outline-none text-[#111827] focus:border-[#111827]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#111827]">
            Mô tả
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="border border-[#D1D5DB] bg-white px-2.5 py-2 text-[14px] font-normal rounded-[4px] resize-y outline-none text-[#111827] focus:border-[#111827]"
            />
          </label>

          <button
            type="submit"
            className="border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white py-2.5 px-4 text-[14px] font-semibold cursor-pointer rounded-[4px] transition-colors"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}
