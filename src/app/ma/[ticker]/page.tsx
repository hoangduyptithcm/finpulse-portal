import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import Top10Widget from "@/components/public/Top10Widget";
import SidebarBanner from "@/components/public/SidebarBanner";
import { prisma } from "@/lib/prisma";
import { getStockByTicker, STOCKS_DATA, KNOWN_TICKERS } from "@/data/stocksData";
import { fetchStockQuoteData } from "@/lib/stockQuoteService";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  FileText,
  Clock,
  Eye,
  Bookmark,
  Activity,
} from "lucide-react";

import { cache } from "react";
import { withMemoryCache } from "@/lib/cache";

export const revalidate = 30;

interface StockPageProps {
  params: Promise<{ ticker: string }>;
}

const getStockPageData = cache(async (upperTicker: string) => {
  return withMemoryCache(`stock-quote-${upperTicker}`, 30, async () => {
    const [liveQuote, staticStock] = await Promise.all([
      fetchStockQuoteData(upperTicker),
      Promise.resolve(getStockByTicker(upperTicker)),
    ]);
    return { liveQuote, staticStock };
  });
});

const getStockPosts = cache(async (upperTicker: string) => {
  return withMemoryCache(`stock-posts-${upperTicker}`, 60, async () => {
    return prisma.post
      .findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: upperTicker, mode: "insensitive" } },
            { excerpt: { contains: upperTicker, mode: "insensitive" } },
            {
              tags: {
                some: {
                  tag: {
                    name: { contains: upperTicker, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          views: true,
          createdAt: true,
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []);
  });
});

const getGlobalCategories = cache(async () => {
  return withMemoryCache("global-categories", 300, async () => {
    return prisma.category
      .findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })
      .catch(() => []);
  });
});

