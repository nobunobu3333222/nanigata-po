import { AXES, BLOOD_TYPES, OPTION_IDS, QUESTION_IDS } from "../../types/quiz";
import type { Answers, Axis, AxisScores, BloodType, Question, TypeScores } from "../../types/quiz";
import { QUESTIONS } from "./questions";
import { BLOOD_TYPE_PROFILES } from "./bloodTypeProfiles";

export type AxisBounds = Readonly<Record<Axis, Readonly<{ min: number; max: number }>>>;
export const mapAxes = <T>(map: (axis: Axis) => T): Record<Axis, T> =>
  Object.fromEntries(AXES.map((axis) => [axis, map(axis)])) as Record<Axis, T>;
const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function assertAnswers(value: unknown): asserts value is Answers {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid answers");
  const record = value as Record<string, unknown>;
  // localStorage/APIから来るデータも信頼しない。自分自身の16キーのみ許可する。
  if (Reflect.ownKeys(record).length !== QUESTION_IDS.length ||
    !QUESTION_IDS.every((id) => Object.hasOwn(record, id) && OPTION_IDS.some((option) => record[id] === option))) {
    throw new Error("Expected all 16 answers with options a/b/c/d");
  }
}

export function calculateAxisBounds(questions: readonly Question[] = QUESTIONS): AxisBounds {
  return mapAxes((axis) => questions.reduce((bounds, question) => {
    if (question.options.length === 0) throw new Error("Question has no options");
    const scores = question.options.map((option) => option.scores[axis] ?? 0);
    if (!scores.every(Number.isFinite)) throw new Error("Invalid question score");
    return { min: bounds.min + Math.min(...scores), max: bounds.max + Math.max(...scores) };
  }, { min: 0, max: 0 }));
}

export function calculateRawScores(answers: Answers, questions: readonly Question[] = QUESTIONS): AxisScores {
  return mapAxes((axis) => questions.reduce((sum, question) => {
    const option = question.options.find((candidate) => candidate.id === answers[question.id]);
    if (!option) throw new Error("Missing or invalid answer");
    return sum + (option.scores[axis] ?? 0);
  }, 0));
}

export function normalizeAxes(raw: AxisScores, bounds: AxisBounds): AxisScores {
  return mapAxes((axis) => {
    const { min, max } = bounds[axis];
    if (![raw[axis], min, max].every(Number.isFinite) || max < min) throw new Error("Invalid axis range");
    // 将来、全選択肢が同配点になった軸は情報がないため中立の50とする。
    return max === min ? 50 : Math.round(clamp((raw[axis] - min) / (max - min) * 100));
  });
}

export function typeSimilarity(axes: AxisScores, type: BloodType): number {
  const distance = AXES.reduce((sum, axis) => {
    if (!Number.isFinite(axes[axis])) throw new Error("Invalid axis score");
    return sum + Math.abs(axes[axis] - BLOOD_TYPE_PROFILES[type][axis]);
  }, 0) / AXES.length;
  return clamp(100 - distance);
}

export function calculateTypeScores(axes: AxisScores): TypeScores {
  return Object.fromEntries(BLOOD_TYPES.map((type) => [type, Math.round(typeSimilarity(axes, type))])) as TypeScores;
}

export function rankTypes(scores: TypeScores): readonly BloodType[] {
  return [...BLOOD_TYPES].sort((a, b) => scores[b] - scores[a] || BLOOD_TYPES.indexOf(a) - BLOOD_TYPES.indexOf(b));
}

