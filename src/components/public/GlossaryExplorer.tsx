"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { GlossaryItem } from "@/data/glossaryData";
import { Search, HelpCircle, CheckCircle } from "lucide-react";

interface GlossaryExplorerProps {
  items: GlossaryItem[];
}

export default function GlossaryExplorer({ items }: GlossaryExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string>("Tất cả");

  const categories = ["Tất cả", "Ngân hàng", "Định giá", "Hiệu quả hoạt động", "Dòng tiền & Nợ"];

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCat === "Tất cả" || item.category === selectedCat;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        item.fullName.toLowerCase().includes(q) ||
        item.shortDef.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [items, search, selectedCat]);

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#F9FAFB] p-4 sm:p-5 border border-[#E5E7EB] rounded-[4px]">
        {/* Search Input */}
        <div className="relative w-full sm:w-[320px]">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm thuật ngữ (NIM, ROE, P/B...)"
            className="w-full pl-9 pr-4 py-2 text-[14px] bg-white border border-[#D1D5DB] rounded text-[#111827] focus:outline-none focus:border-[#1E40AF]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 text-[13px] font-semibold rounded transition-colors cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#111827] text-white"
                  : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-[14px] text-[#6B7280]">
        <span>
          Hiển thị <strong>{filteredItems.length}</strong> thuật ngữ tài chính
        </span>
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="text-[13px] text-[#1E40AF] hover:underline cursor-pointer"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      {/* Grid of Glossary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <article
            key={item.term}
            id={item.slug}
            className="p-6 bg-white border border-[#E5E7EB] hover:border-[#111827] transition-all rounded-[3px] flex flex-col gap-4 shadow-sm hover:shadow-[4px_4px_0_#111827] scroll-mt-24"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[24px] text-[#1E40AF]">
                    {item.term}
                  </span>
                  <span className="text-[12px] font-semibold px-2 py-0.5 bg-[#F3F4F6] text-[#4B5563] rounded border border-[#E5E7EB]">
                    {item.category}
                  </span>
                </div>
                <h3 className="m-0 text-[15px] font-semibold text-[#111827] mt-0.5">
                  {item.fullName}
                </h3>
              </div>
            </div>

            <p className="m-0 text-[15px] leading-[1.6] text-[#374151]">
              {item.shortDef}
            </p>

            {item.formula && (
              <div className="p-3 bg-[#F9FAFB] border-l-3 border-[#1E40AF] rounded-[2px] font-mono text-[13px] text-[#111827]">
                <span className="text-[11px] font-bold text-[#6B7280] block font-sans uppercase mb-1">
                  Công thức tính:
                </span>
                {item.formula}
              </div>
            )}

            {item.benchmark && (
              <div className="flex items-start gap-2 text-[13px] text-[#4B5563] leading-[1.5] bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                <CheckCircle className="w-4 h-4 text-[#0A7A45] shrink-0 mt-0.5" />
                <span>
                  <strong>Mức tham chiếu thực tế:</strong> {item.benchmark}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6] text-[13px] mt-auto">
              <Link
                href={`/posts/vcb-co-dat-sau-bao-cao-quy-2#muc-1`}
                className="text-[#1E40AF] hover:underline font-semibold flex items-center gap-1"
              >
                Xem bài viết ứng dụng thực tế →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px] flex flex-col items-center gap-3">
          <HelpCircle className="w-10 h-10 text-[#9CA3AF]" />
          <h3 className="m-0 text-[18px] font-bold text-[#111827]">
            Không tìm thấy thuật ngữ phù hợp
          </h3>
          <p className="m-0 text-[14px] text-[#6B7280]">
            Thử tìm kiếm với từ khóa khác như: NIM, CASA, P/B, ROE...
          </p>
        </div>
      )}
    </div>
  );
}
