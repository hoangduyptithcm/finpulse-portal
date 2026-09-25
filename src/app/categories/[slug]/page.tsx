import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Top10Widget from "@/components/public/Top10Widget";
import { CATEGORIES, CATEGORY_RIVER } from "@/data/portalData";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: "Chuyên mục | FinPulse" };
  return {
    title: `${cat.name} | FinPulse`,
    description: cat.desc,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const currentCategory = CATEGORIES.find((c) => c.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#16181D]">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Navbar */}
      <Navbar />

      {/* 3. Main Category View (Screen 02) */}
      <main className="max-w-[1240px] mx-auto px-6 py-9 pb-16 w-full flex flex-col gap-7">
        {/* Category Header */}
        <div className="flex flex-col gap-2 pb-5 border-b border-[#E3E1DC]">
          <h1 className="m-0 font-serif font-bold text-[36px] sm:text-[40px] tracking-[-0.015em] text-[#16181D]">
            {currentCategory.name}
          </h1>
          <p className="m-0 text-[16px] text-[#2B2F36] max-w-[640px] leading-[1.55]">
            {currentCategory.desc}
          </p>
          <div className="flex gap-5 mt-2 text-[14px] font-semibold">
            <span className="text-[#16181D] border-b-2 border-[#16181D] pb-1.5 cursor-pointer">
              Mới nhất
            </span>
            <span className="text-[#5E636B] hover:text-[#16181D] cursor-pointer transition-colors">
              Được đọc nhiều
            </span>
            <span className="text-[#5E636B] hover:text-[#16181D] cursor-pointer transition-colors">
              Chuỗi bài
            </span>
          </div>
        </div>

        {/* Content Layout: River list & Sidebar */}
        <div className="flex flex-wrap gap-12 items-start">
          {/* Article River list */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            {CATEGORY_RIVER.map((p) => (
              <Link
                key={p.slug}
                href={`/posts/${p.slug}`}
                className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_150px] gap-4 sm:gap-6 py-5.5 border-b border-[#E3E1DC] text-[#16181D] hover:no-underline group"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="text-[13px] text-[#5E636B]">
                    {p.date} · {p.read}
                  </span>
                  <span className="font-serif font-bold text-[20px] sm:text-[22px] leading-[1.25] group-hover:text-[#133A63] transition-colors">
                    {p.title}
                  </span>
                  <span className="text-[15px] leading-[1.55] text-[#2B2F36]">
                    {p.dek}
                  </span>
                </span>

                <span className="flex flex-col justify-center gap-1 p-3.5 sm:px-4 bg-[#EEEAE2] self-start rounded-[2px]">
                  <span className="text-[22px] font-bold tabular-nums leading-[1.1] text-[#16181D]">
                    {p.stat}
                  </span>
                  <span className="text-[12px] text-[#2B2F36] leading-[1.4]">
                    {p.statLabel}
                  </span>
                </span>
              </Link>
            ))}

            <button
              type="button"
              className="mt-6 self-center border border-[#16181D] bg-[#FCFBF8] hover:bg-[#F0EEE9] px-7 py-2.5 text-[15px] font-semibold cursor-pointer rounded-[2px] transition-colors text-[#16181D]"
            >
              Xem thêm bài
            </button>
          </div>

          {/* Sidebar */}
          <aside className="flex-1 basis-[280px] min-w-0 flex flex-col gap-8">
            <Top10Widget />
          </aside>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
