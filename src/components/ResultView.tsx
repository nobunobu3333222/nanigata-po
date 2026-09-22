"use client";
import { useMemo } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AXES, BLOOD_TYPES } from "../types/quiz";
import { scoreQuiz } from "../lib/quiz/scoring";
import { getAxisCopy, RESULT_COPY } from "../lib/quiz/resultCopy";
import { AXIS_LABELS, SECONDARY_COPY, TYPE_THEMES } from "../lib/quiz/presentation";
import { useHydrated, useQuizSession } from "./QuizSession";
import { ActualTypeSelector } from "./ActualTypeSelector";
import { ShareButtons } from "./ShareButtons";
import { emptyProgress, saveProgress } from "../lib/browser/storage";
import { Disclaimer } from "./SiteChrome";

export function ResultView() {
  const hydrated = useHydrated();
  const { answers, reset } = useQuizSession();
  const router = useRouter();
  const result = useMemo(() => answers ? scoreQuiz(answers) : null, [answers]);
  if (!hydrated) return <main className="result-shell"><p role="status">結果を読み込んでいます…</p></main>;
  if (!result || !answers) return <main className="quiz-shell missing-result"><p className="eyebrow">LET’S TRY</p><h1>診断結果が<br />見つかりません</h1><p>もう一度診断してみよう！</p><Link className="button primary" href="/quiz">診断をはじめる <span aria-hidden="true">↗</span></Link></main>;
  const copy = RESULT_COPY[result.subtype];
  const theme = TYPE_THEMES[result.primaryType];
  const themeStyle = { "--type-color": theme.color, "--type-light": theme.light, "--type-ink": theme.ink } as CSSProperties;
  function retry() { reset(true); saveProgress(emptyProgress()); router.push("/quiz"); }
  return <main className="result-shell" style={themeStyle}>
    <section className="result-hero" aria-labelledby="result-heading" data-testid="result-hero">
      <span className="hero-watermark" aria-hidden="true">{result.primaryType}</span>
      <p className="result-brand">何型っぽ？ <span>血液型印象診断</span></p>
      <p className="hero-intro">あなたは……</p><h1 id="result-heading"><span>{result.primaryType}</span>型っぽ！</h1>
      <p className="result-score-label">{result.primaryType}型っぽさ指数</p><p className="result-score">{result.typeScores[result.primaryType]}<span>%</span></p>
      <p className="subtype-badge">{copy.name}</p><p className="hero-copy">{copy.shortCopy}</p><span className="hero-spark" aria-hidden="true">✳</span>
    </section>
    <p className="score-disclaimer">※血液型を予測する確率ではなく、本診断内での印象類似度です。</p>
    <section className="result-card strengths" aria-labelledby="strength-heading"><p className="eyebrow">YOUR GOOD SIDE</p><h2 id="strength-heading">あなたのいいところ</h2>
      {copy.strengths.map((strength) => <div className="trait" key={strength.title}><span className="trait-icon" aria-hidden="true">✓</span><div><h3>{strength.title}</h3><p>{strength.body}</p></div></div>)}
      <div className="weakness"><p className="eyebrow">ちょっとだけ注意</p><h3>{copy.weakness.title}</h3><p>{copy.weakness.body}</p></div>
    </section>
    <section className="result-card" aria-labelledby="profile-heading" data-testid="axis-profile"><p className="eyebrow">YOUR 7 SIDES</p><h2 id="profile-heading">あなたの見られ方</h2><p className="section-description">7つの傾向から見えてきた、あなたらしさ。</p>
      <div className="axis-list">{AXES.map((axis) => { const score = result.axisScores[axis]; const text = getAxisCopy(axis, score); return <details className="axis" key={axis}>
        <summary><span className="axis-label">{AXIS_LABELS[axis]}<span><strong>{score}</strong><span className="axis-expand" aria-hidden="true">＋</span></span></span><span className="axis-track" aria-hidden="true"><span style={{ width: `${score}%` }} /></span></summary>
        <div className="axis-copy"><h3>{text.title}</h3><p>{text.body}</p></div>
      </details>; })}</div><p className="fine">項目をタップすると、詳しい傾向が見られます。</p>
    </section>
    <section className="result-card" aria-labelledby="why-heading"><p className="eyebrow">IT’S IN YOUR ANSWERS</p><h2 id="why-heading">なんで{result.primaryType}型っぽい？</h2><div className="result-description">{copy.description.split("\n\n").map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
      <h3 className="reasons-heading">こんな回答が結果につながりました。</h3><ul className="reasons">{result.reasons.map((reason) => <li key={reason.questionId}><span className="reason-number">Q{reason.questionId.slice(1)}</span><span>{reason.reasonText}</span></li>)}</ul>
    </section>
    <section className="result-card secondary-card" aria-labelledby="secondary-heading"><div><p className="eyebrow">ANOTHER SIDE</p><h2 id="secondary-heading">隠れ{result.secondaryType}型っぽさも</h2><p>{SECONDARY_COPY[result.secondaryType]}</p></div><p className="secondary-score"><span>{result.secondaryType}型っぽさ</span><strong>{result.typeScores[result.secondaryType]}<small>%</small></strong></p></section>
    <details className="all-types"><summary>4タイプのっぽさ指数を見る</summary><dl>{BLOOD_TYPES.map((type) => <div key={type}><dt>{type}型っぽさ</dt><dd>{result.typeScores[type]}%</dd></div>)}</dl><p className="fine">それぞれの印象との類似度のため、合計100%にはなりません。</p></details>
    <ActualTypeSelector result={result} answers={answers} /><ShareButtons result={result} />
    <p className="fine"><Link href={`/blood-type/${result.primaryType.toLowerCase()}`}>{result.primaryType}型っぽい人の特徴を読む</Link></p>
    <div className="retry-section"><button className="button secondary" onClick={retry}>もう一度診断する <span aria-hidden="true">↻</span></button><Disclaimer /></div>
  </main>;
}
