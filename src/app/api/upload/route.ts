import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const apiKey = req.headers.get("x-api-key") || req.headers.get("authorization")?.replace("Bearer ", "").trim();
    const secret = process.env.API_SECRET_KEY || process.env.AUTH_SECRET || "finpulse_secret_crawler_2026";
    const isApiKeyValid = Boolean(apiKey && apiKey === secret);

    if (!session?.user && !isApiKeyValid) {
      return NextResponse.json(
        { error: "Unauthorized: Vui lòng đăng nhập quyền Admin hoặc cung cấp API Key qua Header x-api-key" },
        { status: 401 }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let buffer: Buffer | null = null;
    let originalName = "image";

    // 1. Nếu client gửi JSON chứa Base64 (phù hợp cho bot/crawler)
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      const rawBase64 = (body.image || body.base64 || body.file || "").trim();

      if (!rawBase64) {
        return NextResponse.json(
          { error: "Vui lòng truyền chuỗi Base64 qua trường 'image' hoặc 'base64'" },
          { status: 400 }
        );
      }

      // Xóa tiền tố data:image/...;base64, nếu có
      const matches = rawBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const base64Data = matches ? matches[2] : rawBase64;
      buffer = Buffer.from(base64Data, "base64");
      if (body.filename) originalName = body.filename;
    } else {
      // 2. Nếu client gửi Multipart FormData (file nhị phân thông thường)
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { error: "Không tìm thấy file tải lên" },
          { status: 400 }
        );
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Định dạng file không hợp lệ, vui lòng chọn file ảnh" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      originalName = file.name;
    }

    if (!buffer || buffer.length === 0) {
      return NextResponse.json(
        { error: "Dữ liệu ảnh không hợp lệ hoặc bị rỗng" },
        { status: 400 }
      );
    }

    // Thư mục lưu trữ: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Tên file chuẩn hóa kèm timestamp
    const safeName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const filename = `${Date.now()}-${safeName.slice(0, 30)}.webp`;
    const filepath = path.join(uploadDir, filename);

    // Dùng sharp nén và tối ưu hóa sang WebP chất lượng 85%
    await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý tải ảnh lên:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi trong quá trình xử lý ảnh" },
      { status: 500 }
    );
  }
}
