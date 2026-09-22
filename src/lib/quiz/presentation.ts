import type { Axis, BloodType, QuestionId } from "../../types/quiz";

export const AXIS_LABELS: Record<Axis, string> = {
  planning: "計画性", caution: "慎重さ", social: "社交性", cooperation: "協調性",
  sensitivity: "感受性", freedom: "自由度", objectivity: "客観性",
};
export const TYPE_THEMES: Record<BloodType, { color: string; light: string; ink: string }> = {
  A: { color: "#FF7187", light: "#FFF0F3", ink: "#96283E" },
  B: { color: "#FFB72B", light: "#FFF6DA", ink: "#805000" },
  O: { color: "#55B7F3", light: "#EAF7FF", ink: "#155C88" },
  AB: { color: "#9A79E8", light: "#F4EFFF", ink: "#61409A" },
};
export const QUESTION_PROMPTS: Record<QuestionId, string> = {
  q01: "旅行の予定。どのくらい決めておきたい？",
  q02: "初めてのお店に行くなら、どう選ぶ？",
  q03: "友達との待ち合わせ。普段はどのくらいに着く？",
  q04: "LINEの返信、いつ返すことが多い？",
  q05: "予定がなくなった休日。どう過ごす？",
  q06: "お店でのメニュー選び。あなたに近いのは？",
  q07: "部屋の片付け、いつすることが多い？",
  q08: "友達が落ち込んでいる。あなたならどうする？",
  q09: "SNSへの投稿。あなたに近いのは？",
  q10: "ミスをしてしまったとき、どうする？",
  q11: "街で知り合いを発見。あなたなら？",
  q12: "鍵を閉めたか心配になったら？",
  q13: "自分だけ違う意見。そんなときは？",
  q14: "新しい趣味にハマったとき、どうなる？",
  q15: "「やめた方がいい」と言われたら？",
  q16: "大人数で過ごしたあと。あなたの気持ちは？",
};
export const SECONDARY_COPY: Record<BloodType, string> = {
  A: "慎重さや気配りの面では、A型っぽい印象も持っています。",
  B: "自分の感覚を大切にしたり、好奇心で動いたりするところにはB型っぽさも。",
  O: "人当たりの柔らかさや、現実的に判断するところにはO型っぽさもあります。",
  AB: "一歩引いて考えたり、自分なりの感覚を持っていたりするところにはAB型っぽさも。",
};
export const ANSWER_TRANSITION_MS = 200;
export const ANALYSIS_MS = 750;
export const DISCLAIMER = "この診断は、一般的に語られる血液型のイメージをもとにしたエンタメコンテンツです。血液型と性格の科学的な関連性を示すものではありません。";
