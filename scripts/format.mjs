#!/usr/bin/env node
/**
 * format.mjs — Prettier wrapper that works WITHOUT global npx/network in CI.
 * Prefers an exact local node_modules install; falls back to a vendored copy
 * (scripts/vendor/prettier/) that is committed for offline reliability.
 *
 * Usage:
 *   node scripts/format.mjs          # write
 *   node scripts/format.mjs --check  # check only (used by `npm run format:check`)
 */
import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const args = check ? ["--check", "."] : ["--write", "."];

const localBin =
  process.platform === "win32"
    ? path.join(root, "node_modules", ".bin", "prettier.cmd")
    : path.join(root, "node_modules", ".bin", "prettier");

function tryLocal() {
  if (!fs.existsSync(localBin)) return false;
  execFileSync(localBin, args, { cwd: root, stdio: "inherit" });
  return true;
}

function tryVendored() {
  const vendored = path.join(root, "scripts", "vendor", "prettier", "bin", "prettier.cjs");
  if (!fs.existsSync(vendored)) return false;
  execFileSync(process.execPath, [vendored, ...args], { cwd: root, stdio: "inherit" });
  return true;
}

function tryGlobal() {
  try {
    execSync(`prettier ${check ? "--check" : "--write"} .`, { cwd: root, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

if (tryLocal() || tryVendored() || tryGlobal()) process.exit(0);

console.error(
  "prettier unavailable: no local install, no vendored copy, no global binary. " +
    "Run `npm install` (devDependencies include prettier) or `npm run vendor:prettier`."
);
process.exit(1);
