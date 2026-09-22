import { afterEach, expect, it, vi } from "vitest";
import { contentSecurityPolicy } from "../src/lib/security/headers";
import { INDEX_PATHS, pageMetadata, siteUrl } from "../src/lib/seo";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";
afterEach(() => vi.unstubAllEnvs());
it("allows nonce scripts but no production eval or inline scripts", () => {
  const csp = contentSecurityPolicy("test-nonce", false, true);
  expect(csp).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic';");
  expect(csp).not.toContain("unsafe-eval"); expect(csp).toContain("frame-ancestors 'none'"); expect(csp).toContain("upgrade-insecure-requests");
});
it("keeps localhost HTTP usable", () => { expect(contentSecurityPolicy("test", true, false)).not.toContain("upgrade-insecure-requests"); });
it("sets canonical, OGP and sitemap only to public content", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://quiz.example"); vi.stubEnv("VERCEL_ENV", "production");
  expect(sitemap().map((item) => item.url)).toEqual(INDEX_PATHS.map((path) => `https://quiz.example${path}`));
  const meta = pageMetadata("/blood-type/a", "A title", "A description");
  expect(meta.alternates?.canonical).toBe("https://quiz.example/blood-type/a"); expect(meta.robots).toEqual({ index: true, follow: true });
  expect(pageMetadata("/result", "result", "result description", true).robots).toEqual({ index: false, follow: true });
  expect(robots().rules).toEqual({ userAgent: "*", allow: "/", disallow: "/api/" });
});
it("does not index unconfigured or preview deployments", () => {
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", ""); expect(pageMetadata("/", "t", "d").robots).toEqual({ index: false, follow: true });
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://quiz.example"); vi.stubEnv("VERCEL_ENV", "preview"); expect(pageMetadata("/", "t", "d").robots).toEqual({ index: false, follow: true });
});
it("does not accept credentials, paths or script URLs in site metadata", () => {
  for (const url of ["javascript:alert(1)", "https://user:pass@example.com", "https://example.com/path"]) { vi.stubEnv("NEXT_PUBLIC_SITE_URL", url); expect(siteUrl().origin).toBe("http://localhost:3000"); }
});
