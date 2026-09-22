import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  workers: 2,
  use: { baseURL: "http://127.0.0.1:3100", viewport: { width: 375, height: 812 }, reducedMotion: "reduce", trace: "retain-on-failure" },
  webServer: { command: "pnpm start --hostname 127.0.0.1 --port 3100", env: { NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100" }, url: "http://127.0.0.1:3100", reuseExistingServer: !process.env.CI, timeout: 30000 },
});
