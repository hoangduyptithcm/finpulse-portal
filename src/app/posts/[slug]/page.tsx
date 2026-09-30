import type { Metadata } from "next";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleView from "@/components/public/ArticleView";
import MarketTickerBar from "@/components/public/MarketTickerBar";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import { cache } from "react";
import { withMemoryCache } from "@/lib/cache";

export const revalidate = 60;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const getPostBySlug = cache(async (slug: string) => {
  return withMemoryCache(`post-${slug}`, 60, async () => {
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

    return post;
  });
});

const getRelatedPosts = cache(async (postId?: string) => {
  return withMemoryCache(`related-posts-${postId || "default"}`, 60, async () => {
    return prisma.post
      .findMany({
        where: {
          status: "PUBLISHED",
          ...(postId ? { NOT: { id: postId } } : {}),
        },
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
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

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (post) {
    const postUrl = `https://finpulse.aas.ai.vn/posts/${slug}`;
    const desc = post.excerpt || `Bài viết phân tích chuyên sâu về ${post.title} trên Nhịp đập tài chính.`;
    return {
      title: `${post.title} | Nhịp đập tài chính`,
      description: desc,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: desc,
        url: postUrl,
        type: "article",
        publishedTime: new Date(post.createdAt).toISOString(),
        modifiedTime: new Date(post.updatedAt).toISOString(),
        authors: ["Minh Anh"],
        images: post.coverImage
          ? [{ url: post.coverImage, alt: post.title }]
          : [{ url: "/icon-512.png", alt: "Nhịp đập tài chính" }],
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
    ? "VCB có đắt sau báo cáo quý 2? | Nhịp đập tài chính"
    : "Chi tiết bài viết | Nhịp đập tài chính";
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

  const [post, categories] = await Promise.all([
    getPostBySlug(slug),
    getGlobalCategories(),
  ]);

  // If not found in DB and not the default mock VCB slug, return 404
  if (!post && slug !== "vcb-co-dat-sau-bao-cao-quy-2") {
    notFound();
  }

  const [relatedPosts, comments] = await Promise.all([
    getRelatedPosts(post?.id),
    post?.id
      ? prisma.comment
          .findMany({
            where: {
              postId: post.id,
              status: "APPROVED",
            },
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              name: true,
              content: true,
              createdAt: true,
            },
          })
          .catch(() => [])
      : Promise.resolve([]),
  ]);

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
          name: "Nhịp đập tài chính",
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
      <Navbar initialCategories={categories} />
      <MarketTickerBar />
      <ArticleView
        post={post || undefined}
        initialComments={comments}
        relatedPosts={relatedPosts}
      />
      <Footer />
    </div>
  );
}

