"use client";

import React, { useState } from "react";
import { 
  X, 
  Plus, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  Cpu, 
  Zap, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Lock
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SkillNode, DomainType, SkillLevel, AttestationEvidence } from "@/lib/types";
import { sound } from "@/lib/sound";
import { createVerifiableReceipt } from "@/lib/crypto";

export function AttestationWizard() {
  const { profile, isAttestModalOpen, setIsAttestModalOpen, addNewSkillAttestation } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [domain, setDomain] = useState<DomainType>("systems");
  const [level, setLevel] = useState<SkillLevel>("expert");
  const [label, setLabel] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("https://github.com/toibawani/engine-lab");
  const [commitHash, setCommitHash] = useState("a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9");
  const [diffContent, setDiffContent] = useState(`+ pub fn compute_simd_lane_stride<T: SimdElement>(slice: &[T]) -> SimdResult {
+     let chunks = slice.chunks_exact(8);
+     // Hardware accelerated vector dot product with zero heap alloc
+     chunks.fold(T::splat(0), |acc, x| acc.simd_mul_add(x, x))
+ }`);
  const [terminalOutput, setTerminalOutput] = useState(`$ cargo bench -p simd-vector-engine
Compiling simd-vector-engine v0.1.0...
Running target/release/deps/simd_bench
test bench_simd_f64_stride ... bench: 1.24 ns/iter (+/- 0.02)
test bench_simd_throughput ... bench: 18.4 GB/sec sustained
test result: ok. 18 passed; 0 failed; finished in 0.42s`);

  // Evaluator Simulation
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState<string[]>([]);
  const [isSigning, setIsSigning] = useState(false);

  if (!isAttestModalOpen) return null;

  const handleNextStep1 = () => {
    if (!label.trim()) {
      alert("Please provide a skill title.");
      return;
    }
    sound.playClick();
    setStep(2);
  };

  const handleNextStep2 = () => {
    sound.playClick();
    setStep(3);
    runEvaluationSimulation();
  };

  const runEvaluationSimulation = () => {
    setIsEvaluating(true);
    setEvalProgress([]);

    const steps = [
      "Cloning evidence commit tree from git object store...",
      "Analyzing AST invariants and cyclomatic complexity...",
      "Running headless automated test runner against commit...",
      "Extracting benchmark latency & throughput metrics...",
      "Computing SHA-256 Merkle root across evidence leaves...",
      "Static verification passed: 100% genuine code diff validated.",
    ];

    steps.forEach((msg, idx) => {
      setTimeout(() => {
        sound.playTerminalTick();
        setEvalProgress((prev) => [...prev, msg]);
        if (idx === steps.length - 1) {
          setIsEvaluating(false);
          sound.playVerifiedChime();
        }
      }, (idx + 1) * 600);
    });
  };

  const handleSignAndMint = async () => {
    sound.playClick(1200);
    setIsSigning(true);

    const evidence: AttestationEvidence = {
      type: "github_commit",
      title: label,
      repoUrl,
      commitHash,
      branch: "main",
      timestamp: new Date().toISOString(),
      diffContent,
      terminalTrace: [
        { type: "cmd", text: "$ cargo test --release" },
        { type: "stdout", text: terminalOutput },
        { type: "success", text: "Proof receipt verified and signed by issuer." },
      ],
      metrics: {
        latency: "1.1ms",
        throughput: "18.4 GB/s",
        testPassRate: "100% (18/18)",
        coverage: "98.2%",
      },
    };

    const newSkillId = `skill-${Date.now()}`;
    const generatedReceipt = await createVerifiableReceipt({
      username: profile.username,
      issuerDid: profile.did,
      issuerName: "MeritOS Peer Attestation Engine",
      publicKeyHex: profile.publicKey,
      skillId: newSkillId,
      skillName: label,
      domain,
      level,
      score: 98.5,
      evidence,
    });

    const newSkillNode: SkillNode = {
      id: newSkillId,
      label,
      shortCode: shortCode || `${domain.substring(0, 3).toUpperCase()}-NEW`,
      domain,
      level,
      status: "verified",
      description: description || "Cryptographically attested high-performance implementation.",
      xp: level === "master" ? 1400 : 900,
      iconName: domain === "systems" ? "Cpu" : domain === "frontend" ? "Zap" : domain === "cloud" ? "Database" : "Sparkles",
      x: 360 + (profile.skills.length % 3) * 180,
      y: domain === "systems" ? 120 : domain === "frontend" ? 280 : domain === "cloud" ? 440 : 600,
      prerequisites: [],
      lastAttestedAt: new Date().toISOString(),
      evidence,
      proofReceipt: generatedReceipt,
    };

    setTimeout(() => {
      addNewSkillAttestation(newSkillNode);
      setIsSigning(false);
      setIsAttestModalOpen(false);
      // Reset form
      setStep(1);
      setLabel("");
      setDescription("");
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0E1017] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-sans">
                Skill Attestation Wizard
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">
                Step {step} of 4: {
                  step === 1 ? "Define Competence Node" :
                  step === 2 ? "Attach Verifiable Evidence" :
                  step === 3 ? "Automated Static Evaluation" :
                  "Cryptographic Signing & Receipt Minting"
                }
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsAttestModalOpen(false);
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/[0.06]">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: NODE INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Domain Cluster
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as DomainType)}
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="systems">Systems & Low-Level</option>
                    <option value="frontend">Frontend Architecture</option>
                    <option value="cloud">Cloud & Distributed</option>
                    <option value="ai">AI & Applied ML</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Mastery Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as SkillLevel)}
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="expert">Expert (900 XP)</option>
                    <option value="master">Master (1400 XP)</option>
                    <option value="proficient">Proficient (600 XP)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                  Skill Title
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. SIMD Vector Dot Product in Zig"
                  className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-sans focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Node Code
                  </label>
                  <input
                    type="text"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    placeholder="e.g. SYS-05"
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed architecture & engineering scope"
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-sans focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: EVIDENCE ATTACHMENT */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    GitHub Repo URL
                  </label>
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Commit Hash (SHA-1)
                  </label>
                  <input
                    type="text"
                    value={commitHash}
                    onChange={(e) => setCommitHash(e.target.value)}
                    className="w-full px-3 py-2 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                  Git Commit Diff Content
                </label>
                <textarea
                  rows={4}
                  value={diffContent}
                  onChange={(e) => setDiffContent(e.target.value)}
                  className="w-full p-3 bg-[#090A0F] border border-white/[0.08] rounded-lg text-xs text-emerald-400 font-mono focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                  Terminal Execution / Benchmark Log
                </label>
                <textarea
                  rows={3}
                  value={terminalOutput}
                  onChange={(e) => setTerminalOutput(e.target.value)}
                  className="w-full p-3 bg-[#090A0F] border border-white/[0.08] rounded-lg text-xs text-zinc-300 font-mono focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: AUTOMATED EVALUATION SIMULATION */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.08] font-mono text-xs space-y-2 min-h-[200px]">
                <div className="flex items-center space-x-2 text-zinc-400 pb-2 border-b border-white/[0.06]">
                  {isEvaluating ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>
                    {isEvaluating ? "Automated Static Evaluation in progress..." : "Static Evaluation Passed"}
                  </span>
                </div>

                <div className="space-y-1 pt-1">
                  {evalProgress.map((p, i) => (
                    <div key={i} className="text-zinc-300 flex items-center space-x-2">
                      <span className="text-emerald-400">✔</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SIGN & MINT */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#12131A] to-[#181A26] border border-white/[0.08] space-y-3">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold font-mono uppercase text-white">
                    Identity Key Signature Seal
                  </h4>
                </div>

                <div className="p-3 rounded-lg bg-[#090A0F] border border-white/[0.06] space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Signer DID:</span>
                    <span className="text-zinc-300">{profile.did}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Standard:</span>
                    <span className="text-emerald-400">W3C Verifiable Credential v1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Algorithm:</span>
                    <span className="text-cyan-400">Ed25519 / WebCrypto ECDSA</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  Minting this attestation will cryptographically sign the Merkle root of the attached evidence and append an immutable block receipt to your Competence Passport.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#12131A] border-t border-white/[0.06] flex items-center justify-between">
          {step > 1 && step <= 2 ? (
            <button
              onClick={() => {
                sound.playClick();
                setStep((step - 1) as any);
              }}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step === 1 && (
            <button
              onClick={handleNextStep1}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg tactile-btn-primary text-xs font-semibold"
            >
              <span>Next: Attach Evidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleNextStep2}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg tactile-btn-primary text-xs font-semibold"
            >
              <span>Run Automated Evaluation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              disabled={isEvaluating}
              onClick={() => {
                sound.playClick();
                setStep(4);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg tactile-btn-primary text-xs font-semibold disabled:opacity-50"
            >
              <span>Proceed to Cryptographic Seal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              disabled={isSigning}
              onClick={handleSignAndMint}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg tactile-btn-primary text-xs font-semibold disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-[#042F2E]" />
              <span>{isSigning ? "Signing Receipt..." : "Cryptographically Sign & Mint to Tree"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
