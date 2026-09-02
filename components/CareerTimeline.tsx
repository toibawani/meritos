"use client";

import React, { useState } from "react";
import { 
  Trophy, Zap, ShieldCheck, Award, Code2, Cpu, Rocket, HeartHandshake, TrendingUp
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  xpGained: number;
  type: "verification" | "rank_up" | "mastery" | "peer_voucher" | "streak" | "humane";
  icon: any;
  color: string;
  glowColor: string;
  meta?: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "m1", date: "2026-08-15",
    title: "Grandmaster Rank Attained",
    description: "Reached the top 0.1% globally — Grandmaster Systems Architect. XP threshold 50,000 crossed.",
    xpGained: 5000, type: "rank_up", icon: Trophy,
    color: "text-amber-400", glowColor: "rgba(251,191,36,0.25)", meta: "50,000 XP Total",
  },
  {
    id: "m2", date: "2026-08-12",
    title: "Zero-Copy WASM Allocator Mastery ×4",
    description: "Fourth consecutive mastery cycle completed. Freshness at 100% with full chaos-test reproducibility.",
    xpGained: 850, type: "mastery", icon: Cpu,
    color: "text-cyan-400", glowColor: "rgba(6,182,212,0.20)", meta: "SYS-02",
  },
  {
    id: "m3", date: "2026-08-10",
    title: "5 Cryptographic Peer Vouchers Signed",
    description: "Elena Rostova, Alex Rivera, and 3 mentees co-signed verified humane-craft peer attestations.",
    xpGained: 2000, type: "peer_voucher", icon: HeartHandshake,
    color: "text-rose-400", glowColor: "rgba(244,63,94,0.20)", meta: "Humane Craft",
  },
  {
    id: "m4", date: "2026-08-05",
    title: "Raft Consensus Engine — Verified",
    description: "PBFT network partition test on 64-node cluster: 99.99% consensus, <200ms artificial delay.",
    xpGained: 920, type: "verification", icon: ShieldCheck,
    color: "text-emerald-400", glowColor: "rgba(16,185,129,0.20)", meta: "SYS-03",
  },
  {
    id: "m5", date: "2026-07-28",
    title: "TypeScript AST Engine — Attested",
    description: "Incremental compilation pass with scope-cache: 450k nodes/sec. 48/48 tests green.",
    xpGained: 850, type: "verification", icon: Code2,
    color: "text-violet-400", glowColor: "rgba(167,139,250,0.20)", meta: "SYS-01",
  },
  {
    id: "m6", date: "2026-07-20",
    title: "100-Day Contribution Streak",
    description: "100 consecutive days of verified, cryptographically signed engineering output. Zero missed days.",
    xpGained: 3000, type: "streak", icon: Zap,
    color: "text-amber-300", glowColor: "rgba(252,211,77,0.22)", meta: "🔥 100d",
  },
  {
    id: "m7", date: "2026-07-15",
    title: "Humane Engineering Champion",
    description: "Elected team humane engineering champion — led blameless post-mortem culture across 3 squads.",
    xpGained: 1500, type: "humane", icon: Award,
    color: "text-rose-300", glowColor: "rgba(244,63,94,0.22)", meta: "Culture Impact",
  },
  {
    id: "m8", date: "2026-06-30",
    title: "eBPF Network Filter — Expert",
    description: "14.2 Mpps throughput with kernel XDP bypass and O(1) BPF map lookups at nanosecond latency.",
    xpGained: 990, type: "verification", icon: Rocket,
    color: "text-orange-400", glowColor: "rgba(251,146,60,0.18)", meta: "SYS-04",
  },
];

const TYPE_LABEL: Record<string, string> = {
  verification: "VERIFIED", rank_up: "RANK UP", mastery: "MASTERY",
  peer_voucher: "PEER VOUCHER", streak: "STREAK", humane: "HUMANE",
};

export function CareerTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>("m1");
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? MILESTONES : MILESTONES.filter(m => m.type === filter);
  const totalXP = MILESTONES.reduce((sum, m) => sum + m.xpGained, 0);

  return (
    <div className="tactile-card rounded-2xl p-5 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">Engineering Career Timeline</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-mono">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-amber-400 font-bold">{totalXP.toLocaleString()} XP</span>
          <span className="text-zinc-600">logged</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {[
          { id: "all", label: "All" },
          { id: "verification", label: "Verifications" },
          { id: "rank_up", label: "Rank Ups" },
          { id: "mastery", label: "Mastery" },
          { id: "peer_voucher", label: "Peer Vouchers" },
          { id: "humane", label: "Humane" },
        ].map(tab => (
          <button key={tab.id}
            onClick={() => { sound.playClick(); setFilter(tab.id); }}
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all ${
              filter === tab.id
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                : "text-zinc-500 hover:text-zinc-300 border border-white/[0.04]"
            }`}
          >{tab.label}</button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-emerald-500/40 via-amber-500/20 to-transparent" />
        <div className="space-y-1">
          {filtered.map((milestone) => {
            const Icon = milestone.icon;
            const isExpanded = expandedId === milestone.id;
            return (
              <div key={milestone.id} className="relative pl-12">
                <div
                  className="absolute left-0 top-2.5 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer"
                  style={{
                    background: isExpanded ? milestone.glowColor : "rgba(14,16,21,0.9)",
                    borderColor: isExpanded ? milestone.glowColor : "rgba(255,255,255,0.06)",
                    boxShadow: isExpanded ? `0 0 16px -4px ${milestone.glowColor}` : "none",
                  }}
                  onClick={() => { sound.playClick(isExpanded ? 700 : 1000); setExpandedId(isExpanded ? null : milestone.id); }}
                >
                  <Icon className={`w-5 h-5 ${milestone.color}`} />
                </div>
                <div
                  className={`mb-2 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isExpanded ? "border-white/[0.12] bg-[#12141E]" : "border-white/[0.04] bg-[#0E1015] hover:border-white/[0.09]"
                  }`}
                  onClick={() => { sound.playClick(isExpanded ? 700 : 1000); setExpandedId(isExpanded ? null : milestone.id); }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border"
                        style={{ color: "inherit", borderColor: milestone.glowColor, background: milestone.glowColor }}
                      >
                        <span className={milestone.color}>{TYPE_LABEL[milestone.type]}</span>
                      </span>
                      <span className={`text-xs font-semibold ${milestone.color}`}>{milestone.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span className="text-amber-400 font-bold">+{milestone.xpGained.toLocaleString()} XP</span>
                      <span className="text-zinc-600">{new Date(milestone.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-white/[0.04] space-y-1">
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{milestone.description}</p>
                      {milestone.meta && (
                        <span className="inline-block text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded-md">{milestone.meta}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-3 text-center text-[10px] font-mono">
        <div>
          <div className="text-emerald-400 font-bold text-sm">{MILESTONES.filter(m => m.type === "verification").length}</div>
          <div className="text-zinc-500 mt-0.5">Verifications</div>
        </div>
        <div>
          <div className="text-rose-400 font-bold text-sm">{MILESTONES.filter(m => m.type === "peer_voucher" || m.type === "humane").length}</div>
          <div className="text-zinc-500 mt-0.5">Humane Events</div>
        </div>
        <div>
          <div className="text-amber-400 font-bold text-sm">{MILESTONES.filter(m => m.type === "rank_up" || m.type === "streak" || m.type === "mastery").length}</div>
          <div className="text-zinc-500 mt-0.5">Achievements</div>
        </div>
      </div>
    </div>
  );
}
