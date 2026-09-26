"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slugify";
import TipTapEditor from "./TipTapEditor";
import { createPost, updatePost } from "@/app/admin/actions";
import { PostStatus } from "@prisma/client";
import {
  Loader2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  ExternalLink,
  X,
} from "lucide-react";

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

export default function PostForm({ initialData, categories = [] }: PostFormProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(
    initialData?.title || (initialData?.id ? "" : "VCB có đắt sau báo cáo quý 2?")
  );
  const [excerpt, setExcerpt] = useState(
    initialData?.excerpt ||
      (initialData?.id
        ? ""
        : "Tôi so P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm để xem mức giá hiện tại đang phản ánh điều gì.")
  );
  const [content, setContent] = useState(
    initialData?.content ||
      (initialData?.id
        ? ""
        : `<h2>1. Tôi nhìn vào số nào</h2><p>Với ngân hàng, tôi không dùng P/E làm thước đo chính. Lợi nhuận ngân hàng dao động theo chi phí dự phòng, nên tôi xem P/B đặt cạnh ROE.</p><p>Tiếp tục viết…</p>`)
  );
  const [slug, setSlug] = useState(
    initialData?.slug || (initialData?.id ? "" : "vcb-co-dat-sau-bao-cao-quy-2")
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
  const [isPub, setIsPub] = useState(
    initialData?.status ? initialData.status === "PUBLISHED" : true
  );
  const [featured, setFeatured] = useState(initialData?.featured ?? true);
  const [aiUsed, setAiUsed] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Modern Toast notification state
  const [toast, setToast] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Success Modal state
  const [publishModal, setPublishModal] = useState<{
    isOpen: boolean;
    title: string;
    slug: string;
    isPub: boolean;
  } | null>(null);

  const showToast = (type: "success" | "error" | "warning", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 4500);
  };

  // Pre-publish checklist
  const [checks, setChecks] = useState([true, true, true, true]);
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
    if (!initialData?.id) {
      setSlug(slugify(val));
    }
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

  const checkAll = () => {
    setChecks([true, true, true, true]);
  };

  // Dedicated Preview Handler - Never 404s!
  const handlePreview = () => {
    const activeCat = categories.find((c) => c.id === categoryId) || {
      id: "cat-default",
      name: "Đọc BCTC",
    };
    const currentSlug = slug.trim() ? slugify(slug) : slugify(title) || "bai-viet-xem-truoc";
    const previewData = {
      id: initialData?.id || "preview-temp",
      title: title.trim() || "Tiêu đề bài viết xem trước",
      slug: currentSlug,
      excerpt: excerpt.trim(),
      content: content || "<p>Chưa có nội dung bài viết.</p>",
      coverImage: coverImage.trim() || null,
      category: {
        name: activeCat.name,
        slug: slugify(activeCat.name),
      },
      author: { name: "Minh Anh" },
      createdAt: new Date().toISOString(),
      sources,
    };

    try {
      sessionStorage.setItem("finpulse_preview_post", JSON.stringify(previewData));
    } catch (e) {
      console.error("Lỗi khi lưu preview session:", e);
    }

    window.open("/posts/preview", "_blank");
  };

  // Upload image handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Tải ảnh thất bại");
      }

      setCoverImage(data.url);
      showToast("success", "Đã tải ảnh bìa lên thành công!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi tải ảnh";
      showToast("error", msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      showToast("warning", "Vui lòng nhập tiêu đề bài viết.");
      return;
    }

    if (isBlocked) {
      showToast(
        "warning",
        "Vui lòng hoàn thành 4 mục trong danh sách kiểm tra trước khi xuất bản."
      );
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const finalSlug = slug.trim() ? slugify(slug) : slugify(title);

      const postPayload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage.trim() || undefined,
        categoryId: categoryId || categories[0]?.id || "",
        status: (isPub ? "PUBLISHED" : "DRAFT") as PostStatus,
        featured,
      };

      if (initialData?.id) {
        await updatePost(initialData.id, postPayload);
      } else {
        await createPost(postPayload);
      }

      // Show high quality modal confirmation without jarring browser alert()
      setPublishModal({
        isOpen: true,
        title: title.trim(),
        slug: finalSlug,
        isPub,
      });

      showToast(
        "success",
        isPub
          ? "Xuất bản bài viết lên Supabase thành công!"
          : "Đã lưu bản nháp thành công!"
      );
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu bài viết";
      setErrorMessage(msg);
      showToast("error", "Lỗi: " + msg);
    } finally {
      setIsSaving(false);
    }
  };

  const exLen = excerpt.length;
  const exShort = exLen > 110 ? excerpt.slice(0, 110) + "…" : excerpt;

  return (
    <div
      data-screen-label="07 Soạn bài"
      className="min-h-screen bg-white flex flex-col -m-7 sm:-m-9 -mb-20 text-[#111827] relative"
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-[14px] font-medium transition-all animate-in fade-in slide-in-from-top-4 duration-200 bg-white border-[#E5E7EB] text-[#111827]">
          {toast.type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          )}
          {toast.type === "warning" && (
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          {toast.type === "error" && (
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

      {/* Top Header */}
      <header className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-5 gap-4 sticky top-0 bg-white z-10">
        <span className="flex gap-4 items-center text-[14px]">
          <Link
            href="/admin/posts"
            className="font-semibold text-[#111827] hover:text-[#1E40AF] transition-colors"
          >
            ← Bài viết
          </Link>
          <span className="text-[#6B7280] text-[13px]">
            {initialData?.id ? "Chế độ chỉnh sửa" : "Soạn bài mới"}
          </span>
        </span>

        <span className="flex gap-2 items-center">
          <button
            type="button"
            onClick={handlePreview}
            className="border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] px-3.5 py-2 text-[14px] font-semibold cursor-pointer rounded-[4px] text-[#111827] transition-colors flex items-center gap-1.5 shadow-xs"
            title="Xem trước bài viết thực tế không cần xuất bản"
          >
            <Eye className="w-4 h-4 text-[#4B5563]" />
            <span>Xem trước</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isBlocked || isSaving}
            className={`border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white px-5 py-2 text-[14px] font-semibold rounded-[4px] transition-colors flex items-center gap-2 ${
              isBlocked || isSaving
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isSaving
                ? "Đang lưu..."
                : isPub
                ? "Xuất bản"
                : "Lưu nháp"}
            </span>
          </button>
        </span>
      </header>

      {errorMessage && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center gap-2 text-red-700 text-[14px]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Editor Body Grid: Main Content & Aside Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] flex-1">
        {/* Left Column: Writing Area */}
        <div className="p-8 sm:px-12 sm:py-10 pb-20 flex justify-center bg-white">
          <div className="w-full max-w-[700px] flex flex-col gap-4">
            {/* Title Textarea */}
            <textarea
              rows={2}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Câu hỏi của bài, VD: VCB có đắt sau báo cáo quý 2?"
              className="w-full border-0 outline-none resize-none font-serif font-bold text-[32px] sm:text-[38px] leading-[1.15] tracking-[-0.015em] text-[#111827] bg-transparent p-0 placeholder:text-[#9CA3AF]"
            />

            {/* Excerpt Textarea */}
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Câu trả lời ngắn cho câu hỏi của bài, 1–2 câu"
              className="w-full border-0 outline-none resize-none font-serif text-[19px] sm:text-[20px] leading-[1.45] text-[#374151] bg-transparent p-0 placeholder:text-[#9CA3AF]"
            />

            {/* TipTap Rich Editor */}
            <div className="pt-2">
              <TipTapEditor content={content} onChange={setContent} />
            </div>
          </div>
        </div>

        {/* Right Aside: Settings & Checklist */}
        <aside className="border-t lg:border-t-0 lg:border-l border-[#E5E7EB] bg-[#F9FAFB] p-5 flex flex-col gap-5.5 text-[14px]">
          {/* Status Toggle */}
          <div className="flex flex-col gap-2">
            <strong className="text-[#111827]">Trạng thái</strong>
            <div className="flex border border-[#E5E7EB] rounded-[4px] overflow-hidden">
              <button
                type="button"
                onClick={() => setIsPub(false)}
                className={`flex-1 py-2 text-[13px] font-semibold border-0 cursor-pointer transition-colors ${
                  !isPub
                    ? "bg-[#111827] text-white"
                    : "bg-white text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                Bản nháp
              </button>
              <button
                type="button"
                onClick={() => setIsPub(true)}
                className={`flex-1 py-2 text-[13px] font-semibold border-0 cursor-pointer transition-colors ${
                  isPub
                    ? "bg-[#1E40AF] text-white"
                    : "bg-white text-[#6B7280] hover:text-[#111827]"
                }`}
              >
                Xuất bản
              </button>
            </div>
          </div>

          {/* Pre-Publish Checklist (Gatekeeper) */}
          {isPub && (
            <div
              className={`flex flex-col gap-2 p-3.5 bg-white border rounded-[4px] shadow-sm ${
                allChecked ? "border-[#E5E7EB]" : "border-[#D9B26A]"
              }`}
            >
              <div className="flex justify-between items-center">
                <strong className="text-[#111827]">
                  Kiểm tra trước khi xuất bản
                </strong>
                {!allChecked && (
                  <button
                    type="button"
                    onClick={checkAll}
                    className="text-[12px] text-[#1E40AF] hover:underline bg-transparent border-0 cursor-pointer font-medium p-0"
                  >
                    Chọn tất cả
                  </button>
                )}
              </div>
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
                className={`text-[12px] font-semibold mt-1 flex items-center gap-1 ${
                  allChecked ? "text-[#0A7A45]" : "text-[#8A5A00]"
                }`}
              >
                {allChecked ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 inline" />
                    <span>Đủ điều kiện xuất bản.</span>
                  </>
                ) : (
                  `Còn ${nLeft} mục chưa đánh dấu.`
                )}
              </span>
            </div>
          )}

          {/* Category Selector */}
          <label className="flex flex-col gap-2">
            <strong className="text-[#111827]">Chuyên mục</strong>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-[#D1D5DB] bg-white p-2.5 text-[14px] rounded-[4px] outline-none text-[#111827] focus:border-[#111827]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Cover Image */}
          <div className="flex flex-col gap-2">
            <strong className="text-[#111827]">Ảnh bìa</strong>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {coverImage ? (
              <div className="relative group rounded-[4px] overflow-hidden border border-[#E5E7EB]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Ảnh bìa"
                  className="w-full aspect-[1200/630] object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-[13px] font-semibold transition-opacity cursor-pointer border-0"
                >
                  Thay đổi ảnh
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[1200/630] border border-dashed border-[#D1D5DB] bg-white hover:bg-[#F9FAFB] cursor-pointer flex flex-col items-center justify-center text-center text-[#6B7280] text-[13px] p-3 rounded-[4px] transition-colors"
              >
                {isUploading ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1E40AF]" />
                    <span>Đang nén & tải ảnh...</span>
                  </span>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mb-1 text-[#9CA3AF]" />
                    <span>Bấm để tải ảnh bìa lên</span>
                    <span className="text-[11px] text-[#9CA3AF] mt-0.5">Khuyến nghị 1200 × 630</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Slug input */}
          <label className="flex flex-col gap-2">
            <strong className="text-[#111827]">Đường dẫn</strong>
            <span className="flex border border-[#D1D5DB] bg-white rounded-[4px] text-[13px] overflow-hidden">
              <span className="py-2 pl-2.5 text-[#6B7280]">/posts/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="border-0 outline-none py-2 px-1 text-[13px] flex-1 min-w-0 bg-transparent text-[#111827]"
              />
            </span>
          </label>

          {/* Sources list */}
          <div className="flex flex-col gap-2">
            <span className="flex justify-between items-center">
              <strong className="text-[#111827]">Nguồn số liệu</strong>
              <span className="text-[13px] text-[#6B7280]">Hiện cuối bài</span>
            </span>
            <div className="flex flex-col gap-1.5">
              {sources.map((s) => (
                <div
                  key={s.n}
                  className="flex gap-2 p-2 px-2.5 bg-white border border-[#E5E7EB] text-[13px] leading-[1.4] rounded-[4px] shadow-sm"
                >
                  <span className="font-bold text-[#1E40AF]">[{s.n}]</span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-[#111827]">{s.label}</span>
                    <span className="text-[#6B7280] truncate">{s.url}</span>
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddSource}
              className="border border-dashed border-[#D1D5DB] bg-transparent p-2 text-[13px] font-semibold cursor-pointer text-[#374151] hover:bg-white rounded-[4px] transition-colors"
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
              <strong className="text-[#111827]">Có dùng AI soạn nháp</strong>
              <span className="text-[#6B7280] text-[13px]">
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
              <strong className="text-[#111827]">Tiêu điểm trang chủ</strong>
              <span className="text-[#6B7280] text-[13px]">
                Hiện ở ô &quot;Bài mới nhất&quot; trên trang chủ.
              </span>
            </span>
          </label>

          {/* Facebook Live Preview Card */}
          <div className="flex flex-col gap-2">
            <span className="flex justify-between items-center">
              <strong className="text-[#111827]">Xem trước Facebook</strong>
              <span
                className={`text-[13px] ${
                  exLen > 160 ? "text-[#DC2626] font-bold" : "text-[#6B7280]"
                }`}
              >
                {exLen}/160 ký tự
              </span>
            </span>
            <div className="bg-white border border-[#E5E7EB] rounded-[4px] overflow-hidden shadow-sm">
              <div className="aspect-[1200/630] bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-[12px]">
                {coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  "Ảnh bìa 1200 × 630"
                )}
              </div>
              <div className="p-2.5 sm:p-3 flex flex-col gap-1 bg-[#F9FAFB]">
                <span className="text-[12px] text-[#6B7280] uppercase font-medium">
                  finpulse.vn
                </span>
                <span className="text-[15px] font-semibold text-[#111827] leading-[1.3]">
                  {title || "Tiêu đề bài viết"}
                </span>
                <span className="text-[13px] text-[#6B7280] leading-[1.35]">
                  {exShort || "Tóm tắt bài viết hiển thị trên mạng xã hội..."}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Publish / Save Success Modal */}
      {publishModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-lg p-6 max-w-[440px] w-full shadow-2xl border border-[#E5E7EB] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-13 h-13 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-[20px] font-bold text-[#111827] mb-1.5 font-sans">
              {publishModal.isPub
                ? "Xuất bản bài viết thành công!"
                : "Đã lưu bản nháp thành công!"}
            </h3>

            <p className="text-[14px] text-[#6B7280] leading-[1.5] mb-6">
              {publishModal.isPub
                ? `Bài viết "${publishModal.title}" đã được lưu an toàn vào Supabase Database và sẵn sàng cho độc giả đón đọc.`
                : `Bài viết "${publishModal.title}" đã được lưu vào cơ sở dữ liệu ở trạng thái bản nháp.`}
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              {publishModal.isPub && (
                <Link
                  href={`/posts/${publishModal.slug}`}
                  target="_blank"
                  className="w-full bg-[#1E40AF] hover:bg-[#1E3A8A] text-white py-2.5 px-4 rounded-[4px] font-semibold text-[14px] flex items-center justify-center gap-2 no-underline transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Xem bài viết trên web</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  router.push("/admin/posts");
                  router.refresh();
                }}
                className="w-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] py-2.5 px-4 rounded-[4px] font-semibold text-[14px] border-0 cursor-pointer transition-colors"
              >
                Về danh sách bài viết
              </button>

              <button
                type="button"
                onClick={() => setPublishModal(null)}
                className="text-[13px] text-[#6B7280] hover:text-[#111827] hover:underline bg-transparent border-0 cursor-pointer pt-1"
              >
                Tiếp tục chỉnh sửa bài này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
