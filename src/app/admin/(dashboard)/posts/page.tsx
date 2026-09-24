import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import DeletePostButton from "./DeletePostButton";
import {
  Plus,
  FileText,
  ArrowUpRight,
  Edit,
  Sparkles,
  Layers,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản lý Bài viết | FinPulse Admin",
};

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" />
            <span>Quản lý Bài viết ({posts.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Danh sách tất cả bài viết, tin tức thị trường và kiến thức đầu tư
          </p>
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Viết bài mới</span>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
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
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Chưa có bài viết nào. Hãy bấm &quot;Viết bài mới&quot; để bắt đầu!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <div className="relative w-14 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div className="max-w-md">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-200 truncate">
                              {post.title}
                            </p>
                            {post.featured && (
                              <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                                <Sparkles className="w-2.5 h-2.5" />
                                Tiêu điểm
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                            /posts/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {post.category?.name || "Chưa phân loại"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
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
                    <td className="py-4 px-4 text-center font-mono text-slate-300">
                      {post.views}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/posts/edit/${post.id}`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Chỉnh sửa bài viết"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
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
