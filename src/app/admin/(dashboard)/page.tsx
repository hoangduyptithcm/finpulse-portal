import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalPosts, publishedPosts, draftPosts, totalViewsResult, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.post.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { category: true, author: true },
      }),
    ]);

  const totalViews = totalViewsResult._sum.views || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
            Tổng quan Hệ thống
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Số liệu bài viết, lượt xem và các hoạt động xuất bản tin tức trên FinPulse
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-sm bg-stone-900 hover:bg-stone-800 px-4 py-2 text-xs font-medium text-white transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Soạn bài mới</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="border border-stone-200 bg-white p-5 rounded-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Tổng bài viết</span>
            <FileText className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-stone-900">{totalPosts}</div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {publishedPosts} bài đã xuất bản
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-stone-200 bg-white p-5 rounded-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Đã xuất bản</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-emerald-700">{publishedPosts}</div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Đang hiển thị cho độc giả
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-stone-200 bg-white p-5 rounded-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Bản nháp (Draft)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-amber-700">{draftPosts}</div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Đang biên tập
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-stone-200 bg-white p-5 rounded-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
            <span>Tổng lượt xem</span>
            <Eye className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-stone-900">{totalViews.toLocaleString("vi-VN")}</div>
            <p className="text-[11px] text-stone-400 mt-0.5">
              Lượt truy cập bài viết
            </p>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="border border-stone-200 bg-white rounded-sm overflow-hidden">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-serif font-bold text-sm text-stone-900">
            Bài viết gần đây
          </h3>

          <Link
            href="/admin/posts"
            className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả bài</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

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
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Chưa có bài viết nào.
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div className="relative w-12 h-8 rounded-sm overflow-hidden shrink-0 bg-stone-100">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : null}
                        <div className="max-w-md">
                          <p className="font-medium text-stone-900 truncate">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono truncate">
                            /posts/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-stone-600 text-xs">
                        {post.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4 text-center font-mono text-stone-700">
                      {post.views}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="px-2 py-1 rounded-sm bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors"
                        >
                          Sửa
                        </Link>
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="p-1 rounded-sm hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
                          title="Xem bài"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
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
