import { describe, expect, it, vi } from "vitest";
import { handleResults } from "../src/lib/server/resultsHandler";
import { resultRecord } from "../src/lib/server/resultRecord";
import { resultInputSchema } from "../src/lib/server/resultSchema";
import { scoreQuiz } from "../src/lib/quiz/scoring";
import { QUESTION_IDS, type Answers } from "../src/types/quiz";
const answers = Object.fromEntries(QUESTION_IDS.map((id) => [id, "a"])) as Answers;
const valid = { quizVersion: "1.0" as const, answers, actualType: "O" as const };
function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request("https://quiz.example/api/results", { method: "POST", headers: { origin: "https://quiz.example", host: "quiz.example", "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
}
function deps() { return { allowedOrigin: "https://quiz.example", limit: vi.fn().mockResolvedValue("allowed"), insert: vi.fn().mockResolvedValue(undefined), onError: vi.fn() }; }
describe("POST /api/results", () => {
  it("recalculates every saved field and returns no result data", async () => {
    const d = deps(); const response = await handleResults(request(), d); const expected = scoreQuiz(answers);
    expect(response.status).toBe(201); expect(await response.json()).toEqual({ success: true });
    expect(d.insert).toHaveBeenCalledWith(expect.objectContaining({ answers, primary_type: expected.primaryType, secondary_type: expected.secondaryType, subtype: expected.subtype, axis_scores: expected.axisScores, type_scores: expected.typeScores, actual_type: "O", is_match: expected.primaryType === "O" }));
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
  it.each([
    { ...valid, axisScores: {} }, { ...valid, typeScores: {} }, { ...valid, primaryType: "B" },
    { ...valid, secondaryType: "B" }, { ...valid, subtype: "B1" }, { ...valid, isMatch: true },
    { ...valid, quizVersion: "2.0" }, { ...valid, quizVersion: "1.0".repeat(100) },
    { ...valid, answers: {} }, { ...valid, answers: { ...answers, q01: "e" } },
    { ...valid, answers: { ...answers, q17: "a" } }, { ...valid, answers: { ...answers, q01: null } },
    { ...valid, answers: [] }, { ...valid, actualType: "C" }, { ...valid, actualType: null },
    { ...valid, actualType: "<script>alert(1)</script>" }, [], null,
  ])("rejects invalid input before DB or rate service: %j", async (body) => {
    const d = deps(); expect((await handleResults(request(body), d)).status).toBe(400); expect(d.insert).not.toHaveBeenCalled(); expect(d.limit).not.toHaveBeenCalled();
  });
  it("rejects a single missing answer", async () => {
    const partial = { ...answers }; Reflect.deleteProperty(partial, "q16");
    expect((await handleResults(request({ ...valid, answers: partial }), deps())).status).toBe(400);
  });
  it.each(["A", "B", "O", "AB", "unknown"] as const)("actualType %s cannot change the diagnosis", (actualType) => {
    const baseline = resultRecord(valid); const changed = resultRecord({ ...valid, actualType });
    for (const key of ["axis_scores", "type_scores", "primary_type", "secondary_type", "subtype", "score_gap", "is_tie", "is_close"] as const) expect(changed[key]).toEqual(baseline[key]);
    expect(changed.is_match).toBe(actualType === "unknown" ? null : actualType === baseline.primary_type);
  });
  it.each<Record<string, string>>([{ origin: "https://evil.example" }, { origin: "null" }, { origin: "" }, { host: "evil.example" }, { "sec-fetch-site": "cross-site" }])("rejects a foreign origin/host", async (headers) => {
    const d = deps(); expect((await handleResults(request(valid, headers), d)).status).toBe(403); expect(d.insert).not.toHaveBeenCalled();
  });
  it.each<Record<string, string>>([{ "Content-Type": "text/plain" }, { "Content-Type": "application/x-www-form-urlencoded" }, { "Content-Encoding": "gzip" }])("only accepts uncompressed JSON", async (headers) => {
    expect((await handleResults(request(valid, headers), deps())).status).toBe(415);
  });
  it("accepts JSON charset", async () => { expect((await handleResults(request(valid, { "Content-Type": "application/json; charset=utf-8" }), deps())).status).toBe(201); });
  it("rejects declared and streamed oversized bodies", async () => {
    expect((await handleResults(request(valid, { "Content-Length": "99999" }), deps())).status).toBe(413);
    expect((await handleResults(request("あ".repeat(1000)), deps())).status).toBe(413);
  });
  it("rejects broken JSON without leaking parse errors", async () => {
    const r = request(); const broken = new Request(r.url, { method: "POST", headers: r.headers, body: "{" });
    const response = await handleResults(broken, deps()); expect(response.status).toBe(400); expect(await response.text()).not.toMatch(/SyntaxError|stack/);
  });
  it("limits requests without writing", async () => { const d = deps(); d.limit.mockResolvedValue("limited"); const response = await handleResults(request(), d); expect(response.status).toBe(429); expect(response.headers.get("retry-after")).toBe("600"); expect(d.insert).not.toHaveBeenCalled(); });
  it("fails closed if protection is missing", async () => { const d = deps(); d.limit.mockResolvedValue("unavailable"); expect((await handleResults(request(), d)).status).toBe(503); expect(d.insert).not.toHaveBeenCalled(); });
  it("never exposes database exceptions or diagnosis in logs", async () => { const d = deps(); d.insert.mockRejectedValue(new Error("Secret SQL stack actualType O")); const response = await handleResults(request(), d); expect(response.status).toBe(503); expect(await response.text()).toBe('{"success":false,"error":"save_unavailable"}'); expect(d.onError).toHaveBeenCalledExactlyOnceWith("storage_failed"); });
  it("refuses saving without a configured site", async () => { const d = { ...deps(), allowedOrigin: "" }; expect((await handleResults(request(), d)).status).toBe(503); expect(d.insert).not.toHaveBeenCalled(); });
  it("rejects GET", async () => { expect((await handleResults(new Request("https://quiz.example/api/results"), deps())).status).toBe(405); });
  it("rejects inherited and extraneous keys", () => { expect(resultInputSchema.safeParse({ ...valid, answers: Object.create(answers) }).success).toBe(false); expect(resultInputSchema.safeParse(JSON.parse(JSON.stringify(valid).replace('"q01":"a"', '"q01":"a","__proto__":"a"'))).success).toBe(false); });
});
