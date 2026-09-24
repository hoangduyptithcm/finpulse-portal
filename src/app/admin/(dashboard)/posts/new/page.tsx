import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tạo bài viết mới | FinPulse Admin",
};

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="py-2">
      <PostForm categories={categories} />
    </div>
  );
}
