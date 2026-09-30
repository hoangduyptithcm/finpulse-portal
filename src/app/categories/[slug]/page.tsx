import type { Metadata } from "next";
import Link from "next/link";
import TopBar from "@/components/public/TopBar";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Top10Widget from "@/components/public/Top10Widget";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { BookOpen, Calendar, Eye, ArrowLeft } from "lucide-react";

import { cache } from "react";
import { withMemoryCache } from "@/lib/cache";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const getCategoryWithPosts = cache(async (slug: string) => {
  return withMemoryCache(`cat-posts-${slug}`, 60, async () => {
    let category = await prisma.category.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            views: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!category) {
      category = await prisma.category.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        include: {
          posts: {
            where: { status: "PUBLISHED" },
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              views: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    return category;
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
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryWithPosts(slug);

  if (!category) {
    return { title: "Chuyên mục | Nhịp đập tài chính" };
  }

  return {
    title: `${category.name} | Nhịp đập tài chính`,
    description: category.description || `Các bài viết thuộc chuyên mục ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const [category, allCategories] = await Promise.all([
    getCategoryWithPosts(slug),
    getGlobalCategories(),
  ]);

  if (!category) {
    if (slug === "giai-thich-khai-niem" || slug === "checklist") {
      redirect("/categories/doc-bctc");
    }
    notFound();
  }

  const posts = category.posts;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111827]">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Navbar */}
      <Navbar initialCategories={allCategories} />

      {/* 3. Main Category View */}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-9 pb-16 flex flex-col gap-7">
        {/* Category Header */}
        <div className="flex flex-col gap-2 pb-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
            <Link href="/" className="hover:text-[#1E40AF] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <span>/</span>
            <span className="text-[#111827] font-medium">Chuyên mục</span>
          </div>

          <h1 className="m-0 font-serif font-bold text-[34px] sm:text-[40px] tracking-[-0.015em] text-[#111827]">
            {category.name}
          </h1>

          {category.description && (
            <p className="m-0 text-[16px] text-[#4B5563] max-w-[640px] leading-[1.55]">
              {category.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-[14px]">
            <span className="text-[#111827] font-semibold border-b-2 border-[#111827] pb-1">
              Tất cả bài viết ({posts.length})
            </span>
          </div>
        </div>

        {/* Content Layout: River list & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start w-full">
          {/* Article River list */}
          <div className="flex-1 min-w-0 flex flex-col">
            {posts.length === 0 ? (
              <div className="py-16 px-6 text-center border border-dashed border-[#E5E7EB] rounded-[4px] flex flex-col items-center justify-center gap-3">
                <BookOpen className="w-10 h-10 text-[#9CA3AF] stroke-[1.5]" />
                <h3 className="m-0 font-serif text-[20px] font-bold text-[#111827]">
                  Chưa có bài viết nào trong chuyên mục này
                </h3>
                <p className="m-0 text-[14px] text-[#6B7280] max-w-[420px]">
                  Các bài phân tích mới nhất sẽ được xuất bản tại đây. Bạn có thể xem các chuyên mục khác hoặc quay lại trang chủ.
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
                          {category.name}
                        </span>
                        <span>·</span>
                        <span>{dateStr}</span>
                        <span>·</span>
                        <span>{p.views.toLocaleString("vi-VN")} lượt đọc</span>
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

                    <span className="hidden sm:flex flex-col justify-center items-end gap-1.5 self-center text-right shrink-0">
                      <span className="text-[14px] font-semibold text-[#111827] flex items-center gap-1.5 group-hover:text-[#1E40AF] transition-colors">
                        <span>Đọc toàn văn</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[12px] text-[#6B7280]">
                        Bóc tách số liệu
                      </span>
                    </span>
                  </Link>
                );
              })
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-8">
            <Top10Widget />
          </aside>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
