import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  let categories: { id: string; name: string; slug: string; description: string | null }[] = [];
  let featuredPost = null;
  let dbStatus = "Connecting...";

  try {
    categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
    });
    featuredPost = await prisma.post.findFirst({
      where: { featured: true },
      include: { category: true, author: true },
    });
    dbStatus = "Connected (PostgreSQL via Prisma)";
  } catch (error) {
    dbStatus = `Error connecting to database: ${(error as Error).message}`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Header / Ticker Bar placeholder */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              FINPULSE
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Day 1 Ready
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DB Status:</span>
            <span className="font-mono text-emerald-300">{dbStatus}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-10 flex-1 w-full space-y-10">
        {/* Hero Banner */}
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-8 shadow-xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              🚀 Cổng thông tin Tài chính & Học tập FinPulse
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Phân tích Thị trường Crypto & Chứng khoán Việt Nam
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Hệ thống xuất bản tin tức tài chính tốc độ cao, tối ưu link chia sẻ Facebook (OpenGraph Card lớn) và vận hành độc lập trên VPS tiết kiệm 100% chi phí.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="mt-8">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
              Chuyên mục khởi tạo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60"
                >
                  <p className="font-semibold text-slate-200 text-sm">{cat.name}</p>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                  <span className="inline-block mt-2 font-mono text-[10px] text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/30">
                    /{cat.slug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Sample Article */}
        {featuredPost && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-400 rounded-full"></span>
                Bài viết mẫu đã nạp vào Database (Seed Data)
              </h2>
              <span className="text-xs text-slate-400">Đã đồng bộ PostgreSQL</span>
            </div>

            <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 overflow-hidden">
              {featuredPost.coverImage && (
                <div className="lg:col-span-5 relative aspect-[16/9] lg:aspect-auto rounded-xl overflow-hidden bg-slate-800">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      {featuredPost.category?.name}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">
                      Tác giả: {featuredPost.author?.name}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white hover:text-emerald-400 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>URL Slug: <code className="text-slate-300">/posts/{featuredPost.slug}</code></span>
                  <span className="text-emerald-400 font-medium">Trạng thái: PUBLISHED</span>
                </div>
              </div>
            </article>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>FinPulse Portal © 2026 • Tối ưu chia sẻ Fanpage Facebook & Độc lập VPS</p>
      </footer>
    </div>
  );
}
