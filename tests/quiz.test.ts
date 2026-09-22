import { describe, expect, it } from "vitest";
import { AXES, BLOOD_TYPES, OPTION_IDS, QUESTION_IDS } from "../src/types/quiz";
import type { Answers, AxisScores, OptionId, Question } from "../src/types/quiz";
import { QUESTIONS } from "../src/lib/quiz/questions";
import { assertAnswers, calculateAxisBounds, calculateRawScores, calculateTypeScores, mapAxes, normalizeAxes, rankTypes, scoreQuiz } from "../src/lib/quiz/scoring";
import { calculateSubtypeScores, selectSubtype, SUBTYPE_ORDER } from "../src/lib/quiz/subtypes";
import { BLOOD_TYPE_PROFILES } from "../src/lib/quiz/bloodTypeProfiles";
import { attachActualType } from "../src/lib/quiz/comparison";
import { getAxisCopy, RESULT_COPY } from "../src/lib/quiz/resultCopy";

const all = (option: OptionId): Answers => Object.fromEntries(QUESTION_IDS.map((id) => [id, option])) as Answers;
const axes = (overrides: Partial<AxisScores> = {}): AxisScores => ({ ...mapAxes(() => 50), ...overrides });

describe("question data", () => {
  it("contains q01–q16, four unique options, legal axis scores and reasons", () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(QUESTION_IDS);
    for (const q of QUESTIONS) {
      expect(q.options.map((o) => o.id)).toEqual(OPTION_IDS);
      for (const o of q.options) {
        expect(o.text.length).toBeGreaterThan(0);
        expect(o.reasonText.length).toBeGreaterThan(0);
        for (const [axis, value] of Object.entries(o.scores)) {
          expect(AXES).toContain(axis);
          expect(Number.isInteger(value)).toBe(true);
          expect(value).toBeGreaterThanOrEqual(-2);
          expect(value).toBeLessThanOrEqual(2);
        }
      }
    }
  });
  it.each([null, undefined, [], {}, { ...all("a"), q16: undefined }, { ...all("a"), q01: "x" }, { ...all("a"), q17: "a" }, Object.create(all("a"))])("rejects incomplete/malformed answers %#", (input) => {
    expect(() => assertAnswers(input)).toThrow();
    expect(() => scoreQuiz(input as Answers)).toThrow();
  });
});

describe("normalization and scoring", () => {
  it("matches independently calculated all-a raw scores", () => {
    expect(calculateRawScores(all("a"))).toEqual({ planning: 10, caution: 15, social: 5, cooperation: 3, sensitivity: 4, freedom: 0, objectivity: 2 });
  });
  it.each(AXES)("reaches 0 and 100 on %s using actual answer combinations", (axis) => {
    for (const [direction, target] of [[1, 0], [-1, 100]] as const) {
      const answers = Object.fromEntries(QUESTIONS.map((q) => [q.id, [...q.options].sort((a, b) => direction * ((a.scores[axis] ?? 0) - (b.scores[axis] ?? 0)))[0].id])) as Answers;
      expect(scoreQuiz(answers).axisScores[axis]).toBe(target);
    }
  });
  it("derives bounds from changed data, includes implicit zero, supports constant axes", () => {
    const changed: readonly Question[] = [{ id: "q01", title: "test", options: [
      { id: "a", text: "a", reasonText: "a", scores: { planning: -2 } },
      { id: "b", text: "b", reasonText: "b", scores: { planning: 2 } },
      { id: "c", text: "c", reasonText: "c", scores: {} },
      { id: "d", text: "d", reasonText: "d", scores: { caution: 1 } },
    ] }];
    const bounds = calculateAxisBounds(changed);
    expect(bounds.planning).toEqual({ min: -2, max: 2 });
    expect(bounds.caution).toEqual({ min: 0, max: 1 });
    const normalized = normalizeAxes(calculateRawScores(all("c"), changed), bounds);
    expect(normalized.planning).toBe(50);
    expect(normalized.social).toBe(50);
    expect(normalized.caution).toBe(0);
    expect(calculateAxisBounds([...changed, ...changed]).planning).toEqual({ min: -4, max: 4 });
  });
  it("clamps values and rounds to nearest integer", () => {
    const bounds = mapAxes(() => ({ min: 0, max: 3 }));
    expect(normalizeAxes(axes({ planning: -9, caution: 9, social: 1, freedom: 2 }), bounds)).toMatchObject({ planning: 0, caution: 100, social: 33, freedom: 67 });
    expect(() => normalizeAxes(axes({ planning: NaN }), bounds)).toThrow();
  });
  it.each(BLOOD_TYPES)("matches prototype %s with similarity 100", (type) => {
    expect(calculateTypeScores(BLOOD_TYPE_PROFILES[type])[type]).toBe(100);
    expect(rankTypes(calculateTypeScores(BLOOD_TYPE_PROFILES[type]))[0]).toBe(type);
  });
  it("uses mean absolute distance, independent percentages, and fixed tie order", () => {
    expect(calculateTypeScores(axes())).toEqual({ A: 76, B: 85, O: 87, AB: 83 });
    expect(rankTypes({ A: 70, B: 70, O: 70, AB: 70 })).toEqual(["A", "B", "O", "AB"]);
    expect(rankTypes({ A: 20, B: 80, O: 80, AB: 70 })).toEqual(["B", "O", "AB", "A"]);
  });
  it.each(OPTION_IDS)("same answers (%s) yield same results without mutation", (option) => {
    const input = Object.freeze(all(option));
    const copy = structuredClone(input);
    expect(scoreQuiz(input)).toEqual(scoreQuiz(input));
    expect(input).toEqual(copy);
  });
  it("validates 4096 deterministic answer combinations and selected-only positive reasons", () => {
    let seed = 12345;
    const seenTypes = new Set<string>();
    for (let i = 0; i < 4096; i++) {
      const answers = Object.fromEntries(QUESTION_IDS.map((id) => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return [id, OPTION_IDS[seed >>> 30]];
      })) as Answers;
      const r = scoreQuiz(answers);
      seenTypes.add(r.primaryType);
      for (const score of [...Object.values(r.axisScores), ...Object.values(r.typeScores)]) {
        expect(Number.isInteger(score)).toBe(true);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
      expect(r.primaryType).not.toBe(r.secondaryType);
      expect(SUBTYPE_ORDER[r.primaryType]).toContain(r.subtype);
      expect(r.scoreGap).toBe(r.typeScores[r.primaryType] - r.typeScores[r.secondaryType]);
      expect(r.isTie).toBe(r.scoreGap === 0);
      expect(r.isClose).toBe(r.scoreGap < 2);
      expect(r.reasons.length).toBeGreaterThan(0);
      expect(r.reasons.length).toBeLessThanOrEqual(3);
      expect(new Set(r.reasons.map((v) => v.questionId)).size).toBe(r.reasons.length);
      for (const reason of r.reasons) {
        expect(reason.optionId).toBe(answers[reason.questionId]);
        expect(reason.contribution).toBeGreaterThan(0);
        expect(reason.reasonText).toBe(QUESTIONS.find((q) => q.id === reason.questionId)!.options.find((o) => o.id === reason.optionId)!.reasonText);
      }
    }
    expect([...seenTypes].sort()).toEqual([...BLOOD_TYPES].sort());
  });
});

