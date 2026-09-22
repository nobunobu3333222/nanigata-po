import type { AxisScores, BloodType } from "../../types/quiz";

// エンタメ上の初期仮説。科学的分類・実血液型の確率ではない。
export const BLOOD_TYPE_PROFILES: Readonly<Record<BloodType, AxisScores>> = {
  "A": {
    "planning": 85,
    "caution": 90,
    "social": 45,
    "cooperation": 85,
    "sensitivity": 70,
    "freedom": 25,
    "objectivity": 55
  },
  "B": {
    "planning": 35,
    "caution": 30,
    "social": 55,
    "cooperation": 35,
    "sensitivity": 50,
    "freedom": 90,
    "objectivity": 40
  },
  "O": {
    "planning": 55,
    "caution": 50,
    "social": 75,
    "cooperation": 60,
    "sensitivity": 40,
    "freedom": 60,
    "objectivity": 80
  },
  "AB": {
    "planning": 55,
    "caution": 65,
    "social": 35,
    "cooperation": 55,
    "sensitivity": 75,
    "freedom": 65,
    "objectivity": 90
  }
};
