import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let post = await prisma.post.findUnique({ where: { slug } });
    if (!post) {
      post = await prisma.post.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
      select: { id: true, slug: true, views: true },
    });

    return NextResponse.json({ success: true, views: updated.views });
  } catch (error) {
    console.error("Error in slug view count:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let post = await prisma.post.findUnique({
      where: { slug },
      select: { views: true },
    });
    if (!post) {
      post = await prisma.post.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        select: { views: true },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, views: post.views });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
