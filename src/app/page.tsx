import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import MarketTicker from "@/components/public/MarketTicker";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import {
  Sparkles,
  Clock,
  Eye,
  ArrowRight,
  TrendingUp,
  Share2,
  BookmarkCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FinPulse Portal | Tin Tức & Phân Tích Crypto, Chứng Khoán Việt Nam",
  description:
    "Cổng thông tin chuyên sâu về Tiền mã hóa, thị trường chứng khoán VN-Index và kiến thức đầu tư tài chính thực chiến.",
};

export default async function HomePage() {
  const [categories, featuredPost, latestPosts] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { posts: { where: { status: "PUBLISHED" } } } },
      },
    }),
    prisma.post.findFirst({
      where: { featured: true, status: "PUBLISHED" },
      include: { category: true, author: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { category: true, author: true },
    }),
  ]);

  // Fallback if no featured post, take the first post
  const heroPost = featuredPost || latestPosts[0];
  const secondaryPosts = latestPosts.filter((p) => p.id !== heroPost?.id).slice(0, 3);
  const regularPosts = latestPosts.filter((p) => p.id !== heroPost?.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Market Ticker */}
      <MarketTicker />

      {/* 2. Top Navigation */}
      <Navbar categories={categories} />

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-12">
        {/* HERO SECTION */}
        {heroPost ? (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Big Hero Post (8 cols) */}
            <div className="lg:col-span-8">
              <Link
                href={`/posts/${heroPost.slug}`}
                className="group relative flex flex-col rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl hover:border-slate-700 transition-all duration-300 h-full"
              >
                {heroPost.coverImage && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={heroPost.coverImage}
                      alt={heroPost.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg">
                        <Sparkles className="w-3.5 h-3.5" />
                        Tiêu Điểm Hôm Nay
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        {heroPost.category?.name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {new Date(heroPost.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        {heroPost.views} lượt xem
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white group-hover:text-emerald-400 transition-colors leading-tight">
                      {heroPost.title}
                    </h1>

                    {heroPost.excerpt && (
                      <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                        {heroPost.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>Đọc toàn bộ bài phân tích</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Trending / Secondary News (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Tin Nóng Đang Chú Ý</span>
                </h3>
                <span className="text-[11px] text-slate-500">Mới cập nhật</span>
              </div>

              <div className="flex flex-col gap-4 flex-1 justify-between">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-700 transition-all flex gap-3.5"
                  >
                    {post.coverImage && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[10px] font-semibold text-emerald-400">
                          {post.category?.name}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-2 mt-0.5 leading-snug">
                          {post.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                        <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                        <span>•</span>
                        <span>{post.views} xem</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Fanpage Mini Card */}
              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/60 p-5 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Share2 className="w-4 h-4" />
                  <span>Kênh Fanpage Facebook</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cập nhật tin tức nhanh nhất, biểu đồ và thảo luận cùng cộng đồng tài chính.
                </p>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/20"
                >
                  Theo dõi Fanpage ngay
                </a>
              </div>
            </div>
          </section>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
            <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Hệ thống đang chuẩn bị các bản tin tài chính mới nhất.</p>
          </div>
        )}

        {/* CATEGORIES PILLS BAR */}
        <section className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
              <span>Chuyên Mục Nổi Bật</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-emerald-500/40 hover:bg-slate-900 transition-all flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                    {cat.description || "Phân tích và bài viết mới"}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-emerald-400 font-semibold">
                    {cat._count.posts} bài
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEED ALL ARTICLES GRID */}
        <section className="pt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full" />
                <span>Bản Tin Mới Cập Nhật</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Các bài phân tích chuyên sâu Crypto và Thị trường Việt Nam
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-slate-700 hover:bg-slate-900/80 transition-all flex flex-col justify-between shadow-lg"
              >
                <div>
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-800">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur text-[10px] font-semibold text-emerald-400 border border-slate-800">
                        {post.category?.name}
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Eye className="w-3 h-3" />
                    {post.views}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FACEBOOK FANPAGE CONVERSION BANNER */}
        <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/50 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
              <Share2 className="w-3.5 h-3.5" />
              Kết Nối Cộng Đồng Fanpage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Đón Đọc Tin Nhanh Thị Trường Mỗi Ngày Trên Fanpage Facebook
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Theo dõi ngay Fanpage để thảo luận cùng hàng nghìn nhà đầu tư, nhận tín hiệu giao dịch Crypto và phân tích cổ phiếu tiềm năng sớm nhất.
            </p>
            <div className="pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-6 py-3 shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
              >
                <span>Tham Gia Fanpage Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
