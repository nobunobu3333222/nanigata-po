import { OPTION_IDS, QUESTION_IDS } from "../../types/quiz";
import type { Answers, OptionId, QuestionId } from "../../types/quiz";
import { assertAnswers } from "../quiz/scoreMath";
import { CURRENT_QUIZ_VERSION } from "../quiz/versions";

export const PROGRESS_KEY = "nanigata_quiz_progress_v1";
export const RESULT_KEY = "nanigata_quiz_result_v1";
export interface Progress {
  quizVersion: string;
  currentQuestion: number;
  answers: Partial<Record<QuestionId, OptionId>>;
}
const MAX_STORAGE_LENGTH = 4096;
export const emptyProgress = (): Progress => ({ quizVersion: CURRENT_QUIZ_VERSION, currentQuestion: 0, answers: {} });

export function parseProgress(raw: string | null): Progress | null {
  if (!raw || raw.length > MAX_STORAGE_LENGTH) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    const v = value as Record<string, unknown>;
    if (v.quizVersion !== CURRENT_QUIZ_VERSION || !Number.isInteger(v.currentQuestion) ||
        (v.currentQuestion as number) < 0 || (v.currentQuestion as number) >= QUESTION_IDS.length ||
        !v.answers || typeof v.answers !== "object" || Array.isArray(v.answers)) return null;
    const entries = Object.entries(v.answers);
    if (entries.length > QUESTION_IDS.length || !entries.every(([id, option]) =>
      QUESTION_IDS.some((q) => q === id) && OPTION_IDS.some((o) => o === option))) return null;
    const answers = Object.fromEntries(entries) as Progress["answers"];
    // 後の質問へ飛ぶ壊れた保存データは復元しない。戻った後の回答は保持できる。
    if (!QUESTION_IDS.slice(0, v.currentQuestion as number).every((id) => answers[id])) return null;
    return { quizVersion: CURRENT_QUIZ_VERSION, currentQuestion: v.currentQuestion as number, answers };
  } catch { return null; }
}
export function parseResult(raw: string | null): Answers | null {
  if (!raw || raw.length > MAX_STORAGE_LENGTH) return null;
  try {
    const value = JSON.parse(raw) as Record<string, unknown> | null;
    if (value?.quizVersion !== CURRENT_QUIZ_VERSION) return null;
    assertAnswers(value.answers);
    return value.answers;
  } catch { return null; }
}
export function readProgress(): Progress | null {
  try { return typeof window === "undefined" ? null : parseProgress(window.localStorage.getItem(PROGRESS_KEY)); }
  catch { return null; }
}
export function readResult(): Answers | null {
  try { return typeof window === "undefined" ? null : parseResult(window.sessionStorage.getItem(RESULT_KEY)); }
  catch { return null; }
}
export function saveProgress(progress: Progress): boolean {
  try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); return true; }
  catch { return false; }
}
export function saveResult(answers: Answers): boolean {
  // actualTypeは永続化しない。タブ内の再読み込み用に回答だけを保存する。
  try { window.sessionStorage.setItem(RESULT_KEY, JSON.stringify({ quizVersion: CURRENT_QUIZ_VERSION, answers })); return true; }
  catch { return false; }
}
export function removeProgress(): void {
  try { window.localStorage.removeItem(PROGRESS_KEY); } catch { /* 保存不可でも診断を妨げない */ }
}
export function removeResult(): void {
  try { window.sessionStorage.removeItem(RESULT_KEY); } catch { /* メモリ上では常にリセットする */ }
}
