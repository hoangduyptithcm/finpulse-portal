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
  if (!session?.user?.id) {
    throw new Error("Vui lòng đăng nhập quyền Admin");
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

  const post = await prisma.post.create({
    data: {
      title,
      slug: uniqueSlug,
      excerpt: formData.excerpt?.trim() || null,
      content: formData.content,
      coverImage: formData.coverImage?.trim() || null,
      categoryId: formData.categoryId,
      status: formData.status as PostStatus,
      featured: formData.featured,
      authorId: session.user.id,
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
