"use client";

import { useState } from "react";
import { BarChart3, LineChart, Table2, Info } from "lucide-react";

interface FinancialYearData {
  period: string;
  revenue: number; // nghìn tỷ đ
  profit: number; // nghìn tỷ đ
  grossMargin: number; // %
  netMargin: number; // %
}

const DEFAULT_VCB_DATA: FinancialYearData[] = [
  { period: "2021", revenue: 56.8, profit: 21.9, grossMargin: 48.2, netMargin: 38.5 },
  { period: "2022", revenue: 68.2, profit: 29.9, grossMargin: 49.5, netMargin: 43.8 },
  { period: "2023", revenue: 74.5, profit: 33.1, grossMargin: 47.8, netMargin: 44.4 },
  { period: "2024", revenue: 81.3, profit: 35.8, grossMargin: 48.5, netMargin: 44.0 },
  { period: "2025", revenue: 89.6, profit: 41.2, grossMargin: 49.1, netMargin: 45.9 },
  { period: "2026 (KH)", revenue: 98.0, profit: 45.5, grossMargin: 49.8, netMargin: 46.4 },
];

interface InteractiveFinancialChartsProps {
  data?: FinancialYearData[];
  title?: string;
  subtitle?: string;
  unit?: string;
}

export default function InteractiveFinancialCharts({
  data = DEFAULT_VCB_DATA,
  title = "Tăng trưởng Doanh thu & Lợi nhuận trước thuế (2021 - 2026)",
  subtitle = "Số liệu kiểm toán hợp nhất (Đơn vị: Nghìn tỷ đồng)",
  unit = "nghìn tỷ đ",
}: InteractiveFinancialChartsProps) {
  const [activeTab, setActiveTab] = useState<"bar" | "line" | "table">("bar");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Maximum value for scaling the bar chart
  const maxRevenue = Math.max(...data.map((d) => d.revenue)) * 1.15;

  return (
    <figure className="m-0 my-6 bg-[#F9FAFB] border border-[#111827] rounded-[3px] p-5 sm:p-6 flex flex-col gap-4 font-sans shadow-[4px_4px_0_#111827]">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#E5E7EB]">
        <div>
          <strong className="text-[17px] text-[#111827] block">
            {title}
          </strong>
          <span className="text-[13px] text-[#6B7280]">
            {subtitle}
          </span>
        </div>

        {/* Tab switch buttons */}
        <div className="flex items-center bg-white border border-[#D1D5DB] rounded p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("bar")}
            className={`px-3 py-1 text-[13px] font-semibold flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === "bar"
                ? "bg-[#111827] text-white"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Cột Doanh thu / Lợi nhuận
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("line")}
            className={`px-3 py-1 text-[13px] font-semibold flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === "line"
                ? "bg-[#111827] text-white"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            Biên lợi nhuận (%)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("table")}
            className={`px-3 py-1 text-[13px] font-semibold flex items-center gap-1.5 rounded-xs transition-colors cursor-pointer ${
              activeTab === "table"
                ? "bg-[#111827] text-white"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            Bảng số liệu
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE GROUPED BAR CHART */}
      {activeTab === "bar" && (
        <div className="flex flex-col gap-3">
          {/* Legend */}
          <div className="flex items-center justify-between text-[12px] text-[#4B5563]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#1E40AF] rounded-xs" />
                Tổng thu nhập hoạt động (Doanh thu)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#0A7A45] rounded-xs" />
                Lợi nhuận trước thuế
              </span>
            </div>
            <span className="text-[#9CA3AF] text-[11px] hidden sm:inline">
              Rê chuột vào cột để xem chi tiết
            </span>
          </div>

          {/* Chart Canvas */}
          <div className="h-[240px] flex items-end justify-between gap-2 sm:gap-6 pt-8 pb-1 border-b-2 border-[#111827] relative">
            {data.map((item, idx) => {
              const revHeight = (item.revenue / maxRevenue) * 100;
              const profHeight = (item.profit / maxRevenue) * 100;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={item.period}
                  className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Tooltip on hover */}
                  {isHovered && (
                    <div className="absolute -top-14 z-30 bg-[#111827] text-white text-[12px] p-2.5 rounded shadow-lg whitespace-nowrap flex flex-col gap-0.5 animate-in fade-in zoom-in-95 pointer-events-none">
                      <span className="font-bold text-[#93C5FD]">Năm {item.period}</span>
                      <span>Doanh thu: <strong>{item.revenue}</strong> {unit}</span>
                      <span>Lợi nhuận: <strong>{item.profit}</strong> {unit}</span>
                      <span className="text-[11px] text-[#86EFAC]">
                        Biên ròng: {item.netMargin}%
                      </span>
                    </div>
                  )}

                  {/* Dual Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Revenue Bar */}
                    <div
                      className={`w-full max-w-[28px] rounded-t-xs transition-all duration-300 ${
                        isHovered ? "bg-[#3B82F6]" : "bg-[#1E40AF]"
                      }`}
                      style={{ height: `${revHeight}%` }}
                    />
                    {/* Profit Bar */}
                    <div
                      className={`w-full max-w-[28px] rounded-t-xs transition-all duration-300 ${
                        isHovered ? "bg-[#10B981]" : "bg-[#0A7A45]"
                      }`}
                      style={{ height: `${profHeight}%` }}
                    />
                  </div>

                  {/* Top value badge on desktop */}
                  <span className="text-[11px] font-mono text-[#6B7280] hidden sm:block pt-1">
                    {item.profit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* X-Axis labels */}
          <div className="flex justify-between gap-2 sm:gap-6">
            {data.map((item, idx) => (
              <span
                key={item.period}
                className={`flex-1 text-center text-[13px] font-semibold transition-colors ${
                  hoveredIdx === idx ? "text-[#1E40AF]" : "text-[#4B5563]"
                }`}
              >
                {item.period}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE LINE CHART (MARGINS) */}
      {activeTab === "line" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[12px] text-[#4B5563]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#1E40AF]" />
                Biên lãi thuần / gộp (%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#0A7A45]" />
                Biên lợi nhuận ròng (%)
              </span>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Tỷ lệ sinh lời trên mỗi 100 đồng doanh thu
            </span>
          </div>

          {/* SVG Line Canvas */}
          <div className="relative h-[220px] bg-white border border-[#E5E7EB] rounded p-4 pt-6">
            <svg
              viewBox="0 0 600 180"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[30, 40, 50].map((val) => {
                const y = 160 - ((val - 20) / 40) * 140;
                return (
                  <g key={val}>
                    <line
                      x1="0"
                      y1={y}
                      x2="600"
                      y2={y}
                      stroke="#F3F4F6"
                      strokeDasharray="4 4"
                    />
                    <text x="5" y={y - 4} fontSize="10" fill="#9CA3AF">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Line 1: Gross Margin */}
              <polyline
                fill="none"
                stroke="#1E40AF"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data
                  .map((d, i) => {
                    const x = (i / (data.length - 1)) * 560 + 20;
                    const y = 160 - ((d.grossMargin - 20) / 40) * 140;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Line 2: Net Margin */}
              <polyline
                fill="none"
                stroke="#0A7A45"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={data
                  .map((d, i) => {
                    const x = (i / (data.length - 1)) * 560 + 20;
                    const y = 160 - ((d.netMargin - 20) / 40) * 140;
                    return `${x},${y}`;
                  })
                  .join(" ")}
              />

              {/* Data points */}
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * 560 + 20;
                const yGross = 160 - ((d.grossMargin - 20) / 40) * 140;
                const yNet = 160 - ((d.netMargin - 20) / 40) * 140;

                return (
                  <g key={d.period}>
                    <circle cx={x} cy={yGross} r="5" fill="#1E40AF" stroke="#fff" strokeWidth="2" />
                    <text x={x} y={yGross - 8} fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1E40AF">
                      {d.grossMargin}%
                    </text>

                    <circle cx={x} cy={yNet} r="5" fill="#0A7A45" stroke="#fff" strokeWidth="2" />
                    <text x={x} y={yNet + 18} fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0A7A45">
                      {d.netMargin}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex justify-between px-3 text-[13px] text-[#4B5563] font-semibold">
            {data.map((d) => (
              <span key={d.period}>{d.period}</span>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: TABLE VIEW */}
      {activeTab === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px] border-collapse bg-white border border-[#E5E7EB] tabular-nums">
            <thead>
              <tr className="bg-[#F3F4F6] text-[#374151] border-b border-[#E5E7EB]">
                <th className="p-3 font-bold">Kỳ báo cáo</th>
                <th className="p-3 font-bold text-right">Doanh thu ({unit})</th>
                <th className="p-3 font-bold text-right">Lợi nhuận trước thuế</th>
                <th className="p-3 font-bold text-right">Biên gộp/NIM (%)</th>
                <th className="p-3 font-bold text-right">Biên lợi nhuận ròng</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.period} className="border-b border-[#E5E7EB] hover:bg-gray-50">
                  <td className="p-3 font-bold text-[#111827]">{row.period}</td>
                  <td className="p-3 text-right font-medium">{row.revenue.toLocaleString("vi-VN")}</td>
                  <td className="p-3 text-right font-bold text-[#0A7A45]">{row.profit.toLocaleString("vi-VN")}</td>
                  <td className="p-3 text-right text-[#1E40AF] font-semibold">{row.grossMargin}%</td>
                  <td className="p-3 text-right font-semibold">{row.netMargin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Caption note */}
      <figcaption className="text-[12px] text-[#6B7280] flex items-center gap-1.5 pt-1 border-t border-[#E5E7EB]">
        <Info className="w-3.5 h-3.5 text-[#9CA3AF]" />
        Biểu đồ do Nhịp đập tài chính dựng từ BCTC kiểm toán công bố. Bạn có thể chuyển sang chế độ &quot;Bảng số liệu&quot; để đối chiếu chi tiết.
      </figcaption>
    </figure>
  );
}
