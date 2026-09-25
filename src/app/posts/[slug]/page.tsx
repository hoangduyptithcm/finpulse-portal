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
    return {
      title: `${post.title} | FinPulse`,
      description: post.excerpt || "Sổ phân tích cá nhân của Minh Anh",
      openGraph: {
        title: post.title,
        description: post.excerpt || undefined,
        type: "article",
        images: post.coverImage ? [{ url: post.coverImage }] : undefined,
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
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
    },
  });

  // If not found in DB and not the default mock VCB slug, return 404
  if (!post && slug !== "vcb-co-dat-sau-bao-cao-quy-2") {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar />
      <MarketTickerBar />
      <ArticleView post={post || undefined} />
      <Footer />
    </div>
  );
}
