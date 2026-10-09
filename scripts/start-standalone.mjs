#!/usr/bin/env node
/**
 * Production launcher for the `output: 'standalone'` build.
 *
 * `next start` prints a warning under standalone output; this script instead
 * assembles the self-contained bundle exactly the way the Dockerfile does and
 * boots it with zero warnings. Requires `npm run build` to have run first.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const standalone = join(root, ".next", "standalone");
const serverJs = join(standalone, "server.js");

if (!existsSync(serverJs)) {
  console.error("[start] .next/standalone/server.js not found. Run `npm run build` first.");
  process.exit(1);
}

// `output: 'standalone'` keeps static + public outside the bundle; wire them in.
for (const [src, dest] of [
  [join(root, "public"), join(standalone, "public")],
  [join(root, ".next", "static"), join(standalone, ".next", "static")],
]) {
  if (!existsSync(src)) continue;
  mkdirSync(join(dest, ".."), { recursive: true });
  cpSync(src, dest, { recursive: true });
}

const result = spawnSync(process.execPath, [serverJs], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
