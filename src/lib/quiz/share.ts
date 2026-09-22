import type { QuizResult } from "../../types/quiz";
import { RESULT_COPY } from "./resultCopy";

export function makeShareText(result: QuizResult): string {
  const copy = RESULT_COPY[result.subtype];
  // 共有は常に診断結果だけ。実際の血液型は明示せず、URLにも埋め込まない。
  return `私、${result.primaryType}型っぽさ${result.typeScores[result.primaryType]}%でした！\n\n「${copy.name}」\n${copy.shortCopy}\n\nあなたは何型っぽい？\n\n#何型っぽ`;
}
export function makeLineText(result: QuizResult): string {
  return `「何型っぽ？」やってみた！\n\n私は${result.primaryType}型っぽさ${result.typeScores[result.primaryType]}%で、\n「${RESULT_COPY[result.subtype].name}」だった。\n\nあなたもやってみて👇`;
}
export function publicShareUrl(origin: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  for (const candidate of [configured, origin]) {
    try { const url = new URL(candidate ?? ""); if (url.protocol === "https:" || url.protocol === "http:") return `${url.origin}/`; } catch { /* 開発環境では現在のoriginを使用 */ }
  }
  return "";
}
export function shareLinks(result: QuizResult, url: string) {
  return {
    x: `https://twitter.com/intent/tweet?${new URLSearchParams({ text: makeShareText(result), url })}`,
    line: `https://social-plugins.line.me/lineit/share?${new URLSearchParams({ url, text: makeLineText(result) })}`,
  };
}
export type ShareOutcome = "shared" | "cancelled" | "unsupported" | "failed";
export async function nativeShare(data: ShareData, share: ((data: ShareData) => Promise<void>) | undefined): Promise<ShareOutcome> {
  if (!share) return "unsupported";
  try { await share(data); return "shared"; }
  catch (error) { return error instanceof Error && error.name === "AbortError" ? "cancelled" : "failed"; }
}
export async function copyLink(url: string, write: ((text: string) => Promise<void>) | undefined): Promise<boolean> {
  if (!write) return false;
  try { await write(url); return true; } catch { return false; }
}
