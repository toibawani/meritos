"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Copy, Check, ExternalLink, Search, 
  Award, Cpu, Layers, Zap, Database, Sparkles, Flame, Star,
  HeartHandshake, MessageSquareHeart, EyeOff, Feather
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DomainType } from "@/lib/types";
import { sound } from "@/lib/sound";

const RANK_COLORS: Record<string, string> = {
  "Grandmaster Systems Architect": "from-amber-400 to-amber-600",
  "Kernel Specialist": "from-cyan-400 to-cyan-600",
  "Tensor Inference Master": "from-violet-400 to-violet-600",
};

export function ProfileHero() {
  const { 
    profile, 
    domainFilter, 
    setDomainFilter, 
    searchQuery, 
    setSearchQuery,
    isBlindEvaluationMode,
    setIsHumaneLedgerOpen,
    setIsRecruiterFastTrackOpen
  } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyDid = () => {
    sound.playClick(1000);
    navigator.clipboard.writeText(isBlindEvaluationMode ? "did:merit:anonymous:blind_eval_8945" : profile.did);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));
  const rankGradient = RANK_COLORS[profile.rankTitle] || "from-emerald-400 to-teal-600";

  const displayName = isBlindEvaluationMode ? "Candidate #8945" : profile.displayName;
  const displayBio = isBlindEvaluationMode 
    ? "Verified Systems & Distributed Architecture Candidate. Personal identifying details hidden to eliminate pedigree and unconscious hiring bias." 
    : profile.bio;

  const domainTabs: { id: DomainType | "all"; label: string; count: number; icon: any; color: string }[] = [
    { id: "all",      label: "All Domains",           count: profile.skills.length,                                  icon: Layers,   color: "text-zinc-400" },
    { id: "systems",  label: "Systems",               count: profile.skills.filter(s => s.domain === "systems").length, icon: Cpu,      color: "text-cyan-400" },
    { id: "frontend", label: "Frontend",              count: profile.skills.filter(s => s.domain === "frontend").length, icon: Zap,      color: "text-violet-400" },
    { id: "cloud",    label: "Cloud & Infra",         count: profile.skills.filter(s => s.domain === "cloud").length,   icon: Database,  color: "text-amber-400" },
    { id: "ai",       label: "AI & ML",               count: profile.skills.filter(s => s.domain === "ai").length,      icon: Sparkles,  color: "text-emerald-400" },
  ];

  return (
    <section className="w-full pt-8 pb-6 border-b border-white/[0.05]" style={{ background: "linear-gradient(180deg, #0A0C13 0%, #090A0F 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Identity Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          
          {/* Left: Avatar + Info */}
          <div className="flex items-start gap-5">
            {/* Avatar with XP ring */}
            <div className="relative shrink-0">
              <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)]" viewBox="0 0 88 88" fill="none">
                <circle cx="44" cy="44" r="40" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                <circle 
                  cx="44" cy="44" r="40" 
                  stroke="url(#xpGrad)" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - xpPercent / 100)}`}
                  transform="rotate(-90 44 44)"
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
                />
                <defs>
                  <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>
                </defs>
              </svg>
              {isBlindEvaluationMode ? (
                <div 
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#121625] to-[#1E2337] border border-emerald-500/30 shadow-xl flex flex-col items-center justify-center text-emerald-400"
                  style={{ width: 76, height: 76 }}
                >
                  <EyeOff className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-mono font-bold">BLIND</span>
                </div>
              ) : (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/[0.10] shadow-xl shadow-black/80"
                  style={{ width: 76, height: 76 }}
                />
              )}
              {/* Level Badge */}
              <div className={`absolute -bottom-2 -right-2 min-w-[28px] h-7 px-1.5 rounded-lg bg-gradient-to-br ${rankGradient} flex items-center justify-center shadow-lg border border-black/30`}>
                <span className="text-[11px] font-mono font-black text-[#1a0a00]">{profile.level}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  {displayName}
                </h1>
                {!isBlindEvaluationMode && (
                  <span className="text-xs font-mono text-zinc-500">@{profile.username}</span>
                )}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gradient-to-r ${rankGradient} text-[#1a0a00]`}>
                  <Award className="w-3 h-3" />
                  {profile.rankTitle}
                </span>

                {isBlindEvaluationMode && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <EyeOff className="w-3 h-3" />
                    Zero-Bias Mode Active
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed max-w-xl">{displayBio}</p>

              {/* Stat pills */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-emerald-400 border border-emerald-500/20" style={{ background: "rgba(16,185,129,0.06)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED PASSPORT
                </div>

                {/* Peer Vouchers Pill */}
                <button
                  onClick={() => {
                    sound.playHumaneChime();
                    setIsHumaneLedgerOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-rose-300 border border-rose-500/25 hover:bg-rose-500/15 transition-all cursor-pointer"
                  style={{ background: "rgba(244,63,94,0.08)" }}
                  title="View peer vouchers"
                >
                  <HeartHandshake className="w-3 h-3 text-rose-400" />
                  <span>{profile.peerAttestations?.length || 5} Peer Vouchers</span>
                </button>

                {/* Empathy Score Pill */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-amber-300 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.06)" }}>
                  <MessageSquareHeart className="w-3 h-3 text-amber-400" />
                  <span>{profile.humaneScores?.reviewEmpathy || 99}% Review Empathy</span>
                </div>

                {/* Async Cadence Pill */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-cyan-300 border border-cyan-500/20" style={{ background: "rgba(6,182,212,0.06)" }}>
                  <Feather className="w-3 h-3 text-cyan-400" />
                  <span>{profile.sustainableRhythm?.deepWorkRatio || 94}% Async Focus</span>
                </div>

                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-amber-400 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.06)" }}>
                  <Flame className="w-3 h-3" />
                  {profile.streakDays}d Streak
                </div>

                <div
                  onClick={handleCopyDid}
                  className="group flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono text-zinc-500 hover:text-emerald-400 border border-white/[0.06] hover:border-white/[0.15] cursor-pointer transition-all"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  title="Click to copy DID"
                >
                  <span className="text-zinc-600">DID:</span>
                  <span className="group-hover:text-emerald-400 transition-colors">
                    {isBlindEvaluationMode ? "did:merit:anonymous:8945…" : `${profile.did.substring(0, 22)}…`}
                  </span>
                  {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </div>

                {!isBlindEvaluationMode && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-zinc-500 hover:text-white border border-white/[0.06] hover:border-white/[0.15] transition-all"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    GitHub <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            {[
              { label: "Competence Index", value: `${profile.verificationScore}%`, sub: "Top 0.1% Global", color: "text-emerald-400" },
              { label: "Verified Nodes", value: `${profile.totalVerifiedSkills}/${profile.skills.length}`, sub: "All Attested", color: "text-cyan-400" },
              { label: "Peer Vouchers", value: `${profile.peerAttestations?.length || 5}`, sub: "Cryptographic", color: "text-rose-400" },
              { label: "Empathy Index", value: `${profile.humaneScores?.reviewEmpathy || 99}%`, sub: "Compassionate PRs", color: "text-amber-400" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="tactile-card p-3 rounded-xl flex flex-col gap-0.5 min-w-[110px]">
                <span className="text-[9px] uppercase font-mono text-zinc-500 tracking-wider">{label}</span>
                <span className={`text-xl font-bold font-mono ${color} leading-none mt-1`}>{value}</span>
                <span className="text-[9px] text-zinc-600 font-mono mt-0.5">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Filter Tabs + Search */}
        <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-0.5 scrollbar-none">
            {domainTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = domainFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDomainFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-white/[0.10] text-white border-white/[0.16] shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : tab.color}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? "bg-white/20 text-white" : "bg-white/[0.05] text-zinc-500"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search proof nodes…"
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none transition-all font-mono"
              style={{ background: "#0E1015", border: "1px solid rgba(255,255,255,0.08)" }}
              onFocus={e => (e.target.style.borderColor = "rgba(16,185,129,0.4)")}
              onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-white">✕</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
