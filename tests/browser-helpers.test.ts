import { describe, expect, it, vi } from "vitest";
import { emptyProgress, parseProgress, parseResult } from "../src/lib/browser/storage";
import { copyLink, makeShareText, nativeShare, publicShareUrl, shareLinks } from "../src/lib/quiz/share";
import { scoreQuiz } from "../src/lib/quiz/scoring";
import { QUESTION_IDS } from "../src/types/quiz";
import type { Answers } from "../src/types/quiz";
const answers = Object.fromEntries(QUESTION_IDS.map((q) => [q, "a"])) as Answers;
const result = scoreQuiz(answers);

describe("untrusted saved progress", () => {
  it("roundtrips changed answers and backtracking", () => {
    const state = { ...emptyProgress(), currentQuestion: 1, answers: { q01: "c", q02: "b", q03: "d" } };
    expect(parseProgress(JSON.stringify(state))).toEqual(state);
  });
  it.each([null, "bad json", "null", "[]", JSON.stringify({ ...emptyProgress(), currentQuestion: 16 }), JSON.stringify({ ...emptyProgress(), currentQuestion: -1 }), JSON.stringify({ ...emptyProgress(), currentQuestion: 1.5 }), JSON.stringify({ ...emptyProgress(), currentQuestion: 5 }), JSON.stringify({ ...emptyProgress(), quizVersion: "old" }), JSON.stringify({ ...emptyProgress(), answers: { q17: "a" } }), JSON.stringify({ ...emptyProgress(), answers: { q01: "e" } }), "x".repeat(5000)])("ignores invalid storage %#", (raw) => {
    expect(parseProgress(raw)).toBeNull();
  });
  it("discards extra fields instead of persisting actualType", () => {
    expect(parseProgress(JSON.stringify({ ...emptyProgress(), actualType: "A" }))).toEqual(emptyProgress());
  });
  it("requires complete versioned answers for results", () => {
    expect(parseResult(JSON.stringify({ quizVersion: "1.0", answers }))).toEqual(answers);
    expect(parseResult(JSON.stringify({ quizVersion: "1.0", answers: { q01: "a" } }))).toBeNull();
    expect(parseResult(JSON.stringify({ quizVersion: "old", answers }))).toBeNull();
    expect(parseResult("null")).toBeNull();
  });
});

describe("sharing is independent of diagnosis", () => {
  it("encodes share text and shares only the root URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    const url = publicShareUrl("https://example.com/result?answers=private#secret");
    expect(url).toBe("https://example.com/");
    const links = shareLinks(result, url);
    expect(new URL(links.x).searchParams.get("text")).toBe(makeShareText(result));
    expect(new URL(links.line).searchParams.get("url")).toBe(url);
    expect(makeShareText(result)).not.toMatch(/実際|actualType|answers/);
    vi.unstubAllEnvs();
  });
  it("rejects unsafe configured URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "javascript:alert(1)");
    expect(publicShareUrl("https://safe.example/path")).toBe("https://safe.example/");
    vi.unstubAllEnvs();
  });
  it("handles native success, cancel, failure and missing API", async () => {
    expect(await nativeShare({}, async () => {})).toBe("shared");
    expect(await nativeShare({}, async () => { throw new DOMException("cancel", "AbortError"); })).toBe("cancelled");
    expect(await nativeShare({}, async () => { throw new Error("permission denied"); })).toBe("failed");
    expect(await nativeShare({}, undefined)).toBe("unsupported");
    expect(scoreQuiz(answers)).toEqual(result);
  });
  it("handles missing or denied clipboard without throwing", async () => {
    expect(await copyLink("https://example.com/", undefined)).toBe(false);
    expect(await copyLink("https://example.com/", async () => { throw new Error("denied"); })).toBe(false);
    const write = vi.fn(async () => {});
    expect(await copyLink("https://example.com/", write)).toBe(true);
    expect(write).toHaveBeenCalledWith("https://example.com/");
  });
});
