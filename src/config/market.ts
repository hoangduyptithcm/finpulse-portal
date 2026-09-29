/**
 * Cấu hình hệ thống dữ liệu luồng thị trường Realtime (Market Stream Config)
 * Đọc trực tiếp từ 4 biến môi trường (.env / .env.local).
 * Tuyệt đối không hardcode endpoint hay credentials trong source code để bảo mật 100% trên Git.
 */

export const MARKET_CONFIG = {
  // 1. Luồng dữ liệu thị trường chứng khoán (Đọc từ 3 biến môi trường)
  stockStream: {
    streamUrl:
      process.env.NEXT_PUBLIC_MARKET_STREAM_URL ||
      process.env.NEXT_PUBLIC_STOCK_STREAM_URL ||
      "",
    streamUser:
      process.env.NEXT_PUBLIC_MARKET_STREAM_USER ||
      process.env.NEXT_PUBLIC_STOCK_STREAM_USER ||
      "",
    streamKey:
      process.env.NEXT_PUBLIC_MARKET_STREAM_KEY ||
      process.env.NEXT_PUBLIC_STOCK_STREAM_KEY ||
      "",
    streamProtocol: "mqtt",
    streamTopics: [
      "i/VNINDEX",
      "i/VN30",
      "i/HNXIndex",
    ],
    heartbeatMs: 30000,   // Heartbeat định kỳ 30s
    retryDelayMs: 5000,   // Thử lại khi kết nối gián đoạn
  },

  // Alias tương thích ngược
  get domesticFeed() {
    return this.stockStream;
  },

  // 2. Luồng dữ liệu Crypto quốc tế (Đọc từ biến môi trường thứ 4)
  cryptoFeed: {
    streamUrl:
      process.env.NEXT_PUBLIC_CRYPTO_STREAM_URL ||
      process.env.NEXT_PUBLIC_CRYPTO_FEED_URL ||
      "",
    retryDelayMs: 3000,
  },

  // 3. Cấu hình REST snapshot dự phòng & cache server
  rest: {
    cacheTtlMs: 30000,
    stockIndicesUrl:
      process.env.DOMESTIC_INDICES_API_URL ||
      "https://msh-datacenter.cafef.vn/price/api/v1/CompanyCompac/RealTimeChartHeader?index=1;2;11",
    cryptoIndicesUrl:
      process.env.CRYPTO_INDICES_API_URL ||
      'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]',
    get stockEndpoint() {
      return this.stockIndicesUrl;
    },
    get cryptoEndpoint() {
      return this.cryptoIndicesUrl;
    },
  },
};
