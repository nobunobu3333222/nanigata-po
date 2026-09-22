import type { AxisScores, BloodType, SubtypeId } from "../../types/quiz";

export const SUBTYPE_ORDER: Readonly<Record<BloodType, readonly SubtypeId[]>> = {
  A: ["A1", "A2", "A3"], B: ["B1", "B2", "B3"],
  O: ["O1", "O2", "O3"], AB: ["AB1", "AB2", "AB3"],
};

export function calculateSubtypeScores(s: AxisScores): Readonly<Record<SubtypeId, number>> {
  return {
    A1: (s.planning + s.caution) / 2,
    A2: (s.cooperation + s.sensitivity) / 2,
    A3: (s.caution + s.sensitivity + (100 - s.social)) / 3,
    B1: (s.freedom + (100 - s.caution)) / 2,
    B2: (s.freedom + s.sensitivity) / 2,
    B3: (s.freedom + (100 - s.cooperation)) / 2,
    O1: (s.social + s.objectivity) / 2,
    O2: (s.social + s.freedom + (100 - s.caution)) / 3,
    O3: (s.objectivity + s.cooperation + s.freedom) / 3,
    AB1: (s.objectivity + s.caution) / 2,
    AB2: (s.sensitivity + s.freedom + (100 - s.social)) / 3,
    AB3: (s.objectivity + s.cooperation + s.freedom) / 3,
  };
}

export function selectSubtype(primaryType: BloodType, axes: AxisScores): SubtypeId {
  const scores = calculateSubtypeScores(axes);
  // 丸める前の式の値で比較。同点は仕様のID順を維持する。
  return SUBTYPE_ORDER[primaryType].reduce((best, candidate) =>
    scores[candidate] > scores[best] ? candidate : best,
  );
}
