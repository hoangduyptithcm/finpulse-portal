"use client";

import { useEffect, useRef, useState } from "react";
import { MARKET_CONFIG } from "@/config/market";

export interface MarketItem {
  name: string;
  value: string;
  change: string;
  isUp: boolean;
  flash?: "up" | "down" | null;
}

export interface WatchItem {
  name: string;
  value: string;
  change: string;
  color: string;
  flash?: "up" | "down" | null;
}

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

// Protobuf binary decoder for market indices stream
function decodeIndexRealtimeProtobuf(buf: Uint8Array): {
  indexValue?: number;
  change?: number;
  changePercent?: number;
} {
  let pos = 0;
  const result: any = {};

  function readVarint(): number {
    let res = 0;
    let shift = 0;
    while (pos < buf.length) {
      const b = buf[pos++];
      res |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) break;
      shift += 7;
    }
    return res;
  }

  function decodeZigZag(n: number): number {
    return (n >>> 1) ^ -(n & 1);
  }

  while (pos < buf.length) {
    const tag = readVarint();
    const fieldNo = tag >> 3;
    const wireType = tag & 0x07;

    if (wireType === 0) {
      const val = readVarint();
      if (fieldNo === 11) {
        // indexValue (scaled: integer with 3 decimal places e.g. 1777460 / 1000 = 1777.46)
        result.indexValue = val > 50000 ? val / 1000 : val > 10000 ? val / 100 : val;
      } else if (fieldNo === 12) {
        // change (sint32 zigzag, scaled by 1000 or 100)
        const zz = decodeZigZag(val);
        result.change = Math.abs(zz) > 500 ? zz / 1000 : Math.abs(zz) > 50 ? zz / 100 : zz;
      } else if (fieldNo === 13) {
        // changePercent (sint32 zigzag, e.g. 320 / 1000 = 0.32%)
        const zz = decodeZigZag(val);
        result.changePercent = Math.abs(zz) > 100 ? zz / 1000 : Math.abs(zz) > 10 ? zz / 100 : zz;
      }
    } else if (wireType === 1) {
      pos += 8;
    } else if (wireType === 2) {
      const len = readVarint();
      pos += len;
    } else if (wireType === 5) {
      pos += 4;
    } else {
      break;
    }
  }

  return result;
}

// MQTT packet builder helpers
function writeString(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const buf = new Uint8Array(2 + bytes.length);
  buf[0] = (bytes.length >> 8) & 0xff;
  buf[1] = bytes.length & 0xff;
  buf.set(bytes, 2);
  return buf;
}

function concatBuffers(buffers: Uint8Array[]): Uint8Array {
  const totalLen = buffers.reduce((acc, b) => acc + b.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const b of buffers) {
    result.set(b, offset);
    offset += b.length;
  }
  return result;
}

function buildMqttConnectPacket(clientId: string, user: string, pass: string): Uint8Array {
  const protoName = writeString("MQTT");
  const protoLevel = new Uint8Array([0x04]);
  const connectFlags = new Uint8Array([0xc2]); // clean session, user, pass
  const keepAlive = new Uint8Array([0x00, 0x3c]); // 60s
  const pClientId = writeString(clientId);
  const pUser = writeString(user);
  const pPass = writeString(pass);

  const payload = concatBuffers([protoName, protoLevel, connectFlags, keepAlive, pClientId, pUser, pPass]);

  let remLen = payload.length;
  const remBytes: number[] = [];
  do {
    let b = remLen % 128;
    remLen = Math.floor(remLen / 128);
    if (remLen > 0) b |= 128;
    remBytes.push(b);
  } while (remLen > 0);

  const header = new Uint8Array([0x10, ...remBytes]);
  return concatBuffers([header, payload]);
}

function buildMqttSubscribePacket(packetId: number, topics: string[]): Uint8Array {
  const pId = new Uint8Array([(packetId >> 8) & 0xff, packetId & 0xff]);
  const parts: Uint8Array[] = [pId];
  for (const t of topics) {
    parts.push(writeString(t));
    parts.push(new Uint8Array([0x00])); // QoS 0
  }
  const payload = concatBuffers(parts);

  let remLen = payload.length;
  const remBytes: number[] = [];
  do {
    let b = remLen % 128;
    remLen = Math.floor(remLen / 128);
    if (remLen > 0) b |= 128;
    remBytes.push(b);
  } while (remLen > 0);

  const header = new Uint8Array([0x82, ...remBytes]);
  return concatBuffers([header, payload]);
}

