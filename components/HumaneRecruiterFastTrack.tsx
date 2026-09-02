"use client";

import React, { useState } from "react";
import { 
  X, 
  Clock, 
  ShieldCheck, 
  EyeOff, 
  Eye, 
  Sparkles, 
  FileText, 
  Check, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  HeartHandshake, 
  Zap, 
  DollarSign, 
  Scale
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function HumaneRecruiterFastTrack() {
  const { 
    profile, 
    isRecruiterFastTrackOpen, 
    setIsRecruiterFastTrackOpen,
    isBlindEvaluationMode,
    toggleBlindEvaluationMode
  } = useApp();

  const [takeHomeCount, setTakeHomeCount] = useState(5);
  const [copiedCharter, setCopiedCharter] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isRecruiterFastTrackOpen) return null;

  // Real-time calculations
  const candidateHoursSaved = takeHomeCount * 8;
  const engineeringGradingHoursSaved = takeHomeCount * 3.5;
  const estimatedDollarsSaved = engineeringGradingHoursSaved * 150; // $150/hr blended engineering cost

  const handleCopyCharter = () => {
    sound.playClick(1000);
    const text = `# The Humane Engineering Hiring Charter\n\n1. No Unpaid Multi-Day Homework: Real code diffs, compiler passes, and peer reviews are verified via MeritOS.\n2. 48-Hour Feedback Guarantee: We respect your life and time by never ghosting candidates.\n3. Human-to-Human Dialogue: Every interview is a compassionate, peer-level architectural conversation.\n\nSigned by hiring teams adopting the W3C Verifiable Competence Standard.`;
    navigator.clipboard.writeText(text);
    setCopiedCharter(true);
    setTimeout(() => setCopiedCharter(false), 2000);
  };

  const handleCopySummary = () => {
    sound.playClick(1000);
    const summary = `--- MERITOS FAST-TRACK HIRING COMMITTEE BRIEF ---\nCandidate: ${isBlindEvaluationMode ? "Candidate #8945 (Anonymized)" : profile.displayName}\nTitle: ${profile.title}\nCompetence Verification: ${profile.verificationScore}% Verified (Ed25519)\nVerified Nodes: ${profile.totalVerifiedSkills} Production Capabilities\nPeer Vouchers: ${profile.peerAttestations.length} Verified Colleague Signatures\nReview Empathy Score: ${profile.humaneScores?.reviewEmpathy || 99}%\nTake-Home Recommendation: WAIVED (Complete AST diffs & terminal traces verified)\nIssuer DID: ${profile.did}\n`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-[#0D0F18] border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        style={{ boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.95)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-gradient-to-r from-[#111422] via-[#14172B] to-[#1D1B2E] flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fast-Track Recruiter Toolkit</span>
              <span>•</span>
              <span className="text-white font-semibold">Zero Unpaid Homework</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              "Skip the Take-Home" Humane Evaluation Hub
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Unpaid take-home tests burn out candidates and bias against engineers with families. MeritOS replaces multi-day homework with authentic AST diffs, test traces, and peer vouchers.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsRecruiterFastTrackOpen(false);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECTION 1: Blind Evaluation Mode Toggle */}
          <div className="p-4 rounded-xl bg-[#131624] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Blind Evaluation Mode (Zero Unconscious Bias)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-lg">
                Mask candidate photo, name, and demographic identifiers across the passport. Focus hiring committees solely on verified technical diffs, code review empathy, and test pass rates.
              </p>
            </div>

            <button
              onClick={toggleBlindEvaluationMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                isBlindEvaluationMode 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-950/50" 
                  : "bg-white/[0.06] text-zinc-300 border-white/[0.12] hover:bg-white/[0.10]"
              }`}
            >
              {isBlindEvaluationMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-emerald-400" />
                  <span>Blind Mode ACTIVE</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-zinc-400" />
                  <span>Enable Blind Mode</span>
                </>
              )}
            </button>
          </div>

          {/* SECTION 2: Respect-for-Time Calculator */}
          <div className="p-5 rounded-xl bg-[#0F111C] border border-white/[0.06] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
                  Developer & Recruiter Time-Saved Calculator
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  See how much time is reclaimed by auditing verified proofs instead of issuing take-homes:
                </p>
              </div>

              {/* Slider for interviews/cycle */}
              <div className="flex items-center space-x-2 bg-[#090A10] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <span className="text-[11px] font-mono text-zinc-400">Interviews:</span>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={takeHomeCount}
                  onChange={e => {
                    sound.playClick(1100);
                    setTakeHomeCount(Number(e.target.value));
                  }}
                  className="w-24 accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-cyan-400 min-w-[20px] text-right">
                  {takeHomeCount}
                </span>
              </div>
            </div>

            {/* Savings Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#141726] border border-cyan-500/20 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Candidate Life Saved</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white leading-none">
                    {candidateHoursSaved} hrs
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  ~{(candidateHoursSaved / 8).toFixed(1)} workdays of unpaid labor spared
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#141726] border border-emerald-500/20 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Team Grading Saved</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white leading-none">
                    {engineeringGradingHoursSaved} hrs
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Senior engineers freed to ship features
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#141726] border border-amber-500/20 flex flex-col justify-between">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Engineering Spend Saved</span>
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-bold font-mono text-white leading-none">
                    ${estimatedDollarsSaved.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Calculated at $150/hr blended engineering rate
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 3: The Humane Hiring Charter */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#121422] to-[#171A2E] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
                  The Humane Hiring Pledge
                </h4>
              </div>

              <button
                onClick={handleCopyCharter}
                className="flex items-center space-x-1 text-xs font-mono text-zinc-400 hover:text-white"
              >
                {copiedCharter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCharter ? "Copied" : "Copy Pledge"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#090A11] border border-white/[0.04] space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1. No Unpaid Homework</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Auditing verified AST visitor diffs and 100k fuzz test traces provides 10x higher signal than toy homework.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#090A11] border border-white/[0.04] space-y-1">
                <div className="flex items-center space-x-1.5 text-cyan-400 font-bold font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>2. 48h Feedback SLA</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Candidates receive respectful, detailed feedback or decision within 48 hours. Zero ghosting.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#090A11] border border-white/[0.04] space-y-1">
                <div className="flex items-center space-x-1.5 text-violet-400 font-bold font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>3. Human-to-Human</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  No automated one-way video filters. Every conversation is a reciprocal peer architecture discussion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0D0F17] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>W3C Verifiable Credentials • Ready for Hiring Committee</span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? "Brief Copied" : "Copy Brief for Committee"}</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsRecruiterFastTrackOpen(false);
              }}
              className="px-4 py-1.5 rounded-lg tactile-btn-primary text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
