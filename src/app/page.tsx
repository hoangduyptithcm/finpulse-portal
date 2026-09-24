import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import MarketTicker from "@/components/public/MarketTicker";
import MarketBox from "@/components/public/MarketBox";
import TopTrending from "@/components/public/TopTrending";
import NewsletterBox from "@/components/public/NewsletterBox";
import Footer from "@/components/public/Footer";
import AdminBottomBar from "@/components/public/AdminBottomBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FinPulse | Tin tức và phân tích tài chính cho nhà đầu tư Việt Nam",
  description:
    "Cổng thông tin chuyên sâu về Crypto, Chứng khoán Việt Nam, Kinh tế Vĩ mô và Kiến thức đầu tư.",
};

export default async function HomePage() {
  const [categories, allPosts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      include: { category: true, author: true },
    }),
  ]);

  // Bài tiêu điểm (Hero Article)
  const heroPost =
    allPosts.find((p) => p.slug === "tong-quan-thi-truong-crypto-va-chu-ky-moi-nam-2026") ||
    allPosts.find((p) => p.featured) ||
    allPosts[0];

  // 2 bài tin con dưới bài chính
  const subHero1 = allPosts.find((p) => p.slug === "spot-etf-ethereum-ghi-nhan-dong-vao-ky-luc");
  const subHero2 = allPosts.find((p) => p.slug === "halving-da-qua-2-nam-gia-bitcoin-phan-ung-the-nao");

  // Cột giữa (Sub-stories - 4 bài)
  const middlePosts = [
    allPosts.find((p) => p.slug === "khoi-ngoai-quay-lai-mua-rong-nhom-ngan-hang-sau-3-tuan"),
    allPosts.find((p) => p.slug === "fed-giu-nguyen-lai-suat-phat-tin-hieu-cat-giam-thang-12"),
    allPosts.find((p) => p.slug === "co-phieu-thep-truoc-mua-bao-cao-quy-iii"),
    allPosts.find((p) => p.slug === "solana-tang-6-nho-hoat-dong-defi-phuc-hoi"),
  ].filter(Boolean) as typeof allPosts;

  // Top 10 bài xem nhiều nhất (Cột phải)
  const trendingArticles = [...allPosts]
    .sort((a, b) => b.views - a.views)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      categoryName: p.category?.name || "Tin tức",
      views: p.views,
    }));

  // Chuyên mục: Chứng khoán Việt Nam
  const vnStockFeatured = allPosts.find(
    (p) => p.slug === "vn-index-vuot-1290-diem-thanh-khoan-cai-thien-ro-ret"
  );
  const vnStockList = [
    allPosts.find((p) => p.slug === "nhom-ngan-hang-dan-dat-vcb-va-tcb-tang-tren-2-phan-tram"),
    allPosts.find((p) => p.slug === "co-phieu-thep-truoc-mua-bao-cao-quy-iii"),
    allPosts.find((p) => p.slug === "ba-ma-ban-le-duoc-khoi-ngoai-gom-manh-tuan-qua"),
    allPosts.find((p) => p.slug === "lich-chia-co-tuc-tien-mat-tuan-40"),
  ].filter(Boolean) as typeof allPosts;

  // Chuyên mục: Kiến thức đầu tư
  const eduFeatured = allPosts.find(
    (p) => p.slug === "doc-bao-cao-tai-chinh-trong-10-phut-5-chi-so-can-nho"
  );
  const eduList = [
    allPosts.find((p) => p.slug === "dca-la-gi-cach-binh-quan-gia-cho-nguoi-moi"),
    allPosts.find((p) => p.slug === "quan-ly-von-vi-sao-khong-nen-don-het-vao-mot-ma"),
    allPosts.find((p) => p.slug === "phan-biet-co-phieu-tang-truong-va-co-phieu-gia-tri"),
    allPosts.find((p) => p.slug === "vi-lanh-va-vi-nong-nen-giu-tien-ma-hoa-o-dau"),
  ].filter(Boolean) as typeof allPosts;

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Header Navbar */}
      <Navbar categories={categories} />

      {/* 3. Market Ticker */}
      <MarketTicker />

      {/* 4. Main 3-Column Editorial Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT 1: HERO ARTICLE (~50% width -> 6 cols) */}
          {heroPost && (
            <div className="lg:col-span-6 space-y-4">
              <Link href={`/posts/${heroPost.slug}`} className="group block space-y-3">
                {heroPost.coverImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 rounded-sm">
                    <Image
                      src={heroPost.coverImage}
                      alt={heroPost.title}
                      fill
                      priority
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-blue-700 tracking-wide">
                    {heroPost.category?.name || "Tiền mã hóa"}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 group-hover:text-blue-700 transition-colors leading-tight">
                    {heroPost.title}
                  </h1>
                  {heroPost.excerpt && (
                    <p className="text-sm text-stone-600 leading-relaxed font-sans">
                      {heroPost.excerpt}
                    </p>
                  )}
                  <p className="text-xs text-stone-400 font-sans pt-1">
                    {heroPost.author?.name || "Minh Anh"} · 2 giờ trước
                  </p>
                </div>
              </Link>

              {/* 2 Sub-bullets underneath */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                {subHero1 && (
                  <Link
                    href={`/posts/${subHero1.slug}`}
                    className="block text-sm font-semibold text-stone-900 hover:text-blue-700 transition-colors"
                  >
                    {subHero1.title}
                  </Link>
                )}
                {subHero2 && (
                  <Link
                    href={`/posts/${subHero2.slug}`}
                    className="block text-sm font-semibold text-stone-900 hover:text-blue-700 transition-colors"
                  >
                    {subHero2.title}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* CỘT 2: SUB-STORIES (~25% width -> 3 cols) */}
          <div className="lg:col-span-3 space-y-4 divide-y divide-stone-200 lg:border-l lg:border-r border-stone-200 lg:px-4">
            {middlePosts.map((post, idx) => (
              <div key={post.id} className={idx > 0 ? "pt-4" : ""}>
                <Link href={`/posts/${post.slug}`} className="group block space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    {post.category?.name}
                  </span>
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-sans pt-0.5">
                    {idx === 0
                      ? "45 phút trước"
                      : idx === 1
                      ? "3 giờ trước"
                      : idx === 2
                      ? "5 giờ trước"
                      : "Hôm qua"}
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {/* CỘT 3: MARKET BOX & TOP 10 TRENDING (~25% width -> 3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <MarketBox />
            <TopTrending articles={trendingArticles} />
          </div>
        </section>

        {/* SECTION: CHỨNG KHOÁN VIỆT NAM */}
        <section className="space-y-4 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Chứng khoán Việt Nam
            </h2>
            <Link
              href="/categories/chung-khoan"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Featured (6 cols) */}
            {vnStockFeatured && (
              <div className="lg:col-span-6 space-y-3">
                <div className="aspect-[16/9] w-full bg-stone-100 rounded-sm relative overflow-hidden">
                  {vnStockFeatured.coverImage ? (
                    <Image
                      src={vnStockFeatured.coverImage}
                      alt={vnStockFeatured.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <Link href={`/posts/${vnStockFeatured.slug}`} className="group block space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {vnStockFeatured.title}
                  </h3>
                  {vnStockFeatured.excerpt && (
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {vnStockFeatured.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 font-sans">1 giờ trước</p>
                </Link>
              </div>
            )}

            {/* Right 4 List Items (6 cols) */}
            <div className="lg:col-span-6 divide-y divide-stone-200">
              {vnStockList.map((post, idx) => (
                <div key={post.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/posts/${post.slug}`} className="group block space-y-1">
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-sans">
                      {idx === 0
                        ? "2 giờ trước"
                        : idx === 1
                        ? "5 giờ trước"
                        : "Hôm qua"}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: KIẾN THỨC ĐẦU TƯ */}
        <section className="space-y-4 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between pb-2 border-b-2 border-stone-900">
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Kiến thức đầu tư
            </h2>
            <Link
              href="/categories/kien-thuc-dau-tu"
              className="text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Featured (6 cols) */}
            {eduFeatured && (
              <div className="lg:col-span-6 space-y-3">
                <div className="aspect-[16/9] w-full bg-stone-100 rounded-sm relative overflow-hidden">
                  {eduFeatured.coverImage ? (
                    <Image
                      src={eduFeatured.coverImage}
                      alt={eduFeatured.title}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <Link href={`/posts/${eduFeatured.slug}`} className="group block space-y-1.5">
                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {eduFeatured.title}
                  </h3>
                  {eduFeatured.excerpt && (
                    <p className="text-xs text-stone-600 leading-relaxed font-sans">
                      {eduFeatured.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 font-sans">23/09</p>
                </Link>
              </div>
            )}

            {/* Right 4 List Items (6 cols) */}
            <div className="lg:col-span-6 divide-y divide-stone-200">
              {eduList.map((post, idx) => (
                <div key={post.id} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/posts/${post.slug}`} className="group block space-y-1">
                    <h4 className="text-sm font-semibold text-stone-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-sans">
                      {idx === 0
                        ? "22/09"
                        : idx === 1
                        ? "21/09"
                        : idx === 2
                        ? "19/09"
                        : "17/09"}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: NEWSLETTER BANNER */}
        <NewsletterBox />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Admin Bottom Bar */}
      <AdminBottomBar />
    </div>
  );
}
