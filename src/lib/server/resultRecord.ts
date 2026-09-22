import { scoreQuiz } from "../quiz/scoring";
import { attachActualType } from "../quiz/comparison";
import type { ResultInput } from "./resultSchema";

export function resultRecord(input: ResultInput) {
  const result = scoreQuiz(input.answers);
  return {
    quiz_version: result.quizVersion, answers: input.answers,
    axis_scores: result.axisScores, type_scores: result.typeScores,
    primary_type: result.primaryType, secondary_type: result.secondaryType,
    subtype: result.subtype, actual_type: input.actualType,
    is_match: attachActualType(result, input.actualType).isMatch,
    score_gap: result.scoreGap, is_tie: result.isTie, is_close: result.isClose,
  };
}
export type ResultRecord = ReturnType<typeof resultRecord>;
