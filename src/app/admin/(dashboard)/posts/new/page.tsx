import PostForm from "@/components/admin/PostForm";
import { getOrSeedCategories } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Soạn bài mới | FinPulse Admin",
  description: "Trình soạn thảo bài viết chuẩn editorial của FinPulse",
};

export default async function NewPostPage() {
  const categories = await getOrSeedCategories();

  return <PostForm categories={categories} />;
}
