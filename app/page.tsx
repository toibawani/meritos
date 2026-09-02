"use client";

import React from "react";
import { ProfileHero } from "@/components/ProfileHero";
import { SkillDagGraph } from "@/components/SkillDagGraph";
import { RadarMatrix } from "@/components/RadarMatrix";
import { ActivityLedger } from "@/components/ActivityLedger";
import { HumaneLedgerModal } from "@/components/HumaneLedgerModal";
import { HumaneRecruiterFastTrack } from "@/components/HumaneRecruiterFastTrack";
import { CareerTimeline } from "@/components/CareerTimeline";
import { LivePulse } from "@/components/LivePulse";
import { 
  ShieldCheck, ArrowRight, Plus, Share2, Sparkles, Terminal, 
  FileText, CheckCircle2, HeartHandshake, Zap, Compass, Clock 
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export default function HomePage() {
  const { 
    profile, 
    setIsAttestModalOpen, 
    setIsBadgeModalOpen, 
    setIsDossierOpen,
    setIsHumaneLedgerOpen,
    setIsRecruiterFastTrackOpen
  } = useApp();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Profile Header Strip */}
      <ProfileHero />

      {/* Interactive Competence DAG Graph */}
      <section className="relative w-full">
        <SkillDagGraph />
      </section>

      {/* Deep Competence Matrix & Activity Ledger Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Matrix (5 cols) */}
          <div className="lg:col-span-5">
            <RadarMatrix />
          </div>

          {/* Activity Ledger (7 cols) */}
          <div className="lg:col-span-7">
            <ActivityLedger />
          </div>
        </div>

        {/* Humane Engineering & Mentorship Highlight Card */}
        <div className="tactile-card rounded-2xl p-8 border border-rose-500/20 relative overflow-hidden bg-gradient-to-r from-[#14121F] via-[#171424] to-[#121626]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-mono">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
                <span>The Humane Competence Covenant</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Engineering excellence measured with human heart.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Great engineers don't just optimize latency; they guide junior teammates, review code with empathy, lead blameless outage post-mortems, and protect sustainable work rhythms. Verified by cryptographic peer attestations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  sound.playHumaneChime();
                  setIsHumaneLedgerOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-semibold shadow-lg shadow-rose-950/40 hover:opacity-95"
              >
                <HeartHandshake className="w-4 h-4 text-white" />
                <span>Inspect Peer Ledger ({profile.peerAttestations?.length || 5})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsRecruiterFastTrackOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl tactile-btn text-xs font-medium text-cyan-300 hover:text-white border border-cyan-500/20"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Skip Take-Home Hub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recruiter & Developer Value Proposition Callout */}
        <div className="tactile-card rounded-2xl p-8 border border-white/[0.08] relative overflow-hidden bg-gradient-to-r from-[#0D0F17] via-[#12131A] to-[#181A26]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Noise Competence Standard</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Never prove "I know this" twice.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Every skill node in MeritOS is anchored to authentic pull requests, deterministic benchmark runs, and W3C cryptographic signatures. Recruiters can audit complete AST diffs and replay test suites in &lt;5 seconds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  sound.playClick(1000);
                  setIsAttestModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl tactile-btn-primary text-xs font-semibold"
              >
                <Plus className="w-4 h-4 text-[#042F2E]" />
                <span>Attest New Proof</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsBadgeModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Embed Badge</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Humane Modals */}
      <HumaneLedgerModal />
      <HumaneRecruiterFastTrack />

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] bg-[#090A0F] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">MeritOS</span>
            <span>•</span>
            <span>W3C Verifiable Credentials • Ed25519 Cryptographic Layer • Humane Engineering Standard</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-rose-400 font-semibold">
              ♥ 100% Blameless & Peer Verified
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">
              ● Consensus Valid
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
