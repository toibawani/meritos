// Captures the three high-value views into docs/assets/ for the README.
// Run AFTER `npx playwright install chromium`. Works against the live site or localhost.
//
//   node scripts/capture-screenshots.mjs                 # live site
//   BASE_URL=http://localhost:3000 node scripts/capture-screenshots.mjs
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL || "https://meritos-tau.vercel.app";
const OUT = "docs/assets";

const views = [
  { file: "home.webp", path: "/" },
  { file: "profile.webp", path: "/p/toibawani" },
  { file: "verify.webp", path: "/verify" },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

for (const view of views) {
  const url = `${BASE}${view.path}`;
  process.stdout.write(`capturing ${view.file} ← ${url} ... `);
  await page.goto(url, { waitUntil: "networkidle" });
  // Let canvas/SVG animations settle before the shot.
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${view.file}`, type: "webp", quality: 85 });
  console.log("done");
}

await browser.close();
console.log(`✅ screenshots written to ${OUT}/`);
