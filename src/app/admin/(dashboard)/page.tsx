import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  FolderTree,
  Plus,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [totalPosts, publishedPosts, draftPosts, totalViewsResult, categories, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.aggregate({ _sum: { views: true } }),
      prisma.category.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true, author: true },
      }),
    ]);

  const totalViews = totalViewsResult._sum.views || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Bảng Điều Khiển Quản Trị
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tổng quan hệ thống, thống kê độc giả và quản lý bài viết trên FinPulse Portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Viết bài mới</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng bài viết</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalPosts}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {publishedPosts} bài đã xuất bản
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Đã xuất bản</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400">{publishedPosts}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Đang hiển thị cho độc giả
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bản nháp (Draft)</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">{draftPosts}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Đang biên tập / Chưa đăng
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng lượt xem</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalViews.toLocaleString("vi-VN")}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              Từ Facebook & Direct
            </p>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Bài viết gần đây</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Danh sách các bài viết mới nhất trong hệ thống
            </p>
          </div>

          <Link
            href="/admin/posts"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Bài viết</th>
                <th className="py-3.5 px-4">Chuyên mục</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Lượt xem</th>
                <th className="py-3.5 px-4">Ngày tạo</th>
                <th className="py-3.5 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Chưa có bài viết nào trong hệ thống.
                  </td>
                </tr>
              ) : (
                recentPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div className="relative w-12 h-8 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="max-w-md">
                          <p className="font-medium text-slate-200 truncate">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">
                            /posts/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {post.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {post.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Đã xuất bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Bản nháp
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                      {post.views}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                        >
                          Sửa
                        </Link>
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Xem trước bài viết"
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
