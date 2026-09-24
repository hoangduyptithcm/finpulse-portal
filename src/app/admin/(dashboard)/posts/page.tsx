import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeletePostButton from "./DeletePostButton";
import { Plus, ArrowUpRight, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Quản lý Bài viết ({posts.length})
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Danh sách tất cả tin tức, bài phân tích thị trường và kiến thức đầu tư
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-stone-900 hover:bg-stone-800 px-4 py-2 text-xs font-medium text-white transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Soạn bài mới</span>
        </Link>
      </div>

      {/* Table */}
      <div className="border border-stone-200 bg-white rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 bg-stone-50/70 text-stone-500 font-medium text-[11px]">
              <tr>
                <th className="py-3 px-4">Bài viết</th>
                <th className="py-3 px-4">Chuyên mục</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-center">Lượt đọc</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Chưa có bài viết nào. Hãy bấm &quot;Soạn bài mới&quot; để bắt đầu!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div className="relative w-14 h-9 rounded-sm overflow-hidden shrink-0 bg-stone-100">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="max-w-md">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-stone-900 truncate">
                              {post.title}
                            </p>
                            {post.featured && (
                              <span className="shrink-0 px-1.5 py-0.2 rounded-sm bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200">
                                Tiêu điểm
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-stone-400 font-mono truncate mt-0.5">
                            /posts/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-stone-700 text-xs">
                        {post.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-medium">
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-stone-700">
                      {post.views}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-1.5 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors"
                          title="Xem trước bài viết"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
