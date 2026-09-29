import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) {
      post = await prisma.post.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        select: { id: true },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
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
    });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json().catch(() => ({}));
    const { name, email, content } = body;

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: "Vui lòng nhập tên và nội dung bình luận." },
        { status: 400 }
      );
    }

    if (name.trim().length > 60) {
      return NextResponse.json(
        { success: false, error: "Tên không được vượt quá 60 ký tự." },
        { status: 400 }
      );
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { success: false, error: "Nội dung bình luận không được vượt quá 2.000 ký tự." },
        { status: 400 }
      );
    }

    let post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!post) {
      post = await prisma.post.findFirst({
        where: { slug: { equals: slug, mode: "insensitive" } },
        select: { id: true },
      });
    }

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        name: name.trim(),
        email: email?.trim() || null,
        content: content.trim(),
        status: "APPROVED",
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
