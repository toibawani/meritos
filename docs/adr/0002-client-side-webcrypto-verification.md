# 0002 — Client-side verification via WebCrypto vs. server round-trip

- **Status:** Accepted
- **Date:** 2024
- **Deciders:** Toiba Wani

## Context

The recruiter "Instant-Proof Sandbox" (`/verify`) must validate a pasted
Meritos receipt. Two architectures are possible:

1. **Server round-trip:** POST the receipt to an API route; the server runs
   WebCrypto/Node `crypto` and returns a verdict.
2. **Client-side verification:** the browser parses and verifies the receipt
   using the native WebCrypto API, entirely on-device.

## Decision

Verification runs **client-side** in the browser using `crypto.subtle`
(WebCrypto). The `/verify` page and the badge/DID issuance flow all execute
Ed25519 signature checks and Merkle root recomputation in the tab.

## Rationale

1. **Trust minimization.** A recruiter verifying _my_ credentials should not
   have to trust _my_ server to tell them the signature is valid. Client-side
   verification means the trust anchor is the W3C VC format and the public key
   in the DID document — not our infrastructure. This is the single most
   important property for a Proof-of-Competence product.
2. **Latency.** No network hop; a typical verification completes in well under
   `2 ms` (measured in tests), which is the number quoted in the case study.
3. **Privacy.** The pasted receipt never leaves the recruiter's machine.
4. **Zero backend.** The app stays deployable as a static/edge bundle with no
   database and no secrets — a genuine selling point for a portfolio project.

## Consequences

- ✅ Recruiter can verify credentials even if this site is offline, as long as
  they have the DID document.
- ✅ No server cost, no cold starts, no data-retention concerns.
- ✅ Enables a credible "verify with zero trust in our server" claim.
- ⚠️ Requires `crypto.subtle` (secure context). Fine on `https://` and
  `localhost`, which covers all real deployment targets.
- ⚠️ Public-key distribution still benefits from the hosted `/api/did/[username]`
  route; that route is a _convenience mirror_, not a trust dependency (the DID
  is embedded in the credential itself).

## Alternatives considered

- **Server verification:** rejected — reintroduces a trust dependency on our
  server and a network round-trip for a `< 2 ms` local computation.
- **WASM crypto lib (libsodium):** unnecessary; WebCrypto Ed25519 is native,
  audited, and dependency-free.
