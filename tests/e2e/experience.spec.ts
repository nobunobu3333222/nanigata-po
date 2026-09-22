import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { QUESTIONS } from "../../src/lib/quiz/questions";
import { QUESTION_PROMPTS } from "../../src/lib/quiz/presentation";
import { scoreQuiz } from "../../src/lib/quiz/scoring";
import { PROGRESS_KEY, RESULT_KEY } from "../../src/lib/browser/storage";
import type { Answers, OptionId } from "../../src/types/quiz";
const allA = Object.fromEntries(QUESTIONS.map((q) => [q.id, "a"])) as Answers;
const diagnosis = scoreQuiz(allA);
async function pick(page: Page, index: number, option: OptionId = "a") {
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS[QUESTIONS[index].id], exact: true })).toBeVisible();
  await page.getByRole("button", { name: QUESTIONS[index].options.find((o) => o.id === option)!.text, exact: true }).click();
}
async function seedResult(page: Page, answers: Answers = allA) {
  await page.goto("/");
  await page.evaluate(({ key, answers }) => sessionStorage.setItem(key, JSON.stringify({ quizVersion: "1.0", answers })), { key: RESULT_KEY, answers });
  await page.goto("/result");
  await expect(page.getByTestId("result-hero")).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test("375px: full journey, back/edit, restore, comparison, retry", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await noOverflow(page);
  await page.getByRole("link", { name: "無料で診断する" }).first().click();
  await page.getByRole("button", { name: "診断スタート" }).click();
  await pick(page, 0);
  await pick(page, 1);
  await page.getByRole("button", { name: "前の質問へ戻る" }).click();
  await expect(page.getByRole("button", { name: QUESTIONS[1].options[0].text, exact: true })).toHaveAttribute("aria-pressed", "true");
  await pick(page, 1, "c");
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q03 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q03 })).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).answers.q02, PROGRESS_KEY)).toBe("c");
  for (let index = 2; index < QUESTIONS.length; index++) { await noOverflow(page); await pick(page, index); }
  await expect(page).toHaveURL(/\/result$/);
  await expect(page.getByTestId("result-hero")).toBeVisible();
  await noOverflow(page);
  expect(await page.evaluate((key) => localStorage.getItem(key), PROGRESS_KEY)).toBeNull();
  const hero = await page.getByTestId("result-hero").innerText();
  const profile = await page.getByTestId("axis-profile").innerText();
  const result = scoreQuiz({ ...allA, q02: "c" });
  await page.getByRole("button", { name: `${result.primaryType}型`, exact: true }).click();
  await expect(page.getByTestId("comparison")).toContainText(`やっぱり${result.primaryType}型！`);
  await page.getByRole("button", { name: `${result.secondaryType}型`, exact: true }).click();
  await expect(page.getByTestId("comparison")).toContainText(`予想は${result.primaryType}型、実際は${result.secondaryType}型！`);
  await page.getByRole("button", { name: "わからない", exact: true }).click();
  await expect(page.getByTestId("comparison")).toContainText("本当の血液型が分からなくてもOK");
  expect(await page.getByTestId("result-hero").innerText()).toBe(hero);
  expect(await page.getByTestId("axis-profile").innerText()).toBe(profile);
  await page.reload();
  await expect(page.getByTestId("result-hero")).toHaveText(hero);
  await expect(page.getByTestId("comparison")).toHaveCount(0);
  await page.getByRole("button", { name: "もう一度診断する" }).click();
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q01 })).toBeVisible();
  await pick(page, 0, "b");
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q02 })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q02 })).toBeVisible();
  expect(await page.evaluate((key) => sessionStorage.getItem(key), RESULT_KEY)).toBeNull();
  expect(errors).toEqual([]);
});