function parseMqttPublish(buf: Uint8Array): { topic: string; payload: Uint8Array } | null {
  if (buf.length < 4) return null;
  const packetType = buf[0] >> 4;
  if (packetType !== 3) return null;

  let pos = 1;
  while (pos < buf.length) {
    const byte = buf[pos++];
    if ((byte & 0x80) === 0) break;
  }

  if (pos + 2 > buf.length) return null;
  const topicLen = (buf[pos] << 8) | buf[pos + 1];
  pos += 2;

  if (pos + topicLen > buf.length) return null;
  const topicBytes = buf.subarray(pos, pos + topicLen);
  const topic = new TextDecoder().decode(topicBytes);
  pos += topicLen;

  const qos = (buf[0] >> 1) & 0x03;
  if (qos > 0) pos += 2;

  const payload = buf.subarray(pos);
  return { topic, payload };
}

const DEFAULT_TICKERS: MarketItem[] = [
  { name: "VN-Index", value: "1.777,73", change: "-0,17%", isUp: false },
  { name: "VN30", value: "1.914,35", change: "-0,42%", isUp: false },
  { name: "HNX", value: "269,91", change: "-0,52%", isUp: false },
  { name: "Bitcoin", value: "$83.900", change: "+0,75%", isUp: true },
  { name: "Ethereum", value: "$2.720", change: "+1,20%", isUp: true },
];

const DEFAULT_WATCHLIST: WatchItem[] = [
  { name: "VN-Index", value: "1.777,73", change: "-0,17%", color: "#C0271D" },
  { name: "VN30", value: "1.914,35", change: "-0,42%", color: "#C0271D" },
  { name: "HNX-Index", value: "269,91", change: "-0,52%", color: "#C0271D" },
  { name: "Bitcoin", value: "$83.900", change: "+0,75%", color: "#0A7A45" },
  { name: "P/E VN-Index", value: "13,8 lần", change: "", color: "#5E636B" },
  { name: "LS qua đêm", value: "4,2%", change: "", color: "#5E636B" },
];

