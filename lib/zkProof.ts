/**
 * MeritOS Zero-Knowledge & Selective Disclosure Engine
 * Allows candidates to prove authentic test passes, commit metrics, and compiler
 * passes without disclosing proprietary enterprise source code or employer secrets.
 */

import { computeSha256 } from "./crypto";

export interface BlindedLeaf {
  publicHash: string; // The SHA-256 commitment placed in the Merkle tree
  salt?: string;       // Held privately by candidate until selectively revealed
  field: string;
  isRedacted: boolean;
}

export interface SelectiveDisclosureProof {
  proofId: string;
  timestamp: string;
  candidateDid: string;
  skillId: string;
  metrics: {
    testPassRate: string;
    coverage: string;
    throughput: string;
    latency: string;
  };
  commitments: Record<string, string>; // fieldName -> Blinded SHA-256 hash
  revealedFields: Record<string, { value: string; salt: string }>;
  verifiedRoot: string;
}

/**
 * Generate a random 32-character hex salt
 */
export function generateSalt(): string {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(16).substring(2) + Date.now().toString(16);
}

/**
 * Create a blinded cryptographic commitment: SHA-256(value || salt)
 */
export async function createBlindedCommitment(
  value: string,
  salt?: string
): Promise<{ commitment: string; salt: string }> {
  const activeSalt = salt || generateSalt();
  const commitment = await computeSha256(`${value}::${activeSalt}`);
  return { commitment, salt: activeSalt };
}

/**
 * Verify that a revealed value and salt correspond to the blinded commitment
 */
export async function verifyBlindedCommitment(
  commitment: string,
  value: string,
  salt: string
): Promise<boolean> {
  const recalculated = await computeSha256(`${value}::${salt}`);
  return recalculated.toLowerCase() === commitment.toLowerCase();
}

/**
 * Build a selective disclosure receipt with proprietary fields redacted
 */
export async function buildSelectiveDisclosureProof(options: {
  candidateDid: string;
  skillId: string;
  rawEvidence: {
    repoUrl: string;
    diffContent: string;
    commitHash: string;
    metrics: {
      throughput: string;
      latency: string;
      testPassRate: string;
      coverage: string;
    };
  };
  fieldsToRedact: ("diffContent" | "repoUrl")[];
}): Promise<SelectiveDisclosureProof> {
  const { candidateDid, skillId, rawEvidence, fieldsToRedact } = options;

  const commitments: Record<string, string> = {};
  const revealedFields: Record<string, { value: string; salt: string }> = {};

  // Salt and commit repo URL
  const repoCommitment = await createBlindedCommitment(rawEvidence.repoUrl);
  commitments["repoUrl"] = repoCommitment.commitment;
  if (!fieldsToRedact.includes("repoUrl")) {
    revealedFields["repoUrl"] = { value: rawEvidence.repoUrl, salt: repoCommitment.salt };
  }

  // Salt and commit diff content
  const diffCommitment = await createBlindedCommitment(rawEvidence.diffContent);
  commitments["diffContent"] = diffCommitment.commitment;
  if (!fieldsToRedact.includes("diffContent")) {
    revealedFields["diffContent"] = { value: rawEvidence.diffContent, salt: diffCommitment.salt };
  }

  // Calculate proof root combining commitments and public metrics
  const leafComponents = [
    candidateDid,
    skillId,
    commitments["repoUrl"],
    commitments["diffContent"],
    rawEvidence.commitHash,
    rawEvidence.metrics.testPassRate,
    rawEvidence.metrics.coverage
  ].join("|");

  const verifiedRoot = await computeSha256(leafComponents);

  return {
    proofId: `zk-proof-${Date.now()}`,
    timestamp: new Date().toISOString(),
    candidateDid,
    skillId,
    metrics: rawEvidence.metrics,
    commitments,
    revealedFields,
    verifiedRoot
  };
}
