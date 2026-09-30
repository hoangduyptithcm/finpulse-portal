"use client";

import { useMarketRealtime } from "@/hooks/useMarketRealtime";

export default function MarketWatchlist() {
  const { watchList, isSocketConnected, updatedAt } = useMarketRealtime();

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b-2 border-[#111827]">
        <h2 className="m-0 text-[14px] font-bold text-[#111827]">
          Số liệu tôi đang theo dõi
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Realtime</span>
        </div>
      </div>

      <table className="w-full border-collapse text-[14px] tabular-nums">
        <tbody>
          {watchList.map((t) => (
            <tr
              key={t.name}
              className={`transition-colors duration-300 ${
                t.flash === "up"
                  ? "bg-emerald-50/70"
                  : t.flash === "down"
                  ? "bg-rose-50/70"
                  : "hover:bg-gray-50/60"
              }`}
            >
              <td className="py-[9px] border-b border-[#E5E7EB] font-semibold text-[#111827]">
                {t.name}
              </td>
              <td className="py-[9px] border-b border-[#E5E7EB] text-right font-semibold text-[#111827]">
                {t.value}
              </td>
              <td
                className="py-[9px] pl-2.5 border-b border-[#E5E7EB] text-right w-[64px] font-semibold text-[13px]"
                style={{ color: t.color }}
              >
                {t.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <span className="mt-2 text-[12px] text-[#6B7280] leading-[1.5]">
        Dữ liệu thị trường cập nhật thời gian thực (Realtime WebSocket).
      </span>
    </div>
  );
}
