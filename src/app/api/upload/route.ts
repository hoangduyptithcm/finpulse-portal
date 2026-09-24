import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized: Vui lòng đăng nhập quyền Admin" },
        { status: 401 }
      );
    }

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
    const buffer = Buffer.from(bytes);

    // Thư mục lưu trữ: public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Tên file chuẩn hóa kèm timestamp
    const safeName = file.name
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
