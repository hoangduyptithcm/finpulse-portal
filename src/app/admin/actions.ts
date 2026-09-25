"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/slugify";
import { PostStatus } from "@prisma/client";

// --- QUẢN LÝ BÀI VIẾT ---

export async function createPost(formData: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  status: PostStatus;
  featured: boolean;
}) {
  const session = await auth();
  let authorId = session?.user?.id;
  if (!authorId && session?.user?.email) {
    const u = await prisma.user.findUnique({ where: { email: session.user.email } });
    authorId = u?.id;
  }
  if (!authorId) {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    authorId = admin?.id;
  }
  if (!authorId) {
    throw new Error("Vui lòng đăng nhập quyền Admin để tạo bài viết.");
  }

  const title = formData.title.trim();
  if (!title) throw new Error("Tiêu đề bài viết không được để trống");

  let baseSlug = (formData.slug?.trim() ? slugify(formData.slug) : slugify(title));
  if (!baseSlug) baseSlug = `bai-viet-${Date.now()}`;

  // Kiểm tra trùng slug
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  let categoryId = formData.categoryId;
  if (!categoryId) {
    let cat = await prisma.category.findFirst({ orderBy: { order: "asc" } });
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: "Đọc BCTC", slug: "doc-bctc", description: "Bóc tách số liệu báo cáo tài chính", order: 1 }
      });
    }
    categoryId = cat.id;
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug: uniqueSlug,
      excerpt: formData.excerpt?.trim() || null,
      content: formData.content,
      coverImage: formData.coverImage?.trim() || null,
      categoryId,
      status: formData.status as PostStatus,
      featured: formData.featured,
      authorId,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${post.slug}`);

  return { success: true, post };
}

export async function updatePost(
  id: string,
  formData: {
    title: string;
    slug?: string;
    excerpt?: string;
    content: string;
    coverImage?: string;
    categoryId: string;
    status: PostStatus;
    featured: boolean;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vui lòng đăng nhập quyền Admin");
  }

  const title = formData.title.trim();
  if (!title) throw new Error("Tiêu đề bài viết không được để trống");

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Không tìm thấy bài viết");

  let slug = formData.slug?.trim() ? slugify(formData.slug) : slugify(title);
  if (slug !== existing.slug) {
    let uniqueSlug = slug;
    let counter = 1;
    while (
      await prisma.post.findFirst({
        where: { slug: uniqueSlug, NOT: { id } },
      })
    ) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    slug = uniqueSlug;
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: formData.excerpt?.trim() || null,
      content: formData.content,
      coverImage: formData.coverImage?.trim() || null,
      categoryId: formData.categoryId,
      status: formData.status as PostStatus,
      featured: formData.featured,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath(`/posts/${existing.slug}`);

  return { success: true, post };
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vui lòng đăng nhập quyền Admin");
  }

  const post = await prisma.post.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath(`/posts/${post.slug}`);

  return { success: true };
}

// --- QUẢN LÝ CHUYÊN MỤC ---

export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  order?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vui lòng đăng nhập quyền Admin");
  }

  const name = data.name.trim();
  if (!name) throw new Error("Tên chuyên mục không được để trống");

  let slug = data.slug?.trim() ? slugify(data.slug) : slugify(name);
  if (!slug) slug = `danh-muc-${Date.now()}`;

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description: data.description?.trim() || null,
      order: data.order ?? 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts/new");

  return { success: true, category };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vui lòng đăng nhập quyền Admin");
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts/new");

  return { success: true };
}

export async function getOrSeedCategories() {
  let categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  if (categories.length === 0) {
    const defaults = [
      { name: "Đọc BCTC", slug: "doc-bctc", description: "Bóc tách số liệu báo cáo tài chính", order: 1 },
      { name: "Ghi chép quan sát", slug: "nhat-ky-quan-sat", description: "Ghi chép quan sát thị trường và dòng tiền", order: 2 },
      { name: "Vĩ mô & Tiền tệ", slug: "vi-mo", description: "Lãi suất, Fed, Ngân hàng Nhà nước và tỷ giá", order: 3 },
      { name: "Hỏi & Đáp doanh nghiệp", slug: "hoi-dap", description: "Mỗi tuần một câu hỏi về doanh nghiệp niêm yết", order: 4 },
      { name: "Tiền mã hóa", slug: "crypto", description: "Thị trường tiền mã hóa và tài sản số", order: 5 },
      { name: "Chứng khoán", slug: "chung-khoan", description: "Thị trường VN-Index và cổ phiếu", order: 6 },
    ];
    for (const c of defaults) {
      await prisma.category.create({ data: c });
    }
    categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  }

  return categories;
}
