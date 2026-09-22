import type { Answers, QuizResult } from "../../types/quiz";
import { assertAnswers, calculateAxisBounds, calculateRawScores, normalizeAxes, calculateTypeScores, rankTypes } from "./scoreMath";
import { selectSubtype } from "./subtypes";
import { CLOSE_SCORE_GAP, CURRENT_QUIZ_VERSION } from "./versions";
import { extractAnswerReasons } from "./reasons";
export * from "./scoreMath";

// actualTypeを引数に持たせない。UI・サーバー共通の純粋な診断入口。
export function scoreQuiz(answers: Answers): QuizResult {
  assertAnswers(answers);
  const bounds = calculateAxisBounds();
  const rawScores = calculateRawScores(answers);
  const axisScores = normalizeAxes(rawScores, bounds);
  const typeScores = calculateTypeScores(axisScores);
  const [primaryType, secondaryType] = rankTypes(typeScores);
  const scoreGap = typeScores[primaryType] - typeScores[secondaryType];
  return {
    quizVersion: CURRENT_QUIZ_VERSION, rawScores, axisScores, typeScores,
    primaryType, secondaryType, subtype: selectSubtype(primaryType, axisScores),
    reasons: extractAnswerReasons(answers, primaryType, rawScores, bounds),
    scoreGap, isTie: scoreGap === 0, isClose: scoreGap < CLOSE_SCORE_GAP,
  };
}
