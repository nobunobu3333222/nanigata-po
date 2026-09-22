export const AXES = [
  "planning",
  "caution",
  "social",
  "cooperation",
  "sensitivity",
  "freedom",
  "objectivity"
] as const;
export const BLOOD_TYPES = ["A", "B", "O", "AB"] as const;
export const OPTION_IDS = ["a", "b", "c", "d"] as const;
export const QUESTION_IDS = [
  "q01",
  "q02",
  "q03",
  "q04",
  "q05",
  "q06",
  "q07",
  "q08",
  "q09",
  "q10",
  "q11",
  "q12",
  "q13",
  "q14",
  "q15",
  "q16"
] as const;
export type Axis = (typeof AXES)[number];
export type BloodType = (typeof BLOOD_TYPES)[number];
export type OptionId = (typeof OPTION_IDS)[number];
export type QuestionId = (typeof QUESTION_IDS)[number];
export type SubtypeId = `${BloodType}${1 | 2 | 3}`;
export type ActualType = BloodType | "unknown";
export type AxisScores = Readonly<Record<Axis, number>>;
export type TypeScores = Readonly<Record<BloodType, number>>;
export type Answers = Readonly<Record<QuestionId, OptionId>>;
export interface QuestionOption {
 readonly id: OptionId;
 readonly text: string;
 readonly reasonText: string;
 readonly scores: Readonly<Partial<Record<Axis, number>>>;
}
export interface Question {
 readonly id: QuestionId;
 readonly title: string;
 readonly options: readonly QuestionOption[];
}
export interface AnswerReason {
 readonly questionId: QuestionId;
 readonly optionId: OptionId;
 readonly reasonText: string;
 readonly contribution: number;
}
export interface QuizResult {
 readonly quizVersion: string;
 readonly rawScores: AxisScores;
 readonly axisScores: AxisScores;
 readonly typeScores: TypeScores;
 readonly primaryType: BloodType;
 readonly secondaryType: BloodType;
 readonly subtype: SubtypeId;
 readonly reasons: readonly AnswerReason[];
 readonly scoreGap: number;
 readonly isTie: boolean;
 readonly isClose: boolean;
}
