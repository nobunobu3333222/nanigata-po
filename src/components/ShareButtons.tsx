"use client";
import { useRef, useState } from "react";
import type { QuizResult } from "../types/quiz";
import { copyLink, makeShareText, nativeShare, publicShareUrl, shareLinks } from "../lib/quiz/share";

export function ShareButtons({ result }: { result: QuizResult }) {
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState(false);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const url = publicShareUrl(typeof window === "undefined" ? "" : window.location.origin);
  const links = shareLinks(result, url);
  async function share() {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    setMessage("共有画面を開いています。開かない場合は、LINE・X・リンクコピーをご利用ください。");
    const outcome = await nativeShare({ title: "何型っぽ？", text: makeShareText(result), url }, typeof navigator.share === "function" ? navigator.share.bind(navigator) : undefined);
    const messages = { shared: "共有しました！", cancelled: "共有をキャンセルしました。結果はそのままご覧いただけます。", unsupported: "下のLINE・X・リンクコピーから共有できます。", failed: "共有できませんでした。LINE・X・リンクコピーをお試しください。" };
    setMessage(messages[outcome]); setBusy(false); lock.current = false;
  }
  async function copy() {
    const ok = await copyLink(url, navigator.clipboard?.writeText.bind(navigator.clipboard));
    setFallback(!ok);
    setMessage(ok ? "リンクをコピーしました！" : "コピーできませんでした。下のリンクを選択してコピーしてください。");
  }
  return <section className="share-section" aria-labelledby="share-heading">
    <p className="eyebrow">PASS IT ON</p><h2 id="share-heading">友達は、何型っぽい？</h2><p>「私、こんな結果だった！」<br />ちょっとした会話のきっかけに。</p>
    <button className="button primary" disabled={busy} onClick={share}>結果をシェアする <span aria-hidden="true">↗</span></button>
    <div className="share-links"><a className="button secondary line" href={links.line} target="_blank" rel="noopener noreferrer">LINEで送る</a><a className="button secondary" href={links.x} target="_blank" rel="noopener noreferrer">Xでシェア</a></div>
    <button className="text-button" onClick={copy}>リンクをコピー</button>
    <p className="share-status fine" role="status">{message}</p>
    {fallback && <label className="copy-fallback">共有リンク<input readOnly value={url} onFocus={(event) => event.currentTarget.select()} /></label>}
    <p className="fine">共有する内容に、本当の血液型は含まれません。</p>
  </section>;
}
