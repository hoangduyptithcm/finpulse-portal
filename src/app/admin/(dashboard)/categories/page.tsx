import { prisma } from "@/lib/prisma";
import CategoryManager from "./CategoryManager";
import { FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý Chuyên mục | FinPulse Admin",
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <FolderTree className="w-6 h-6 text-emerald-400" />
          <span>Quản lý Chuyên mục Tài chính</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Thiết lập các danh mục như Crypto, Chứng khoán Việt Nam, Kinh tế vĩ mô để phân loại bài viết
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
