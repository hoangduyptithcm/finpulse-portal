import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Chỉnh sửa bài viết | FinPulse Admin",
};

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-2">
      <PostForm initialData={post} categories={categories} />
    </div>
  );
}
