import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Top10Widget from "@/components/public/Top10Widget";
import { prisma } from "@/lib/prisma";
import { Search as SearchIcon, ArrowLeft, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Tìm kiếm: "${q}" | FinPulse` : "Tìm kiếm | FinPulse",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  let posts: any[] = [];
  if (query) {
    posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        category: true,
        author: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }).catch(() => []);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      <TopBar />
      <Navbar />

      <main className="max-w-[1240px] mx-auto px-6 py-9 pb-16 w-full flex flex-col gap-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col gap-3 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">Tìm kiếm</span>
          </div>

          <h1 className="m-0 font-serif font-bold text-[32px] sm:text-[38px] text-[#111827]">
            {query ? (
              <>
                Kết quả tìm kiếm cho <span className="text-[#1E40AF]">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Tìm kiếm bài viết"
            )}
          </h1>

          <p className="m-0 text-[15px] text-[#6B7280]">
            {query
              ? `Tìm thấy ${posts.length} bài viết phù hợp với từ khóa của bạn.`
              : "Nhập từ khóa hoặc mã cổ phiếu (VD: VCB, FPT, BCTC, biên lợi nhuận...) để tìm kiếm."}
          </p>
        </div>

        {/* Search Input Bar on Page */}
        <form action="/search" method="GET" className="flex gap-2 max-w-[600px]">
          <div className="flex-1 flex items-center bg-white border border-[#D1D5DB] rounded-[4px] px-3.5 py-2.5 focus-within:border-[#1E40AF] transition-colors">
            <SearchIcon className="w-4 h-4 text-[#9CA3AF] mr-2.5 shrink-0" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Nhập tên bài, mã chứng khoán hoặc chủ đề..."
              className="w-full bg-transparent outline-none text-[15px] text-[#111827] placeholder:text-[#9CA3AF]"
              autoFocus={!query}
            />
          </div>
          <button
            type="submit"
            className="border-0 bg-[#1E40AF] hover:bg-[#1E3A8A] !text-white hover:!text-white px-6 py-2.5 text-[15px] font-semibold rounded-[4px] cursor-pointer transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Results Layout */}
        <div className="flex flex-wrap gap-12 items-start mt-2">
          {/* Main Results Column */}
          <div className="flex-[2_1_520px] flex flex-col min-w-0">
            {!query ? (
              <div className="py-12 px-6 text-center border border-dashed border-[#E5E7EB] rounded-[4px] text-[#6B7280]">
                Hãy nhập từ khóa tìm kiếm để bắt đầu tra cứu.
              </div>
            ) : posts.length === 0 ? (
              <div className="py-14 px-6 text-center border border-dashed border-[#E5E7EB] rounded-[4px] flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-10 h-10 text-[#9CA3AF] stroke-[1.5]" />
                <h3 className="m-0 font-serif text-[20px] font-bold text-[#111827]">
                  Không tìm thấy bài viết nào phù hợp
                </h3>
                <p className="m-0 text-[14px] text-[#6B7280] max-w-[420px]">
                  Không có bài viết nào khớp với từ khóa &ldquo;{query}&rdquo;. Thử tìm kiếm với từ khóa ngắn gọn hơn hoặc xem danh mục bài viết.
                </p>
                <Link
                  href="/"
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E40AF] text-white !text-white rounded-[4px] text-[14px] font-semibold hover:bg-[#1E3A8A] transition-colors no-underline"
                >
                  <ArrowLeft className="w-4 h-4 text-white !text-white" />
                  <span>Quay về trang chủ</span>
                </Link>
              </div>
            ) : (
              posts.map((p) => {
                const dateStr = new Date(p.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });

                return (
                  <Link
                    key={p.id}
                    href={`/posts/${p.slug}`}
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px] gap-4 sm:gap-6 py-6 border-b border-[#E5E7EB] text-[#111827] hover:no-underline group"
                  >
                    <span className="flex flex-col gap-2">
                      <span className="text-[13px] text-[#6B7280] flex items-center gap-2">
                        <span className="font-semibold text-[#1E40AF]">
                          {p.category?.name || "Bài viết"}
                        </span>
                        <span>·</span>
                        <span>{dateStr}</span>
                      </span>

                      <span className="font-serif font-bold text-[20px] sm:text-[23px] leading-[1.25] group-hover:text-[#1E40AF] transition-colors">
                        {p.title}
                      </span>

                      {p.excerpt && (
                        <span className="text-[15px] leading-[1.55] text-[#4B5563] line-clamp-2">
                          {p.excerpt}
                        </span>
                      )}
                    </span>

                    <span className="flex flex-col justify-center items-center gap-1 p-3.5 bg-[#F9FAFB] border border-[#F3F4F6] self-start rounded-[4px] text-center">
                      <span className="text-[20px] font-bold tabular-nums leading-tight text-[#111827]">
                        {p.views.toLocaleString("vi-VN")}
                      </span>
                      <span className="text-[12px] text-[#6B7280]">
                        lượt xem
                      </span>
                    </span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex-1 basis-[280px] min-w-0 flex flex-col gap-8">
            <Top10Widget />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
