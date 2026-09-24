"use client";

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: "VN-Index", price: "1.292,40", change: "+0,67%", isUp: true },
  { symbol: "VN30", price: "1.335,20", change: "+0,84%", isUp: true },
  { symbol: "HNX", price: "238,15", change: "-0,19%", isUp: false },
  { symbol: "Bitcoin", price: "97.420", change: "+3,85%", isUp: true },
  { symbol: "Ethereum", price: "2.890", change: "+2,40%", isUp: true },
];

export default function MarketTicker() {
  return (
    <div className="border-b border-stone-200 bg-stone-50/60 text-xs text-stone-700 py-1.5 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-6 sm:space-x-8 text-[11px] whitespace-nowrap">
        {DEFAULT_TICKERS.map((t, idx) => (
          <div key={idx} className="flex items-center space-x-1.5 shrink-0">
            <span className="font-semibold text-stone-900">{t.symbol}</span>
            <span className="font-mono text-stone-700">{t.price}</span>
            <span
              className={`font-mono font-medium ${
                t.isUp ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {t.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
