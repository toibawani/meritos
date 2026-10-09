#!/usr/bin/env node
/**
 * Codemod: remove unused IMPORT bindings reported by ESLint (no-unused-vars).
 * Only touches import declarations (safe). Local unused vars are handled manually.
 * Uses ESLint JSON output for precise, trustworthy results.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import ts from "typescript";

// 1. Get ESLint JSON report
const report = JSONSync();
const files = report.filter((f) => f.messages?.length);

let totalRemoved = 0;

for (const file of files) {
  const filePath = file.filePath;
  const source = fs.readFileSync(filePath, "utf8");

  // Collect unused identifiers that are import bindings for this file
  const unusedNames = new Set();
  for (const msg of file.messages) {
    if (
      msg.ruleId === "@typescript-eslint/no-unused-vars" &&
      /defined but never used/.test(msg.message)
    ) {
      const nameMatch = msg.message.match(/'([^']+)' is defined but never used/);
      if (nameMatch) unusedNames.add(nameMatch[1]);
    }
  }
  if (unusedNames.size === 0) continue;

  // 2. Parse to find import declarations and their binding names
  const sf = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );

  // Gather all identifiers that are used anywhere in the file EXCEPT within import statements
  const importRanges = [];
  const usedOutsideImports = new Set();
  const visit = (node) => {
    if (ts.isImportDeclaration(node)) {
      importRanges.push([node.getStart(sf), node.getEnd()]);
      return; // do NOT descend into imports when collecting used identifiers
    }
    if (ts.isIdentifier(node)) {
      usedOutsideImports.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  // 3. For each import declaration, figure out which named specifiers to drop
  const removals = []; // [start, end] text ranges to delete
  for (const node of sf.statements) {
    if (!ts.isImportDeclaration(node)) continue;
    const clause = node.importClause;
    if (!clause) continue;

    const namedBindings = clause.namedBindings;
    if (namedBindings && ts.isNamedImports(namedBindings)) {
      const elements = namedBindings.elements;
      const toRemove = [];
      for (const el of elements) {
        const name = (el.propertyName || el.name).text;
        // Trust ESLint's no-unused-vars determination; remove the binding.
        if (unusedNames.has(name)) {
          toRemove.push(el);
        }
      }
      if (toRemove.length === elements.length && !clause.name) {
        // entire import statement unused (no default import) -> drop whole statement
        removals.push([node.getFullStart(), node.getEnd()]);
      } else if (toRemove.length) {
        for (const el of toRemove) {
          // remove from the comma before/after the specifier
          const start = el.getFullStart();
          const end = el.getEnd();
          removals.push([start, end]);
        }
      }
    }
  }

  if (removals.length === 0) continue;

  // 4. Apply removals (reverse order to keep offsets valid)
  removals.sort((a, b) => b[0] - a[0]);
  let updated = source;
  let removedCount = 0;
  for (const [start, end] of removals) {
    // Extend to swallow a following comma+space if present, else a leading comma+space
    let s = start;
    let e = end;
    const after = updated.slice(end);
    const before = updated.slice(0, start);
    if (/^\s*,/.test(after)) {
      const m = after.match(/^\s*,\s*/)[0];
      e = end + m.length;
    } else if (/,\s*$/.test(before)) {
      const m = before.match(/,\s*$/)[0];
      s = start - m.length;
    }
    updated = updated.slice(0, s) + updated.slice(e);
    removedCount++;
  }

  // Clean up empty named-import braces left behind: `import {  } from "x"` -> remove line
  updated = updated.replace(/import\s*\{\s*\}\s*from\s*("[^"]+"|'[^']+');?\n?/g, "");
  // Collapse `import {  , A }` artifacts: remove stray leading commas inside braces
  updated = updated.replace(/(\{\s*),\s*/g, "$1");
  updated = updated.replace(/,\s*(\})/g, "$1");

  if (updated !== source) {
    fs.writeFileSync(filePath, updated, "utf8");
    totalRemoved += removedCount;
    console.log(`  ${filePath}: removed ${removedCount} import binding(s)`);
  }
}

console.log(`\nDone. Removed ${totalRemoved} unused import bindings.`);

function JSONSync() {
  // ESLint exits non-zero when it finds lint errors; capture stdout anyway.
  try {
    const out = execSync(
      'npx eslint --ext .ts,.tsx --format json --rule \'{"@typescript-eslint/no-unused-vars":"error"}\' app components lib',
      { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }
    );
    return JSON.parse(out);
  } catch (err) {
    if (err.stdout) return JSON.parse(err.stdout);
    throw err;
  }
}
