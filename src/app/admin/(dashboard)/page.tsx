import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { FileEdit, BookOpen, Layers, Eye, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tổng quan Quản trị | FinPulse",
  description: "Trang tổng quan hệ thống và số liệu đọc tuần của FinPulse",
};

export default async function AdminDashboardPage() {
  const session = await auth();
  const userName = session?.user?.name || "Minh Anh";

  // Query real data from Prisma
  const [
    publishedCount,
    draftCount,
    categoryCount,
    viewsAggregate,
    drafts,
    topPosts,
  ] = await Promise.all([
    prisma.post.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.post.count({ where: { status: "DRAFT" } }).catch(() => 0),
    prisma.category.count().catch(() => 0),
    prisma.post
      .aggregate({ _sum: { views: true } })
      .catch(() => ({ _sum: { views: 0 } })),
    prisma.post
      .findMany({
        where: { status: "DRAFT" },
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        take: 5,
      })
      .catch(() => []),
    prisma.post
      .findMany({
        where: { status: "PUBLISHED" },
        include: { category: true },
        orderBy: { views: "desc" },
        take: 5,
      })
      .catch(() => []),
  ]);

  const totalViews = viewsAggregate._sum.views || 0;

  // Format current date in Vietnamese
  const now = new Date();
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayName = daysOfWeek[now.getDay()];
  const dateStr = `${dayName}, ${now.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })}`;

  const currentHour = now.getHours();
  let greetingTime = "buổi sáng";
  if (currentHour >= 12 && currentHour < 18) {
    greetingTime = "buổi chiều";
  } else if (currentHour >= 18 || currentHour < 5) {
    greetingTime = "buổi tối";
  }

  const stats = [
    {
      label: "Bài đã xuất bản",
      value: publishedCount.toLocaleString("vi-VN"),
      note: publishedCount > 0 ? "Đang hiển thị công khai" : "Chưa có bài nào",
      noteColor: publishedCount > 0 ? "#059669" : "#6B7280",
    },
    {
      label: "Bản nháp",
      value: draftCount.toLocaleString("vi-VN"),
      note: draftCount > 0 ? `${draftCount} bài đang biên tập` : "Không có bản nháp",
      noteColor: draftCount > 0 ? "#D97706" : "#6B7280",
    },
    {
      label: "Tổng lượt đọc",
      value: totalViews.toLocaleString("vi-VN"),
      note: "Số liệu thực tế",
      noteColor: "#1E40AF",
    },
    {
      label: "Chuyên mục",
      value: categoryCount.toLocaleString("vi-VN"),
      note: "Danh mục phân loại",
      noteColor: "#059669",
    },
  ];

  const formatRelativeTime = (d: Date) => {
    try {
      const diffMs = Date.now() - new Date(d).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "vừa xong";
      if (diffHours < 24) return `${diffHours} giờ trước`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} ngày trước`;
      return new Date(d).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    } catch {
      return "gần đây";
    }
  };

  return (
    <div
      data-screen-label="05 Tổng quan"
      className="max-w-[1080px] flex flex-col gap-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[26px] font-bold text-[#111827]">
          Chào {greetingTime}, {userName}
        </h1>
        <p className="m-0 text-[15px] text-[#6B7280]">
          {dateStr} ·{" "}
          {draftCount > 0
            ? `${draftCount} bản nháp đang chờ bạn hoàn thiện.`
            : publishedCount > 0
            ? "Tất cả bài viết đã được xuất bản."
            : "Hệ thống sẵn sàng để bắt đầu viết bài mới."}
        </p>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-white border border-[#E5E7EB] rounded-[4px] shadow-sm">
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className={`p-4.5 sm:p-5 flex flex-col gap-1 ${
              idx < stats.length - 1 ? "border-r border-[#E5E7EB]" : ""
            }`}
          >
            <span className="text-[13px] text-[#6B7280]">{s.label}</span>
            <span className="text-[28px] font-bold tabular-nums text-[#111827] leading-tight">
              {s.value}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: s.noteColor }}
            >
              {s.note}
            </span>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Drafts & Top Views */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Bản nháp của bạn */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] shadow-sm flex flex-col">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#E5E7EB]">
            <strong className="text-[15px] text-[#111827] flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-[#4B5563]" />
              <span>Bản nháp của bạn</span>
            </strong>
            <Link
              href="/admin/posts"
              className="text-[14px] text-[#1E40AF] hover:underline"
            >
              Tất cả bài viết
            </Link>
          </div>

          <div className="flex flex-col flex-1 min-h-[180px]">
            {drafts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center m-auto gap-2">
                <FileEdit className="w-8 h-8 text-[#9CA3AF] stroke-[1.5]" />
                <p className="m-0 text-[14px] text-[#6B7280]">
                  Hiện không có bản nháp nào đang xử lý.
                </p>
                <Link
                  href="/admin/posts/new"
                  className="mt-1 text-[13px] font-semibold text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Soạn bài mới ngay</span>
                </Link>
              </div>
            ) : (
              drafts.map((d) => (
                <Link
                  key={d.id}
                  href={`/admin/posts/edit/${d.id}`}
                  className="flex flex-col gap-1 px-5 py-3.5 border-b border-[#F3F4F6] last:border-none text-[#111827] hover:bg-[#F9FAFB] transition-colors no-underline group"
                >
                  <span className="text-[15px] font-semibold group-hover:text-[#1E40AF] line-clamp-1">
                    {d.title}
                  </span>
                  <span className="text-[13px] text-[#6B7280]">
                    {d.category?.name || "Chưa phân loại"} · Sửa {formatRelativeTime(d.updatedAt)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right: Đọc nhiều nhất */}
        <div className="bg-white border border-[#E5E7EB] rounded-[4px] shadow-sm flex flex-col">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#E5E7EB]">
            <strong className="text-[15px] text-[#111827] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#4B5563]" />
              <span>Đọc nhiều nhất</span>
            </strong>
            <span className="text-[13px] text-[#6B7280]">Lượt xem</span>
          </div>

          <div className="flex flex-col flex-1 min-h-[180px]">
            {topPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center m-auto gap-2">
                <BookOpen className="w-8 h-8 text-[#9CA3AF] stroke-[1.5]" />
                <p className="m-0 text-[14px] text-[#6B7280]">
                  Chưa có bài viết nào được xuất bản.
                </p>
                <Link
                  href="/admin/posts/new"
                  className="mt-1 text-[13px] font-semibold text-[#1E40AF] hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tạo bài viết đầu tiên</span>
                </Link>
              </div>
            ) : (
              topPosts.map((t) => (
                <Link
                  key={t.id}
                  href={`/posts/${t.slug}`}
                  target="_blank"
                  className="flex justify-between items-center gap-4 px-5 py-3.5 border-b border-[#F3F4F6] last:border-none text-[14px] text-[#111827] hover:bg-[#F9FAFB] transition-colors no-underline group"
                >
                  <span className="font-medium text-[#111827] group-hover:text-[#1E40AF] leading-[1.4] line-clamp-1">
                    {t.title}
                  </span>
                  <span className="tabular-nums font-semibold text-[#111827] shrink-0">
                    {t.views.toLocaleString("vi-VN")}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
