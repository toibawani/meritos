export type DomainType = "systems" | "frontend" | "cloud" | "ai";
export type SkillLevel = "novice" | "proficient" | "expert" | "master";
export type NodeStatus = "verified" | "in_progress" | "locked";

export interface TerminalTraceStep {
  type: "cmd" | "stdout" | "stderr" | "success" | "warn" | "info" | "diff";
  text: string;
  delayMs?: number;
}

export interface AttestationEvidence {
  type: "github_commit" | "pull_request" | "benchmark_suite" | "test_run" | "live_demo";
  title: string;
  repoUrl: string;
  commitHash: string;
  branch?: string;
  diffContent: string;
  terminalTrace: TerminalTraceStep[];
  metrics: {
    latency?: string;
    throughput?: string;
    testPassRate?: string;
    coverage?: string;
    memoryUsage?: string;
    p99Latency?: string;
  };
  timestamp: string;
  notes?: string;
}

export interface VerifiableReceipt {
  "@context": string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
    name: string;
    publicKey: string;
    keyType: string;
  };
  issuanceDate: string;
  credentialSubject: {
    id: string;
    username: string;
    skillId: string;
    skillName: string;
    domain: DomainType;
    level: SkillLevel;
    score: number;
    merkleRoot: string;
    evidenceFingerprint: string;
  };
  proof: {
    type: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    jws?: string;
    signatureValue: string;
  };
}

export interface SkillNode {
  id: string;
  label: string;
  shortCode: string;
  domain: DomainType;
  level: SkillLevel;
  status: NodeStatus;
  description: string;
  xp: number;
  iconName: string;
  x: number;
  y: number;
  prerequisites: string[]; // array of skill node ids
  evidence: AttestationEvidence;
  proofReceipt?: VerifiableReceipt;
  lastAttestedAt?: string;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  type: "attestation_signed" | "node_unlocked" | "score_updated" | "verification_audited";
  skillId: string;
  skillName: string;
  domain: DomainType;
  status: "verified" | "pending" | "decay_refreshed";
  receiptHash: string;
  blockHeight: number;
}

export interface RadarCapabilityScores {
  quality: number;
  architecture: number;
  reliability: number;
  speed: number;
  cryptographicDepth: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  title: string;
  avatarUrl: string;
  githubUrl: string;
  did: string;
  publicKey: string;
  verificationScore: number; // e.g. 96.4
  totalVerifiedSkills: number;
  globalRank: string; // e.g. "Top 0.5%"
  domainBreakdown: Record<DomainType, number>;
  radarScores: RadarCapabilityScores;
  activityLedger: ActivityEntry[];
  skills: SkillNode[];
}
