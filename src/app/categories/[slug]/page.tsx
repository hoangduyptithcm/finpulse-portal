import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/public/MarketTicker";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { Clock, Eye, FolderTree, BookmarkCheck } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return { title: "Chuyên mục không tồn tại | FinPulse Portal" };
  }

  return {
    title: `${category.name} | FinPulse Portal`,
    description: category.description || `Bản tin và phân tích chuyên mục ${category.name}`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, allCategories, posts] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.post.findMany({
      where: {
        category: { slug },
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      include: { author: true, category: true },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <MarketTicker />
      <Navbar categories={allCategories} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Category Header Banner */}
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-emerald-950/30 p-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <FolderTree className="w-3.5 h-3.5" />
            <span>Chuyên mục tin tức</span>
          </div>
          <h1 className="text-3xl font-black text-white">{category.name}</h1>
          {category.description && (
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="text-xs text-slate-500 font-mono">
            {posts.length} bài viết đã xuất bản
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-2">
            <BookmarkCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-400 text-sm">Chưa có bài viết nào trong chuyên mục này.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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
        )}
      </main>

      <Footer />
    </div>
  );
}
