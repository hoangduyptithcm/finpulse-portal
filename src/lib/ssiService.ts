import { MARKET_CONFIG } from "@/config/market";

export interface SsiStockData {
  ticker: string;
  companyNameVi: string;
  companyNameEn: string;
  exchange: "HOSE" | "HNX" | "UPCOM";
  matchedPrice: number;
  priceFormatted: string;
  priceChange: number;
  changeFormatted: string;
  priceChangePercent: number;
  changePercentFormatted: string;
  isPositive: boolean;
  refPrice: number;
  refPriceFormatted: string;
  ceiling: number;
  ceilingFormatted: string;
  floor: number;
  floorFormatted: string;
  highest: number;
  highestFormatted: string;
  lowest: number;
  lowestFormatted: string;
  openPrice: number;
  openPriceFormatted: string;
  avgPrice: number;
  volume: number;
  volumeFormatted: string;
  totalValue: number;
  totalValueFormatted: string;
  foreignBuy: number;
  foreignSell: number;
  foreignRoom: number;
  tradingDate: string;
  source: "Realtime Market Stream" | "Offline Snapshot";
}

function formatCurrency(amount: number): string {
  if (!amount || isNaN(amount)) return "--";
  return amount.toLocaleString("vi-VN") + " đ";
}

function formatVolume(vol: number): string {
  if (!vol || isNaN(vol)) return "--";
  if (vol >= 1_000_000) {
    return (vol / 1_000_000).toFixed(2).replace(".", ",") + "M cp";
  }
  return vol.toLocaleString("vi-VN") + " cp";
}

function formatValueBillion(val: number): string {
  if (!val || isNaN(val)) return "--";
  const billions = val / 1_000_000_000;
  return billions.toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tỷ đ";
}

/**
 * Fetches real-time stock quote and company details from configured market feed.
 * Endpoint is retrieved dynamically from MARKET_CONFIG.rest.tickerEndpoint.
 */
export async function fetchSsiStockData(tickerParam: string): Promise<SsiStockData | null> {
  const ticker = tickerParam.toUpperCase().trim();
  const baseUrl = (MARKET_CONFIG.rest.tickerEndpoint || "").replace(/\/+$/, "");
  if (!baseUrl) {
    return null;
  }
  const url = `${baseUrl}/${ticker}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 30 }, // Cache on server for 30s
      signal: AbortSignal.timeout(4000), // 4s timeout
    });

    if (!res.ok) {
      console.warn(`[Market Quote API] Non-200 status ${res.status} for ticker ${ticker}`);
      return null;
    }

    const json = await res.json();
    if (json.code !== "SUCCESS" || !json.data) {
      return null;
    }

    const d = json.data;
    const price = d.matchedPrice || d.refPrice || 0;
    const change = typeof d.priceChange === "number" ? d.priceChange : 0;
    const changePercent = typeof d.priceChangePercent === "number" ? d.priceChangePercent : 0;
    const isPositive = change >= 0;

    const exchangeUpper = (d.exchange || "HOSE").toUpperCase();
    const exchange =
      exchangeUpper === "HNX" ? "HNX" : exchangeUpper === "UPCOM" ? "UPCOM" : "HOSE";

    return {
      ticker: d.stockSymbol || ticker,
      companyNameVi: d.companyNameVi || d.clientName || `Công ty Cổ phần ${ticker}`,
      companyNameEn: d.companyNameEn || d.clientNameEn || "",
      exchange,
      matchedPrice: price,
      priceFormatted: formatCurrency(price),
      priceChange: change,
      changeFormatted: `${change > 0 ? "+" : ""}${change.toLocaleString("vi-VN")} đ`,
      priceChangePercent: changePercent,
      changePercentFormatted: `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
      isPositive,
      refPrice: d.refPrice || 0,
      refPriceFormatted: formatCurrency(d.refPrice),
      ceiling: d.ceiling || 0,
      ceilingFormatted: formatCurrency(d.ceiling),
      floor: d.floor || 0,
      floorFormatted: formatCurrency(d.floor),
      highest: d.highest || price,
      highestFormatted: formatCurrency(d.highest || price),
      lowest: d.lowest || price,
      lowestFormatted: formatCurrency(d.lowest || price),
      openPrice: d.openPrice || price,
      openPriceFormatted: formatCurrency(d.openPrice || price),
      avgPrice: d.avgPrice || price,
      volume: d.stockVol || d.nmTotalTradedQty || 0,
      volumeFormatted: formatVolume(d.stockVol || d.nmTotalTradedQty || 0),
      totalValue: d.nmTotalTradedValue || 0,
      totalValueFormatted: formatValueBillion(d.nmTotalTradedValue || 0),
      foreignBuy: d.buyForeignQtty || 0,
      foreignSell: d.sellForeignQtty || 0,
      foreignRoom: d.remainForeignQtty || 0,
      tradingDate: d.tradingDate || "",
      source: "Realtime Market Stream",
    };
  } catch (error) {
    console.error(`[Market Quote API] Failed to fetch data for ${ticker}:`, error);
    return null;
  }
}

// Aliases for modern naming
export const fetchStockQuoteData = fetchSsiStockData;
export type StockQuoteData = SsiStockData;
