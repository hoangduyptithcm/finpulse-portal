import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý Chuyên mục | FinPulse",
  description: "Thiết lập và quản lý danh mục phân loại bài viết FinPulse",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return <CategoryManager initialCategories={categories} />;
}
