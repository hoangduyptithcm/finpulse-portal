"use client";

interface MarketItem {
  name: string;
  value: string;
  change: string;
  isUp: boolean;
}

const MARKET_DATA: MarketItem[] = [
  { name: "VN-Index", value: "1.292,40", change: "+0,67%", isUp: true },
  { name: "VN30", value: "1.335,20", change: "+0,84%", isUp: true },
  { name: "HNX", value: "238,15", change: "-0,19%", isUp: false },
  { name: "Bitcoin", value: "97.420", change: "+3,85%", isUp: true },
  { name: "Ethereum", value: "2.890", change: "+2,40%", isUp: true },
];

export default function MarketTickerBar() {
  return (
    <div className="bg-white border-b border-[#E5E7EB] text-[13px] overflow-x-auto scrollbar-none">
      <div className="max-w-[1240px] mx-auto px-6 py-2.5 flex items-center gap-7 whitespace-nowrap">
        {MARKET_DATA.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 font-medium">
            <span className="font-semibold text-[#111827]">{item.name}</span>
            <span className="text-[#374151] tabular-nums">{item.value}</span>
            <span
              className={`font-semibold tabular-nums text-[12px] ${
                item.isUp ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
