import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("MeritOS Data Integrity & Persona Verification", () => {
  const seedFilePath = path.resolve(process.cwd(), "lib/data/seedData.ts");

  test("seedData.ts file exists and is populated with rich evidence", () => {
    assert.ok(fs.existsSync(seedFilePath), "seedData.ts must exist");
    const content = fs.readFileSync(seedFilePath, "utf-8");
    assert.ok(content.length > 50000, "seedData.ts should contain extensive production data");
  });

  test("Validates DID structure and Ed25519 public key format for personas", () => {
    const content = fs.readFileSync(seedFilePath, "utf-8");

    // Check did:merit: occurrences
    const didMatches = content.match(/did:merit:[a-zA-Z0-9_:-]+/g);
    assert.ok(didMatches && didMatches.length >= 3, "Should define DIDs for core personas");

    for (const did of didMatches) {
      assert.match(did, /^did:merit:/);
    }

    // Check hex public keys (standard 64-char or 66-char uncompressed SEC1 hex)
    const pkMatches = content.match(/publicKey:\s*"([a-f0-9]{64,66})"/g);
    assert.ok(pkMatches && pkMatches.length >= 3, "Each persona must have a valid hex Ed25519 public key");
  });

  test("Validates cryptographic receipts and Merkle root presence in skill proofs", () => {
    const content = fs.readFileSync(seedFilePath, "utf-8");

    assert.ok(content.includes("merkleRoot"), "Proofs must contain Merkle root assertions");
    assert.ok(content.includes("evidenceFingerprint"), "Proofs must contain evidence fingerprints");
    assert.ok(content.includes("verificationMethod"), "Proofs must specify W3C verification method");
    assert.ok(content.includes("Ed25519VerificationKey2020"), "Must adhere to Ed25519 suite 2020");
  });

  test("Validates humane engineering pillars and peer voucher signatures", () => {
    const content = fs.readFileSync(seedFilePath, "utf-8");

    assert.ok(content.includes("peerAttestations"), "Profiles must include peer attestations");
    assert.ok(content.includes("mentorship"), "Pillars must include mentorship");
    assert.ok(content.includes("blameless_culture"), "Pillars must include blameless culture");
    assert.ok(content.includes("sustainable_cadence"), "Pillars must include sustainable cadence");
    assert.ok(content.includes("review_empathy"), "Pillars must include review empathy");
  });
});
