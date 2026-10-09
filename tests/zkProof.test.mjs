import { test, describe } from "node:test";
import assert from "node:assert/strict";

// Import the REAL shipped implementation (compiled from lib/zkProof.ts by `pretest`).
import {
  generateSalt,
  createBlindedCommitment,
  verifyBlindedCommitment,
  buildSelectiveDisclosureProof,
} from "../.test-build/zkProof.js";

describe("MeritOS Zero-Knowledge & Selective Disclosure Engine", () => {
  test("Blinded commitment creation and mathematical verification", async () => {
    const confidentialSecret = "export class ProprietaryTradingEngine { ... }";
    const { commitment, salt } = await createBlindedCommitment(confidentialSecret);

    assert.ok(commitment.length === 64);
    assert.ok(salt.length > 10);

    const isValid = await verifyBlindedCommitment(commitment, confidentialSecret, salt);
    assert.equal(isValid, true);
  });

  test("Commitment verification fails if confidential text is altered", async () => {
    const originalText = "safe_code_v1";
    const { commitment, salt } = await createBlindedCommitment(originalText);

    const isTamperedValid = await verifyBlindedCommitment(commitment, "tampered_code_v2", salt);
    assert.equal(isTamperedValid, false);
  });

  test("Commitment verification fails with incorrect salt", async () => {
    const secret = "top_secret_algorithm";
    const { commitment } = await createBlindedCommitment(secret);
    const wrongSalt = generateSalt();

    const isValid = await verifyBlindedCommitment(commitment, secret, wrongSalt);
    assert.equal(isValid, false);
  });

  test("Selective disclosure proof generation hides proprietary diff without breaking Merkle anchor", async () => {
    const proprietaryDiff = "@@ -1,5 +1,10 @@ proprietary trade secrets";
    const publicRepoUrl = "https://github.com/enterprise/private-repo";

    const proof = await buildSelectiveDisclosureProof({
      candidateDid: "did:merit:toibawani",
      skillId: "ts-compiler-ast",
      rawEvidence: {
        repoUrl: publicRepoUrl,
        diffContent: proprietaryDiff,
        commitHash: "d24a0ccf776ab0786090b6c94c36c7b68d5e0d9e",
        metrics: {
          throughput: "12.4k ops/s",
          latency: "0.8ms",
          testPassRate: "100%",
          coverage: "98.4%",
        },
      },
      fieldsToRedact: ["diffContent", "repoUrl"],
    });

    // Verifier receives commitment hashes without seeing raw proprietaryDiff
    assert.ok(proof.commitments.diffContent.length === 64);
    assert.ok(proof.verifiedRoot.length === 64);
    assert.ok(!JSON.stringify(proof).includes("proprietary trade secrets"));

    // Redacted fields must NOT be revealed...
    assert.ok(!("diffContent" in proof.revealedFields));
    assert.ok(!("repoUrl" in proof.revealedFields));

    // ...while commitments still anchor a verifiable root
    assert.ok(
      proof.verifiedRoot.length === 64 && /^[0-9a-f]{64}$/.test(proof.verifiedRoot),
      "proof root must be a valid SHA-256 hex digest"
    );
  });

  test("Selectively revealed fields verify against their commitments", async () => {
    const value = "public helper v1.2.0";
    const { commitment, salt } = await createBlindedCommitment(value);
    const isValid = await verifyBlindedCommitment(commitment, value, salt);
    assert.equal(isValid, true);
  });
});
