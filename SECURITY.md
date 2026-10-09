# Security Policy

## Supported Versions

MeritOS is a client-side application. The latest released version (`v1.x`, `main` branch) receives security fixes. Because the entire cryptographic core runs in the browser via the native WebCrypto API, there is **no server-side secret storage and no user database to compromise**.

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report privately:

- **GitHub Private Vulnerability Reporting** (preferred): open the repo → **Security** tab → **Report a vulnerability**.
- Or email the maintainer with subject prefix `[SECURITY]`.

Please include:

1. A description of the issue and its impact.
2. Steps to reproduce (a minimal PoC is ideal).
3. The affected route, component, or function.
4. Any suggested fix.

## What to expect

- **Acknowledgement** within 72 hours.
- A remediation plan and target release date after triage.
- Credit in the release notes unless you prefer to remain anonymous.

## Scope notes

In-scope: the crypto core (`lib/crypto.ts`, `lib/zkProof.ts`), credential/DID issuance and verification, XSS/CSRF in any route, dependency supply-chain issues.

Out-of-scope: issues in third-party hosting, self-hosted deployment misconfiguration, and social-engineering attacks against individuals.
