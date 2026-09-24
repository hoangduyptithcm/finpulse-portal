import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import MarketTicker from "@/components/public/MarketTicker";
import Footer from "@/components/public/Footer";
import AdminBottomBar from "@/components/public/AdminBottomBar";

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
    return { title: "Chuyên mục không tồn tại | FinPulse" };
  }

  return {
    title: `${category.name} | FinPulse`,
    description: category.description || `Bản tin tài chính chuyên mục ${category.name}`,
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
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
      <TopBar />
      <Navbar categories={allCategories} />
      <MarketTicker />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Header */}
        <div className="border-b border-stone-200 pb-4 space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs text-stone-600 max-w-2xl">{category.description}</p>
          )}
          <p className="text-[11px] text-stone-400 font-sans">{posts.length} bài viết</p>
        </div>

        {/* List of articles */}
        {posts.length === 0 ? (
          <div className="py-12 text-center text-stone-500 text-xs">
            Chưa có bài viết nào trong chuyên mục này.
          </div>
        ) : (
          <div className="divide-y divide-stone-200 max-w-4xl">
            {posts.map((post) => (
              <article key={post.id} className="py-4 space-y-1.5">
                <Link href={`/posts/${post.slug}`} className="group block space-y-1">
                  <h2 className="font-serif text-lg font-bold text-stone-900 group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 font-sans">
                    {post.author?.name || "Minh Anh"} · {new Date(post.createdAt).toLocaleDateString("vi-VN")} · {post.views} lượt đọc
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <AdminBottomBar />
    </div>
  );
}
