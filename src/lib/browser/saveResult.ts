import type { Answers, ActualType } from "../../types/quiz";
import { CURRENT_QUIZ_VERSION } from "../quiz/versions";
export type SaveOutcome = "saved" | "limited" | "failed";
export async function saveAnonymousResult(answers: Answers, actualType: ActualType): Promise<SaveOutcome> {
  try {
    const response = await fetch("/api/results", {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizVersion: CURRENT_QUIZ_VERSION, answers, actualType }),
      signal: AbortSignal.timeout(12000),
    });
    if (response.status === 429) return "limited";
    if (!response.ok) return "failed";
    const body: unknown = await response.json();
    return typeof body === "object" && body !== null && "success" in body && body.success === true ? "saved" : "failed";
  } catch { return "failed"; }
}