export function useMarketRealtime() {
  const [tickerItems, setTickerItems] = useState<MarketItem[]>(DEFAULT_TICKERS);
  const [watchList, setWatchList] = useState<WatchItem[]>(DEFAULT_WATCHLIST);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const prevPricesRef = useRef<{ [key: string]: number }>({
    VNINDEX: 1777.73,
    VN30: 1914.35,
    HNX: 269.91,
    BTC: 84000,
    ETH: 2720,
  });

  const flashTimers = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const triggerFlash = (symbol: string, direction: "up" | "down") => {
    if (flashTimers.current[symbol]) {
      clearTimeout(flashTimers.current[symbol]);
    }

    setTickerItems((prev) =>
      prev.map((item) =>
        item.name.toLowerCase().includes(symbol.toLowerCase())
          ? { ...item, flash: direction }
          : item
      )
    );

    setWatchList((prev) =>
      prev.map((item) =>
        item.name.toLowerCase().includes(symbol.toLowerCase())
          ? { ...item, flash: direction }
          : item
      )
    );

    flashTimers.current[symbol] = setTimeout(() => {
      setTickerItems((prev) =>
        prev.map((item) =>
          item.name.toLowerCase().includes(symbol.toLowerCase())
            ? { ...item, flash: null }
            : item
        )
      );
      setWatchList((prev) =>
        prev.map((item) =>
          item.name.toLowerCase().includes(symbol.toLowerCase())
            ? { ...item, flash: null }
            : item
        )
      );
    }, 1200);
  };

  // 1. Initial snapshot & background refresh from /api/market-data
  useEffect(() => {
    let isMounted = true;

    async function loadSnapshot() {
      try {
        const res = await fetch("/api/market-data");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        if (Array.isArray(data.tickerItems) && data.tickerItems.length > 0) {
          setTickerItems((prev) =>
            data.tickerItems.map((item: MarketItem) => {
              const existing = prev.find((p) => p.name === item.name);
              return { ...item, flash: existing?.flash || null };
            })
          );
        }

        if (Array.isArray(data.watchList) && data.watchList.length > 0) {
          setWatchList((prev) =>
            data.watchList.map((item: WatchItem) => {
              const existing = prev.find((p) => p.name === item.name);
              return { ...item, flash: existing?.flash || null };
            })
          );
        }

        if (data.updatedAt) {
          setUpdatedAt(data.updatedAt);
        }
      } catch (err) {
        console.error("Error loading market snapshot:", err);
      }
    }

    loadSnapshot();
    const pollInterval = setInterval(loadSnapshot, MARKET_CONFIG.rest.cacheTtlMs);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // 2. Domestic market indices MQTT over WebSocket (VN-Index, VN30, HNX-Index)
  useEffect(() => {
    let feedWs: WebSocket | null = null;
    let feedPingInterval: NodeJS.Timeout | null = null;
    let feedReconnectTimeout: NodeJS.Timeout | null = null;
    let isDestroyed = false;

    function connectDomesticFeed() {
      if (typeof window === "undefined" || isDestroyed) return;

      try {
        const stockStream = MARKET_CONFIG.stockStream;
        if (!stockStream.streamUrl) return;

        feedWs = new WebSocket(stockStream.streamUrl, [stockStream.streamProtocol]);

        feedWs.onopen = () => {
          if (isDestroyed || !feedWs) return;
          setIsSocketConnected(true);

          // 1. Send CONNECT packet with stream credentials
          const clientId = "feed_" + Math.random().toString(36).slice(2, 9);
          const connectPacket = buildMqttConnectPacket(
            clientId,
            stockStream.streamUser,
            stockStream.streamKey
          );
          feedWs.send(connectPacket);

          // 2. Keepalive heartbeat
          feedPingInterval = setInterval(() => {
            if (feedWs && feedWs.readyState === WebSocket.OPEN) {
              feedWs.send(new Uint8Array([0xc0, 0x00])); // PINGREQ
            }
          }, stockStream.heartbeatMs);
        };

        feedWs.onmessage = async (event) => {
          if (isDestroyed) return;
          try {
            let buf: Uint8Array;
            if (event.data instanceof Blob) {
              buf = new Uint8Array(await event.data.arrayBuffer());
            } else {
              buf = new Uint8Array(event.data);
            }

            const packetType = buf[0] >> 4;

            // CONNACK (packet type 2) -> Subscribe to index topics
            if (packetType === 2) {
              const subPacket = buildMqttSubscribePacket(
                1,
                stockStream.streamTopics
              );
              if (feedWs && feedWs.readyState === WebSocket.OPEN) {
                feedWs.send(subPacket);
              }
            }

            // PUBLISH (packet type 3) -> Decode protobuf data
            if (packetType === 3) {
              const pub = parseMqttPublish(buf);
              if (!pub) return;

              const decoded = decodeIndexRealtimeProtobuf(pub.payload);
              if (!decoded.indexValue) return;

              const val = decoded.indexValue;
              const chg = decoded.change ?? 0;
              const pct = decoded.changePercent ?? 0;
              const isUp = chg >= 0;
              const formattedPrice = formatVN(val, 2);
              const formattedChange = formatPercent(pct);

              let indexKey = "";
              if (pub.topic.includes("VNINDEX")) indexKey = "VN-Index";
              else if (pub.topic.includes("VN30")) indexKey = "VN30";
              else if (pub.topic.includes("HNX")) indexKey = "HNX";

              if (indexKey) {
                const prev = prevPricesRef.current[indexKey] || val;
                const direction = val > prev ? "up" : val < prev ? "down" : null;
                prevPricesRef.current[indexKey] = val;

                if (direction) {
                  triggerFlash(indexKey, direction);
                }

                setTickerItems((prevItems) =>
                  prevItems.map((item) =>
                    item.name === indexKey
                      ? { ...item, value: formattedPrice, change: formattedChange, isUp }
                      : item
                  )
                );

                setWatchList((prevList) =>
                  prevList.map((item) => {
                    const isTarget =
                      item.name === indexKey ||
                      (indexKey === "HNX" && item.name === "HNX-Index");
                    if (!isTarget) return item;
                    return {
                      ...item,
                      value: formattedPrice,
                      change: formattedChange,
                      color: isUp ? "#0A7A45" : "#C0271D",
                    };
                  })
                );
              }
            }
          } catch (err) {
            console.error("Domestic feed decode error:", err);
          }
        };

        feedWs.onerror = () => {
          setIsSocketConnected(false);
        };

        feedWs.onclose = () => {
          if (!isDestroyed) {
            feedReconnectTimeout = setTimeout(
              connectDomesticFeed,
              stockStream.retryDelayMs
            );
          }
        };
      } catch (err) {
        console.error("Domestic feed connection error:", err);
        if (!isDestroyed) {
          feedReconnectTimeout = setTimeout(
            connectDomesticFeed,
            MARKET_CONFIG.stockStream.retryDelayMs
          );
        }
      }
    }

    connectDomesticFeed();

    return () => {
      isDestroyed = true;
      if (feedPingInterval) clearInterval(feedPingInterval);
      if (feedReconnectTimeout) clearTimeout(feedReconnectTimeout);
      if (feedWs) {
        feedWs.onclose = null;
        feedWs.close();
      }
    };
  }, []);

  // 3. Crypto WebSocket stream (Bitcoin & Ethereum)
  useEffect(() => {
    let cryptoWs: WebSocket | null = null;
    let cryptoReconnectTimeout: NodeJS.Timeout | null = null;
    let isDestroyed = false;

    function connectCryptoWs() {
      if (typeof window === "undefined" || isDestroyed) return;

      try {
        const { cryptoFeed } = MARKET_CONFIG;
        if (!cryptoFeed.streamUrl) return;

        cryptoWs = new WebSocket(cryptoFeed.streamUrl);

        cryptoWs.onopen = () => {
          if (!isDestroyed) {
            setIsSocketConnected(true);
          }
        };

        cryptoWs.onmessage = (event) => {
          if (isDestroyed) return;
          try {
            const message = JSON.parse(event.data);
            const stream = message.stream;
            const data = message.data;

            if (stream === "btcusdt@ticker") {
              const newPrice = parseFloat(data.c);
              const changePct = parseFloat(data.P);
              const isUp = changePct >= 0;
              const formattedPrice = `$${formatVN(Math.round(newPrice), 0)}`;
              const formattedChange = formatPercent(changePct);

              const prevPrice = prevPricesRef.current.BTC;
              const direction =
                newPrice > prevPrice ? "up" : newPrice < prevPrice ? "down" : null;
              prevPricesRef.current.BTC = newPrice;

              if (direction) {
                triggerFlash("bitcoin", direction);
              }

              setTickerItems((prev) =>
                prev.map((item) =>
                  item.name === "Bitcoin"
                    ? { ...item, value: formattedPrice, change: formattedChange, isUp }
                    : item
                )
              );

              setWatchList((prev) =>
                prev.map((item) =>
                  item.name === "Bitcoin"
                    ? {
                        ...item,
                        value: formattedPrice,
                        change: formattedChange,
                        color: isUp ? "#0A7A45" : "#C0271D",
                      }
                    : item
                )
              );
            } else if (stream === "ethusdt@ticker") {
              const newPrice = parseFloat(data.c);
              const changePct = parseFloat(data.P);
              const isUp = changePct >= 0;
              const formattedPrice = `$${formatVN(Math.round(newPrice), 0)}`;
              const formattedChange = formatPercent(changePct);

              const prevPrice = prevPricesRef.current.ETH;
              const direction =
                newPrice > prevPrice ? "up" : newPrice < prevPrice ? "down" : null;
              prevPricesRef.current.ETH = newPrice;

              if (direction) {
                triggerFlash("ethereum", direction);
              }

              setTickerItems((prev) =>
                prev.map((item) =>
                  item.name === "Ethereum"
                    ? { ...item, value: formattedPrice, change: formattedChange, isUp }
                    : item
                )
              );
            }
          } catch (e) {
            console.error("Crypto WS parse error:", e);
          }
        };

        cryptoWs.onerror = () => {};
        cryptoWs.onclose = () => {
          if (!isDestroyed) {
            cryptoReconnectTimeout = setTimeout(
              connectCryptoWs,
              cryptoFeed.retryDelayMs
            );
          }
        };
      } catch (err) {
        console.error("Crypto WS connection error:", err);
        if (!isDestroyed) {
          cryptoReconnectTimeout = setTimeout(
            connectCryptoWs,
            MARKET_CONFIG.cryptoFeed.retryDelayMs
          );
        }
      }
    }

    connectCryptoWs();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (!cryptoWs || cryptoWs.readyState === WebSocket.CLOSED) {
          connectCryptoWs();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isDestroyed = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (cryptoReconnectTimeout) clearTimeout(cryptoReconnectTimeout);
      if (cryptoWs) {
        cryptoWs.onclose = null;
        cryptoWs.close();
      }
      Object.values(flashTimers.current).forEach((t) => clearTimeout(t));
    };
  }, []);

  return {
    tickerItems,
    watchList,
    updatedAt,
    isSocketConnected,
  };
}
