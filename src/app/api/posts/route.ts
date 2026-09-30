import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { PostStatus } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

/**
 * Validate API Key from headers or query param.
 */
function isAuthorized(req: Request): boolean {
  const secret = process.env.API_SECRET_KEY || process.env.AUTH_SECRET || "finpulse_secret_crawler_2026";
  const authHeader = req.headers.get("authorization");
  const apiKeyHeader = req.headers.get("x-api-key");
  const { searchParams } = new URL(req.url);
  const keyParam = searchParams.get("key");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === secret) return true;
  }

  if (apiKeyHeader && apiKeyHeader.trim() === secret) {
    return true;
  }

  if (keyParam && keyParam.trim() === secret) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Kiểm tra xác thực API Key
    if (!isAuthorized(req)) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Vui lòng cung cấp API Key hợp lệ qua Header 'x-api-key' hoặc 'Authorization: Bearer <KEY>'",
        },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let title: string = "";
    let content: string = "";
    let excerpt: string | undefined;
    let category: string | undefined;
    let categorySlug: string | undefined;
    let coverImage: string | undefined;
    let status: string = "PUBLISHED";
    let featured: boolean = false;
    let customSlug: string | undefined;

    // 2. Hỗ trợ cả Multipart/Form-Data (gửi kèm file ảnh) lẫn JSON thuần (Base64 hoặc URL ảnh)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = (formData.get("title") as string) || "";
      content = (formData.get("content") as string) || "";
      excerpt = (formData.get("excerpt") as string) || undefined;
      category = (formData.get("category") as string) || undefined;
      categorySlug = (formData.get("categorySlug") as string) || undefined;
      coverImage = (formData.get("coverImage") as string) || (formData.get("imageUrl") as string) || undefined;
      status = (formData.get("status") as string) || "PUBLISHED";
      featured = formData.get("featured") === "true" || formData.get("featured") === "1";
      customSlug = (formData.get("slug") as string) || undefined;

      // Xử lý file ảnh nhị phân tải lên nếu có
      const file = (formData.get("file") || formData.get("image") || formData.get("cover")) as File | null;
      if (file && typeof file === "object" && file.size > 0 && file.type?.startsWith("image/")) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const safeName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .toLowerCase();
        const filename = `${Date.now()}-${safeName.slice(0, 30)}.webp`;
        const filepath = path.join(uploadDir, filename);

        await sharp(buffer)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(filepath);

        coverImage = `/uploads/${filename}`;
      }
    } else {
      const body = await req.json().catch(() => null);
      if (!body || typeof body !== "object") {
        return NextResponse.json(
          { success: false, error: "Payload không hợp lệ, yêu cầu định dạng JSON hoặc Multipart/Form-Data" },
          { status: 400 }
        );
      }

      title = body.title || "";
      content = body.content || "";
      excerpt = body.excerpt;
      category = body.category;
      categorySlug = body.categorySlug;
      coverImage = body.coverImage || body.imageUrl || body.imageBase64 || body.coverImageBase64;
      status = body.status || "PUBLISHED";
      featured = Boolean(body.featured);
      customSlug = body.slug;
    }

    // 3. Kiểm tra trường bắt buộc
    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Trường 'title' là bắt buộc" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Trường 'content' là bắt buộc (HTML hoặc văn bản)" },
        { status: 400 }
      );
    }

    const cleanTitle = title.trim();

    // 4. Tìm tác giả (mặc định lấy Admin)
    let author = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true, name: true, email: true },
    });

    if (!author) {
      author = await prisma.user.findFirst({
        select: { id: true, name: true, email: true },
      });
    }

    if (!author) {
      return NextResponse.json(
        { success: false, error: "Chưa có tài khoản tác giả/admin trong cơ sở dữ liệu" },
        { status: 500 }
      );
    }

    // 5. Xác định chuyên mục
    const targetCatIdentifier = (categorySlug || category || "").toString().trim().toLowerCase();
    let cat = null;

    if (targetCatIdentifier) {
      cat = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: targetCatIdentifier },
            { id: targetCatIdentifier },
            { name: { equals: targetCatIdentifier, mode: "insensitive" } },
          ],
        },
      });
    }

    // Nếu không tìm thấy hoặc không truyền, lấy chuyên mục mặc định
    if (!cat) {
      cat = await prisma.category.findFirst({ orderBy: { order: "asc" } });
    }

    if (!cat) {
      cat = await prisma.category.create({
        data: {
          name: "Vĩ mô & Tiền tệ",
          slug: "vi-mo",
          description: "Phân tích vĩ mô, lãi suất và biến động thị trường",
          order: 1,
        },
      });
    }

    // 6. Xử lý slug duy nhất
    let baseSlug = customSlug?.trim() ? slugify(customSlug) : slugify(cleanTitle);
    if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;

    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 7. Xử lý excerpt nếu không truyền
    let cleanExcerpt = excerpt?.trim();
    if (!cleanExcerpt) {
      const stripped = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      cleanExcerpt = stripped.length > 160 ? `${stripped.substring(0, 157)}...` : stripped;
    }

    // 8. Khởi tạo lượt xem ngẫu nhiên tự nhiên (45 - 95 lượt đọc)
    const initialViews = Math.floor(45 + Math.random() * 50);

    // 8.1 Xử lý tự động nếu coverImage là chuỗi Base64
    let finalCoverImage = coverImage?.trim() || null;
    if (finalCoverImage && (finalCoverImage.startsWith("data:image/") || (finalCoverImage.length > 200 && !finalCoverImage.startsWith("http")))) {
      try {
        const matches = finalCoverImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        const base64Data = matches ? matches[2] : finalCoverImage;
        const buffer = Buffer.from(base64Data, "base64");

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const filename = `${Date.now()}-${uniqueSlug.slice(0, 25)}.webp`;
        const filepath = path.join(uploadDir, filename);

        await sharp(buffer)
          .resize({ width: 1920, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(filepath);

        finalCoverImage = `/uploads/${filename}`;
      } catch (err) {
        console.warn("[Post Base64 CoverImage Warning]:", err);
      }
    }

    // 9. Lưu bài viết vào cơ sở dữ liệu
    const postStatus: PostStatus =
      status?.toUpperCase() === "DRAFT"
        ? PostStatus.DRAFT
        : status?.toUpperCase() === "ARCHIVED"
        ? PostStatus.ARCHIVED
        : PostStatus.PUBLISHED;

    const post = await prisma.post.create({
      data: {
        title: cleanTitle,
        slug: uniqueSlug,
        content: content.trim(),
        excerpt: cleanExcerpt,
        coverImage: finalCoverImage,
        categoryId: cat.id,
        authorId: author.id,
        status: postStatus,
        featured: Boolean(featured),
        views: initialViews,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { name: true } },
      },
    });

    // 10. Revalidate cache trang chủ và chuyên mục
    try {
      revalidatePath("/");
      revalidatePath(`/categories/${cat.slug}`);
      revalidatePath(`/posts/${post.slug}`);
    } catch (_) {}

    const origin = new URL(req.url).origin;

    return NextResponse.json(
      {
        success: true,
        message: "Đăng bài viết thành công!",
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          status: post.status,
          category: post.category.name,
          categorySlug: post.category.slug,
          author: post.author.name,
          views: post.views,
          coverImage: post.coverImage,
          url: `${origin}/posts/${post.slug}`,
          createdAt: post.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/posts Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Lỗi máy chủ khi đăng bài viết",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));

    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json({
      success: true,
      count: posts.length,
      posts: posts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        category: p.category.name,
        categorySlug: p.category.slug,
        coverImage: p.coverImage,
        views: p.views,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
