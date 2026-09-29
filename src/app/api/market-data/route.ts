import { NextResponse } from "next/server";
import { MARKET_CONFIG } from "@/config/market";

export const dynamic = "force-dynamic";

interface CacheState {
  data: any;
  timestamp: number;
}

let cachedMarketData: CacheState | null = null;
const CACHE_TTL_MS = MARKET_CONFIG.rest.cacheTtlMs;

function formatVN(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

function formatPercent(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2).replace(".", ",")}%`;
}

// Fallback baseline in case external APIs fail or are unreachable
const FALLBACK_DATA = {
  updatedAt: "15:05",
  source: "Realtime Market Stream",
  tickerItems: [
    { name: "VN-Index", value: "1.777,73", change: "-0,17%", isUp: false },
    { name: "VN30", value: "1.914,35", change: "-0,42%", isUp: false },
    { name: "HNX", value: "269,91", change: "-0,52%", isUp: false },
    { name: "Bitcoin", value: "$83.900", change: "+0,75%", isUp: true },
    { name: "Ethereum", value: "$2.720", change: "+1,20%", isUp: true },
  ],
  watchList: [
    { name: "VN-Index", value: "1.777,73", change: "-0,17%", color: "#C0271D" },
    { name: "VN30", value: "1.914,35", change: "-0,42%", color: "#C0271D" },
    { name: "HNX-Index", value: "269,91", change: "-0,52%", color: "#C0271D" },
    { name: "Bitcoin", value: "$83.900", change: "+0,75%", color: "#0A7A45" },
    { name: "P/E VN-Index", value: "13,8 lần", change: "", color: "#5E636B" },
    { name: "LS qua đêm", value: "4,2%", change: "", color: "#5E636B" },
  ],
};

async function fetchStockIndices() {
  const res = await fetch(MARKET_CONFIG.rest.stockEndpoint, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(4000),
  });

  if (!res.ok) throw new Error(`Stock API returned ${res.status}`);
  const json = await res.json();

  function parseSeries(key: string, defPrice: number, defChange: number) {
    const series = json?.value?.[key];
    if (Array.isArray(series) && series.length > 0) {
      const last = series[series.length - 1];
      const price = last.data;
      const open = last.openPrice;
      const diff = price - open;
      const pct = open > 0 ? (diff / open) * 100 : 0;
      return {
        value: formatVN(price, 2),
        change: formatPercent(pct),
        isUp: pct >= 0,
      };
    }
    return {
      value: formatVN(defPrice, 2),
      change: formatPercent(defChange),
      isUp: defChange >= 0,
    };
  }

  return {
    source: "Realtime Market Stream",
    vni: parseSeries("RealTimeChartIndexV1:1", 1777.73, -0.17),
    vn30: parseSeries("RealTimeChartIndexV1:11", 1914.35, -0.42),
    hnx: parseSeries("RealTimeChartIndexV1:2", 269.91, -0.52),
  };
}

export async function GET() {
  const now = Date.now();

  // Return cached data if within TTL
  if (cachedMarketData && now - cachedMarketData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedMarketData.data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  }

  try {
    // 1. Fetch VN Stock Indices
    const stockPromise = fetchStockIndices();

    // 2. Fetch Binance Crypto (BTC & ETH)
    const cryptoPromise = fetch(MARKET_CONFIG.rest.cryptoEndpoint, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    })
      .then((res) => (res.ok ? res.json() : null))
      .catch((err) => {
        console.warn("Binance fetch error:", err.message);
        return null;
      });

    const [stockResult, cryptoData] = await Promise.all([stockPromise, cryptoPromise]);

    let btc = { value: "83.900", change: "+0,75%", isUp: true };
    let eth = { value: "2.720", change: "+1,20%", isUp: true };

    if (Array.isArray(cryptoData)) {
      const btcItem = cryptoData.find((d: any) => d.symbol === "BTCUSDT");
      if (btcItem) {
        const price = parseFloat(btcItem.lastPrice);
        const pct = parseFloat(btcItem.priceChangePercent);
        btc = {
          value: formatVN(Math.round(price), 0),
          change: formatPercent(pct),
          isUp: pct >= 0,
        };
      }
      const ethItem = cryptoData.find((d: any) => d.symbol === "ETHUSDT");
      if (ethItem) {
        const price = parseFloat(ethItem.lastPrice);
        const pct = parseFloat(ethItem.priceChangePercent);
        eth = {
          value: formatVN(Math.round(price), 0),
          change: formatPercent(pct),
          isUp: pct >= 0,
        };
      }
    }

    const timeFormatter = new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const updateTimeStr = timeFormatter.format(new Date());

    const result = {
      updatedAt: updateTimeStr,
      source: "Realtime Market Stream",
      tickerItems: [
        { name: "VN-Index", value: stockResult.vni.value, change: stockResult.vni.change, isUp: stockResult.vni.isUp },
        { name: "VN30", value: stockResult.vn30.value, change: stockResult.vn30.change, isUp: stockResult.vn30.isUp },
        { name: "HNX", value: stockResult.hnx.value, change: stockResult.hnx.change, isUp: stockResult.hnx.isUp },
        { name: "Bitcoin", value: `$${btc.value}`, change: btc.change, isUp: btc.isUp },
        { name: "Ethereum", value: `$${eth.value}`, change: eth.change, isUp: eth.isUp },
      ],
      watchList: [
        { name: "VN-Index", value: stockResult.vni.value, change: stockResult.vni.change, color: stockResult.vni.isUp ? "#0A7A45" : "#C0271D" },
        { name: "VN30", value: stockResult.vn30.value, change: stockResult.vn30.change, color: stockResult.vn30.isUp ? "#0A7A45" : "#C0271D" },
        { name: "HNX-Index", value: stockResult.hnx.value, change: stockResult.hnx.change, color: stockResult.hnx.isUp ? "#0A7A45" : "#C0271D" },
        { name: "Bitcoin", value: `$${btc.value}`, change: btc.change, color: btc.isUp ? "#0A7A45" : "#C0271D" },
        { name: "P/E VN-Index", value: "13,8 lần", change: "", color: "#5E636B" },
        { name: "LS qua đêm", value: "4,2%", change: "", color: "#5E636B" },
      ],
    };

    cachedMarketData = {
      data: result,
      timestamp: now,
    };

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("Market data API error:", error);
    if (cachedMarketData) {
      return NextResponse.json(cachedMarketData.data);
    }
    return NextResponse.json(FALLBACK_DATA);
  }
}
