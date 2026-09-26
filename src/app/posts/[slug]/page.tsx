import type { Metadata } from "next";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleView from "@/components/public/ArticleView";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

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
  });

  if (post) {
    const postUrl = `https://finpulse.aas.ai.vn/posts/${slug}`;
    const desc = post.excerpt || `Bài viết phân tích chuyên sâu về ${post.title} trên FinPulse.`;
    return {
      title: post.title,
      description: desc,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: desc,
        url: postUrl,
        type: "article",
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: ["Minh Anh"],
        images: post.coverImage
          ? [{ url: post.coverImage, alt: post.title }]
          : [{ url: "/icon-512.png", alt: "FinPulse" }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: desc,
        images: post.coverImage ? [post.coverImage] : ["/icon-512.png"],
      },
    };
  }

  const isVcb = slug === "vcb-co-dat-sau-bao-cao-quy-2";
  const title = isVcb
    ? "VCB có đắt sau báo cáo quý 2? | FinPulse"
    : "Chi tiết bài viết | FinPulse";
  const description =
    "Tôi so P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm để xem mức giá hiện tại đang phản ánh điều gì.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://finpulse.aas.ai.vn/posts/${slug}`,
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  if (!post) {
    post = await prisma.post.findFirst({
      where: {
        slug: {
          equals: slug,
          mode: "insensitive",
        },
      },
      include: {
        category: true,
        author: { select: { name: true } },
      },
    });
  }

  // If not found in DB and not the default mock VCB slug, return 404
  if (!post && slug !== "vcb-co-dat-sau-bao-cao-quy-2") {
    notFound();
  }

  const relatedPosts = await prisma.post
    .findMany({
      where: {
        status: "PUBLISHED",
        ...(post?.id ? { NOT: { id: post.id } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    })
    .catch(() => []);

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage || "https://finpulse.aas.ai.vn/icon-512.png",
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
          "@type": "Person",
          name: post.author?.name || "Minh Anh",
        },
        publisher: {
          "@type": "Organization",
          name: "FinPulse",
          logo: {
            "@type": "ImageObject",
            url: "https://finpulse.aas.ai.vn/icon-512.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://finpulse.aas.ai.vn/posts/${slug}`,
        },
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {post?.status === "DRAFT" && (
        <aside
          aria-label="Thông báo bản nháp"
          className="bg-[#D97706] text-white text-[13px] font-medium px-4 py-2 text-center flex items-center justify-center gap-2"
        >
          <span>
            ⚡ BẢN NHÁP: Bài viết này đang ở trạng thái bản nháp và chưa xuất bản chính thức.
          </span>
        </aside>
      )}
      <TopBar />
      <Navbar />
      <MarketTickerBar />
      <ArticleView post={post || undefined} relatedPosts={relatedPosts} />
      <Footer />
    </div>
  );
}

