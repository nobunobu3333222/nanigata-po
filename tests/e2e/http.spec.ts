import { expect, test } from "@playwright/test";
import { INDEX_PATHS } from "../../src/lib/seo";
const origin = "http://127.0.0.1:3100";
const answers = Object.fromEntries(Array.from({ length: 16 }, (_, i) => [`q${String(i + 1).padStart(2, "0")}`, "a"]));
const valid = { quizVersion: "1.0", answers, actualType: "unknown" };
test("all SEO content and metadata exist without client JavaScript", async ({ request }) => {
  const titles = new Set<string>(); const descriptions = new Set<string>();
  for (const path of INDEX_PATHS) {
    const response = await request.get(path); expect(response.status()).toBe(200);
    const html = await response.text();
    expect(html).toContain("<h1"); expect(html).toContain('rel="canonical"'); expect(html).toContain('property="og:image"');
    const title = html.match(/<title>(.*?)<\/title>/)?.[1]; expect(title).toBeTruthy(); titles.add(title!);
    const description = html.match(/<meta name="description" content="([^"]+)"/ )?.[1]; expect(description).toBeTruthy(); descriptions.add(description!);
    if (path.startsWith("/blood-type")) { expect(html).toContain('"@type":"BreadcrumbList"'); expect(html).toContain("科学的な関連性"); }
    if (path === "/") expect(html).toContain('"@type":"WebSite"');
  }
  expect(titles.size).toBe(8); expect(descriptions.size).toBe(8);
});
test("CSP uses a fresh nonce for every SSR response", async ({ request }) => {
  const first = await request.get("/"); const second = await request.get("/");
  const csp = first.headers()["content-security-policy"];
  expect(csp).toContain("frame-ancestors 'none'"); expect(csp).not.toContain("unsafe-eval");
  expect(csp).not.toBe(second.headers()["content-security-policy"]);
  const nonce = csp.match(/'nonce-([^']+)'/)?.[1]; expect(nonce).toBeTruthy(); expect(await first.text()).toContain(`nonce="${nonce}"`);
  expect(first.headers()["x-content-type-options"]).toBe("nosniff"); expect(first.headers()["x-frame-options"]).toBe("DENY");
  expect(first.headers()["permissions-policy"]).toContain("camera=(), microphone=(), geolocation=()");
});
test("quiz/result noindex, crawlable robots, exact sitemap and 404", async ({ request }) => {
  for (const path of ["/quiz", "/result?type=A"]) expect(await (await request.get(path)).text()).toContain('name="robots" content="noindex, follow"');
  const sitemap = await (await request.get("/sitemap.xml")).text(); expect((sitemap.match(/<loc>/g) ?? []).length).toBe(8); expect(sitemap).not.toMatch(/\/quiz|\/result|\/api\//);
  const robots = await (await request.get("/robots.txt")).text(); expect(robots).toContain("Allow: /"); expect(robots).not.toMatch(/Disallow: \/(?:quiz|result)/);
  expect((await request.get("/blood-type/invalid")).status()).toBe(404);
});
test("all five OGP images return 1200x630 PNG", async ({ request }) => {
  for (const suffix of ["", "?type=a", "?type=b", "?type=o", "?type=ab"]) {
    const response = await request.get(`/og${suffix}`); expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toBe("image/png");
    const png = await response.body(); expect(png.readUInt32BE(16)).toBe(1200); expect(png.readUInt32BE(20)).toBe(630);
  }
});
test("real Route Handler rejects malformed traffic and fails closed without Vercel", async ({ request }) => {
  const headers = { origin };
  expect((await request.post("/api/results", { headers, data: { ...valid, answers: {} } })).status()).toBe(400);
  expect((await request.post("/api/results", { headers, data: { ...valid, actualType: "fake" } })).status()).toBe(400);
  expect((await request.post("/api/results", { headers, data: { ...valid, typeScores: {} } })).status()).toBe(400);
  expect((await request.post("/api/results", { headers, data: "x".repeat(5000) })).status()).toBe(415);
  expect((await request.post("/api/results", { headers: { ...headers, "content-type": "application/json" }, data: "x".repeat(5000) })).status()).toBe(413);
  expect((await request.post("/api/results", { headers: { origin: "https://foreign.example" }, data: valid })).status()).toBe(403);
  expect((await request.post("/api/results", { headers, data: valid })).status()).toBe(503);
  expect((await request.get("/api/results")).status()).toBe(405);
});
