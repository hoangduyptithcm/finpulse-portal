import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMemoryCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await withMemoryCache("global-categories-full", 300, async () => {
      return prisma.category.findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
        },
      });
    });

    return NextResponse.json(
      { success: true, categories },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ success: false, categories: [] }, { status: 500 });
  }
}

