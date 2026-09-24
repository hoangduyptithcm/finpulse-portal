"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: "BTC/USDT", name: "Bitcoin", price: "$97,420", change: "+3.85%", isUp: true },
  { symbol: "VN-INDEX", name: "VN-Index", price: "1,292.40", change: "+8.65 pt", isUp: true },
  { symbol: "ETH/USDT", name: "Ethereum", price: "$2,890", change: "+2.40%", isUp: true },
  { symbol: "VN30", name: "VN30-Index", price: "1,335.20", change: "+11.10 pt", isUp: true },
  { symbol: "SOL/USDT", name: "Solana", price: "$204.50", change: "+6.12%", isUp: true },
  { symbol: "HNX-INDEX", name: "HNX-Index", price: "238.15", change: "-0.45 pt", isUp: false },
  { symbol: "BNB/USDT", name: "BNB", price: "$645.00", change: "+1.75%", isUp: true },
  { symbol: "VND/USD", name: "Tỷ giá", price: "25,480", change: "+0.05%", isUp: true },
];

export default function MarketTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS);

  // Optional: fetch real live crypto prices from CoinGecko API in client
  useEffect(() => {
    async function fetchCrypto() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin&vs_currencies=usd&include_24hr_change=true"
        );
        if (!res.ok) return;
        const data = await res.json();

        setTickers((prev) =>
          prev.map((item) => {
            if (item.symbol === "BTC/USDT" && data.bitcoin) {
              const change = data.bitcoin.usd_24h_change || 0;
              return {
                ...item,
                price: `$${data.bitcoin.usd.toLocaleString("en-US")}`,
                change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
                isUp: change >= 0,
              };
            }
            if (item.symbol === "ETH/USDT" && data.ethereum) {
              const change = data.ethereum.usd_24h_change || 0;
              return {
                ...item,
                price: `$${data.ethereum.usd.toLocaleString("en-US")}`,
                change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
                isUp: change >= 0,
              };
            }
            if (item.symbol === "SOL/USDT" && data.solana) {
              const change = data.solana.usd_24h_change || 0;
              return {
                ...item,
                price: `$${data.solana.usd.toLocaleString("en-US")}`,
                change: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
                isUp: change >= 0,
              };
            }
            return item;
          })
        );
      } catch {
        // Fallback gracefully to default values if API limit reached
      }
    }

    fetchCrypto();
  }, []);

  return (
    <div className="border-b border-slate-800/80 bg-slate-950/90 text-slate-200 text-xs overflow-hidden select-none">
      <div className="flex items-center">
        {/* Live Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 text-emerald-400 border-r border-slate-800/80 font-bold text-[11px] z-10">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="hidden sm:inline">THỊ TRƯỜNG</span>
          <span className="sm:hidden">LIVE</span>
        </div>

        {/* Ticker marquee / flex items */}
        <div className="flex overflow-x-auto no-scrollbar divide-x divide-slate-800/60 py-2">
          {tickers.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 whitespace-nowrap shrink-0 hover:bg-slate-900/60 transition-colors"
            >
              <span className="font-semibold text-slate-300 text-[11px]">
                {t.symbol}
              </span>
              <span className="font-mono text-white text-[12px]">{t.price}</span>
              <span
                className={`flex items-center text-[10px] font-bold font-mono px-1 rounded ${
                  t.isUp
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-rose-400 bg-rose-500/10"
                }`}
              >
                {t.isUp ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
