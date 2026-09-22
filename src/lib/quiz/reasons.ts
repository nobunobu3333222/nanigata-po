import type { AnswerReason, Answers, AxisScores, BloodType } from "../../types/quiz";
import { QUESTIONS } from "./questions";
import { mapAxes, normalizeAxes, typeSimilarity } from "./scoreMath";
import type { AxisBounds } from "./scoreMath";
import { MAX_ANSWER_REASONS } from "./versions";

export function extractAnswerReasons(
  answers: Answers, primaryType: BloodType, raw: AxisScores, bounds: AxisBounds,
): readonly AnswerReason[] {
  const currentSimilarity = typeSimilarity(normalizeAxes(raw, bounds), primaryType);
  return QUESTIONS.map((question) => {
    const selected = question.options.find((option) => option.id === answers[question.id])!;
    const alternatives = question.options.filter((option) => option.id !== selected.id);
    // 他回答へ置換したときの平均類似度との差。丸め前のtypeScoreで寄与を比較する。
    const alternativeAverage = alternatives.reduce((sum, option) => {
      const replaced = mapAxes((axis) => raw[axis] - (selected.scores[axis] ?? 0) + (option.scores[axis] ?? 0));
      return sum + typeSimilarity(normalizeAxes(replaced, bounds), primaryType);
    }, 0) / alternatives.length;
    return {
      questionId: question.id, optionId: selected.id, reasonText: selected.reasonText,
      contribution: currentSimilarity - alternativeAverage,
    };
  })
    .filter((reason) => reason.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution || a.questionId.localeCompare(b.questionId))
    .slice(0, MAX_ANSWER_REASONS);
}
