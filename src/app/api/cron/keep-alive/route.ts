import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Route Cron Keep-Alive:
 * - Ping Supabase REST API (Kong gateway & PostgREST traffic)
 * - Ping Database trực tiếp qua Prisma (Postgres connection traffic)
 * Giúp Supabase Free Tier không bị đưa vào trạng thái 'Paused' sau 7 ngày không hoạt động.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authHeader = req.headers.get("authorization");
    const secretParam = searchParams.get("secret");

    // Nếu bạn cài đặt CRON_SECRET trong .env, sẽ kiểm tra xác thực để tránh spam
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const isAuthorized =
        authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret;

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing cron secret" },
          { status: 401 }
        );
      }
    }

    const results: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
    };

    // 1. Ping Supabase REST API (inbound HTTP traffic)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const restRes = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: "GET",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          cache: "no-store",
        });

        results.supabaseApi = {
          status: restRes.status,
          ok: restRes.ok,
        };
      } catch (err) {
        results.supabaseApi = {
          error: err instanceof Error ? err.message : String(err),
        };
      }
    } else {
      results.supabaseApi = "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";
    }

    // 2. Ping Database qua Prisma (inbound DB connection pooler traffic)
    try {
      await prisma.$queryRaw`SELECT 1 as alive`;
      results.database = { ok: true, message: "Prisma query successful" };
    } catch (err) {
      results.database = {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    return NextResponse.json({
      success: true,
      message: "Supabase keep-alive ping executed successfully",
      ...results,
    });
  } catch (error) {
    console.error("Keep-alive cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
