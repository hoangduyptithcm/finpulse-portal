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
        <div className="flex-[1_1_560px] min-w-0 bg-[#FCFBF8] border border-[#E3E1DC] overflow-x-auto rounded-[2px]">
          <table className="w-full border-collapse text-[14px] min-w-[520px]">
            <thead>
              <tr className="text-left text-[#5E636B] text-[13px] bg-[#F1EEE8]">
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC] w-14">
                  Thứ tự
                </th>
                <th className="py-2.5 px-4 font-semibold border-b border-[#E3E1DC]">
                  Tên
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC]">
                  Đường dẫn
                </th>
                <th className="py-2.5 px-4 font-semibold whitespace-nowrap border-b border-[#E3E1DC] text-right">
                  Số bài
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.slug} className="hover:bg-[#F1EEE8] transition-colors">
                  <td className="py-3.5 px-4 border-b border-[#EFEDE8] text-[#5E636B]">
                    {c.order}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#EFEDE8]">
                    <span className="flex flex-col gap-1">
                      <strong className="text-[#16181D] font-semibold">
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
                          className="text-[#133A63] hover:underline"
                        >
                          Sửa
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.slug, c.name)}
                          className="border-0 bg-transparent p-0 text-[#C0271D] hover:underline cursor-pointer"
                        >
                          Xóa
                        </button>
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#EFEDE8] text-[#5E636B]">
                    /{c.slug}
                  </td>
                  <td className="py-3.5 px-4 border-b border-[#EFEDE8] text-right tabular-nums text-[#16181D] font-medium">
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
          className="flex-[1_1_260px] bg-[#FCFBF8] border border-[#E3E1DC] p-5 flex flex-col gap-3.5 rounded-[2px]"
        >
          <strong className="text-[15px] text-[#16181D]">
            Thêm chuyên mục
          </strong>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#16181D]">
            Tên
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Vàng và hàng hóa"
              required
              className="border border-[#C9C5BC] bg-white px-2.5 py-2 text-[14px] font-normal rounded-[3px] outline-none text-[#16181D] focus:border-[#16181D]"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[14px] font-semibold text-[#16181D]">
            Mô tả
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="border border-[#C9C5BC] bg-white px-2.5 py-2 text-[14px] font-normal rounded-[3px] resize-y outline-none text-[#16181D] focus:border-[#16181D]"
            />
          </label>

          <button
            type="submit"
            className="border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white py-2.5 px-4 text-[14px] font-semibold cursor-pointer rounded-[3px] transition-colors"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
}
