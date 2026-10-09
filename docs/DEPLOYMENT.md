# Deployment

Meritos needs **no environment variables and no database**. Every path below
runs the same cryptographic app; the only difference is who hosts the bundle.

## Option 1 — Vercel (one click, zero config)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/toibawani/meritos)

1. Click the button above → sign in with GitHub.
2. Vercel auto-detects Next.js. Accept the defaults (build: `next build`,
   output: `.next`).
3. **Deploy.** Done. The app, `/api/badge/[username]`, `/api/did/[username]`,
   and `/api/health` all work with zero configuration.

### Automated deploys (CI-gated)

The `.github/workflows/deploy.yml` workflow redeploys on every push to `main`,
**after** the CI gate passes. To enable it, add these repository secrets
(Settings → Secrets and variables → Actions):

| Secret               | Where to find it                                                        |
| -------------------- | ----------------------------------------------------------------------- |
| `VERCEL_TOKEN`       | Vercel → Account Settings → Tokens → Create                            |
| `VERCEL_ORG_ID`      | Vercel project → Settings → General (`Project ID` block)                |
| `VERCEL_PROJECT_ID`  | Same as above                                                           |

Once set, `git push origin main` (or a manual `workflow_dispatch`) builds and
ships to production. Vercel automatically injects `VERCEL_GIT_COMMIT_SHA`, which
`/api/health` surfaces as its `commit` field.

## Option 2 — Docker (self-hosted, portable)

```bash
docker build -t meritos .
docker run -p 3000:3000 meritos
# → http://localhost:3000   (health: /api/health)
```

The image is multi-stage and runs as a **non-root** user. It builds Next.js with
`output: 'standalone'`, copies only the self-contained server bundle, and
exposes port `3000`. A `HEALTHCHECK` hits `/api/health` for orchestrators.

## Option 3 — Local / Node

```bash
npm ci
npm run build
npm start          # http://localhost:3000
```

## Verifying a deploy

```bash
curl -s https://<your-host>/api/health
# → {"status":"ok","version":"1.0.0","commit":"<sha>"}
```

## Notes

- No `NEXT_PUBLIC_*` variables are required. See `.env.example` for the two
  **optional** observability variables (`COMMIT_SHA`, `APP_VERSION`).
- Because verification is client-side (see `docs/adr/0002`), the app has no
  backend to scale, no secrets to rotate, and no database to migrate.
