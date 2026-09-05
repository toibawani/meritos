"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, ShieldCheck, CheckCircle2, AlertCircle, X, Sparkles, 
  ArrowRight, HeartHandshake, Zap, Cpu, Award, Download, Copy, Check
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

interface TeamArchetype {
  id: string;
  name: string;
  department: string;
  description: string;
  requiredSkills: string[];
  humaneRequirements: string[];
  urgency: "High" | "Critical" | "Strategic";
}

const ARCHETYPES: TeamArchetype[] = [
  {
    id: "systems-core",
    name: "Distributed Systems & Engine Squad",
    department: "Core Platform",
    description: "Building low-latency database engines, custom compilers, and consensus layers for high-throughput transactional backbones.",
    requiredSkills: [
      "TypeScript AST Engine & Compiler Passes",
      "WASM Slab Allocator & Linear Memory",
      "Zero-Copy Binary RPC & Wire Protocol",
      "Distributed Raft State Machine Replication"
    ],
    humaneRequirements: [
      "Blameless incident retrospectives",
      "High-context async RFC writing",
      "Junior systems engineer mentorship"
    ],
    urgency: "Critical"
  },
  {
    id: "frontend-infra",
    name: "Frontend Infrastructure & UI Platform",
    department: "Web Experience",
    description: "High-performance graphics engines, design system compilers, and web-first client runtime architecture.",
    requiredSkills: [
      "React Concurrent Fiber Reconciler",
      "WebGPU Compute Shaders & 3D Visualizer",
      "Micro-Frontend Sandbox & Module Federation"
    ],
    humaneRequirements: [
      "Empathetic code reviews with praise",
      "Inclusive component accessibility auditing",
      "Async design decision documents"
    ],
    urgency: "Strategic"
  },
  {
    id: "cloud-ai-platform",
    name: "Cloud Platform & Edge AI Inference",
    department: "AI Systems",
    description: "Multi-tenant Kubernetes operator orchestration, kernel observability via eBPF, and low-bit model quantization runtimes.",
    requiredSkills: [
      "eBPF Kernel Network Observability",
      "Kubernetes CRD Operator & Controller",
      "4-Bit (AWQ/GPTQ) Quantized LLM Inference Runtime"
    ],
    humaneRequirements: [
      "Calm on-call paging discipline",
      "Mentoring across hardware/software boundary",
      "Sustainable on-call shift rotation"
    ],
    urgency: "High"
  },
  {
    id: "founding-core",
    name: "Staff Polyglot / Founding Core Lead",
    department: "Executive Engineering",
    description: "Generalist technical leadership capable of architecture spanning deep systems to frontend with compassionate culture.",
    requiredSkills: [
      "TypeScript AST Engine & Compiler Passes",
      "React Concurrent Fiber Reconciler",
      "Distributed Raft State Machine Replication",
      "Zero-Copy Binary RPC & Wire Protocol"
    ],
    humaneRequirements: [
      "Pillar of team psychological safety",
      "Zero unpaid homework hiring advocate",
      "Sustainable sprint pacing"
    ],
    urgency: "Critical"
  }
];

