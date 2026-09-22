import "server-only";
import { checkRateLimit } from "@vercel/firewall";
import { isIP } from "node:net";

export const RATE_LIMIT_ID = "quiz-results";
export type LimitDecision = "allowed" | "limited" | "unavailable";
export async function limitResultRequest(request: Request): Promise<LimitDecision> {
  // インメモリ制限はServerlessで共有されないため代用しない。未設定時は保存しない。
  if (process.env.VERCEL !== "1" || process.env.NODE_ENV !== "production") return "unavailable";
  const origin = process.env.NEXT_PUBLIC_SITE_URL;
  if (!origin) return "unavailable";
  const ip = request.headers.get("x-real-ip");
  if (!ip || !isIP(ip)) return "unavailable";
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const site = new URL(origin);
    if (site.protocol !== "https:") return "unavailable";
    // SDKへ渡すヘッダーを限定。任意のHostを送信先にしない。Cookieや認証情報も転送しない。
    const headers = new Headers({ host: site.host, "x-real-ip": ip, "x-forwarded-for": ip });
    const result = await Promise.race([
      checkRateLimit(RATE_LIMIT_ID, { headers }),
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("limit_timeout")), 3000); }),
    ]);
    if (result.error === "not-found") return "unavailable";
    return result.rateLimited || result.error ? "limited" : "allowed";
  } catch { return "unavailable"; }
  finally { clearTimeout(timeout); }
}
