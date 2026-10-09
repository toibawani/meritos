#!/usr/bin/env node
/**
 * build-test-lib.mjs — compile the pure crypto/zk lib (lib/crypto.ts, lib/zkProof.ts,
 * lib/types.ts) to CommonJS in `.test-build/` using the project's own TypeScript,
 * so `tests/*.test.mjs` import and exercise the REAL shipped code (not re-implementations).
 *
 * Runs automatically via the `pretest` npm hook before `npm test` / `npm run test:coverage`.
 * Pure stdlib + local tsc. No network. Works on Node 20+.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, ".test-build");

// Clean previous build (ignore failures on first run)
fs.rmSync(outDir, { recursive: true, force: true });

const tscBin = path.join(root, "node_modules", "typescript", "bin", "tsc");
const tsc = fs.existsSync(tscBin) ? tscBin : "tsc";

execFileSync(
  process.execPath,
  [
    tsc,
    "lib/crypto.ts",
    "lib/zkProof.ts",
    "lib/types.ts",
    "--outDir",
    ".test-build",
    "--module",
    "commonjs",
    "--target",
    "es2020",
    "--moduleResolution",
    "node",
    "--lib",
    "es2020,dom",
    "--esModuleInterop",
    "--skipLibCheck",
    "--declaration",
    "false",
    "--sourceMap",
    "false",
  ],
  { cwd: root, stdio: "inherit" }
);

console.log("test-lib built → .test-build/");
