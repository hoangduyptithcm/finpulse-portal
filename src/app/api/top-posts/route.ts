import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMemoryCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

    const items = await withMemoryCache(`top-posts-${range}`, 60, async () => {
      let dateFilter = {};
      if (range === "month") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = { createdAt: { gte: thirtyDaysAgo } };
      }

      let posts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
          ...dateFilter,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          views: true,
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: {
          views: "desc",
        },
        take: 10,
      });

      // If month range returned empty or few, fallback to all-time
      if (posts.length === 0 && range === "month") {
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            views: true,
            category: {
              select: { name: true, slug: true },
            },
          },
          orderBy: {
            views: "desc",
          },
          take: 10,
        });
      }

      return posts.map((p, idx) => {
        const words = (p.excerpt || p.title || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
        const mins = Math.max(3, Math.min(10, Math.round(words / 15) || 4));
        return {
          id: p.id,
          n: (idx + 1).toString().padStart(2, "0"),
          title: p.title,
          slug: p.slug,
          cat: p.category?.name || "Phân tích",
          readTime: `${mins} phút đọc`,
          views: p.views.toLocaleString("vi-VN"),
          numColor: idx < 3 ? "#111827" : "#6B7280",
        };
      });
    });

    return NextResponse.json(
      { success: true, items },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}

