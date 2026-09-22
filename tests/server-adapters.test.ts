import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@vercel/firewall", () => ({ checkRateLimit: vi.fn() }));
import { checkRateLimit } from "@vercel/firewall";
import { limitResultRequest } from "../src/lib/server/rateLimit";
import { insertResult } from "../src/lib/server/supabase";
import { resultRecord } from "../src/lib/server/resultRecord";
import { QUESTION_IDS, type Answers } from "../src/types/quiz";
import { saveAnonymousResult } from "../src/lib/browser/saveResult";
const answers = Object.fromEntries(QUESTION_IDS.map((id) => [id, "a"])) as Answers;
const record = resultRecord({ quizVersion: "1.0", answers, actualType: "unknown" });
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
describe("server integrations", () => {
  function setup() { vi.stubEnv("VERCEL", "1"); vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://quiz.example"); }
  const req = () => new Request("https://quiz.example/api/results", { headers: { host: "untrusted.example", "x-real-ip": "203.0.113.1", cookie: "private", authorization: "private" } });
  it("does not pretend local memory can protect production", async () => { expect(await limitResultRequest(req())).toBe("unavailable"); expect(checkRateLimit).not.toHaveBeenCalled(); });
  it.each([{ rateLimited: false, expected: "allowed" }, { rateLimited: true, expected: "limited" }, { rateLimited: false, error: "not-found" as const, expected: "unavailable" }, { rateLimited: true, error: "blocked" as const, expected: "limited" }])("handles firewall result %j", async ({ expected, ...result }) => {
    setup(); vi.mocked(checkRateLimit).mockResolvedValue(result); expect(await limitResultRequest(req())).toBe(expected);
    const headers = vi.mocked(checkRateLimit).mock.calls.at(-1)?.[1]?.headers as Headers;
    expect(headers.get("host")).toBe("quiz.example"); expect(headers.has("cookie")).toBe(false); expect(headers.has("authorization")).toBe(false);
  });
  it("fails closed on SDK exception", async () => { setup(); vi.mocked(checkRateLimit).mockRejectedValue(new Error("offline")); expect(await limitResultRequest(req())).toBe("unavailable"); });
  it("rejects absent platform IP", async () => { setup(); expect(await limitResultRequest(new Request("https://quiz.example"))).toBe("unavailable"); });
  it("sends the secret only to backend REST with insert-only response", async () => {
    vi.stubEnv("SUPABASE_URL", "https://db.example"); vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_TEST_ONLY");
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 })); vi.stubGlobal("fetch", fetchMock); await insertResult(record);
    const [url, options] = fetchMock.mock.calls[0]; expect(String(url)).toBe("https://db.example/rest/v1/quiz_results");
    expect(options.headers).toEqual({ apikey: "sb_secret_TEST_ONLY", "Content-Type": "application/json", Prefer: "return=minimal" }); expect(options.redirect).toBe("error"); expect(JSON.parse(options.body)).toEqual(record);
  });
  it("rejects missing credentials before network access", async () => { vi.stubEnv("SUPABASE_SECRET_KEY", ""); const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock); await expect(insertResult(record)).rejects.toThrow("storage_unavailable"); expect(fetchMock).not.toHaveBeenCalled(); });
  it("hides Supabase response details", async () => { vi.stubEnv("SUPABASE_URL", "https://db.example"); vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_TEST_ONLY"); vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("private SQL", { status: 400 }))); await expect(insertResult(record)).rejects.toThrow("storage_failed"); });
});
describe("browser saving never throws into result UI", () => {
  it.each([{ status: 201, body: '{"success":true}', expected: "saved" }, { status: 429, body: "{}", expected: "limited" }, { status: 503, body: "{}", expected: "failed" }, { status: 200, body: "not json", expected: "failed" }])("handles %j", async ({ status, body, expected }) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status })); vi.stubGlobal("fetch", fetchMock);
    expect(await saveAnonymousResult(answers, "A")).toBe(expected);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ quizVersion: "1.0", answers, actualType: "A" });
  });
  it("handles offline or timeout", async () => { vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network"))); expect(await saveAnonymousResult(answers, "A")).toBe("failed"); });
});
