# 0003 — Node built-in test runner vs. Jest/Vitest

- **Status:** Accepted
- **Date:** 2024
- **Deciders:** Toiba Wani

## Context

The cryptographic core (`lib/crypto.ts`, `lib/zkProof.ts`) is pure,
framework-agnostic logic that must be exhaustively unit-tested. The team must
choose a test runner that fits a "zero-dependency, recruiter-reviewable"
philosophy and runs identically in CI without extra transpilation.

## Decision

We use the **Node.js built-in test runner** (`node --test tests/*.test.mjs`)
against TypeScript sources compiled to a throwaway `.test-build/` directory by
`scripts/build-test-lib.mjs` (wired as the `pretest` npm hook).

## Rationale

1. **Zero additional dependencies.** Jest/Vitest pull in a large dependency
   tree. The built-in runner ships with Node, so `npm test` works from a fresh
   `npm ci` with nothing extra.
2. **Real WebCrypto.** Node exposes `globalThis.crypto.subtle` (the _same_ API
   surface the browser uses), so we test the exact primitives the app runs —
   no mocking, no jsdom, no node-specific divergence.
3. **Fast, deterministic startup.** No config file, no transform pipeline for
   the test layer; the only compile step is `tsc` on two pure modules.
4. **Coverage for free.** `--experimental-test-coverage` gives us a real
   coverage number for CI and the badge without adding `c8`/`istanbul`.
5. **CI symmetry.** The same `node --test` command runs locally and in the
   Node 20/22 matrix, so "works on my machine" is structurally impossible.

## Consequences

- ✅ Honest, dependency-light tooling that mirrors browser WebCrypto exactly.
- ✅ Coverage badge is generated from a measured number, not asserted.
- ✅ Trivial to reason about for a reviewer reading the `test` script.
- ⚠️ No built-in watch mode / snapshot ergonomics like Vitest — acceptable
  because the core is pure logic, not React rendering (UI is covered by
  Playwright in `e2e/`).
- ⚠️ The `pretest` compile step is a small amount of glue (one script); we
  judge this cheaper than carrying a test-framework dependency.

## Alternatives considered

- **Vitest:** excellent DX and watch mode, but adds a dependency and pulls a
  Vite transform pipeline — overkill for two pure modules.
- **Jest:** mature, but heavy, slower to start, and needs jsdom/babel config to
  exercise WebCrypto realistically.
- **c8:** considered for coverage; superseded by Node's native
  `--experimental-test-coverage`, keeping the dependency graph at zero.
