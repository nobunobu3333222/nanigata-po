import { z } from "zod";
import { QUESTION_IDS, OPTION_IDS, BLOOD_TYPES } from "../../types/quiz";
import { CURRENT_QUIZ_VERSION } from "../quiz/versions";

export const resultInputSchema = z.strictObject({
  quizVersion: z.literal(CURRENT_QUIZ_VERSION),
  answers: z.unknown().refine((value) => typeof value === "object" && value !== null && QUESTION_IDS.every((id) => Object.hasOwn(value, id))).pipe(z.record(z.enum(QUESTION_IDS), z.enum(OPTION_IDS))),
  actualType: z.enum([...BLOOD_TYPES, "unknown"]),
});
export type ResultInput = z.infer<typeof resultInputSchema>;
export const MAX_BODY_BYTES = 2048;
