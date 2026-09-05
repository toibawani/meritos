import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// Standalone verification functions matching lib/crypto.ts specification
function bufToHex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
    .join("");
}

function hexToBuf(hex) {
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, "");
  const bytes = new Uint8Array(Math.ceil(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function computeSha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function computeMerkleRoot(leaves) {
  if (leaves.length === 0) {
    return computeSha256("empty_merkle_tree");
  }

  let currentLayer = leaves.map(leaf => computeSha256(leaf));

  while (currentLayer.length > 1) {
    const nextLayer = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        const combined = currentLayer[i] + currentLayer[i + 1];
        nextLayer.push(computeSha256(combined));
      } else {
        const duplicated = currentLayer[i] + currentLayer[i];
        nextLayer.push(computeSha256(duplicated));
      }
    }
    currentLayer = nextLayer;
  }

  return currentLayer[0];
}

describe("MeritOS Cryptographic Verification Engine", () => {
  test("bufToHex & hexToBuf roundtrip consistency", () => {
    const originalHex = "9f8a3c2e1184bc234a991823efca4421bca90821";
    const buf = hexToBuf(originalHex);
    const restoredHex = bufToHex(buf);
    assert.equal(restoredHex.toLowerCase(), originalHex.toLowerCase());
  });

  test("SHA-256 standard test vector verification", () => {
    // Empty string SHA-256
    const emptyHash = computeSha256("");
    assert.equal(emptyHash, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    // Standard ASCII string
    const testHash = computeSha256("MeritOS:proof-of-competence");
    assert.equal(testHash.length, 64);
    assert.match(testHash, /^[0-9a-f]{64}$/);
  });

  test("Merkle root deterministic computation across 4 leaves", () => {
    const leafA = "leaf_1:github_commit:9f8a3c";
    const leafB = "leaf_2:chaos_recovery:pass";
    const leafC = "leaf_3:peer_voucher:did:merit:alex";
    const leafD = "leaf_4:ast_compiler:level_master";

    const root1 = computeMerkleRoot([leafA, leafB, leafC, leafD]);
    const root2 = computeMerkleRoot([leafA, leafB, leafC, leafD]);

    assert.equal(root1, root2);
    assert.equal(root1.length, 64);

    // Tampering test: changing a single character changes root hash
    const tamperedRoot = computeMerkleRoot([leafA + "_tampered", leafB, leafC, leafD]);
    assert.notEqual(root1, tamperedRoot);
  });

  test("Merkle root handles odd number of leaves gracefully via duplication", () => {
    const leaves = [
      "claim_1",
      "claim_2",
      "claim_3"
    ];

    const root = computeMerkleRoot(leaves);
    assert.equal(root.length, 64);
    assert.match(root, /^[0-9a-f]{64}$/);
  });

  test("Ed25519 keypair generation and message signature verification", () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
    const testPayload = JSON.stringify({
      subject: "did:merit:toibawani",
      skillId: "ts-compiler-ast",
      xpGained: 850,
      timestamp: "2026-09-05T18:00:00Z"
    });

    const signature = crypto.sign(null, Buffer.from(testPayload), privateKey);
    assert.ok(signature.length > 0);

    const isVerified = crypto.verify(null, Buffer.from(testPayload), publicKey, signature);
    assert.equal(isVerified, true);

    const isTampered = crypto.verify(null, Buffer.from(testPayload + "tamper"), publicKey, signature);
    assert.equal(isTampered, false);
  });
});
