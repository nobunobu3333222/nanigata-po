import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { resultRecord } from "../src/lib/server/resultRecord";
import { QUESTION_IDS, type Answers } from "../src/types/quiz";

// 本物のPostgreSQLエンジンを使うローカル検証。Supabase実環境のData API確認とは区別する。
const db = new PGlite();
const answers = Object.fromEntries(QUESTION_IDS.map((id) => [id, "a"])) as Answers;
const record = resultRecord({ quizVersion: "1.0", answers, actualType: "unknown" });
const columns = Object.keys(record);
const insert = `insert into public.quiz_results (${columns.join(",")}) values (${columns.map((_, i) => `$${i + 1}`).join(",")})`;
const values = (value: Record<string, unknown>) => columns.map((key) => typeof value[key] === "object" && value[key] !== null ? JSON.stringify(value[key]) : value[key]);
beforeAll(async () => {
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  await db.exec(await readFile("supabase/migrations/202609200001_quiz_results.sql", "utf8"));
}, 15000);
afterAll(async () => { await db.close(); });
describe("migration and database access", () => {
  it("enables RLS with no public policies", async () => {
    const result = await db.query("select relrowsecurity from pg_class where oid = 'public.quiz_results'::regclass");
    expect(result.rows).toEqual([{ relrowsecurity: true }]);
    expect((await db.query("select * from pg_policies where tablename='quiz_results'")).rows).toHaveLength(0);
  });
  for (const role of ["anon", "authenticated"]) {
    for (const [operation, query] of Object.entries({ SELECT: "select * from public.quiz_results", INSERT: "insert into public.quiz_results default values", UPDATE: "update public.quiz_results set actual_type='A'", DELETE: "delete from public.quiz_results" })) {
      it(`${role} ${operation} is denied`, async () => {
        await db.exec(`set role ${role}`);
        try { await expect(db.query(query)).rejects.toMatchObject({ code: "42501" }); }
        finally { await db.exec("reset role"); }
      });
    }
  }
  it("permits only service-role INSERT", async () => {
    await db.exec("set role service_role");
    try {
      await db.query(insert, values(record));
      for (const query of ["select * from public.quiz_results", "update public.quiz_results set actual_type='A'", "delete from public.quiz_results"]) await expect(db.query(query)).rejects.toMatchObject({ code: "42501" });
    } finally { await db.exec("reset role"); }
    expect((await db.query("select count(*)::int as count from public.quiz_results")).rows).toEqual([{ count: 1 }]);
  });
  it.each([
    { answers: { ...answers, q01: ["a"] } }, { answers: { ...answers, q01: null } }, { answers: { ...answers, q17: "a" } }, { answers: {} },
    { axis_scores: { ...record.axis_scores, planning: 101 } }, { axis_scores: { ...record.axis_scores, planning: 50.1 } }, { axis_scores: { ...record.axis_scores, planning: "50" } },
    { type_scores: { ...record.type_scores, A: -1 } }, { secondary_type: record.primary_type }, { subtype: "XX1" },
    { actual_type: "C" }, { is_match: true }, { quiz_version: "2.0" }, { score_gap: 101 }, { is_tie: !record.is_tie }, { is_close: !record.is_close },
  ])("rejects malformed records: %j", async (change) => {
    await expect(db.query(insert, values({ ...record, ...change }))).rejects.toMatchObject({ code: "23514" });
  });
});
