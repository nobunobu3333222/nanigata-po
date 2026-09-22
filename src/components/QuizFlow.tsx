"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../lib/quiz/questions";
import { ANALYSIS_MS, ANSWER_TRANSITION_MS, QUESTION_PROMPTS } from "../lib/quiz/presentation";
import { assertAnswers } from "../lib/quiz/scoreMath";
import { emptyProgress, readProgress, saveProgress } from "../lib/browser/storage";
import type { OptionId } from "../types/quiz";
import { useHydrated, useQuizSession } from "./QuizSession";

export function QuizFlow() {
  const router = useRouter();
  const session = useQuizSession();
  const hydrated = useHydrated();
  const [initial] = useState(readProgress);
  const [progress, setProgress] = useState(initial ?? emptyProgress());
  const [screen, setScreen] = useState<"intro" | "questions" | "analysis">(initial || session.startImmediately ? "questions" : "intro");
  const [selected, setSelected] = useState<OptionId | null>(null);
  const [storageFailed, setStorageFailed] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (hydrated && screen !== "intro") {
      window.scrollTo(0, 0);
      heading.current?.focus({ preventScroll: true });
    }
  }, [hydrated, progress.currentQuestion, screen]);

  function persist(next: typeof progress) { setProgress(next); setStorageFailed(!saveProgress(next)); }
  function start() { session.reset(); persist(emptyProgress()); setScreen("questions"); }
  function previous() {
    if (timer.current) clearTimeout(timer.current);
    locked.current = false; setSelected(null);
    if (progress.currentQuestion === 0) setScreen("intro");
    else persist({ ...progress, currentQuestion: progress.currentQuestion - 1 });
  }
  function answer(option: OptionId) {
    if (locked.current) return;
    locked.current = true; setSelected(option);
    const answers = { ...progress.answers, [QUESTIONS[progress.currentQuestion].id]: option };
    // タップ直後に保存するため、アニメーション中のリロードでも回答を失わない。
    persist({ ...progress, answers });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => {
      if (progress.currentQuestion < QUESTIONS.length - 1) {
        persist({ ...progress, answers, currentQuestion: progress.currentQuestion + 1 });
        locked.current = false; setSelected(null);
      } else {
        assertAnswers(answers);
        setScreen("analysis");
        timer.current = setTimeout(() => { session.complete(answers); router.push("/result"); }, ANALYSIS_MS);
      }
    }, reduced ? 0 : ANSWER_TRANSITION_MS);
  }

  if (!hydrated) return <main className="quiz-shell"><p role="status">診断を準備しています…</p></main>;
  if (screen === "intro") return <main className="quiz-shell intro">
    <p className="eyebrow">BE YOURSELF</p><div className="intro-mark" aria-hidden="true">？</div>
    <h1>いつものあなたを、<br />そのまま選んで。</h1>
    <p>16問の日常シーンから<br />あなたの「見られ方」を診断します。</p>
    <div className="intro-note"><p>正解・不正解はありません。</p><p>実際の自分に一番近いものを<br />直感で選んでください。</p></div>
    <button className="button primary" onClick={start}>診断スタート <span aria-hidden="true">↗</span></button>
    <p className="fine">約2分 · 登録不要<br />※エンタメとしてお楽しみください。</p>
  </main>;
  if (screen === "analysis") return <main className="quiz-shell analysis" aria-live="polite">
    <div className="analysis-orbit" aria-hidden="true"><span>？</span></div>
    <h1 ref={heading} tabIndex={-1}>あなたの「見られ方」を<br />分析しています…</h1>
    <p>16個の答えから、あなたらしさを。</p><div className="trait-pills"><span>計画性</span><span>慎重さ</span><span>社交性</span><span>自由度</span></div>
  </main>;
  const question = QUESTIONS[progress.currentQuestion];
  const completed = Object.keys(progress.answers).length;
  return <main className="quiz-shell">
    <div className="quiz-toolbar"><button className="back-button" onClick={previous} aria-label={progress.currentQuestion === 0 ? "診断説明へ戻る" : "前の質問へ戻る"}>←</button><p className="question-counter">Q <strong>{String(progress.currentQuestion + 1).padStart(2, "0")}</strong><span> / {QUESTIONS.length}</span></p><span className="fine">{completed}問回答済み</span></div>
    <progress className="quiz-progress" aria-label="診断の回答進捗" max={QUESTIONS.length} value={completed} />
    <section className="question-section" aria-labelledby="question-title">
      <p className="eyebrow">{question.title}</p><h1 ref={heading} tabIndex={-1} id="question-title">{QUESTION_PROMPTS[question.id]}</h1>
      <p className="question-hint">いちばん近いものを、ひとつ。</p>
      <div className="answers" aria-label="回答の選択肢">
        {question.options.map((option) => <button key={`${question.id}-${option.id}`} className={`answer ${selected === option.id ? "selected" : ""}`} aria-pressed={(selected ?? progress.answers[question.id]) === option.id} aria-disabled={selected !== null} onClick={() => answer(option.id)}>
          <span className="option-letter" aria-hidden="true">{option.id.toUpperCase()}</span><span>{option.text}</span><span className="option-check" aria-hidden="true">{(selected ?? progress.answers[question.id]) === option.id ? "✓" : ""}</span>
        </button>)}
      </div>
    </section>
    <p className="quiz-footnote" role="status">{storageFailed ? "このブラウザでは途中保存ができません。このまま診断を続けられます。" : "回答は自動で保存されます。あとから戻って変更もできます。"}</p>
  </main>;
}
