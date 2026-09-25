"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/portalData";
import { slugify } from "@/lib/slugify";
import TipTapEditor from "./TipTapEditor";

interface PostFormProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string | null;
    content?: string;
    coverImage?: string | null;
    status?: string;
    featured?: boolean;
    categoryId?: string;
  };
  categories?: { id: string; name: string }[];
}

export default function PostForm({ initialData }: PostFormProps = {}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "VCB có đắt sau báo cáo quý 2?");
  const [excerpt, setExcerpt] = useState(
    initialData?.excerpt ||
      "Tôi so P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm để xem mức giá hiện tại đang phản ánh điều gì."
  );
  const [content, setContent] = useState(
    initialData?.content || `
<h2>1. Tôi nhìn vào số nào</h2>
<p>Với ngân hàng, tôi không dùng P/E làm thước đo chính. Lợi nhuận ngân hàng dao động theo chi phí dự phòng, nên tôi xem P/B đặt cạnh ROE. [1]</p>
<p>Tiếp tục viết…</p>
  `
  );
  const [slug, setSlug] = useState(
    initialData?.slug || "vcb-co-dat-sau-bao-cao-quy-2"
  );
  const [category, setCategory] = useState("Đọc BCTC");
  const [isPub, setIsPub] = useState(true);
  const [aiUsed, setAiUsed] = useState(true);
  const [featured, setFeatured] = useState(true);

  // Pre-publish checklist
  const [checks, setChecks] = useState([true, true, false, false]);
  const checkLabels = [
    "Số liệu lấy từ nguồn gốc và đã đối chiếu lại",
    "Có ít nhất 1 nguồn số liệu kèm link",
    "Luận điểm và kết luận do tôi tự viết",
    "Không chép hay diễn đạt lại bài báo khác",
  ];
  const allChecked = checks.every(Boolean);
  const nLeft = checks.filter((c) => !c).length;
  const isBlocked = isPub && !allChecked;

  // Sources
  const [sources, setSources] = useState([
    {
      n: 1,
      label: "BCTC hợp nhất quý 2/2026 – VCB",
      url: "hsx.vn/.../VCB_BCTC_Q2_2026.pdf",
    },
    {
      n: 2,
      label: "Giá đóng cửa 20/09/2026",
      url: "hsx.vn/Modules/Listed/Web/SymbolView",
    },
  ]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleAddSource = () => {
    const label = prompt("Tên tài liệu nguồn (VD: Báo cáo tài chính quý 2):");
    if (!label) return;
    const url = prompt("Đường dẫn (URL hoặc số hiệu văn bản):") || "";
    setSources((prev) => [...prev, { n: prev.length + 1, label, url }]);
  };

  const toggleCheck = (idx: number) => {
    setChecks((prev) => prev.map((c, i) => (i === idx ? !c : c)));
  };

  const handlePublish = () => {
    if (isBlocked) {
      alert("Vui lòng hoàn thành 4 mục trong danh sách kiểm tra trước khi xuất bản.");
      return;
    }
    alert(isPub ? "Xuất bản bài viết thành công!" : "Đã lưu bản nháp thành công!");
    router.push("/admin/posts");
  };

  const exLen = excerpt.length;
  const exShort = exLen > 110 ? excerpt.slice(0, 110) + "…" : excerpt;

  return (
    <div
      data-screen-label="07 Soạn bài"
      className="min-h-screen bg-[#F7F5F0] flex flex-col -m-7 sm:-m-9 -mb-20 text-[#16181D]"
    >
      {/* Top Header */}
      <header className="h-14 border-b border-[#E3E1DC] flex items-center justify-between px-5 gap-4 sticky top-0 bg-[#F7F5F0] z-10">
        <span className="flex gap-4 items-center text-[14px]">
          <Link
            href="/admin/posts"
            className="font-semibold text-[#16181D] hover:text-[#133A63] transition-colors"
          >
            ← Bài viết
          </Link>
          <span className="text-[#5E636B]">Đã lưu nháp lúc 10:24</span>
        </span>

        <span className="flex gap-2">
          <Link
            href="/posts/vcb-co-dat-sau-bao-cao-quy-2"
            target="_blank"
            className="border border-[#C9C5BC] bg-[#FCFBF8] hover:bg-[#F0EEE9] px-3.5 py-2 text-[14px] font-semibold cursor-pointer rounded-[3px] text-[#16181D] no-underline transition-colors"
          >
            Xem trước
          </Link>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isBlocked}
            className={`border-0 bg-[#133A63] hover:bg-[#0C2A4A] !text-white hover:!text-white px-4 py-2 text-[14px] font-semibold rounded-[3px] transition-colors ${
              isBlocked
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isPub ? "Xuất bản" : "Lưu nháp"}
          </button>
        </span>
      </header>

      {/* Editor Body Grid: Main Content & Aside Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] flex-1">
        {/* Left Column: Writing Area */}
        <div className="p-8 sm:px-12 sm:py-10 pb-20 flex justify-center">
          <div className="w-full max-w-[700px] flex flex-col gap-4">
            {/* Title Textarea */}
            <textarea
              rows={2}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Câu hỏi của bài, VD: VCB có đắt sau báo cáo quý 2?"
              className="w-full border-0 outline-none resize-none font-serif font-bold text-[32px] sm:text-[38px] leading-[1.15] tracking-[-0.015em] text-[#16181D] bg-transparent p-0 placeholder:text-[#9A9EA5]"
            />

            {/* Excerpt Textarea */}
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Câu trả lời ngắn cho câu hỏi của bài, 1–2 câu"
              className="w-full border-0 outline-none resize-none font-serif text-[19px] sm:text-[20px] leading-[1.45] text-[#2B2F36] bg-transparent p-0 placeholder:text-[#9A9EA5]"
            />

            {/* TipTap Rich Editor */}
            <div className="pt-2">
              <TipTapEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Right Aside: Settings & Checklist */}
        <aside className="border-t lg:border-t-0 lg:border-left border-[#E3E1DC] bg-[#F1EEE8] p-5 flex flex-col gap-5.5 text-[14px]">
          {/* Status Toggle */}
          <div className="flex flex-col gap-2">
            <strong className="text-[#16181D]">Trạng thái</strong>
            <div className="flex border border-[#C9C5BC] rounded-[3px] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsPub(false)}
                className={`flex-1 border-0 p-2 text-[14px] font-semibold cursor-pointer transition-colors ${
                  !isPub
                    ? "bg-[#16181D] !text-white"
                    : "bg-[#FCFBF8] text-[#2B2F36]"
                }`}
              >
                Bản nháp
              </button>
              <button
                type="button"
                onClick={() => setIsPub(true)}
                className={`flex-1 border-0 border-l border-[#C9C5BC] p-2 text-[14px] font-semibold cursor-pointer transition-colors ${
                  isPub
                    ? "bg-[#16181D] !text-white"
                    : "bg-[#FCFBF8] text-[#2B2F36]"
                }`}
              >
                Xuất bản
              </button>
            </div>
          </div>

          {/* Pre-Publish Checklist (Gatekeeper) */}
          {isPub && (
            <div
              className={`flex flex-col gap-2 p-3.5 bg-[#FCFBF8] border rounded-[2px] ${
                allChecked ? "border-[#E3E1DC]" : "border-[#D9B26A]"
              }`}
            >
              <strong className="text-[#16181D]">
                Kiểm tra trước khi xuất bản
              </strong>
              <div className="flex flex-col gap-2">
                {checkLabels.map((lbl, idx) => (
                  <label
                    key={idx}
                    className="flex gap-2 items-start text-[13px] leading-[1.45] cursor-pointer text-[#2B2F36]"
                  >
                    <input
                      type="checkbox"
                      checked={checks[idx]}
                      onChange={() => toggleCheck(idx)}
                      className="mt-0.5 rounded-[2px]"
                    />
                    <span>{lbl}</span>
                  </label>
                ))}
              </div>
              <span
                className={`text-[12px] font-semibold mt-1 ${
                  allChecked ? "text-[#0A7A45]" : "text-[#8A5A00]"
                }`}
              >
                {allChecked
                  ? "✓ Đủ điều kiện xuất bản."
                  : `Còn ${nLeft} mục chưa đánh dấu.`}
              </span>
            </div>
          )}

          {/* Category Selector */}
          <label className="flex flex-col gap-2">
            <strong className="text-[#16181D]">Chuyên mục</strong>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-[#C9C5BC] bg-[#FCFBF8] p-2.5 text-[14px] rounded-[3px] outline-none text-[#16181D]"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <strong className="text-[#16181D]">Ảnh bìa</strong>
            <div className="aspect-[1200/630] border border-dashed border-[#B8B4AA] bg-[#FCFBF8] flex items-center justify-center text-center text-[#5E636B] text-[13px] p-3 rounded-[2px]">
              Kéo ảnh vào đây hoặc bấm để chọn
              <br />
              Khuyến nghị 1200 × 630
            </div>
          </div>

          {/* Slug input */}
          <label className="flex flex-col gap-2">
            <strong className="text-[#16181D]">Đường dẫn</strong>
            <span className="flex border border-[#C9C5BC] bg-[#FCFBF8] rounded-[3px] text-[13px] overflow-hidden">
              <span className="py-2 pl-2.5 text-[#5E636B]">/posts/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border-0 outline-none py-2 px-1 text-[13px] flex-1 min-w-0 bg-transparent text-[#16181D]"
              />
            </span>
          </label>

          {/* Sources list */}
          <div className="flex flex-col gap-2">
            <span className="flex justify-between items-center">
              <strong className="text-[#16181D]">Nguồn số liệu</strong>
              <span className="text-[13px] text-[#5E636B]">Hiện cuối bài</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {sources.map((s) => (
                <div
                  key={s.n}
                  className="flex gap-2 p-2 px-2.5 bg-[#FCFBF8] border border-[#E3E1DC] text-[13px] leading-[1.4] rounded-[2px]"
                >
                  <span className="font-bold text-[#133A63]">[{s.n}]</span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#16181D]">{s.label}</span>
                    <span className="text-[#5E636B] truncate">{s.url}</span>
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddSource}
              className="border border-dashed border-[#B8B4AA] bg-transparent p-2 text-[13px] font-semibold cursor-pointer text-[#2B2F36] hover:bg-[#FCFBF8] rounded-[3px] transition-colors"
            >
              + Thêm nguồn (BCTC, HOSE, SSC…)
            </button>
          </div>

          {/* AI Disclosure check */}
          <label className="flex gap-2.5 items-start cursor-pointer">
            <input
              type="checkbox"
              checked={aiUsed}
              onChange={() => setAiUsed(!aiUsed)}
              className="mt-1 rounded-[2px]"
            />
            <span className="flex flex-col gap-0.5">
              <strong className="text-[#16181D]">Có dùng AI soạn nháp</strong>
              <span className="text-[#5E636B] text-[13px]">
                Tự ghi chú &quot;Nháp có hỗ trợ AI&quot; ở phần tác giả. Miễn trừ
                trách nhiệm luôn được chèn cuối bài.
              </span>
            </span>
          </label>

          {/* Featured on Home */}
          <label className="flex gap-2.5 items-start cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={() => setFeatured(!featured)}
              className="mt-1 rounded-[2px]"
            />
            <span className="flex flex-col gap-0.5">
              <strong className="text-[#16181D]">Tiêu điểm trang chủ</strong>
              <span className="text-[#5E636B] text-[13px]">
                Hiện ở ô &quot;Bài mới nhất&quot; trên trang chủ.
              </span>
            </span>
          </label>

          {/* Facebook Live Preview Card */}
          <div className="flex flex-col gap-2">
            <span className="flex justify-between items-center">
              <strong className="text-[#16181D]">Xem trước Facebook</strong>
              <span
                className={`text-[13px] ${
                  exLen > 160 ? "text-[#C0271D] font-bold" : "text-[#5E636B]"
                }`}
              >
                {exLen}/160 ký tự
              </span>
            </span>
            <div className="bg-[#FCFBF8] border border-[#DADDE1] rounded-[2px] overflow-hidden">
              <div className="aspect-[1200/630] bg-[#E7E4DD] flex items-center justify-center text-[#5E636B] text-[12px]">
                Ảnh bìa 1200 × 630
              </div>
              <div className="p-2.5 sm:p-3 flex flex-col gap-1 bg-[#F0F2F5]">
                <span className="text-[12px] text-[#65676B] uppercase font-medium">
                  finpulse.vn
                </span>
                <span className="text-[15px] font-semibold text-[#050505] leading-[1.3]">
                  {title}
                </span>
                <span className="text-[13px] text-[#65676B] leading-[1.35]">
                  {exShort}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
