import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "month";

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
      include: {
        category: true,
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
        include: {
          category: true,
        },
        orderBy: {
          views: "desc",
        },
        take: 10,
      });
    }

    const items = posts.map((p, idx) => {
      const words = (p.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
      const mins = Math.max(3, Math.min(12, Math.round(words / 160)));
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

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching top posts:", error);
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
