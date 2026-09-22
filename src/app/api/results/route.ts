import { handleResults } from "../../../lib/server/resultsHandler";
import { insertResult } from "../../../lib/server/supabase";
import { limitResultRequest } from "../../../lib/server/rateLimit";
export const runtime = "nodejs";
export const maxDuration = 15;
export function POST(request: Request) {
  return handleResults(request, {
    allowedOrigin: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    limit: limitResultRequest, insert: insertResult,
    // 診断内容・例外オブジェクト・Secretを含めず、固定カテゴリのみを記録する。
    onError: (category) => console.error("result_save", category),
  });
}
