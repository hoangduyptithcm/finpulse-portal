import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MarketTicker from "@/components/public/MarketTicker";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ShareButtons from "@/components/public/ShareButtons";
import {
  Clock,
  Eye,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  UserCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERATE DYNAMIC METADATA CHO FACEBOOK OPENGRAPH (CỰC KỲ QUAN TRỌNG)
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { author: true, category: true },
  });

  if (!post) {
    return {
      title: "Không tìm thấy bài viết | FinPulse Portal",
    };
  }

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  const coverImageUrl = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : `${siteUrl}/og-fallback.png`;

  return {
    title: `${post.title} | FinPulse Portal`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      url: postUrl,
      siteName: "FinPulse Portal - Phân Tích Crypto & Thị Trường VN",
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
      authors: [post.author?.name || "FinPulse Analyst"],
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

  // Lấy bài viết & đồng thời tăng lượt xem (views)
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

  // Tăng lượt xem trong nền (không làm chậm trang)
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  // Lấy các bài viết liên quan (cùng chuyên mục) và danh mục cho Navbar
  const [categories, relatedPosts] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.post.findMany({
      where: {
        categoryId: post.categoryId,
        status: "PUBLISHED",
        NOT: { id: post.id },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const siteUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const currentUrl = `${siteUrl}/posts/${post.slug}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Ticker */}
      <MarketTicker />

      {/* 2. Navbar */}
      <Navbar categories={categories} />

      {/* 3. Article Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link
            href={`/categories/${post.category?.slug}`}
            className="text-emerald-400 font-medium hover:underline"
          >
            {post.category?.name}
          </Link>
        </nav>

        {/* Article Header */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {post.category?.name}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              {post.views + 1} lượt xem
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          {/* Excerpt Lead Box */}
          {post.excerpt && (
            <div className="p-4 sm:p-5 rounded-2xl border-l-4 border-emerald-400 bg-slate-900/70 text-slate-300 text-sm sm:text-base leading-relaxed italic font-serif">
              &quot;{post.excerpt}&quot;
            </div>
          )}

          {/* Social Share Bar Top */}
          <div className="pt-2 pb-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {post.author?.name?.[0] || "A"}
              </div>
              <span>
                Biên tập: <strong>{post.author?.name || "FinPulse Team"}</strong>
              </span>
            </div>
            <ShareButtons title={post.title} url={currentUrl} />
          </div>
        </header>

        {/* Cover Image (Facebook 1200x630 format) */}
        {post.coverImage && (
          <div className="relative aspect-[1200/630] w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body HTML Content */}
        <article
          className="prose prose-invert prose-emerald max-w-none text-slate-200 text-base leading-relaxed pt-4
          prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:mb-5 prose-p:leading-8
          prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-900/60 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic
          prose-img:rounded-2xl prose-img:border prose-img:border-slate-800 prose-img:shadow-xl
          prose-a:text-emerald-400 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-emerald-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Social Share Bar Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Nguồn tin tức: FinPulse Financial Research Desk</span>
          </div>
          <ShareButtons title={post.title} url={currentUrl} />
        </div>

        {/* Disclaimer Warning */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3.5 text-xs text-amber-300/90 leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <p>
            <strong>Cảnh báo rủi ro tài chính:</strong> Bài viết trên chỉ nhằm cung cấp góc nhìn thông tin thị trường, hoàn toàn không được xem là lời khuyên mua bán hay kêu gọi đầu tư. Hãy tự nghiên cứu kỹ lưỡng trước khi đưa ra bất kỳ quyết định tài chính nào.
          </p>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="pt-8 space-y-5 border-t border-slate-800/80">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-400 rounded-full" />
              <span>Bài Viết Cùng Chuyên Mục</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/posts/${item.slug}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:bg-slate-900 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {item.coverImage && (
                      <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-800">
                        <Image
                          src={item.coverImage}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 line-clamp-2 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
