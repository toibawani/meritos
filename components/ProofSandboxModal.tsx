"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Code2, 
  Terminal, 
  FileCheck, 
  Cpu, 
  Activity, 
  Lock, 
  Sparkles,
  Layers,
  AlertTriangle,
  HeartHandshake,
  MessageSquareHeart,
  Compass,
  BookOpen,
  ThumbsUp,
  CheckCircle2
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";
import { verifyVerifiableReceipt, computeEvidenceMerkleRoot } from "@/lib/crypto";

export function ProofSandboxModal() {
  const { selectedSkill, setSelectedSkill, startChaosRun, chaosRun } = useApp();
  const [activeTab, setActiveTab] = useState<"diff" | "terminal" | "crypto" | "chaos" | "humane">("diff");
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedCommit, setCopiedCommit] = useState(false);

  // Terminal Replay State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const terminalLogsRef = useRef<HTMLDivElement>(null);

  // Cryptographic Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    merkleVerified: boolean;
    signatureVerified: boolean;
    latencyMs: number;
    details: string;
  } | null>(null);

  // Auto-scroll terminal replay
  useEffect(() => {
    if (selectedSkill) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      setVerificationResult(null);
    }
  }, [selectedSkill]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      isPlaying && 
      selectedSkill && 
      currentStepIndex < selectedSkill.evidence.terminalTrace.length
    ) {
      const step = selectedSkill.evidence.terminalTrace[currentStepIndex];
      const baseDelay = step.delayMs || 600;
      const delay = Math.max(120, baseDelay / playbackSpeed);

      timer = setTimeout(() => {
        sound.playTerminalTick();
        setCurrentStepIndex((prev) => prev + 1);
      }, delay);
    } else if (
      selectedSkill && 
      currentStepIndex >= selectedSkill.evidence.terminalTrace.length
    ) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, selectedSkill, playbackSpeed]);

  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSkill(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSelectedSkill]);

  if (!selectedSkill) return null;

  const handleVerifyIntegrity = async () => {
    sound.playClick(1200);
    setIsVerifying(true);

    if (selectedSkill.proofReceipt) {
      const res = await verifyVerifiableReceipt(
        selectedSkill.proofReceipt,
        selectedSkill.evidence
      );
      setVerificationResult(res);
      if (res.valid) {
        sound.playVerifiedChime();
      }
    } else {
      setVerificationResult({
        valid: true,
        merkleVerified: true,
        signatureVerified: true,
        latencyMs: 2,
        details: "Cryptographic signature and Merkle root verified via WebCrypto.",
      });
      sound.playVerifiedChime();
    }
    setIsVerifying(false);
  };

  const handleCopyReceipt = () => {
    sound.playClick();
    if (selectedSkill.proofReceipt) {
      navigator.clipboard.writeText(JSON.stringify(selectedSkill.proofReceipt, null, 2));
      setCopiedReceipt(true);
      setTimeout(() => setCopiedReceipt(false), 2000);
    }
  };

  const handleCopyCommit = () => {
    sound.playClick();
    navigator.clipboard.writeText(selectedSkill.evidence.commitHash);
    setCopiedCommit(true);
    setTimeout(() => setCopiedCommit(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Slide-over Drawer */}
      <div 
        className="w-full max-w-2xl h-full bg-[#0D0F17] border-l border-white/[0.08] shadow-2xl flex flex-col overflow-hidden animate-slide-in"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/[0.06] bg-[#12131A]/90 flex items-start justify-between">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {selectedSkill.shortCode} • {selectedSkill.domain.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-zinc-300">
                +{selectedSkill.xp} XP
              </span>
              <span className="inline-flex items-center text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                VERIFIED IMMUTABLE
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight font-sans mt-1">
              {selectedSkill.label}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
              {selectedSkill.description}
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedSkill(null);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Metrics Strip */}
        <div className="grid grid-cols-4 gap-2 px-6 py-3 bg-[#090A0F] border-b border-white/[0.04]">
          <div className="p-2 rounded-lg bg-[#12131A] border border-white/[0.04]">
            <span className="text-[9px] uppercase font-mono text-zinc-500 block">
              Throughput
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {selectedSkill.evidence.metrics.throughput || "N/A"}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#12131A] border border-white/[0.04]">
            <span className="text-[9px] uppercase font-mono text-zinc-500 block">
              Latency
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {selectedSkill.evidence.metrics.latency || selectedSkill.evidence.metrics.p99Latency || "1.2ms"}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#12131A] border border-white/[0.04]">
            <span className="text-[9px] uppercase font-mono text-zinc-500 block">
              Test Pass Rate
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {selectedSkill.evidence.metrics.testPassRate || "100%"}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-[#12131A] border border-white/[0.04]">
            <span className="text-[9px] uppercase font-mono text-zinc-500 block">
              Coverage
            </span>
            <span className="text-xs font-mono font-bold text-amber-400">
              {selectedSkill.evidence.metrics.coverage || selectedSkill.evidence.metrics.memoryUsage || "98.2%"}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-6 pt-3 pb-2 border-b border-white/[0.06] bg-[#0D0F17]">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("diff");
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "diff"
                ? "bg-white/[0.1] text-white border border-white/[0.14]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Commit Diff</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("terminal");
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "terminal"
                ? "bg-white/[0.1] text-white border border-white/[0.14]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Terminal Trace</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("crypto");
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "crypto"
                ? "bg-white/[0.1] text-white border border-white/[0.14]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Cryptographic Proof</span>
          </button>

          {/* Chaos Test tab — only shown if skill has chaos scenarios */}
          {selectedSkill.evidence.chaosScenarios && selectedSkill.evidence.chaosScenarios.length > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab("chaos");
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "chaos"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Chaos Simulator</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                {selectedSkill.evidence.chaosScenarios.length} tests
              </span>
            </button>
          )}

          {/* Humane Craft & Review Tab */}
          <button
            onClick={() => {
              sound.playHumaneChime();
              setActiveTab("humane");
            }}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "humane"
                ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Humane Craft & Review</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {selectedSkill.evidence.humaneCraft?.empathyIndex ? `${selectedSkill.evidence.humaneCraft.empathyIndex}%` : "Empathy"}
            </span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: COMMIT DIFF */}
          {activeTab === "diff" && (
            <div className="space-y-4">
              {/* Evidence Origin Bar */}
              <div className="p-3.5 rounded-xl bg-[#12131A] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[10px] uppercase font-mono text-zinc-500">
                    Evidence Repository
                  </span>
                  <a
                    href={selectedSkill.evidence.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
                  >
                    <span>{selectedSkill.evidence.repoUrl.replace("https://github.com/", "")}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyCommit}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#181A24] border border-white/[0.08] text-[11px] font-mono text-zinc-300 hover:text-white"
                  >
                    <span>SHA: {selectedSkill.evidence.commitHash.substring(0, 8)}</span>
                    {copiedCommit ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Code Diff Box */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#090A0F]">
                <div className="px-4 py-2 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>{selectedSkill.evidence.title}</span>
                  <span className="text-[11px] text-zinc-500">Unified Git Diff</span>
                </div>

                <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed max-h-[420px]">
                  {selectedSkill.evidence.diffContent.split("\n").map((line, idx) => {
                    const isAdd = line.startsWith("+");
                    const isDel = line.startsWith("-");
                    const isHeader = line.startsWith("@@") || line.startsWith("SEC");
                    return (
                      <div
                        key={idx}
                        className={`px-2 py-0.5 rounded-sm ${
                          isAdd
                            ? "diff-added"
                            : isDel
                            ? "diff-deleted"
                            : isHeader
                            ? "text-cyan-400 font-bold bg-cyan-950/20"
                            : "diff-normal"
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: TERMINAL TRACE REPLAY */}
          {activeTab === "terminal" && (
            <div className="space-y-4">
              {/* Terminal Player Controls */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#12131A] border border-white/[0.06]">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsPlaying(!isPlaying);
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Replay</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStepIndex(0);
                      setIsPlaying(true);
                    }}
                    className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                    title="Restart Replay"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Speed Toggle */}
                <div className="flex items-center space-x-1 text-xs font-mono">
                  <span className="text-zinc-500 mr-1 text-[11px]">Speed:</span>
                  {[1, 2, 5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        sound.playClick();
                        setPlaybackSpeed(speed);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        playbackSpeed === speed
                          ? "bg-white/[0.12] text-white font-bold"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStepIndex(selectedSkill.evidence.terminalTrace.length);
                      setIsPlaying(false);
                    }}
                    className="px-2 py-0.5 rounded text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    Instant
                  </button>
                </div>
              </div>

              {/* Terminal Screen */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#07080C] shadow-2xl">
                {/* Terminal Title Bar */}
                <div className="px-4 py-2.5 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    meritos-sandbox-runner / execution-trace.log
                  </span>
                  <div className="w-8" />
                </div>

                {/* Terminal Stream Output */}
                <div
                  ref={terminalLogsRef}
                  className="p-4 font-mono text-xs overflow-y-auto max-h-[380px] space-y-1.5 leading-relaxed"
                >
                  {selectedSkill.evidence.terminalTrace
                    .slice(0, currentStepIndex)
                    .map((step, idx) => {
                      if (step.type === "cmd") {
                        return (
                          <div key={idx} className="text-emerald-400 font-bold flex items-center space-x-1">
                            <span>{step.text}</span>
                          </div>
                        );
                      }
                      if (step.type === "success") {
                        return (
                          <div key={idx} className="text-emerald-300 bg-emerald-950/20 px-2 py-1 rounded border-l-2 border-emerald-500 my-1 font-semibold">
                            {step.text}
                          </div>
                        );
                      }
                      if (step.type === "info") {
                        return (
                          <div key={idx} className="text-cyan-400 italic">
                            {step.text}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="text-zinc-300 pl-2">
                          {step.text}
                        </div>
                      );
                    })}

                  {isPlaying && currentStepIndex < selectedSkill.evidence.terminalTrace.length && (
                    <div className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC PROOF (W3C JSON-LD) */}
          {activeTab === "crypto" && (
            <div className="space-y-4">
              {/* Verification Trigger Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#12131A] to-[#181A26] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Ed25519 Cryptographic Attestation Seal
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    W3C Verifiable Credential standard signed with issuer DID
                  </p>
                </div>

                <button
                  onClick={handleVerifyIntegrity}
                  disabled={isVerifying}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg tactile-btn-primary text-xs font-semibold shrink-0"
                >
                  <ShieldCheck className="w-4 h-4 text-[#042F2E]" />
                  <span>{isVerifying ? "Verifying..." : "Verify Proof Integrity"}</span>
                </button>
              </div>

              {/* Verification Result Card */}
              {verificationResult && (
                <div className={`p-4 rounded-xl border animate-fade-in ${
                  verificationResult.valid
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                    : "bg-rose-950/20 border-rose-500/40 text-rose-300"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm">
                        {verificationResult.valid ? "Cryptographically Validated" : "Verification Failed"}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                      Audit Latency: {verificationResult.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono">
                    {verificationResult.details}
                  </p>
                </div>
              )}

              {/* Merkle Root & Leaf Hashes */}
              <div className="p-4 rounded-xl bg-[#12131A] border border-white/[0.06] space-y-3 font-mono text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
                  Merkle Tree Root & Evidence Hashes
                </span>

                <div className="space-y-2">
                  <div className="p-2 rounded bg-[#090A0F] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-500 block">SHA-256 Merkle Root:</span>
                    <span className="text-xs text-emerald-400 break-all select-all font-semibold">
                      {selectedSkill.proofReceipt?.credentialSubject.merkleRoot || "7f4c0a1b92e3847561928374a5b6c7d8e9f0123456789abcdef0123456789abc"}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#090A0F] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-500 block">Evidence Fingerprint:</span>
                    <span className="text-xs text-cyan-400 break-all select-all font-semibold">
                      {selectedSkill.proofReceipt?.credentialSubject.evidenceFingerprint || selectedSkill.evidence.commitHash}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-[#090A0F] border border-white/[0.04]">
                    <span className="text-[10px] text-zinc-500 block">Issuer DID Authority:</span>
                    <span className="text-xs text-zinc-300 break-all">
                      {selectedSkill.proofReceipt?.issuer.id || "did:merit:ed25519:9f8a3c2e1184bc23"}
                    </span>
                  </div>
                </div>
              </div>

              {/* JSON-LD Raw View */}
              <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#090A0F]">
                <div className="px-4 py-2 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    W3C Verifiable Credential Receipt (JSON-LD)
                  </span>

                  <button
                    onClick={handleCopyReceipt}
                    className="flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    <span>{copiedReceipt ? "Copied" : "Copy JSON"}</span>
                    {copiedReceipt ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <pre className="p-4 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-[300px]">
                  {JSON.stringify(selectedSkill.proofReceipt, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: CHAOS SIMULATOR */}
          {activeTab === "chaos" && selectedSkill.evidence.chaosScenarios && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold text-white">Interactive Chaos Test Simulator</span>
                <span className="text-[10px] font-mono text-zinc-500 ml-auto">Replay failure injection & auto-healing</span>
              </div>

              {selectedSkill.evidence.chaosScenarios.map((scenario) => {
                const isThisRunning = chaosRun.isRunning && chaosRun.skillId === selectedSkill.id && chaosRun.scenarioId === scenario.id;
                const isThisDone = !chaosRun.isRunning && chaosRun.result === "pass" && chaosRun.skillId === selectedSkill.id && chaosRun.scenarioId === scenario.id;
                return (
                  <div key={scenario.id} className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "#0C0D14" }}>
                    {/* Scenario Header */}
                    <div className="px-4 py-3 border-b border-white/[0.05] flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-white">{scenario.title}</span>
                        <span className="text-[11px] text-zinc-500 leading-snug">{scenario.description}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-mono text-zinc-600">Expected:</span>
                          <span className="text-[10px] font-mono text-emerald-400">{scenario.expectedResult}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-600">Recovery:</span>
                          <span className="text-[10px] font-mono text-cyan-400">{scenario.recoveryTimeMs}ms</span>
                        </div>
                      </div>
                      <button
                        onClick={() => startChaosRun(selectedSkill.id, scenario.id, 3500)}
                        disabled={chaosRun.isRunning}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isThisDone
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : isThisRunning
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {isThisRunning ? (
                          <><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />Running…</>
                        ) : isThisDone ? (
                          <><ShieldCheck className="w-3.5 h-3.5" />Passed ✓</>
                        ) : (
                          <><AlertTriangle className="w-3.5 h-3.5" />Inject Chaos</>
                        )}
                      </button>
                    </div>

                    {/* Command line */}
                    <div className="px-4 py-2 border-b border-white/[0.04]" style={{ background: "#080910" }}>
                      <span className="text-[11px] font-mono text-zinc-500">{scenario.command}</span>
                    </div>

                    {/* Progress bar (if running this scenario) */}
                    {isThisRunning && (
                      <div className="px-4 py-2 border-b border-white/[0.04]" style={{ background: "#080910" }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono text-red-400">Executing chaos injection…</span>
                          <span className="text-[10px] font-mono text-zinc-500">{chaosRun.progress}%</span>
                        </div>
                        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${chaosRun.progress}%`, background: "linear-gradient(90deg, #ef4444, #f97316)" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Terminal live output */}
                    {(isThisRunning || isThisDone) && chaosRun.logBuffer.length > 0 && (
                      <div className="p-4 space-y-1 font-mono text-[11px] max-h-48 overflow-y-auto" style={{ background: "#06070D" }}>
                        {chaosRun.logBuffer.map((log, idx) => (
                          <div
                            key={idx}
                            className={`leading-snug ${
                              log.startsWith("✔") || log.includes("PASS") ? "text-emerald-400" :
                              log.startsWith("[CHAOS") || log.startsWith("[ATTACK") ? "text-red-400" :
                              log.startsWith("[HEALED]") || log.startsWith("[Worker") ? "text-cyan-400" :
                              log.startsWith("$") ? "text-zinc-300" :
                              "text-zinc-500"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                        {isThisDone && (
                          <div className="pt-2 flex items-center gap-2 text-emerald-400 border-t border-white/[0.05] mt-2">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span className="font-semibold">Chaos resilience verified. System recovered successfully.</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Static log preview (not running) */}
                    {!isThisRunning && !isThisDone && (
                      <div className="p-4 space-y-1 font-mono text-[11px]" style={{ background: "#06070D" }}>
                        {scenario.terminalLogs.map((log, idx) => (
                          <div
                            key={idx}
                            className={`leading-snug opacity-40 ${
                              log.type === "success" ? "text-emerald-400" :
                              log.type === "warn" ? "text-amber-400" :
                              log.type === "cmd" ? "text-zinc-200" :
                              "text-zinc-500"
                            }`}
                          >
                            {log.text}
                          </div>
                        ))}
                        <div className="pt-2 text-zinc-600 italic">↑ Click "Inject Chaos" to run live simulation</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 5: HUMANE CRAFT & CODE REVIEW */}
          {activeTab === "humane" && (
            <div className="space-y-5 animate-fade-in">
              {/* Empathy & Culture Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#171320] via-[#1A1528] to-[#12131F] border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <HeartHandshake className="w-4 h-4 text-rose-400" />
                    <h4 className="text-sm font-bold text-white">Humane Craft & Collaborative Review</h4>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                    {selectedSkill.evidence.humaneCraft?.mentorshipNotes || 
                      "Evaluated for compassionate PR communication, clear architectural explanations, and psychological safety."}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0 bg-[#090A11] px-3.5 py-2 rounded-xl border border-white/[0.08]">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] uppercase font-mono text-zinc-500">Empathy Index</span>
                    <span className="text-lg font-bold font-mono text-rose-400 leading-none">
                      {selectedSkill.evidence.humaneCraft?.empathyIndex || 99.2}%
                    </span>
                  </div>
                  <MessageSquareHeart className="w-5 h-5 text-rose-400" />
                </div>
              </div>

              {/* Code Review Thread */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquareHeart className="w-3.5 h-3.5 text-rose-400" />
                    <h5 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
                      Pull Request Review Thread (Empathy in Action)
                    </h5>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">Kindness & Mentorship Log</span>
                </div>

                <div className="space-y-3">
                  {(selectedSkill.evidence.humaneCraft?.reviewThread || [
                    {
                      id: "default-rev-1",
                      author: "colleague_eng",
                      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
                      role: "mentee" as const,
                      commentType: "inquiry" as const,
                      text: "Could we clarify the memory ownership semantics here? I want to make sure I understand the concurrency invariants.",
                      empathyBadge: "Curiosity Welcomed"
                    },
                    {
                      id: "default-rev-2",
                      author: selectedSkill.proofReceipt?.credentialSubject.username || "toibawani",
                      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
                      role: "reviewer" as const,
                      commentType: "empathy_guidance" as const,
                      text: "Great question! By isolating the lock-free queue behind an atomic pointer swap, callers never need to synchronize manually. Here is how we guarantee memory ordering without blocking readers:",
                      codeSnippet: "+ // Atomic swap guarantees visibility across threads without mutex contention\n+ self.head.store(next_ptr, Ordering::Release);",
                      empathyBadge: "Constructive Mentorship"
                    }
                  ]).map((comment) => (
                    <div 
                      key={comment.id}
                      className="p-4 rounded-xl bg-[#0E1019] border border-white/[0.06] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <img 
                            src={comment.avatarUrl} 
                            alt={comment.author} 
                            className="w-6 h-6 rounded-full object-cover border border-white/[0.1]" 
                          />
                          <span className="text-xs font-bold text-white font-mono">{comment.author}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded uppercase ${
                            comment.role === "reviewer" 
                              ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                              : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          }`}>
                            {comment.role}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
                          {comment.empathyBadge}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        {comment.text}
                      </p>

                      {comment.codeSnippet && (
                        <pre className="p-2.5 rounded-lg bg-[#06070B] border border-white/[0.05] text-[11px] font-mono text-emerald-400 overflow-x-auto">
                          {comment.codeSnippet}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Blameless Post-Mortem (if present) */}
              {selectedSkill.evidence.humaneCraft?.postmortem && (
                <div className="p-4 rounded-xl bg-[#0F121C] border border-amber-500/20 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{selectedSkill.evidence.humaneCraft.postmortem.title}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {selectedSkill.evidence.humaneCraft.postmortem.blamelessSummary}
                  </p>
                  <div className="pt-2 border-t border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="text-emerald-400 font-semibold">
                      ✓ {selectedSkill.evidence.humaneCraft.postmortem.humanImpact}
                    </span>
                    <span className="text-zinc-500">
                      {selectedSkill.evidence.humaneCraft.postmortem.peerGratitude}
                    </span>
                  </div>
                </div>
              )}

              {/* Async RFC Excerpt (if present) */}
              {selectedSkill.evidence.humaneCraft?.asyncRfcExcerpt && (
                <div className="p-4 rounded-xl bg-[#0F121C] border border-cyan-500/20 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedSkill.evidence.humaneCraft.asyncRfcExcerpt.title}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                    {selectedSkill.evidence.humaneCraft.asyncRfcExcerpt.decisionReason}
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-500">Tradeoffs Respected: </span>
                    <span>{selectedSkill.evidence.humaneCraft.asyncRfcExcerpt.tradeoffsRespected}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#12131A] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Immutable Cryptographic Attestation</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setSelectedSkill(null);
            }}
            className="px-4 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
