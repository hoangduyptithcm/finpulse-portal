import CategoryManager from "./CategoryManager";

export const metadata = {
  title: "Quản lý Chuyên mục | FinPulse",
  description: "Thiết lập và quản lý danh mục phân loại bài viết FinPulse",
};

export default function AdminCategoriesPage() {
  return <CategoryManager />;
}