test("missing/corrupt storage recovers safely and routes are noindex", async ({ page }) => {
  await page.goto("/result");
  await expect(page.getByRole("heading", { name: /診断結果が\s*見つかりません/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await page.evaluate(({ p, r }) => { localStorage.setItem(p, '{"answers":{"q01":"x"}}'); sessionStorage.setItem(r, "bad json"); }, { p: PROGRESS_KEY, r: RESULT_KEY });
  await page.goto("/quiz");
  await expect(page.getByRole("button", { name: "診断スタート" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await page.goto("/result");
  await expect(page.getByRole("heading", { name: /診断結果が\s*見つかりません/ })).toBeVisible();
});

test("storage denied: diagnosis still completes in memory", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.removeItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await page.goto("/quiz");
  await page.getByRole("button", { name: "診断スタート" }).click();
  await expect(page.getByRole("status")).toContainText("途中保存ができません");
  for (let index = 0; index < QUESTIONS.length; index++) await pick(page, index);
  await expect(page.getByTestId("result-hero")).toContainText(`${diagnosis.primaryType}型っぽ！`);
  await page.getByRole("button", { name: "もう一度診断する" }).click();
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q01 })).toBeVisible();
});

test("native share cancellation, rejection, fallback and clipboard failure preserve results", async ({ page }) => {
  await seedResult(page);
  const hero = await page.getByTestId("result-hero").innerText();
  await page.evaluate(() => Object.defineProperty(navigator, "share", { configurable: true, value: async () => { throw new DOMException("cancelled", "AbortError"); } }));
  await page.getByRole("button", { name: "結果をシェアする" }).click();
  await expect(page.locator(".share-section").getByRole("status")).toContainText("キャンセル");
  await page.evaluate(() => Object.defineProperty(navigator, "share", { configurable: true, value: async () => { throw new Error("failed"); } }));
  await page.getByRole("button", { name: "結果をシェアする" }).click();
  await expect(page.locator(".share-section").getByRole("status")).toContainText("共有できませんでした");
  await page.evaluate(() => Object.defineProperty(navigator, "share", { configurable: true, value: undefined }));
  await page.getByRole("button", { name: "結果をシェアする" }).click();
  await expect(page.locator(".share-section").getByRole("status")).toContainText("下のLINE・X");
  await page.evaluate(() => Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("denied"); } } }));
  await page.getByRole("button", { name: "リンクをコピー" }).click();
  await expect(page.getByRole("textbox", { name: "共有リンク" })).toHaveValue("http://127.0.0.1:3100/");
  expect(await page.getByTestId("result-hero").innerText()).toBe(hero);
  const x = new URL((await page.getByRole("link", { name: "Xでシェア" }).getAttribute("href"))!);
  expect(x.searchParams.get("url")).toBe("http://127.0.0.1:3100/");
  expect(x.searchParams.get("text")).not.toContain("actualType");
});

test("native and clipboard success, keyboard answering, reduced motion", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("button", { name: "診断スタート" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q01 })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: QUESTIONS[0].options[0].text, exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: QUESTION_PROMPTS.q02 })).toBeFocused();
  await seedResult(page);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: async () => {} });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => {} } });
  });
  await page.getByRole("button", { name: "結果をシェアする" }).click();
  await expect(page.locator(".share-section").getByRole("status")).toContainText("共有しました");
  await page.getByRole("button", { name: "リンクをコピー" }).click();
  await expect(page.locator(".share-section").getByRole("status")).toContainText("リンクをコピーしました");
  await page.getByTestId("axis-profile").locator("summary").first().click();
  await expect(page.locator(".axis[open] .axis-copy")).toBeVisible();
});

for (const width of [375, 390, 430, 768, 1440]) {
  test(`layout ${width}px: home, all questions, result`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/"); await noOverflow(page);
    if (width === 375) await page.screenshot({ path: "test-results/home-375.png", fullPage: true });
    await page.goto("/quiz"); await page.getByRole("button", { name: "診断スタート" }).click();
    for (let index = 0; index < QUESTIONS.length; index++) {
      await noOverflow(page);
      if (width === 375 && index === 0) await page.screenshot({ path: "test-results/quiz-375.png", fullPage: true });
      const button = page.getByRole("button", { name: QUESTIONS[index].options[0].text, exact: true });
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await pick(page, index);
    }
    await expect(page.getByTestId("result-hero")).toBeVisible(); await noOverflow(page);
    if (width === 375) await page.screenshot({ path: "test-results/result-375.png", fullPage: true });
    if (width === 1440) await page.screenshot({ path: "test-results/result-1440.png", fullPage: true });
  });
}

for (const status of [201, 429, 503]) {
  test(`saving status ${status} preserves the diagnosis and excludes scores from request`, async ({ page }) => {
    const bodies: unknown[] = [];
    await page.route('**/api/results', async (route) => {
      bodies.push(route.request().postDataJSON());
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({ success: status === 201 }) });
    });
    await seedResult(page);
    const hero = await page.getByTestId('result-hero').innerText();
    const profile = await page.getByTestId('axis-profile').innerText();
    await page.getByRole('button', { name: 'O型', exact: true }).click();
    const expected = status === 201 ? '匿名データを保存しました' : status === 429 ? '保存回数の上限' : '保存に失敗しました';
    await expect(page.locator('.actual-section').getByRole('status')).toContainText(expected);
    expect(bodies).toEqual([{ quizVersion: '1.0', answers: allA, actualType: 'O' }]);
    await page.getByRole('button', { name: 'O型', exact: true }).click();
    expect(bodies).toHaveLength(1);
    expect(await page.getByTestId('result-hero').innerText()).toBe(hero);
    expect(await page.getByTestId('axis-profile').innerText()).toBe(profile);
  });
}
