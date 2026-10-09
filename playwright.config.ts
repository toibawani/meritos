import { defineConfig, devices } from "@playwright/test";

/**
 * MeritOS smoke tests: run against the production build (`next build && next start`)
 * so we verify exactly what ships. `webServer` boots the standalone/prod server
 * automatically in CI; locally it reuses an already-running server on port 3100.
 */
const PORT = Number(process.env.E2E_PORT || 3100);
const BASE_URL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  webServer: {
    // Boot the same self-contained server the Docker image ships, so the smoke
    // tests validate exactly what runs in production. Requires `npm run build`.
    command: `node scripts/start-standalone.mjs`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
