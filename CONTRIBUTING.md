# Contributing to MeritOS

Thanks for your interest in improving MeritOS — the Proof-of-Competence Platform. This project values **engineering rigor** over feature volume: every claim must be demonstrable, and every change must be honest about what it measures.

## Ground rules

1. **Conventional commits.** Use `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `perf:`, `ci:`. These drive the changelog.
2. **Small, logically-scoped commits.** One concern per commit. No "WIP" dumps.
3. **No fabricated metrics.** Coverage, latency, and badge numbers must be measured, never hand-written.
4. **Tests travel with code.** New `lib/` logic needs a case in `tests/`. New routes need a Playwright smoke case.

## Local setup

```bash
npm ci            # exact, lockfile-pinned install
npm run dev       # http://localhost:3000
```

## The one command that gates everything

```bash
npm run verify
```

This runs, in order: `lint` → `typecheck` → `format:check` → `test` → `build`. **`npm run verify` must pass with zero errors before you open a PR.** It is also what CI enforces.

## Project layout

| Path            | Purpose                                                       |
| --------------- | ------------------------------------------------------------- |
| `lib/crypto.ts` | Ed25519, SHA-256, Merkle receipts, W3C VC — pure, unit-tested |
| `lib/zkProof.ts`| Zero-knowledge hash commitments / selective disclosure        |
| `lib/store.tsx` | Client state, personas, persisted identity                    |
| `app/`          | Next.js App Router pages and API routes                       |
| `components/`   | Presentational + interactive UI                               |
| `tests/`        | Node built-in test runner suites                              |
| `e2e/`          | Playwright smoke tests (run against `next build && next start`) |

## Adding an ADR

Significant architectural decisions go in `docs/adr/` using the next number (`0004-…`). See `docs/adr/0001-*.md` for the format.

## Reporting security issues

Please read [SECURITY.md](./SECURITY.md). Do **not** open a public issue for vulnerabilities.
