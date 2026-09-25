import type { Metadata } from "next";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleView from "@/components/public/ArticleView";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const isVcb = slug === "vcb-co-dat-sau-bao-cao-quy-2";
  const title = isVcb
    ? "VCB có đắt sau báo cáo quý 2? | FinPulse"
    : "Chi tiết bài viết | FinPulse";
  const description =
    "Tôi so P/B, ROE và nợ xấu của Vietcombank với chính nó trong 5 năm để xem mức giá hiện tại đang phản ánh điều gì.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: "https://finpulse.vn/og-vcb.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function PostDetailPage({ params }: PostPageProps) {
  // Await params per Next.js 15+ conventions
  await params;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#16181D]">
      <TopBar />
      <Navbar />
      <ArticleView />
      <Footer />
    </div>
  );
}
