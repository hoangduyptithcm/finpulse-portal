import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import MarketTicker from "@/components/public/MarketTicker";
import Footer from "@/components/public/Footer";
import ShareButtons from "@/components/public/ShareButtons";
import AdminBottomBar from "@/components/public/AdminBottomBar";
import { Clock, Eye, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });

  if (!post) {
    return { title: "Không tìm thấy bài viết | FinPulse" };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const coverImageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : `${siteUrl}/og-fallback.png`;

  return {
    title: `${post.title} | FinPulse`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: postUrl,
      siteName: "FinPulse - Tin tức và Phân tích Tài chính",
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author?.name || "Minh Anh"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.title,
      images: [coverImageUrl],
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: true,
    },
  });

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Tăng lượt xem
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const [categories, relatedPosts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.post.findMany({
      where: {
        categoryId: post.categoryId,
        status: "PUBLISHED",
        NOT: { id: post.id },
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const currentUrl = `${siteUrl}/posts/${post.slug}`;

  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
      <TopBar />
      <Navbar categories={categories} />
      <MarketTicker />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
          <Link
            href={`/categories/${post.category?.slug}`}
            className="text-blue-700 font-medium hover:underline"
          >
            {post.category?.name}
          </Link>
        </nav>

        {/* Title & Metadata */}
        <header className="space-y-4">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-2 pb-4 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-stone-900">
                {post.author?.name || "Minh Anh"}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views + 1} lượt đọc
              </span>
            </div>

            <ShareButtons title={post.title} url={currentUrl} />
          </div>

          {/* Excerpt Lead */}
          {post.excerpt && (
            <p className="text-base sm:text-lg font-serif italic text-stone-700 leading-relaxed bg-stone-50 p-4 border-l-2 border-stone-800">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone-100 rounded-sm">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <article
          className="prose prose-stone max-w-none text-stone-800 text-base leading-relaxed pt-2
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-stone-900
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-stone-200 prose-h2:pb-2
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:mb-5 prose-p:leading-8
          prose-blockquote:border-l-2 prose-blockquote:border-stone-800 prose-blockquote:bg-stone-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
          prose-a:text-blue-700 prose-a:underline hover:prose-a:text-blue-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share buttons bottom */}
        <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">FinPulse Newsroom</span>
          <ShareButtons title={post.title} url={currentUrl} />
        </div>

        {/* Related Stories */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-stone-200 space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Cùng chuyên mục {post.category?.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/posts/${item.slug}`}
                  className="group p-3 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors block space-y-1.5"
                >
                  <h4 className="text-xs font-bold text-stone-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")} · {item.views} đọc
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AdminBottomBar />
    </div>
  );
}
