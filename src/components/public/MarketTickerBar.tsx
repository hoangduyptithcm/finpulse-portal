"use client";

import { useMarketRealtime } from "@/hooks/useMarketRealtime";

export default function MarketTickerBar() {
  const { tickerItems, isSocketConnected, updatedAt } = useMarketRealtime();

  return (
    <div className="bg-white border-b border-[#E5E7EB] text-[13px] overflow-x-auto scrollbar-none">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-6 whitespace-nowrap">
        <div className="flex items-center gap-7">
          {tickerItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-1.5 font-medium px-1.5 py-0.5 rounded transition-all duration-300 ${
                item.flash === "up"
                  ? "bg-emerald-50 ring-1 ring-emerald-300"
                  : item.flash === "down"
                  ? "bg-rose-50 ring-1 ring-rose-300"
                  : ""
              }`}
            >
              <span className="font-semibold text-[#111827]">{item.name}</span>
              <span className="tabular-nums font-semibold text-[#111827]">
                {item.value}
              </span>
              <span
                className={`font-semibold tabular-nums text-[12px] px-1 py-0.2 rounded ${
                  item.isUp
                    ? "text-[#16A34A] bg-emerald-50"
                    : "text-[#DC2626] bg-rose-50"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Realtime</span>
          </div>
          {updatedAt && (
            <span className="text-[11px] text-[#9CA3AF] tabular-nums">
              {updatedAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
