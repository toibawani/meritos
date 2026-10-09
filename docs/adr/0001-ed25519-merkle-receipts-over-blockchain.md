# 0001 — Ed25519 + SHA-256 Merkle receipts over blockchain anchoring

- **Status:** Accepted
- **Date:** 2024
- **Deciders:** Toiba Wani

## Context

A Proof-of-Competence platform must let a recruiter independently verify that a
credential (code diff, terminal trace, repo metadata) has not been tampered
with, and that it was signed by a specific developer identity (`did:merit`).
The classic alternative to a self-contained cryptographic receipt is
**blockchain anchoring** — periodically writing the Merkle root to a public
ledger so timestamps and immutability come from a global consensus mechanism.

## Decision

We implement self-contained, offline-verifiable receipts using:

- **Ed25519** signatures (via WebCrypto `Ed25519`) for developer identity and
  non-repudiation.
- **SHA-256** content hashing for each artifact (diff, log, repo metadata).
- A **deterministic Merkle tree** aggregating all artifact hashes into a single
  root, signed once. A verifier can check a single leaf against the signed root
  without downloading every artifact.

We **do not** anchor to a blockchain.

## Why not blockchain anchoring

1. **Zero dependencies + offline verification.** A recruiter must be able to
   verify a credential by pasting JSON into the sandbox — no node, no RPC, no
   wallet, no network. Merkle receipts verify in `< 2 ms` entirely in-browser.
2. **No gas / cost / latency.** Anchoring introduces fees and block-time
   latency for what is, here, a portfolio-grade integrity guarantee.
3. **Honesty about threat model.** This system defends against **forgery and
   tampering** of a claimed artifact, not against a developer backdating an
   originally-honest credential. A public ledger does not solve that either,
   and the README must not imply it does.
4. **Reviewability.** Ed25519 + SHA-256 are FIPS-aligned, widely audited, and
   natively available in the browser — no opaque consensus to explain to a
   skeptical interviewer.

## Consequences

- ✅ Fully client-side, instant, zero-infrastructure verification.
- ✅ Simple to test exhaustively (pure functions in `lib/crypto.ts`).
- ⚠️ Non-repudiation is bounded by key custody; if a private key leaks, an
  attacker can mint credentials. Mitigation: keys never leave the browser.
- ⚠️ No independent timestamp oracle. Accepted, because we do not claim one.

## Alternatives considered

- **RSA-2048/4096:** larger keys/signatures, slower; Ed25519 gives
  comparable security at 32-byte keys with faster verification.
- **Blockchain (Ethereum/Polygon) anchoring:** rejected for cost, latency, and
  the requirement for offline verification (see above).
- **W3C VC Data Integrity + `Ed25519Signature2020`:** adopted in *spirit* —
  our DID documents already reference `Ed25519VerificationKey2020`.
