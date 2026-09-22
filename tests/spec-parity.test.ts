import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { QUESTIONS } from "../src/lib/quiz/questions";
import { RESULT_COPY } from "../src/lib/quiz/resultCopy";

it("all 64 answer texts and sparse scores match QUIZ_LOGIC.md", () => {
  const spec = readFileSync(new URL("../QUIZ_LOGIC.md", import.meta.url), "utf8");
  const blocks = [...spec.matchAll(/## Q(\d{2}) ([^\n]+)\n([\s\S]*?)(?=\n## Q|\n---\n\n# 4\.)/g)];
  expect(blocks).toHaveLength(16);
  blocks.forEach((block, index) => {
    const question = QUESTIONS[index];
    expect(question.id).toBe(`q${block[1]}`);
    expect(question.title).toBe(block[2]);
    const options = [...block[3].matchAll(/([A-D])「([^\n]+)」\s+```text\n([\s\S]*?)```/g)];
    expect(options).toHaveLength(4);
    options.forEach((option, optionIndex) => {
      expect(question.options[optionIndex]).toMatchObject({
        id: option[1].toLowerCase(), text: option[2],
        scores: Object.fromEntries([...option[3].matchAll(/(\w+) ([+-]\d+)/g)].map((pair) => [pair[1], Number(pair[2])])),
      });
      expect(Object.keys(question.options[optionIndex].scores)).toHaveLength([...option[3].matchAll(/(\w+) ([+-]\d+)/g)].length);
    });
  });
});

it("all result copy is sourced verbatim from RESULT_CONTENT.md", () => {
  const spec = readFileSync(new URL("../RESULT_CONTENT.md", import.meta.url), "utf8");
  for (const [id, copy] of Object.entries(RESULT_COPY)) {
    const block = spec.split(`## ${id}｜`)[1].split(/\n## |\n# /)[0];
    for (const text of [copy.name, copy.shortCopy, copy.description, ...copy.strengths.flatMap((s) => [s.title, s.body]), copy.weakness.title, copy.weakness.body]) {
      expect(block).toContain(text);
    }
  }
});
