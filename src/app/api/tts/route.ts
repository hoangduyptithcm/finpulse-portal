import { NextRequest, NextResponse } from "next/server";
import https from "node:https";

export const dynamic = "force-dynamic";

// In-memory cache for generated MP3 buffers (max 100 items)
const ttsCache = new Map<string, Buffer>();
const MAX_CACHE_SIZE = 100;

// Agent ignoring TLS cert issues (common in corporate proxies)
const agent = new https.Agent({ rejectUnauthorized: false });

function fetchGoogleTtsChunk(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const url =
      "https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=" +
      encodeURIComponent(text.trim());

    https
      .get(url, { agent, timeout: 10000 }, (res) => {
        if (res.statusCode !== 200) {
          return reject(
            new Error(`Google TTS responded with status code ${res.statusCode}`)
          );
        }
        const data: Buffer[] = [];
        res.on("data", (chunk: Buffer) => data.push(chunk));
        res.on("end", () => resolve(Buffer.concat(data)));
      })
      .on("error", (err) => reject(err));
  });
}

function splitTextIntoChunks(text: string, maxLength = 150): string[] {
  // Normalize whitespace
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`~>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return [];

  const sentences = clean.match(/[^.!?\n,;]+[.!?\n,;]+|[^.!?\n,;]+$/g) || [clean];
  const chunks: string[] = [];
  let current = "";

  for (const raw of sentences) {
    const s = raw.trim();
    if (!s) continue;

    if ((current + " " + s).trim().length <= maxLength) {
      current = current ? `${current} ${s}` : s;
    } else {
      if (current) chunks.push(current);

      if (s.length > maxLength) {
        // Break long sentence by space
        const words = s.split(" ");
        let sub = "";
        for (const w of words) {
          if ((sub + " " + w).trim().length <= maxLength) {
            sub = sub ? `${sub} ${w}` : w;
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      } else {
        current = s;
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body.text || "";
    const requestedVoice = (
      body.voice ||
      process.env.KOKORO_TTS_VOICE ||
      "duet"
    )
      .toLowerCase()
      .trim();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Văn bản không được để trống" },
        { status: 400 }
      );
    }

    // Limit length to ~3,500 characters
    const truncatedText = text.slice(0, 3500);

    // Check cache with voice identifier (v3 to invalidate old fallback responses)
    const cacheKey = `v3_${truncatedText.trim()}_${requestedVoice}`;
    if (ttsCache.has(cacheKey)) {
      const cachedBuffer = ttsCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cachedBuffer), {
        status: 200,
        headers: {
          "Content-Type": "audio/wav",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "X-TTS-Voice": requestedVoice,
        },
      });
    }

    // Priority 1: Check if Kokoro-Vietnamese Microservice is available
    // Default to IPv4 http://127.0.0.1:8880/api/tts (avoids Node.js IPv6 ::1 ECONNREFUSED on Linux)
    const rawKokoroUrl = process.env.KOKORO_TTS_URL || "http://127.0.0.1:8880/api/tts";
    const kokoroUrl = rawKokoroUrl.replace("//localhost:", "//127.0.0.1:");

    if (kokoroUrl) {
      try {
        console.log(`[TTS] Calling Kokoro microservice at ${kokoroUrl} (voice: ${requestedVoice})...`);
        const kokoroRes = await fetch(kokoroUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: truncatedText,
            voice: requestedVoice,
            speed: 1.0,
          }),
          signal: AbortSignal.timeout(120000), // 120s timeout for model loading and long texts
        });

        if (kokoroRes.ok) {
          const audioArrayBuf = await kokoroRes.arrayBuffer();
          const kokoroBuffer = Buffer.from(audioArrayBuf);
          const contentType =
            kokoroRes.headers.get("content-type") || "audio/wav";
          const xCache = kokoroRes.headers.get("x-cache") || "MISS";
          const xSynthTime = kokoroRes.headers.get("x-synthesis-time") || "";

          if (ttsCache.size >= MAX_CACHE_SIZE) {
            const firstKey = ttsCache.keys().next().value;
            if (firstKey) ttsCache.delete(firstKey);
          }
          ttsCache.set(cacheKey, kokoroBuffer);
          console.log(`[TTS] Kokoro audio generated successfully (${kokoroBuffer.length} bytes, cache: ${xCache}).`);

          return new NextResponse(new Uint8Array(kokoroBuffer), {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=604800, s-maxage=604800",
              "X-TTS-Engine": "Kokoro-Vietnamese",
              "X-TTS-Voice": requestedVoice,
              "X-Cache": xCache,
              ...(xSynthTime ? { "X-Synthesis-Time": xSynthTime } : {}),
            },
          });
        } else {
          console.warn(
            `[TTS] Kokoro microservice at ${kokoroUrl} returned status ${kokoroRes.status}, falling back to default TTS.`
          );
        }
      } catch (kokoroErr: any) {
        console.warn(
          `[TTS] Cannot reach Kokoro microservice at ${kokoroUrl} (${kokoroErr?.message}), falling back to default TTS.`
        );
      }
    } else {
      console.warn(
        "[TTS] KOKORO_TTS_URL is NOT set in environment variables! Using fallback TTS."
      );
    }

    // Priority 2: Fallback TTS Engine
    const chunks = splitTextIntoChunks(truncatedText);
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy nội dung hợp lệ để phát" },
        { status: 400 }
      );
    }

    // Fetch chunks in parallel batches of 4
    const audioBuffers: Buffer[] = [];
    const BATCH_SIZE = 4;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((chunk) => fetchGoogleTtsChunk(chunk))
      );
      audioBuffers.push(...batchResults);
    }

    const combinedBuffer = Buffer.concat(audioBuffers);

    // Save to memory cache
    if (ttsCache.size >= MAX_CACHE_SIZE) {
      const firstKey = ttsCache.keys().next().value;
      if (firstKey) ttsCache.delete(firstKey);
    }
    ttsCache.set(cacheKey, combinedBuffer);

    return new NextResponse(new Uint8Array(combinedBuffer), {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "X-TTS-Engine": "Fallback",
      },
    });
  } catch (err: any) {
    console.error("[TTS API Error]:", err);
    return NextResponse.json(
      { error: "Lỗi chuyển đổi giọng đọc tiếng Việt", details: err?.message },
      { status: 500 }
    );
  }
}