describe("subtypes", () => {
  it("implements all 12 formulas without rounding", () => {
    expect(calculateSubtypeScores({ planning: 10, caution: 20, social: 30, cooperation: 40, sensitivity: 50, freedom: 60, objectivity: 70 })).toEqual({
      A1: 15, A2: 45, A3: 140 / 3, B1: 70, B2: 55, B3: 60, O1: 50, O2: 170 / 3, O3: 170 / 3, AB1: 45, AB2: 60, AB3: 170 / 3,
    });
  });
  it.each(BLOOD_TYPES)("resolves %s subtype ties by numeric order", (type) => {
    expect(selectSubtype(type, axes())).toBe(`${type}1`);
  });
  it("every subtype can win within its own blood type", () => {
    const seen = new Set<string>();
    for (let mask = 0; mask < 128; mask++) {
      const profile = mapAxes((axis) => mask & (1 << AXES.indexOf(axis)) ? 100 : 0);
      for (const type of BLOOD_TYPES) seen.add(selectSubtype(type, profile));
    }
    expect([...seen].sort()).toEqual(Object.keys(RESULT_COPY).sort());
  });
});

describe("actualType isolation and fixed content", () => {
  it.each([...BLOOD_TYPES, "unknown", null] as const)("actualType=%s changes no diagnostic field", (actualType) => {
    const diagnosis = scoreQuiz(all("a"));
    const before = structuredClone(diagnosis);
    Object.freeze(diagnosis);
    const compared = attachActualType(diagnosis, actualType);
    expect(compared.diagnosis).toBe(diagnosis);
    expect(compared.diagnosis).toEqual(before);
    expect(compared.isMatch).toBe(actualType === null || actualType === "unknown" ? null : actualType === diagnosis.primaryType);
    expect(scoreQuiz(all("a"))).toEqual(before);
  });
  it("has 12 complete result entries, two strengths and one weakness each", () => {
    expect(Object.keys(RESULT_COPY)).toHaveLength(12);
    for (const entry of Object.values(RESULT_COPY)) {
      expect(entry.strengths).toHaveLength(2);
      expect(entry.weakness.title).toBeTruthy();
      expect(entry.weakness.body).toBeTruthy();
      expect(entry.shortCopy).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });
  it.each(AXES)("switches %s copy at 40 and 75", (axis) => {
    expect(getAxisCopy(axis, 0)).toEqual(getAxisCopy(axis, 39));
    expect(getAxisCopy(axis, 39)).not.toEqual(getAxisCopy(axis, 40));
    expect(getAxisCopy(axis, 40)).toEqual(getAxisCopy(axis, 74));
    expect(getAxisCopy(axis, 74)).not.toEqual(getAxisCopy(axis, 75));
    expect(getAxisCopy(axis, 75)).toEqual(getAxisCopy(axis, 100));
  });
});