export async function generateStaticParams() {
  return KNOWN_TICKERS.map((ticker) => ({
    ticker,
  }));
}

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase().trim();
  const { liveQuote, staticStock } = await getStockPageData(upperTicker);

  const companyName = liveQuote?.companyNameVi || staticStock.name;
  const title = `Mã cổ phiếu ${upperTicker}: Chỉ số tài chính & Bài phân tích | ${companyName}`;
  const description = `Dữ liệu khớp lệnh thị trường, chỉ số P/E, P/B, ROE và toàn bộ bài viết phân tích bóc tách BCTC chuyên sâu về mã ${upperTicker} (${companyName}) trên Nhịp đập tài chính.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://finpulse.aas.ai.vn/ma/${upperTicker}`,
    },
    openGraph: {
      title,
      description,
      url: `https://finpulse.aas.ai.vn/ma/${upperTicker}`,
      type: "website",
    },
  };
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase().trim();

  // Basic regex validation for ticker symbols (2 to 6 alphanumeric characters)
  if (!/^[A-Z0-9]{2,6}$/.test(upperTicker)) {
    notFound();
  }

  // Fetch real-time market quote, stock fundamental, posts, and navbar categories in parallel
  const [{ liveQuote, staticStock }, posts, categories] = await Promise.all([
    getStockPageData(upperTicker),
    getStockPosts(upperTicker),
    getGlobalCategories(),
  ]);

  // Determine effective display values
  const companyName = liveQuote?.companyNameVi || staticStock.name;
  const exchange = liveQuote?.exchange || staticStock.exchange;
  const price = liveQuote?.priceFormatted || staticStock.price;
  const change = liveQuote?.changeFormatted || staticStock.change;
  const changePercent = liveQuote?.changePercentFormatted || staticStock.changePercent;
  const isPositive = liveQuote ? liveQuote.isPositive : staticStock.isPositive;
  const volume = liveQuote?.volumeFormatted || staticStock.volume;

  // Calculate SVG sparkline coordinates
  const minVal = Math.min(...staticStock.sparkline);
  const maxVal = Math.max(...staticStock.sparkline);
  const range = maxVal - minVal || 1;
  const points = staticStock.sparkline
    .map((val, idx) => {
      const x = (idx / (staticStock.sparkline.length - 1)) * 260;
      const y = 60 - ((val - minVal) / range) * 48;
      return `${x},${y}`;
    })
    .join(" ");

  // Suggested other popular tickers
  const otherTickers = KNOWN_TICKERS.filter((t) => t !== upperTicker).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar initialCategories={categories} />
      <MarketTickerBar />

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-20 flex flex-col gap-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] text-[#6B7280]">
          <Link href="/" className="hover:text-[#111827] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-[#6B7280]">Hồ sơ cổ phiếu</span>
          <span>/</span>
          <span className="font-bold text-[#111827] font-mono">{upperTicker}</span>
        </nav>

        {/* Company Header Box with SSI Live Integration */}
        <section className="bg-white border-2 border-[#111827] p-6 sm:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 shadow-[6px_6px_0_#111827]">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-extrabold text-[28px] sm:text-[32px] tracking-tight bg-[#111827] text-white px-3 py-0.5 rounded-[3px]">
                {upperTicker}
              </span>
              <span className="text-[13px] font-bold uppercase tracking-wider px-2.5 py-1 bg-[#F3F4F6] border border-[#E5E7EB] text-[#374151] rounded">
                Sàn {exchange}
              </span>
              <span className="text-[13px] font-medium px-2.5 py-1 bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] rounded">
                {staticStock.industry}
              </span>
            </div>

            <h1 className="m-0 font-serif font-bold text-[24px] sm:text-[30px] leading-[1.2] text-[#111827]">
              {companyName}
            </h1>

            <p className="m-0 text-[15px] sm:text-[16px] leading-[1.6] text-[#4B5563]">
              {staticStock.overview}
            </p>
          </div>

          {/* Price & Sparkline Card */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px]">
            <div className="flex flex-col lg:items-end">
              <span className="text-[12px] font-medium text-[#6B7280]">
                {liveQuote ? "Giá khớp lệnh thời gian thực" : "Thị giá tham chiếu"}
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono font-bold text-[30px] text-[#111827]">
                  {price}
                </span>
                <span
                  className={`font-mono font-bold text-[14px] flex items-center ${
                    isPositive ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {changePercent} ({change})
                </span>
              </div>
              <span className="text-[11px] text-[#9CA3AF] mt-0.5">
                Khối lượng: {volume} {liveQuote ? `· GTGD: ${liveQuote.totalValueFormatted}` : ""}
              </span>
            </div>

            {/* Sparkline Visual */}
            <div className="flex flex-col lg:items-end gap-1">
              <svg
                viewBox="0 0 260 65"
                className="w-[200px] h-[50px] overflow-visible"
              >
                <polyline
                  fill="none"
                  stroke={isPositive ? "#059669" : "#E11D48"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
              <div className="flex justify-between w-[200px] text-[10px] text-[#9CA3AF] font-mono">
                <span>Thấp: {liveQuote ? liveQuote.lowestFormatted : staticStock.low52w}</span>
                <span>Cao: {liveQuote ? liveQuote.highestFormatted : staticStock.high52w}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Market Board Snippet (if live data is available) */}
        {liveQuote && (
          <section className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-[3px] flex flex-col gap-3 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
              <span className="text-[13px] font-bold text-[#1E293B] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#1E40AF]" />
                Chi tiết phiên giao dịch trong ngày
              </span>
              <span className="text-[11px] text-[#64748B]">
                Dữ liệu khớp lệnh thời gian thực
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-[13px] tabular-nums">
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Giá trần</span>
                <span className="font-mono font-bold text-[#9333EA]">{liveQuote.ceilingFormatted}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Giá sàn</span>
                <span className="font-mono font-bold text-[#0284C7]">{liveQuote.floorFormatted}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Tham chiếu</span>
                <span className="font-mono font-bold text-[#CA8A04]">{liveQuote.refPriceFormatted}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Cao nhất</span>
                <span className="font-mono font-bold text-emerald-700">{liveQuote.highestFormatted}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Thấp nhất</span>
                <span className="font-mono font-bold text-rose-600">{liveQuote.lowestFormatted}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Khối ngoại Mua</span>
                <span className="font-mono font-bold text-[#1E293B]">{liveQuote.foreignBuy.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Khối ngoại Bán</span>
                <span className="font-mono font-bold text-[#1E293B]">{liveQuote.foreignSell.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex flex-col p-2 bg-white rounded border border-[#E2E8F0]">
                <span className="text-[11px] text-[#64748B]">Room ngoại còn</span>
                <span className="font-mono font-bold text-[#1E293B]">
                  {(liveQuote.foreignRoom / 1_000_000).toFixed(1)}M cp
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Section: Fundamental Indicators Grid */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#111827]">
            <h2 className="m-0 text-[18px] font-bold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1E40AF]" />
              Các chỉ số tài chính cốt lõi
            </h2>
            <span className="text-[13px] text-[#6B7280]">
              Nguồn: Báo cáo tài chính hợp nhất đã công bố
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Định giá P/E", value: staticStock.pe, note: "Giá / Thu nhập" },
              { label: "Định giá P/B", value: staticStock.pb, note: "Giá / Giá trị sổ sách" },
              { label: "Hiệu quả ROE", value: staticStock.roe, note: "LN / Vốn chủ sở hữu" },
              { label: "Biên lợi nhuận gộp", value: staticStock.grossMargin, note: "Gross Margin / NIM" },
              { label: "Biên lợi nhuận ròng", value: staticStock.netMargin, note: "Net Margin" },
              { label: "Vốn hóa thị trường", value: staticStock.marketCap, note: "Quy mô doanh nghiệp" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-white border border-[#E5E7EB] hover:border-[#111827] transition-colors rounded-[2px] flex flex-col gap-1"
              >
                <span className="text-[12px] font-medium text-[#6B7280]">
                  {stat.label}
                </span>
                <span className="font-mono font-bold text-[22px] text-[#111827] tabular-nums">
                  {stat.value}
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  {stat.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content: Related Articles & Side Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Articles about this stock */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b-2 border-[#111827]">
              <h2 className="m-0 text-[18px] font-bold text-[#111827] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1E40AF]" />
                Bài phân tích & Ghi chép về {upperTicker} ({posts.length})
              </h2>
            </div>

            {posts.length > 0 ? (
              <div className="flex flex-col gap-5">
                {posts.map((p) => {
                  const words = (p.excerpt || p.title || "")
                    .replace(/<[^>]*>/g, " ")
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean).length;
                  const mins = Math.max(3, Math.min(10, Math.round(words / 15) || 4));

                  return (
                    <article
                      key={p.id}
                      className="p-6 bg-white border border-[#E5E7EB] hover:border-[#111827] hover:shadow-[4px_4px_0_#111827] transition-all flex flex-col gap-3 group"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#6B7280]">
                        <span className="font-bold text-[#1E40AF]">
                          {p.category?.name || "Báo cáo phân tích"}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                            {mins} phút đọc
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-[#9CA3AF]" />
                            {p.views.toLocaleString("vi-VN")} lượt đọc
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/posts/${p.slug}`}
                        className="font-serif font-bold text-[21px] sm:text-[24px] leading-[1.25] text-[#111827] group-hover:text-[#1E40AF] transition-colors no-underline"
                      >
                        {p.title}
                      </Link>

                      {p.excerpt && (
                        <p className="m-0 text-[15px] leading-[1.6] text-[#4B5563] line-clamp-3">
                          {p.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-[13px]">
                        <span className="text-[#9CA3AF]">
                          Xuất bản:{" "}
                          {new Date(p.createdAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                        <Link
                          href={`/posts/${p.slug}`}
                          className="font-semibold text-[#1E40AF] group-hover:underline flex items-center gap-1"
                        >
                          Đọc toàn văn bài phân tích →
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[4px] flex flex-col gap-3 text-center items-center">
                <span className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1E40AF] flex items-center justify-center font-bold text-[20px]">
                  {upperTicker}
                </span>
                <h3 className="m-0 font-serif font-bold text-[20px] text-[#111827]">
                  Chưa có bài phân tích chuyên biệt riêng cho {upperTicker}
                </h3>
                <p className="m-0 text-[15px] text-[#4B5563] max-w-[540px]">
                  Tác giả đang trong quá trình bóc tách báo cáo tài chính quý gần nhất của {companyName}. Bạn có thể xem các bài phân tích ngân hàng và sản xuất tiêu biểu dưới đây:
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center">
                  <Link
                    href="/posts/vcb-co-dat-sau-bao-cao-quy-2"
                    className="text-[14px] font-semibold text-[#1E40AF] bg-white border border-[#BFDBFE] px-3.5 py-1.5 rounded hover:bg-[#EFF6FF] transition-colors"
                  >
                    Xem bài phân tích VCB mẫu →
                  </Link>
                  <Link
                    href="/categories/doc-bctc"
                    className="text-[14px] font-semibold text-[#111827] bg-white border border-[#E5E7EB] px-3.5 py-1.5 rounded hover:bg-[#F3F4F6] transition-colors"
                  >
                    Khám phá chuyên mục Đọc BCTC →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Other Stocks & Watchlist Card */}
          <aside className="lg:col-span-4 flex flex-col gap-7">
            {/* Watchlist Action Box */}
            <div className="p-6 bg-[#F9FAFB] border border-[#111827] rounded-[3px] flex flex-col gap-4 shadow-[4px_4px_0_#111827]">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-[#1E40AF]" />
                <h3 className="m-0 font-bold text-[16px] text-[#111827]">
                  Theo dõi cổ phiếu {upperTicker}
                </h3>
              </div>
              <p className="m-0 text-[14px] leading-[1.55] text-[#4B5563]">
                Nhận thông báo ngay khi có bài bóc tách BCTC mới, cập nhật biên lợi nhuận hoặc biến động dòng tiền về mã <strong>{upperTicker}</strong>.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="w-full px-3.5 py-2.5 text-[14px] border border-[#D1D5DB] rounded bg-white text-[#111827] focus:outline-none focus:border-[#1E40AF]"
                />
                <button
                  type="button"
                  style={{ color: "#ffffff", backgroundColor: "#111827" }}
                  className="w-full py-2.5 px-4 bg-[#111827] hover:bg-[#1E40AF] !text-white font-bold text-[14px] rounded transition-colors cursor-pointer"
                >
                  Nhận tin về mã {upperTicker}
                </button>
              </div>
              <span className="text-[11px] text-[#9CA3AF]">
                Miễn phí · Không spam · Có thể hủy bất kỳ lúc nào.
              </span>
            </div>

            {/* Other Popular Stocks */}
            <div className="flex flex-col">
              <h3 className="m-0 text-[14px] font-bold pb-2 border-b-2 border-[#111827] text-[#111827]">
                Các mã cổ phiếu đáng chú ý khác
              </h3>
              <div className="flex flex-col divide-y divide-[#E5E7EB]">
                {otherTickers.map((t) => {
                  const s = STOCKS_DATA[t];
                  return (
                    <Link
                      key={t}
                      href={`/ma/${t}`}
                      className="py-3 flex items-center justify-between hover:bg-gray-50/80 px-1 rounded transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-[15px] text-[#111827] group-hover:text-[#1E40AF] transition-colors">
                          {s.ticker}
                        </span>
                        <span className="text-[12px] text-[#6B7280] line-clamp-1 max-w-[200px]">
                          {s.name}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-semibold text-[14px] text-[#111827]">
                          {s.price}
                        </span>
                        <span
                          className={`font-mono text-[12px] font-bold ${
                            s.isPositive ? "text-emerald-700" : "text-rose-600"
                          }`}
                        >
                          {s.changePercent}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <Top10Widget />
            <SidebarBanner />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
