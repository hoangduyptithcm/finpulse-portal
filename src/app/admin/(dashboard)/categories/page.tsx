import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-stone-200">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
          Quản lý Chuyên mục
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Thiết lập các danh mục như Crypto, Chứng khoán, Vĩ mô để phân loại bài viết
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
