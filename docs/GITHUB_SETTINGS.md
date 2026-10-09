# GitHub repository settings checklist

These are **not** automatable via the API without write access to repo
metadata that Cline intentionally does not touch. Apply them once in the GitHub
UI (Settings) to maximize the 30-second recruiter impression.

## About (repo home, right sidebar)

- **Description:**

  ```
  Proof-of-Competence Platform — portable, cryptographically verifiable developer identity (W3C VCs, did:merit, Ed25519 Merkle receipts). Next.js + WebCrypto, zero backend.
  ```

- **Website:** `https://meritos-tau.vercel.app` (the live demo).
- **Topics** (add each):
  - `verifiable-credentials`
  - `did`
  - `webcrypto`
  - `nextjs`
  - `zero-knowledge`
  - `developer-portfolio`
  - `merkle-tree`
  - `ed25519`
  - `typescript`

## Social preview (Settings → General → Social preview)

- Upload a 1280×640 image. Suggested content: the MeritOS shield, the tagline
  "Proof-of-Competence Platform", and the live-demo URL. Store the source asset
  in `docs/assets/social-preview.png` for reproducibility.

## Other settings worth enabling

- [ ] **Issues:** keep enabled; the `.github/ISSUE_TEMPLATE/` forms already exist.
- [ ] **Discussions:** optional — good for recruiter Q&A.
- [ ] **Branch protection on `main`:**
  - Require status checks to pass: `lint-typecheck`, `test`, `build` (from
    `.github/workflows/ci.yml`).
  - Require branches up to date before merging.
- [ ] **Automatically delete head branches** after PR merge.
- [ ] **Sponsorships / Releases:** enable Releases so the `v1.0.0` tag publishes
      as a release with its changelog.

## Secrets for automated deploys (Settings → Secrets and variables → Actions)

- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for how these are consumed.
