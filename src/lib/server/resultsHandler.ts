import { resultInputSchema, MAX_BODY_BYTES } from "./resultSchema";
import { resultRecord, type ResultRecord } from "./resultRecord";
import type { LimitDecision } from "./rateLimit";

interface Dependencies {
  allowedOrigin: string;
  limit(request: Request): Promise<LimitDecision>;
  insert(record: ResultRecord): Promise<void>;
  onError(category: "storage_failed" | "protection_unavailable"): void;
}
function reply(status: number, error?: string) {
  return Response.json(error ? { success: false, error } : { success: true }, {
    status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...(status === 429 ? { "Retry-After": "600" } : {}) },
  });
}
async function readBody(request: Request) {
  const length = request.headers.get("content-length");
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new Error("too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_json");
  let size = 0;
  const chunks: Uint8Array[] = [];
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { void reader.cancel().catch(() => {}); throw new Error("too_large"); }
      chunks.push(value);
    }
    if (timedOut) throw new Error("body_timeout");
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
export async function handleResults(request: Request, deps: Dependencies): Promise<Response> {
  if (request.method !== "POST") return reply(405, "method_not_allowed");
  if (!deps.allowedOrigin) { deps.onError("protection_unavailable"); return reply(503, "save_unavailable"); }
  let allowed: URL;
  try { allowed = new URL(deps.allowedOrigin); } catch { deps.onError("protection_unavailable"); return reply(503, "save_unavailable"); }
  if (request.headers.get("origin") !== allowed.origin || request.headers.get("host") !== allowed.host || request.headers.get("sec-fetch-site") === "cross-site") return reply(403, "origin_rejected");
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json" || (request.headers.has("content-encoding") && request.headers.get("content-encoding") !== "identity")) return reply(415, "json_required");
  let body: unknown;
  try { body = await readBody(request); } catch (error) { return reply(error instanceof Error && error.message === "too_large" ? 413 : 400, "invalid_request"); }
  const parsed = resultInputSchema.safeParse(body);
  if (!parsed.success) return reply(400, "invalid_request");
  try {
    const decision = await deps.limit(request);
    if (decision === "limited") return reply(429, "too_many_requests");
    if (decision !== "allowed") { deps.onError("protection_unavailable"); return reply(503, "save_unavailable"); }
    await deps.insert(resultRecord(parsed.data));
    return reply(201);
  } catch {
    deps.onError("storage_failed");
    return reply(503, "save_unavailable");
  }
}
