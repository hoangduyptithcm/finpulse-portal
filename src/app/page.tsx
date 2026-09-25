import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import NewsletterForm from "@/components/public/NewsletterForm";
import Top10Widget from "@/components/public/Top10Widget";
import { prisma } from "@/lib/prisma";
import {
  KEY_STATS,
  CATEGORY_COLUMNS,
  SERIES_LIST,
  RECENT_NOTES,
  WATCH_LIST,
} from "@/data/portalData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FinPulse | Sổ phân tích của Minh Anh",
  description:
    "Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, trả lời bằng số liệu công bố. Sổ ghi chép cá nhân, không phải tin tức hay lời khuyên đầu tư.",
};

export default async function HomePage() {
  const publishedPosts = await prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    })
    .catch(() => []);

  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];

  const featuredCard = featuredPost
    ? {
        slug: featuredPost.slug,
        categoryName: featuredPost.category?.name || "Đọc BCTC",
        date: new Date(featuredPost.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        title: featuredPost.title,
        excerpt:
          featuredPost.excerpt ||
          "chưa đắt so với chính nó 5 năm qua, nhưng nợ xấu tăng là lý do tôi chưa coi đây là vùng giá rẻ.",
      }
    : {
        slug: "vcb-co-dat-sau-bao-cao-quy-2",
        categoryName: "Đọc BCTC",
        date: "22/09/2026",
        title: "VCB có đắt sau báo cáo quý 2?",
        excerpt:
          "chưa đắt so với chính nó 5 năm qua, nhưng nợ xấu tăng là lý do tôi chưa coi đây là vùng giá rẻ.",
      };

  const displayNotes =
    publishedPosts.length > 0
      ? publishedPosts.slice(0, 6).map((p) => {
          const d = new Date(p.createdAt);
          return {
            slug: p.slug,
            day: d.getDate().toString().padStart(2, "0"),
            month: `T${d.getMonth() + 1}`,
            title: p.title,
            text: p.excerpt || "",
          };
        })
      : RECENT_NOTES;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* 1. Disclaimer Top Bar */}
      <TopBar />

      {/* 2. Brand Sticky Navbar */}
      <Navbar />

      {/* 3. Main Page Content */}
      <main className="max-w-[1240px] mx-auto px-6 py-11 pb-20 w-full flex flex-col gap-14">
        {/* Section 1: Hero Lead & Featured Article Card */}
        <section className="flex flex-wrap gap-12 items-center">
          {/* Left Column: Mission statement & Newsletter */}
          <div className="flex-1 basis-[420px] flex flex-col gap-5 min-w-0">
            <h1 className="m-0 font-serif font-bold text-[32px] sm:text-[40px] lg:text-[46px] leading-[1.12] tracking-[-0.02em] text-balance text-[#111827]">
              Mỗi tuần một câu hỏi về doanh nghiệp niêm yết, trả lời bằng số liệu công bố.
            </h1>
            <p className="m-0 text-[17px] leading-[1.6] text-[#4B5563] max-w-[560px]">
              Tôi đọc báo cáo tài chính, nghị quyết ĐHĐCĐ và dữ liệu HOSE/HNX, rồi ghi lại cách tôi hiểu những con số đó. Đây là sổ ghi chép cá nhân, không phải tin tức hay lời khuyên đầu tư.
            </p>
            <NewsletterForm />
          </div>

          {/* Right Column: Featured Article Box */}
          <Link
            href={`/posts/${featuredCard.slug}`}
            className="flex-1 basis-[440px] min-w-0 flex flex-col gap-4 p-7 bg-white border border-[#111827] text-[#111827] no-underline hover:no-underline transition-all duration-200 hover:shadow-[6px_6px_0_#111827] group"
          >
            <span className="text-[13px] text-[#6B7280]">
              <strong className="text-[#1D4ED8]">Bài mới nhất · {featuredCard.categoryName}</strong> · {featuredCard.date} · 8 phút đọc
            </span>
            <span className="font-serif font-bold text-[26px] sm:text-[30px] lg:text-[34px] leading-[1.15] tracking-[-0.015em] group-hover:text-[#1D4ED8] transition-colors">
              {featuredCard.title}
            </span>
            <span className="text-[16px] leading-[1.55] text-[#374151]">
              <strong>Trả lời ngắn:</strong> {featuredCard.excerpt}
            </span>
            <span className="grid grid-cols-3 border-t border-[#E5E7EB] pt-3.5 gap-3">
              {KEY_STATS.map((k) => (
                <span key={k.label} className="flex flex-col gap-0.5">
                  <span className="text-[24px] font-bold tabular-nums leading-tight text-[#111827]">
                    {k.value}
                  </span>
                  <span className="text-[13px] text-[#6B7280] leading-tight">
                    {k.label}
                  </span>
                </span>
              ))}
            </span>
            <span className="text-[15px] font-bold text-[#1D4ED8] group-hover:underline flex items-center gap-1">
              Đọc phân tích →
            </span>
          </Link>
        </section>

        {/* Section 2: 4 Category Columns Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORY_COLUMNS.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col gap-1.5 border-t-2 border-[#111827] pt-3"
            >
              <Link
                href={`/categories/${c.slug}`}
                className="font-serif font-bold text-[22px] text-[#111827] hover:text-[#1D4ED8] transition-colors"
              >
                {c.name}
              </Link>
              <span className="text-[14px] text-[#6B7280] leading-[1.5] mb-1.5">
                {c.desc}
              </span>
              <div className="flex flex-col">
                {c.items.map((it) => (
                  <Link
                    key={it.slug}
                    href={`/posts/${it.slug}`}
                    className="flex flex-col gap-1 py-3 border-t border-[#E5E7EB] text-[#111827] hover:text-[#1D4ED8] hover:no-underline transition-colors group"
                  >
                    <span className="font-serif font-semibold text-[17px] leading-[1.35] group-hover:text-[#1D4ED8]">
                      {it.title}
                    </span>
                    <span className="text-[13px] text-[#6B7280]">
                      {it.date}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section 3: Middle Split (Series & Recent Notes vs Sidebar) */}
        <section className="flex flex-wrap gap-12 items-start">
          {/* Left Column: Series + Recent Notes */}
          <div className="flex-[2_1_520px] min-w-0 flex flex-col gap-8">
            {/* Series Box: Đọc BCTC ngân hàng từ con số 0 */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-7 rounded-[4px] flex flex-col gap-4.5">
              <div className="flex justify-between items-baseline gap-3 flex-wrap">
                <span className="flex flex-col gap-1">
                  <span className="text-[13px] font-bold text-[#1D4ED8]">
                    Chuỗi bài · 3/6 phần
                  </span>
                  <span className="font-serif font-bold text-[24px] sm:text-[26px] leading-[1.2] text-[#111827]">
                    Đọc BCTC ngân hàng từ con số 0
                  </span>
                </span>
                <Link
                  href="/posts/vcb-co-dat-sau-bao-cao-quy-2"
                  className="text-[14px] font-bold text-[#1D4ED8] hover:underline"
                >
                  Bắt đầu từ phần 1
                </Link>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#E2E8F0] w-full overflow-hidden rounded-full">
                <div className="w-1/2 h-full bg-[#1D4ED8]" />
              </div>

              {/* 6 parts grid */}
              <ol className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 gap-x-7">
                {SERIES_LIST.map((p) => (
                  <li
                    key={p.n}
                    className="flex gap-3 py-3 border-t border-[#E2E8F0]"
                  >
                    <span
                      className="font-serif font-bold text-[18px] w-[18px] flex-shrink-0"
                      style={{ color: p.numColor }}
                    >
                      {p.n}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      {p.slug ? (
                        <Link
                          href={`/posts/${p.slug}`}
                          className="text-[15px] font-semibold leading-[1.4] hover:text-[#1D4ED8] transition-colors"
                          style={{ color: p.color }}
                        >
                          {p.title}
                        </Link>
                      ) : (
                        <span
                          className="text-[15px] font-semibold leading-[1.4]"
                          style={{ color: p.color }}
                        >
                          {p.title}
                        </span>
                      )}
                      <span className="text-[12px] text-[#6B7280]">
                        {p.status}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Ghi chép gần đây (Recent Notes) */}
            <div className="flex flex-col">
              <div className="flex justify-between items-baseline border-t-2 border-[#111827] pt-2.5 mb-1">
                <span className="font-serif font-bold text-[24px] text-[#111827]">
                  Ghi chép gần đây
                </span>
                <Link
                  href="/categories/nhat-ky-quan-sat"
                  className="text-[14px] font-semibold text-[#1D4ED8] hover:underline"
                >
                  Tất cả ghi chép
                </Link>
              </div>

              <div className="flex flex-col">
                {displayNotes.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/posts/${n.slug}`}
                    className="grid grid-cols-[72px_minmax(0,1fr)] gap-5 py-4.5 border-b border-[#E5E7EB] text-[#111827] hover:no-underline group"
                  >
                    <span className="flex flex-col leading-[1.1]">
                      <span className="font-serif font-bold text-[28px] text-[#111827]">
                        {n.day}
                      </span>
                      <span className="text-[13px] text-[#6B7280]">
                        {n.month}
                      </span>
                    </span>
                    <span className="flex flex-col gap-1.5">
                      <span className="font-serif font-bold text-[19px] leading-[1.3] group-hover:text-[#1D4ED8] transition-colors">
                        {n.title}
                      </span>
                      <span className="text-[15px] leading-[1.55] text-[#374151]">
                        {n.text}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Top 10 & Watchlist */}
          <aside className="flex-1 basis-[280px] min-w-0 flex flex-col gap-8">
            {/* Top 10 articles */}
            <Top10Widget />

            {/* Số liệu tôi đang theo dõi (Market Watchlist) */}
            <div className="flex flex-col">
              <h2 className="m-0 text-[14px] font-bold pb-2 border-b-2 border-[#111827] text-[#111827]">
                Số liệu tôi đang theo dõi
              </h2>
              <table className="w-full border-collapse text-[14px] tabular-nums">
                <tbody>
                  {WATCH_LIST.map((t) => (
                    <tr key={t.name}>
                      <td className="py-[9px] border-b border-[#E5E7EB] font-semibold text-[#111827]">
                        {t.name}
                      </td>
                      <td className="py-[9px] border-b border-[#E5E7EB] text-right font-medium text-[#374151]">
                        {t.value}
                      </td>
                      <td
                        className="py-[9px] pl-2.5 border-b border-[#E5E7EB] text-right w-[64px] font-semibold"
                        style={{ color: t.color }}
                      >
                        {t.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="mt-2 text-[12px] text-[#6B7280] leading-[1.5]">
                Giá đóng cửa 23/09/2026. Nguồn: HOSE, NHNN.
              </span>
            </div>
          </aside>
        </section>
      </main>

      {/* 4. Editorial Footer */}
      <Footer />
    </div>
  );
}
