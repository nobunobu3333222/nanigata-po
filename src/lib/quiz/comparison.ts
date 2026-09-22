import type { ActualType, QuizResult } from "../../types/quiz";

// 診断後の付加情報。元の診断結果は再計算・変更せずに保持する。
export function attachActualType(diagnosis: QuizResult, actualType: ActualType | null) {
  return {
    diagnosis,
    actualType,
    isMatch: actualType === null || actualType === "unknown" ? null : diagnosis.primaryType === actualType,
  } as const;
}
