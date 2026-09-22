import "server-only";
import type { ResultRecord } from "./resultRecord";

export async function insertResult(record: ResultRecord): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret?.startsWith("sb_secret_")) throw new Error("storage_unavailable");
  const target = new URL(url);
  if (target.protocol !== "https:" || target.username || target.password || target.pathname !== "/") throw new Error("storage_configuration");
  // 現行Secretはapikeyだけへ渡す。ブラウザへの返却・Bearer転用・レスポンス詳細のログは禁止。
  const response = await fetch(new URL("/rest/v1/quiz_results", target), {
    method: "POST", headers: { apikey: secret, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(record), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("storage_failed");
}