export function TeamFitSimulator() {
  const { isTeamFitOpen, setIsTeamFitOpen, profile } = useApp();
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>("systems-core");
  const [copied, setCopied] = useState(false);

  const currentArchetype = useMemo(() => {
    return ARCHETYPES.find(a => a.id === selectedArchetypeId) || ARCHETYPES[0];
  }, [selectedArchetypeId]);

  // Compute skill matches
  const matchAnalysis = useMemo(() => {
    const verifiedLabels = new Set(profile.skills.map(s => s.label));
    
    const matchedSkills = currentArchetype.requiredSkills.filter(req => 
      verifiedLabels.has(req) || profile.skills.some(s => s.label.toLowerCase().includes(req.toLowerCase().split(" ")[0]))
    );

    const matchPercentage = Math.min(100, Math.round((matchedSkills.length / currentArchetype.requiredSkills.length) * 100));

    // Mentorship leverage calculation based on peer vouchers
    const voucherCount = profile.peerAttestations?.length || 0;
    const mentorshipMultiplier = (1 + voucherCount * 0.25).toFixed(1);

    return {
      matchedSkills,
      unmatchedSkills: currentArchetype.requiredSkills.filter(req => !matchedSkills.includes(req)),
      matchPercentage,
      mentorshipMultiplier
    };
  }, [profile, currentArchetype]);

  const copyReport = () => {
    const text = `MeritOS Team Fit Report
Candidate: ${profile.displayName} (${profile.rankTitle})
Target Squad: ${currentArchetype.name}
Technical Fit: ${matchAnalysis.matchPercentage}%
Verified Skills Covered: ${matchAnalysis.matchedSkills.length}/${currentArchetype.requiredSkills.length}
Mentorship Leverage: ${matchAnalysis.mentorshipMultiplier}x multiplier
Verified on MeritOS Cryptographic Ledger: ${profile.did}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playVerifiedChime();
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isTeamFitOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsTeamFitOpen(false)} 
      />

      <div className="relative w-full max-w-4xl bg-[#0E1017] border border-white/10 rounded-2xl shadow-2xl shadow-emerald-950/40 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Team Fit & Skill Gap Simulator</h2>
              <p className="text-xs text-white/50 font-mono">
                Model how {profile.displayName}&apos;s verified competence satisfies your squad requirements
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick(700);
              setIsTeamFitOpen(false);
            }}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Squad Archetype Selector */}
          <div>
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider font-mono block mb-3">
              Select Target Engineering Squad
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ARCHETYPES.map((arch) => {
                const isSelected = arch.id === selectedArchetypeId;
                return (
                  <button
                    key={arch.id}
                    onClick={() => {
                      sound.playClick(900);
                      setSelectedArchetypeId(arch.id);
                    }}
                    className={`p-3.5 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-950/30"
                        : "bg-white/[0.02] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                        {arch.department}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        arch.urgency === "Critical" ? "text-rose-400" : "text-amber-400"
                      }`}>
                        {arch.urgency}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white truncate">{arch.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synergy Score & Key Metrics Banner */}
          <div className="tactile-card rounded-xl p-5 border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-[#10191E]/50 to-teal-950/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-1 text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono">Squad Synergy Match</div>
                <div className="text-4xl font-extrabold text-white font-mono mt-1">
                  {matchAnalysis.matchPercentage}%
                </div>
                <div className="text-xs text-emerald-300 font-mono mt-0.5">High Confidence Fit</div>
              </div>

              <div className="md:col-span-3 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase text-white/40 font-mono">Verified Skills</div>
                  <div className="text-lg font-bold text-white font-mono mt-1">
                    {matchAnalysis.matchedSkills.length} / {currentArchetype.requiredSkills.length}
                  </div>
                  <div className="text-[11px] text-white/50">Zero guesswork</div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase text-white/40 font-mono">Mentorship Leverage</div>
                  <div className="text-lg font-bold text-amber-300 font-mono mt-1">
                    {matchAnalysis.mentorshipMultiplier}x
                  </div>
                  <div className="text-[11px] text-white/50">Multiplier effect</div>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] uppercase text-white/40 font-mono">Ramp-Up SLA</div>
                  <div className="text-lg font-bold text-teal-300 font-mono mt-1">
                    &lt; 3 Days
                  </div>
                  <div className="text-[11px] text-white/50">Instant impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Required Skills vs Candidate Coverage */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Target Stack Requirements
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {matchAnalysis.matchedSkills.length} Verified Passed
                </span>
              </div>

              <div className="space-y-2">
                {currentArchetype.requiredSkills.map((req, idx) => {
                  const isPassed = matchAnalysis.matchedSkills.includes(req);
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg flex items-center justify-between text-xs font-mono border ${
                        isPassed
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                          : "bg-white/[0.01] border-white/5 text-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isPassed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-white/30 shrink-0" />
                        )}
                        <span className="truncate">{req}</span>
                      </div>
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isPassed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/30"
                      }`}>
                        {isPassed ? "Attested" : "Adjacent"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Humane & Collaborative Synergy */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  Humane Culture & Team Multipliers
                </h3>
                <span className="text-[11px] text-rose-400 font-mono">
                  {profile.peerAttestations?.length || 0} Peer Vouchers
                </span>
              </div>

              <div className="space-y-2">
                {currentArchetype.humaneRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg flex items-center justify-between text-xs font-mono bg-rose-500/5 border border-rose-500/10 text-rose-200"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="truncate">{req}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300">
                      Validated
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-white/50 font-mono">
            Cryptographic proof verifiable via <span className="text-emerald-400">{profile.did.substring(0, 22)}...</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={copyReport}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-mono flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to Clipboard" : "Copy Assessment Summary"}</span>
            </button>
            <button
              onClick={() => {
                sound.playClick(800);
                setIsTeamFitOpen(false);
              }}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all"
            >
              <span>Done</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
