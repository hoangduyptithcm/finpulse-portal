import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import Footer from "@/components/public/Footer";
import Top10Widget from "@/components/public/Top10Widget";
import { prisma } from "@/lib/prisma";
import {
  CATEGORY_COLUMNS,
  SERIES_LIST,
  RECENT_NOTES,
  WATCH_LIST,
} from "@/data/portalData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FinPulse | Cổng Thông Tin & Phân Tích Tài Chính",
  description:
    "Phân tích chuyên sâu về thị trường chứng khoán, tiền mã hóa, vĩ mô và doanh nghiệp niêm yết.",
};

export default async function HomePage() {
  const publishedPosts = await prisma.post
    .findMany({
      where: { status: "PUBLISHED" },
      include: { category: true, author: true },
      orderBy: { createdAt: "desc" },
      take: 12,
    })
    .catch(() => []);

  const featuredPost = publishedPosts.find((p) => p.featured) || publishedPosts[0];

  const heroArticle = featuredPost
    ? {
        slug: featuredPost.slug,
        categoryName: featuredPost.category?.name || "Tiền mã hóa",
        categorySlug: featuredPost.category?.slug || "crypto",
        date: new Date(featuredPost.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        title: featuredPost.title,
        excerpt:
          featuredPost.excerpt ||
          "Dòng tiền từ các quỹ ETF giữ vai trò dẫn dắt, trong khi nhà đầu tư cá nhân quay lại chậm hơn các chu kỳ trước.",
        coverImage:
          featuredPost.coverImage ||
          "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
        author: featuredPost.author?.name || "Minh Anh",
      }
    : {
        slug: "tong-quan-thi-truong-crypto-va-chu-ky-moi-nam-2026",
        categoryName: "Tiền mã hóa",
        categorySlug: "crypto",
        date: "24/09/2026",
        title: "Tổng quan thị trường Crypto và chu kỳ tăng trưởng mới trong năm 2026",
        excerpt:
          "Dòng tiền từ các quỹ ETF giữ vai trò dẫn dắt, trong khi nhà đầu tư cá nhân quay lại chậm hơn các chu kỳ trước.",
        coverImage:
          "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1200&q=80",
        author: "Minh Anh",
      };

  const secondaryPosts = publishedPosts.filter((p) => p.slug !== heroArticle.slug);

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
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Brand Sticky Navbar */}
      <Navbar />

      {/* 3. Market Live Ticker Bar */}
      <MarketTickerBar />

      {/* 4. Main Page Content */}
      <main className="max-w-[1240px] mx-auto px-6 py-8 pb-20 w-full flex flex-col gap-12">
        {/* Section 1: Hero Featured & Market Sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
          {/* Left Column: Big Hero Story */}
          <div className="flex flex-col gap-6">
            <Link
              href={`/posts/${heroArticle.slug}`}
              className="flex flex-col gap-4 text-[#111827] group no-underline hover:no-underline"
            >
              {/* Hero Image */}
              <div className="w-full aspect-[16/9] rounded-[4px] overflow-hidden bg-slate-100 border border-[#E5E7EB]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroArticle.coverImage}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>

              {/* Category Tag */}
              <span className="text-[14px] font-bold text-[#1D4ED8]">
                {heroArticle.categoryName}
              </span>

              {/* Title */}
              <h1 className="m-0 font-serif font-bold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.2] tracking-[-0.015em] group-hover:text-[#1D4ED8] transition-colors text-balance">
                {heroArticle.title}
              </h1>

              {/* Excerpt */}
              <p className="m-0 text-[16px] sm:text-[17px] leading-[1.6] text-[#4B5563]">
                {heroArticle.excerpt}
              </p>

              {/* Author & Time */}
              <span className="text-[13px] text-[#6B7280]">
                {heroArticle.author} · {heroArticle.date}
              </span>
            </Link>

            {/* Sub-headlines list below hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E5E7EB]">
              {secondaryPosts.length > 0 ? (
                secondaryPosts.slice(0, 2).map((sp) => (
                  <Link
                    key={sp.id}
                    href={`/posts/${sp.slug}`}
                    className="flex flex-col gap-1.5 group no-underline text-[#111827]"
                  >
                    <span className="text-[12px] font-bold text-[#1D4ED8]">
                      {sp.category?.name || "Tin tức"}
                    </span>
                    <span className="font-serif font-bold text-[18px] leading-[1.3] group-hover:text-[#1D4ED8] transition-colors">
                      {sp.title}
                    </span>
                    <span className="text-[14px] text-[#4B5563] line-clamp-2">
                      {sp.excerpt}
                    </span>
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/posts/vcb-co-dat-sau-bao-cao-quy-2"
                    className="flex flex-col gap-1.5 group no-underline text-[#111827]"
                  >
                    <span className="text-[12px] font-bold text-[#1D4ED8]">
                      Tiền mã hóa
                    </span>
                    <span className="font-serif font-bold text-[18px] leading-[1.3] group-hover:text-[#1D4ED8] transition-colors">
                      Spot ETF Ethereum ghi nhận dòng vào kỷ lục
                    </span>
                    <span className="text-[14px] text-[#4B5563]">
                      Thanh khoản thị trường gia tăng mạnh mẽ khi các tổ chức lớn tích lũy.
                    </span>
                  </Link>
                  <Link
                    href="/posts/vcb-co-dat-sau-bao-cao-quy-2"
                    className="flex flex-col gap-1.5 group no-underline text-[#111827]"
                  >
                    <span className="text-[12px] font-bold text-[#1D4ED8]">
                      Phân tích chu kỳ
                    </span>
                    <span className="font-serif font-bold text-[18px] leading-[1.3] group-hover:text-[#1D4ED8] transition-colors">
                      Halving đã qua 2 năm: giá Bitcoin phản ứng thế nào?
                    </span>
                    <span className="text-[14px] text-[#4B5563]">
                      Đối chiếu dữ liệu lịch sử các đợt halving 2016 và 2020 để nhìn nhận chu kỳ hiện tại.
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Market Watchlist & Top 10 */}
          <aside className="flex flex-col gap-8">
            {/* Thị trường Table */}
            <div className="flex flex-col bg-white">
              <h2 className="m-0 text-[16px] font-bold pb-2.5 border-b-2 border-[#111827] text-[#111827]">
                Thị trường
              </h2>
              <table className="w-full border-collapse text-[14px] tabular-nums">
                <tbody>
                  {WATCH_LIST.map((t) => (
                    <tr key={t.name}>
                      <td className="py-3 border-b border-[#E5E7EB] font-semibold text-[#111827]">
                        {t.name}
                      </td>
                      <td className="py-3 border-b border-[#E5E7EB] text-right font-medium text-[#374151]">
                        {t.value}
                      </td>
                      <td
                        className="py-3 pl-3 border-b border-[#E5E7EB] text-right w-[72px] font-semibold"
                        style={{ color: t.color }}
                      >
                        {t.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="mt-2.5 text-[12px] text-[#6B7280]">
                Cập nhật tự động · Nguồn: HOSE, HNX, CoinGecko
              </span>
            </div>

            {/* Top 10 Reading Widget */}
            <Top10Widget />
          </aside>
        </section>

        {/* Section 2: 4 Category Columns Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4 border-t border-[#E5E7EB]">
          {CATEGORY_COLUMNS.map((c) => (
            <div
              key={c.slug}
              className="flex flex-col gap-2 border-t-2 border-[#111827] pt-3"
            >
              <Link
                href={`/categories/${c.slug}`}
                className="font-serif font-bold text-[20px] text-[#111827] hover:text-[#1D4ED8] transition-colors"
              >
                {c.name}
              </Link>
              <span className="text-[13px] text-[#6B7280] leading-[1.5] mb-1">
                {c.desc}
              </span>
              <div className="flex flex-col">
                {c.items.map((it) => (
                  <Link
                    key={it.slug}
                    href={`/posts/${it.slug}`}
                    className="flex flex-col gap-1 py-3 border-t border-[#E5E7EB] text-[#111827] hover:text-[#1D4ED8] hover:no-underline transition-colors group"
                  >
                    <span className="font-serif font-semibold text-[16px] leading-[1.35] group-hover:text-[#1D4ED8]">
                      {it.title}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      {it.date}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section 3: Series and Recent Notes */}
        <section className="flex flex-wrap gap-10 items-start pt-4 border-t border-[#E5E7EB]">
          {/* Series Box: Đọc BCTC ngân hàng từ con số 0 */}
          <div className="flex-1 basis-[500px] min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] p-7 rounded-[4px] flex flex-col gap-4">
            <div className="flex justify-between items-baseline gap-3 flex-wrap">
              <span className="flex flex-col gap-1">
                <span className="text-[13px] font-bold text-[#1D4ED8]">
                  Chuỗi bài · 3/6 phần
                </span>
                <span className="font-serif font-bold text-[24px] sm:text-[26px] leading-[1.2]">
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
                        className="text-[14px] font-semibold leading-[1.4] hover:text-[#1D4ED8] transition-colors"
                        style={{ color: p.color }}
                      >
                        {p.title}
                      </Link>
                    ) : (
                      <span
                        className="text-[14px] font-semibold leading-[1.4]"
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
          <div className="flex-1 basis-[420px] min-w-0 flex flex-col">
            <div className="flex justify-between items-baseline border-t-2 border-[#111827] pt-2.5 mb-1">
              <span className="font-serif font-bold text-[22px]">
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
                  className="grid grid-cols-[64px_minmax(0,1fr)] gap-4 py-4 border-b border-[#E5E7EB] text-[#111827] hover:no-underline group"
                >
                  <span className="flex flex-col leading-[1.1]">
                    <span className="font-serif font-bold text-[26px]">
                      {n.day}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      {n.month}
                    </span>
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-serif font-bold text-[17px] leading-[1.3] group-hover:text-[#1D4ED8] transition-colors">
                      {n.title}
                    </span>
                    <span className="text-[14px] leading-[1.5] text-[#4B5563] line-clamp-2">
                      {n.text}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 5. Clean Footer */}
      <Footer />
    </div>
  );
}
