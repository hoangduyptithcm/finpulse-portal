import PostsManager from "@/components/admin/PostsManager";

export const metadata = {
  title: "Quản lý Bài viết | FinPulse",
  description: "Danh sách và quản lý bài viết trong FinPulse",
};

export default function AdminPostsPage() {
  return <PostsManager />;
}
