"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { BLOOD_TYPES } from "../types/quiz";
import type { ActualType, Answers, QuizResult } from "../types/quiz";
import { attachActualType } from "../lib/quiz/comparison";
import { saveAnonymousResult, type SaveOutcome } from "../lib/browser/saveResult";

export function ActualTypeSelector({ result, answers }: { result: QuizResult; answers: Answers }) {
  const [actualType, setActualType] = useState<ActualType | null>(null);
  const [saveState, setSaveState] = useState<SaveOutcome | "idle" | "saving">("idle");
  const selected = useRef<ActualType | null>(null);
  const outcomes = useRef(new Map<ActualType, SaveOutcome | "saving">());
  async function select(type: ActualType) {
    setActualType(type);
    selected.current = type;
    const previous = outcomes.current.get(type);
    if (previous) { setSaveState(previous); return; }
    outcomes.current.set(type, "saving");
    setSaveState("saving");
    const outcome = await saveAnonymousResult(answers, type);
    outcomes.current.set(type, outcome);
    if (selected.current === type) setSaveState(outcome);
  }
  const comparison = attachActualType(result, actualType);
  const primaryType = result.primaryType;
  const title = actualType === "unknown" ? `あなたは${primaryType}型っぽい人！` : comparison.isMatch ? `やっぱり${actualType}型！` : `予想は${primaryType}型、実際は${actualType}型！`;
  return <section className="result-card actual-section" aria-labelledby="actual-heading">
    <p className="eyebrow">ONE MORE THING</p><h2 id="actual-heading">ところで、<br />本当の血液型は？</h2><p>診断結果と比べてみよう。</p>
    <fieldset><legend className="sr-only">本当の血液型</legend><div className="actual-options">
      {[...BLOOD_TYPES, "unknown" as const].map((type) => <button type="button" key={type} aria-pressed={actualType === type} onClick={() => void select(type)} className={`actual-option ${type === "unknown" ? "unknown" : ""}`}>{type === "unknown" ? "わからない" : `${type}型`}</button>)}
    </div></fieldset>
    <p className="fine">選択は任意です。入力しても診断結果は変わりません。<br />選択すると、回答・診断結果・本当の血液型を匿名で保存し、利用状況の把握や診断の改善に活用します。<Link href="/privacy">データの取り扱い</Link></p>
    <p className="fine" role="status">{saveState === "saving" ? "匿名データを保存しています…" : saveState === "saved" ? "匿名データを保存しました。ご協力ありがとうございます。" : saveState === "limited" ? "保存回数の上限に達しました。診断結果はそのままご覧いただけます。" : saveState === "failed" ? "保存に失敗しました。診断結果はそのままご覧いただけます。" : ""}</p>
    <div aria-live="polite" aria-atomic="true">{actualType && <div className="comparison" data-testid="comparison">
      <p className="eyebrow">{actualType === "unknown" ? "YOUR IMPRESSION" : comparison.isMatch ? "ぴったり、一致！" : "おっ、意外なギャップ！"}</p><h3>{title}</h3>
      {actualType === "unknown" ? <p>本当の血液型が分からなくてもOK。今回の診断では、あなたの日常行動から「{primaryType}型っぽい印象」が最も強く出ました。</p> : <>
        <div className="comparison-types"><div><span>予想</span><strong>{primaryType}<small>型</small></strong></div><span aria-hidden="true">↔</span><div><span>実際</span><strong>{actualType}<small>型</small></strong></div></div>
        <p>{comparison.isMatch ? `本当の血液型と、日常行動から受ける印象が一致しました。あなたは周りから見ても、${actualType}型らしい印象を持たれやすいのかもしれません。` : `血液型は違いましたが、あなたの日常行動からは「${primaryType}型っぽい印象」が強く出ました。本当の血液型とのギャップも、あなたらしさの一つかもしれません。`}</p>
      </>}
    </div>}</div>
  </section>;
}
