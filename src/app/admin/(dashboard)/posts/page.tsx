import { prisma } from "@/lib/prisma";
import PostsManager from "@/components/admin/PostsManager";
import { getOrSeedCategories } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý Bài viết | FinPulse Admin",
  description: "Danh sách và quản lý bài viết trong FinPulse",
};

export default async function AdminPostsPage() {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    getOrSeedCategories(),
  ]);

  return <PostsManager initialPosts={posts} categories={categories} />;
}
