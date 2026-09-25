import Link from "next/link";
import { ADMIN_OVERVIEW_DATA } from "@/data/portalData";

export const metadata = {
  title: "Tổng quan Quản trị | FinPulse",
  description: "Trang tổng quan hệ thống và số liệu đọc tuần của FinPulse",
};

export default function AdminDashboardPage() {
  const { stats, drafts, topWeek } = ADMIN_OVERVIEW_DATA;

  return (
    <div
      data-screen-label="05 Tổng quan"
      className="max-w-[1080px] flex flex-col gap-8"
    >
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="m-0 text-[26px] font-bold text-[#16181D]">
          Chào buổi sáng, Minh Anh
        </h1>
        <p className="m-0 text-[15px] text-[#5E636B]">
          Thứ Năm, 24/09/2026 · 2 bản nháp đang chờ bạn hoàn thiện.
        </p>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 bg-[#FCFBF8] border border-[#E3E1DC]">
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className={`p-4.5 sm:p-5 flex flex-col gap-1 ${
              idx < stats.length - 1 ? "border-r border-[#E3E1DC]" : ""
            }`}
          >
            <span className="text-[13px] text-[#5E636B]">{s.label}</span>
            <span className="text-[28px] font-bold tabular-nums text-[#16181D] leading-tight">
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
        <div className="bg-[#FCFBF8] border border-[#E3E1DC] rounded-[2px]">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#E3E1DC]">
            <strong className="text-[15px] text-[#16181D]">
              Bản nháp của bạn
            </strong>
            <Link
              href="/admin/posts"
              className="text-[14px] text-[#133A63] hover:underline"
            >
              Tất cả
            </Link>
          </div>
          <div className="flex flex-col">
            {drafts.map((d) => (
              <Link
                key={d.title}
                href="/admin/posts/new"
                className="flex flex-col gap-1 px-5 py-3.5 border-b border-[#EFEDE8] last:border-none text-[#16181D] hover:bg-[#F1EEE8] transition-colors no-underline group"
              >
                <span className="text-[15px] font-semibold group-hover:text-[#133A63]">
                  {d.title}
                </span>
                <span className="text-[13px] text-[#5E636B]">
                  {d.cat} · Sửa lần cuối {d.time}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Đọc nhiều 7 ngày qua */}
        <div className="bg-[#FCFBF8] border border-[#E3E1DC] rounded-[2px]">
          <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#E3E1DC]">
            <strong className="text-[15px] text-[#16181D]">
              Đọc nhiều 7 ngày qua
            </strong>
            <span className="text-[13px] text-[#5E636B]">Lượt xem</span>
          </div>
          <div className="flex flex-col">
            {topWeek.map((t) => (
              <div
                key={t.title}
                className="flex justify-between items-center gap-4 px-5 py-3 border-b border-[#EFEDE8] last:border-none text-[14px]"
              >
                <span className="font-medium text-[#16181D] leading-[1.4]">
                  {t.title}
                </span>
                <span className="tabular-nums font-semibold text-[#16181D]">
                  {t.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
