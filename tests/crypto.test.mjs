import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Import the REAL shipped implementation (compiled from lib/crypto.ts by `pretest`).
// These tests exercise production code, not re-implemented copies.
import {
  bufToHex,
  hexToBuf,
  computeSha256,
  computeMerkleRoot,
  computeEvidenceMerkleRoot,
  generateIdentityKeyPair,
  createVerifiableReceipt,
  verifyVerifiableReceipt,
} from "../.test-build/crypto.js";

const DEMO_EVIDENCE = {
  type: "github_commit",
  title: "TypeScript AST engine",
  repoUrl: "https://github.com/toibawani/meritos",
  commitHash: "d24a0ccf776ab0786090b6c94c36c7b68d5e0d9e",
  diffContent: "diff --git a/lib/crypto.ts b/lib/crypto.ts\n+export async function computeSha256()",
  terminalTrace: [{ type: "cmd", text: "npm test" }],
  metrics: { testPassRate: "100%", coverage: "92.4%" },
  timestamp: "2026-10-09T00:00:00.000Z",
};

describe("MeritOS Cryptographic Verification Engine", () => {
  test("SHA-256 requires WebCrypto and rejects runtimes without it", async () => {
    await assert.rejects(async () => {
      const realCrypto = globalThis.crypto;
      try {
        Object.defineProperty(globalThis, "crypto", { value: undefined, configurable: true });
        await computeSha256("should-throw");
      } finally {
        Object.defineProperty(globalThis, "crypto", { value: realCrypto, configurable: true });
      }
    }, /WebCrypto \(crypto\.subtle\) is required/);
  });

  test("bufToHex & hexToBuf roundtrip consistency", () => {
    const originalHex = "9f8a3c2e1184bc234a991823efca4421bca90821";
    const buf = hexToBuf(originalHex);
    const restoredHex = bufToHex(buf.buffer);
    assert.equal(restoredHex.toLowerCase(), originalHex.toLowerCase());
  });

  test("SHA-256 standard test vector verification", async () => {
    // Empty string SHA-256
    const emptyHash = await computeSha256("");
    assert.equal(emptyHash, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    // Standard ASCII string
    const testHash = await computeSha256("MeritOS:proof-of-competence");
    assert.equal(testHash.length, 64);
    assert.match(testHash, /^[0-9a-f]{64}$/);
  });

  test("Merkle root deterministic computation across 4 leaves", async () => {
    const leafA = "leaf_1:github_commit:9f8a3c";
    const leafB = "leaf_2:chaos_recovery:pass";
    const leafC = "leaf_3:peer_voucher:did:merit:alex";
    const leafD = "leaf_4:ast_compiler:level_master";

    const root1 = await computeMerkleRoot([leafA, leafB, leafC, leafD]);
    const root2 = await computeMerkleRoot([leafA, leafB, leafC, leafD]);

    assert.equal(root1, root2);
    assert.equal(root1.length, 64);

    // Tampering test: changing a single character changes root hash
    const tamperedRoot = await computeMerkleRoot([leafA + "_tampered", leafB, leafC, leafD]);
    assert.notEqual(root1, tamperedRoot);
  });

  test("Merkle root handles odd number of leaves gracefully via duplication", async () => {
    const leaves = ["claim_1", "claim_2", "claim_3"];

    const root = await computeMerkleRoot(leaves);
    assert.equal(root.length, 64);
    assert.match(root, /^[0-9a-f]{64}$/);
  });

  test("Evidence Merkle root aggregates diff, repo, trace, metrics and timestamp", async () => {
    const { merkleRoot, leafHashes } = await computeEvidenceMerkleRoot(DEMO_EVIDENCE);
    assert.equal(merkleRoot.length, 64);
    assert.match(merkleRoot, /^[0-9a-f]{64}$/);
    for (const leaf of ["diffHash", "repoHash", "traceHash", "metricsHash", "timestampHash"]) {
      assert.match(leafHashes[leaf], /^[0-9a-f]{64}$/);
    }
  });

  test("Identity keypair generation and verifiable receipt round-trip", async () => {
    const identity = await generateIdentityKeyPair();
    assert.match(identity.did, /^did:merit:/);
    assert.ok(identity.publicKeyHex.length >= 64);
    assert.ok(identity.publicKeyJwk && identity.privateKeyJwk);

    const receipt = await createVerifiableReceipt({
      username: "toibawani",
      issuerDid: identity.did,
      issuerName: "MeritOS Attestation Service",
      publicKeyHex: identity.publicKeyHex,
      skillId: "ts-compiler-ast",
      skillName: "TypeScript AST Engine",
      domain: "systems",
      level: "expert",
      score: 98,
      evidence: DEMO_EVIDENCE,
      privateKeyJwk: identity.privateKeyJwk,
    });

    assert.ok(receipt.proof.signatureValue.length > 0);
    assert.equal(receipt.credentialSubject.merkleRoot.length, 64);

    const result = await verifyVerifiableReceipt(receipt, DEMO_EVIDENCE);
    assert.equal(result.valid, true);
    assert.equal(result.tampered, false);
    assert.equal(result.merkleVerified, true);
    assert.ok(result.latencyMs >= 0);
  });

  test("Receipt verification detects tampered evidence via Merkle mismatch", async () => {
    const identity = await generateIdentityKeyPair();
    const receipt = await createVerifiableReceipt({
      username: "toibawani",
      issuerDid: identity.did,
      issuerName: "MeritOS Attestation Service",
      publicKeyHex: identity.publicKeyHex,
      skillId: "ts-compiler-ast",
      skillName: "TypeScript AST Engine",
      domain: "systems",
      level: "expert",
      score: 98,
      evidence: DEMO_EVIDENCE,
    });

    const tamperedEvidence = structuredClone(DEMO_EVIDENCE);
    tamperedEvidence.diffContent += "\n// attacker injected line";

    const result = await verifyVerifiableReceipt(receipt, tamperedEvidence);
    assert.equal(result.valid, false);
    assert.equal(result.tampered, true);
    assert.equal(result.merkleVerified, false);
  });

  test("Receipt verification rejects malformed credentials", async () => {
    const result = await verifyVerifiableReceipt(undefined);
    assert.equal(result.valid, false);
    assert.equal(result.tampered, true);
  });
});
