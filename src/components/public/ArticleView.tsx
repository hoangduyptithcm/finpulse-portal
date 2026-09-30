"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Top10Widget from "@/components/public/Top10Widget";
import CommentsSection, { CommentItem } from "@/components/public/CommentsSection";
import { VCB_ARTICLE_DATA, KEY_STATS } from "@/data/portalData";

const TOC = [
  { id: "muc-1", label: "1. Tôi nhìn vào số nào" },
  { id: "muc-2", label: "2. So với chính nó 5 năm" },
  { id: "muc-3", label: "3. Tôi có thể sai nếu…" },
  { id: "muc-4", label: "4. Nguồn số liệu" },
];

export interface DynamicPostData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  category?: { name: string; slug: string } | null;
  author?: { name: string } | null;
  createdAt: Date | string;
  views?: number;
}

interface ArticleViewProps {
  post?: DynamicPostData;
  initialComments?: CommentItem[];
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    createdAt: Date | string;
    category?: { name: string; slug: string } | null;
  }>;
}

export default function ArticleView({
  post,
  initialComments = [],
  relatedPosts = [],
}: ArticleViewProps = {}) {
  const data = {
    ...VCB_ARTICLE_DATA,
    ...(post
      ? {
          title: post.title,
          excerpt: post.excerpt || "",
          category: post.category?.name || "Đọc BCTC",
          categorySlug: post.category?.slug || "doc-bctc",
          author: post.author?.name || "Minh Anh",
          date: new Date(post.createdAt).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          shortAnswer: "",
          shortAnswerBullets: [],
          tags: [post.category?.name || "Phân tích"],
        }
      : {}),
  };
  const [progress, setProgress] = useState(0);
  const [activeSec, setActiveSec] = useState("muc-1");
  const [feedback, setFeedback] = useState<null | "yes" | "no">(null);
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState<number>(post?.views ?? 0);

  useEffect(() => {
    if (!post?.slug) return;

    const storageKey = `finpulse_viewed_${post.slug}`;
    const alreadyViewed =
      typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;

    if (!alreadyViewed) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(storageKey, "1");
      }
      fetch("/api/posts/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.success && typeof result.views === "number") {
            setViews(result.views);
          }
        })
        .catch(() => {});
    }
  }, [post?.slug]);

  useEffect(() => {
    const handleScroll = () => {
      const art = document.getElementById("fp-article");
      if (!art) return;
      const r = art.getBoundingClientRect();
      const totalH = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / totalH));
      setProgress(p);

      let currentSec = TOC[0].id;
      for (const item of TOC) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top < 180) {
          currentSec = item.id;
        }
      }
      setActiveSec(currentSec);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 84,
        behavior: "smooth",
      });
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const readLeft =
    progress >= 0.96
      ? "Bạn đã đọc hết bài"
      : `Còn khoảng ${Math.max(1, Math.ceil(8 * (1 - progress)))} phút đọc`;

  return (
    <>
      {/* Sticky Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#133A63] z-50 transition-all duration-100"
        style={{ width: `${(progress * 100).toFixed(1)}%` }}
      />

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-7 pb-16 flex flex-col gap-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 justify-between items-start w-full">
          {/* Main Article Content */}
          <article
            id="fp-article"
            className="flex-1 min-w-0 max-w-[1020px] w-full flex flex-col gap-6"
          >
            {/* Breadcrumbs */}
            <nav className="flex gap-2 text-[14px] text-[#5E636B]">
              <Link href="/" className="text-[#5E636B] hover:text-[#16181D]">
                Trang chủ
              </Link>
              <span>/</span>
              <Link
                href={`/categories/${data.categorySlug}`}
                className="font-bold text-[#16181D] hover:text-[#133A63]"
              >
                {data.category}
              </Link>
            </nav>

            {/* Title & Dek */}
            <h1 className="m-0 font-serif font-bold text-[32px] sm:text-[40px] lg:text-[48px] leading-[1.1] tracking-[-0.02em] text-balance text-[#16181D]">
              {data.title}
            </h1>
            <p className="m-0 font-serif text-[20px] sm:text-[21px] leading-[1.45] text-[#2B2F36]">
              {data.excerpt}
            </p>

            {/* Metadata Bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 py-3.5 border-t border-b border-[#E5E7EB]">
              <div className="flex gap-3 items-center">
                <span className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center font-serif font-bold text-[18px] text-[#1E40AF] flex-shrink-0">
                  M
                </span>
                <span className="flex flex-col text-[14px]">
                  <Link
                    href="/about"
                    className="font-bold text-[#111827] hover:text-[#1E40AF]"
                  >
                    {data.author}
                  </Link>
                  <span className="text-[#6B7280]">
                    {data.date} · {data.readTime} · {views.toLocaleString("vi-VN")} lượt đọc
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="border-0 bg-transparent cursor-pointer text-[#1E40AF] hover:underline p-0 text-[14px] font-semibold"
              >
                {copied ? "Đã chép link!" : "Sao chép link"}
              </button>
            </div>

            {/* "Trả lời ngắn" Callout Box (chỉ hiển thị khi có phần tóm tắt riêng biệt cho bài mẫu) */}
            {!post && data.shortAnswer && (
              <div className="bg-[#16181D] text-[#F7F5F0] p-6 sm:p-6.5 flex flex-col gap-3 rounded-[2px]">
                <span className="text-[13px] font-bold text-[#C9D6E6]">
                  Trả lời ngắn
                </span>
                <span className="font-serif text-[20px] sm:text-[21px] leading-[1.45] text-white font-medium">
                  {data.shortAnswer}
                </span>
                {data.shortAnswerBullets && data.shortAnswerBullets.length > 0 && (
                  <ul className="m-0 mt-1 pl-5 flex flex-col gap-1.5 text-[15px] leading-[1.55] text-[#E5E7EB]">
                    {data.shortAnswerBullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Article Body */}
            {post ? (
              <div className="flex flex-col gap-6">
                <div
                  className="font-serif leading-[1.75] text-[#16181D] flex flex-col gap-5.5 transition-all prose prose-lg max-w-none py-2 text-[18px] sm:text-[19px]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Section Nguồn số liệu & Thời điểm ghi nhận */}
                <div className="p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px] flex flex-col gap-3 font-sans mt-4">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                    <span className="text-[14px] font-bold text-[#111827]">
                      Nguồn số liệu & Thời điểm ghi nhận
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      Cập nhật: {new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </span>
                  </div>
                  <p className="m-0 text-[13px] leading-[1.6] text-[#4B5563]">
                    Số liệu trong bài được trích xuất từ các kênh công bố thông tin chính thức: HOSE/HNX, Ủy ban Chứng khoán Nhà nước, Báo cáo tài chính doanh nghiệp, hoặc dữ liệu thị trường vĩ mô độc lập. Tác giả tự bóc tách và phân tích theo phương pháp độc lập.
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[13px] font-semibold text-[#1E40AF]">
                    <Link href="/about#nguon-so-lieu" className="hover:underline">
                      Xem nguyên tắc nguồn số liệu →
                    </Link>
                    <span className="text-[#D1D5DB]">·</span>
                    <Link href="/about#mien-tru" className="text-[#6B7280] hover:text-[#111827]">
                      Miễn trừ trách nhiệm
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
            <div
              className="font-serif leading-[1.75] text-[#16181D] flex flex-col gap-5.5 transition-all text-[18px] sm:text-[19px]"
            >
              {/* Section 1 */}
              <h2
                id="muc-1"
                className="mt-5 font-sans text-[22px] sm:text-[24px] font-bold leading-[1.3] tracking-[-0.01em] scroll-mt-24 text-[#16181D]"
              >
                1. Tôi nhìn vào số nào
              </h2>
              <p className="m-0">
                Với ngân hàng, tôi không dùng P/E làm thước đo chính. Lợi nhuận
                ngân hàng dao động theo chi phí dự phòng, nên tôi xem P/B đặt
                cạnh ROE: trả bao nhiêu cho mỗi đồng vốn chủ, và đồng vốn đó sinh
                lời tốt đến đâu.
                <a
                  href="#muc-4"
                  onClick={scrollTo("muc-4")}
                  className="font-sans text-[0.62em] font-bold align-super ml-0.5 text-[#133A63]"
                >
                  [1]
                </a>
              </p>

              {/* 3 Key stats display grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 border-t-2 border-[#111827] border-b border-[#E5E7EB] font-sans">
                {KEY_STATS.map((k) => (
                  <div
                    key={k.label}
                    className="p-4 pl-0 flex flex-col gap-1 border-b sm:border-b-0 sm:border-r border-[#E5E7EB] last:border-none"
                  >
                    <span className="text-[28px] sm:text-[30px] font-bold leading-none tabular-nums text-[#111827]">
                      {k.value}
                    </span>
                    <span className="text-[14px] leading-[1.4] text-[#374151]">
                      {k.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bar Chart figure */}
              <figure className="m-0 flex flex-col gap-3 font-sans bg-[#F9FAFB] p-5 border border-[#E5E7EB] rounded-[2px]">
                <figcaption className="flex flex-col gap-0.5">
                  <strong className="text-[16px] text-[#16181D]">
                    Lợi nhuận trước thuế theo quý
                  </strong>
                  <span className="text-[13px] text-[#5E636B]">
                    Nghìn tỷ đồng, hợp nhất
                  </span>
                </figcaption>

                <div className="flex items-end gap-3 h-[190px] border-b border-[#16181D] pt-5">
                  {data.qBars.map((b) => (
                    <div
                      key={b.m}
                      className="flex-1 flex flex-col justify-end items-center gap-1.5 h-full"
                    >
                      <span className="text-[13px] font-semibold tabular-nums text-[#16181D]">
                        {b.label}
                      </span>
                      <div
                        className="w-full max-w-[56px] transition-all duration-300"
                        style={{ height: b.h, backgroundColor: b.color }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {data.qBars.map((b) => (
                    <span
                      key={b.m}
                      className="flex-1 text-center text-[13px] text-[#5E636B]"
                    >
                      {b.m}
                    </span>
                  ))}
                </div>

                <span className="text-[12px] text-[#5E636B]">
                  Biểu đồ tự vẽ từ BCTC hợp nhất đã công bố [1]. Số liệu minh họa.
                </span>
              </figure>

              {/* Section 2 */}
              <h2
                id="muc-2"
                className="mt-5 font-sans text-[22px] sm:text-[24px] font-bold leading-[1.3] tracking-[-0.01em] scroll-mt-24 text-[#16181D]"
              >
                2. So với chính nó 5 năm
              </h2>
              <p className="m-0">
                So với các ngân hàng khác thì dễ bị lệch vì mỗi ngân hàng có
                khẩu vị rủi ro khác nhau. Tôi thích so VCB với chính VCB: hiện
                tại so với trung bình 5 năm.
                <a
                  href="#muc-4"
                  onClick={scrollTo("muc-4")}
                  className="font-sans text-[0.62em] font-bold align-super ml-0.5 text-[#133A63]"
                >
                  [1]
                </a>
                <a
                  href="#muc-4"
                  onClick={scrollTo("muc-4")}
                  className="font-sans text-[0.62em] font-bold align-super ml-0.5 text-[#133A63]"
                >
                  [3]
                </a>
              </p>

              {/* Comparison Table */}
              <div className="overflow-x-auto font-sans">
                <table className="w-full min-w-[480px] border-collapse text-[15px] tabular-nums">
                  <thead>
                    <tr className="text-left text-[13px] text-[#5E636B]">
                      <th className="py-2 pr-3 border-b-2 border-[#16181D] font-semibold">
                        Chỉ số
                      </th>
                      <th className="py-2 px-3 border-b-2 border-[#16181D] font-semibold text-right">
                        TB 5 năm
                      </th>
                      <th className="py-2 px-3 border-b-2 border-[#16181D] font-semibold text-right">
                        Hiện tại
                      </th>
                      <th className="py-2 pl-3 border-b-2 border-[#16181D] font-semibold">
                        Tôi đọc là
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.compareTable.map((c) => (
                      <tr key={c.k}>
                        <td className="py-3 pr-3 border-b border-[#E5E7EB] font-semibold text-[#111827]">
                          {c.k}
                        </td>
                        <td className="py-3 px-3 border-b border-[#E5E7EB] text-right text-[#6B7280]">
                          {c.avg}
                        </td>
                        <td className="py-3 px-3 border-b border-[#E5E7EB] text-right font-bold text-[#111827]">
                          {c.now}
                        </td>
                        <td
                          className="py-3 pl-3 border-b border-[#E5E7EB] font-medium"
                          style={{ color: c.color }}
                        >
                          {c.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Blockquote: Quan điểm của tôi */}
              <blockquote className="my-3 py-6 border-t border-b border-[#111827] flex flex-col gap-2.5">
                <span className="font-sans text-[13px] font-bold text-[#1D4ED8]">
                  Quan điểm của tôi
                </span>
                <span className="text-[22px] sm:text-[24px] leading-[1.4] font-semibold tracking-[-0.01em] text-[#111827]">
                  {data.quote}
                </span>
              </blockquote>

              {/* Section 3 */}
              <h2
                id="muc-3"
                className="mt-5 font-sans text-[22px] sm:text-[24px] font-bold leading-[1.3] tracking-[-0.01em] scroll-mt-24 text-[#111827]"
              >
                3. Tôi có thể sai nếu…
              </h2>
              <ol className="m-0 p-0 list-none flex flex-col font-sans">
                {data.risks.map((r) => (
                  <li
                    key={r.n}
                    className="flex gap-3.5 py-3.5 border-b border-[#E5E7EB] text-[16px] leading-[1.55]"
                  >
                    <span className="font-bold text-[#DC2626] flex-shrink-0 w-[18px]">
                      {r.n}
                    </span>
                    <span className="text-[#374151]">{r.text}</span>
                  </li>
                ))}
              </ol>

              {/* Thuật ngữ trong bài (Glossary) */}
              <aside className="border border-[#E5E7EB] bg-[#F9FAFB] p-5 sm:p-6 flex flex-col gap-3.5 font-sans rounded-[2px]">
                <strong className="text-[16px] text-[#111827]">
                  Thuật ngữ trong bài
                </strong>
                {data.glossary.map((g) => (
                  <div
                    key={g.term}
                    className="flex flex-col gap-0.5 text-[15px] leading-[1.55]"
                  >
                    <strong className="text-[#111827]">{g.term}</strong>
                    <span className="text-[#374151]">{g.def}</span>
                  </div>
                ))}
              </aside>

              {/* Section 4: Nguồn số liệu */}
              <section
                id="muc-4"
                className="scroll-mt-24 flex flex-col gap-2.5 font-sans pt-2"
              >
                <h2 className="m-0 text-[18px] font-bold text-[#111827]">
                  Nguồn số liệu
                </h2>
                <ol className="m-0 p-0 list-none flex flex-col">
                  {data.sources.map((s) => (
                    <li
                      key={s.n}
                      className="flex gap-3 py-2.5 border-t border-[#E5E7EB] text-[15px] leading-[1.5]"
                    >
                      <span className="font-bold text-[#1E40AF] flex-shrink-0">
                        [{s.n}]
                      </span>
                      <span className="flex flex-col">
                        <span className="font-semibold text-[#111827]">
                          {s.label}
                        </span>
                        <span className="text-[13px] text-[#6B7280]">
                          {s.where}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {data.tags.map((t) => (
                <span
                  key={t}
                  className="text-[13px] font-semibold text-[#374151] border border-[#E5E7EB] px-2.5 py-1 rounded-[2px]"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Reader Feedback Widget */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4.5 sm:px-5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[2px]">
              <span className="text-[15px] font-semibold text-[#111827]">
                {feedback === null
                  ? "Bài viết có giúp bạn hiểu thêm?"
                  : feedback === "yes"
                  ? "Cảm ơn bạn đã phản hồi!"
                  : "Cảm ơn bạn. Tôi sẽ viết rõ hơn ở bài sau."}
              </span>
              {feedback === null && (
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedback("yes")}
                    className="border border-[#111827] bg-white hover:bg-[#F9FAFB] px-4 py-1.5 text-[14px] font-semibold cursor-pointer rounded-[2px] transition-colors text-[#111827]"
                  >
                    Có
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedback("no")}
                    className="border border-[#D1D5DB] bg-white hover:bg-[#F9FAFB] px-4 py-1.5 text-[14px] font-semibold cursor-pointer rounded-[2px] transition-colors text-[#374151]"
                  >
                    Chưa
                  </button>
                </span>
              )}
            </div>

            {/* AI Disclosure & Disclaimer */}
            <p className="m-0 py-4 border-t border-b border-[#E5E7EB] text-[14px] leading-[1.6] text-[#374151]">
              Nội dung do tác giả biên soạn với hỗ trợ công cụ AI, mang tính trao
              đổi kiến thức. Không phải thông tin báo chí, không phải khuyến nghị
              mua/bán. Số liệu lấy từ nguồn công bố; nhà đầu tư tự kiểm chứng.
            </p>

            {/* Comments Section */}
            <CommentsSection
              postSlug={post?.slug || "vcb-co-dat-sau-bao-cao-quy-2"}
              initialComments={initialComments}
            />

            {/* Next Category Card */}
            <Link
              href={`/categories/${data.categorySlug}`}
              className="flex flex-col gap-1 p-4.5 sm:px-5 border border-[#111827] bg-white text-[#111827] no-underline hover:no-underline transition-all hover:shadow-[4px_4px_0_#111827] group"
            >
              <span className="text-[13px] font-bold text-[#1E40AF]">
                Khám phá chuyên mục · {data.category}
              </span>
              <span className="font-serif font-bold text-[20px] leading-[1.3] group-hover:text-[#1E40AF] transition-colors">
                Xem toàn bộ các bài viết cùng chủ đề →
              </span>
            </Link>
          </article>

          {/* Sticky Right Sidebar (TOC & Top 10) */}
          <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-8">
            <Top10Widget />

            {/* Sticky Table of Contents (TOC) - Only for default demo article */}
            {!post && (
              <nav className="sticky top-[84px] flex flex-col bg-white p-4 border border-[#E5E7EB] rounded-[2px]">
                <h2 className="m-0 mb-1.5 text-[14px] font-bold pb-2 border-b-2 border-[#111827] text-[#111827]">
                  Trong bài này
                </h2>
                <div className="flex flex-col">
                  {TOC.map((t) => {
                    const isActive = activeSec === t.id;
                    return (
                      <a
                        key={t.id}
                        href={`#${t.id}`}
                        onClick={scrollTo(t.id)}
                        className={`py-2 pl-3 text-[14px] leading-[1.4] border-l-2 transition-colors hover:no-underline hover:text-[#111827] ${
                          isActive
                            ? "border-[#1E40AF] text-[#111827] font-semibold"
                            : "border-[#E5E7EB] text-[#6B7280] font-normal"
                        }`}
                      >
                        {t.label}
                      </a>
                    );
                  })}
                </div>
                <span className="mt-3 text-[13px] text-[#6B7280]">
                  {readLeft}
                </span>
              </nav>
            )}
          </aside>
        </div>

        {/* Related Articles Section - Only rendered when real related posts exist */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="w-full flex flex-col gap-4 pt-6">
            <h2 className="m-0 text-[14px] font-bold pb-2 border-b-2 border-[#111827] text-[#111827]">
              Bài liên quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {relatedPosts.map((p) => (
                <Link
                  key={p.id}
                  href={`/posts/${p.slug}`}
                  className="flex flex-col gap-2 pt-3.5 border-t border-[#E5E7EB] text-[#111827] hover:text-[#1E40AF] hover:no-underline transition-colors group"
                >
                  <span className="text-[13px] font-bold text-[#1E40AF]">
                    {p.category?.name || "Bài viết"}
                  </span>
                  <span className="font-serif font-bold text-[19px] leading-[1.3] group-hover:text-[#1E40AF] line-clamp-2">
                    {p.title}
                  </span>
                  <span className="text-[13px] text-[#6B7280]">
                    {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
