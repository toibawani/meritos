"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Search, 
  Award, 
  Activity, 
  Cpu, 
  Layers, 
  Zap, 
  Database, 
  Sparkles,
  Share2
} from "lucide-react";
import { useApp } from "@/lib/store";
import { DomainType } from "@/lib/types";
import { sound } from "@/lib/sound";

export function ProfileHero() {
  const { 
    profile, 
    domainFilter, 
    setDomainFilter, 
    searchQuery, 
    setSearchQuery,
    setIsBadgeModalOpen,
    setIsDossierOpen
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyDid = () => {
    sound.playClick(1000);
    navigator.clipboard.writeText(profile.did);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const domainTabs: { id: DomainType | "all"; label: string; count: number; icon: any }[] = [
    { 
      id: "all", 
      label: "All Nodes", 
      count: profile.skills.length, 
      icon: Layers 
    },
    { 
      id: "systems", 
      label: "Systems & Low-Level", 
      count: profile.skills.filter(s => s.domain === "systems").length, 
      icon: Cpu 
    },
    { 
      id: "frontend", 
      label: "Frontend Architecture", 
      count: profile.skills.filter(s => s.domain === "frontend").length, 
      icon: Zap 
    },
    { 
      id: "cloud", 
      label: "Cloud & Distributed", 
      count: profile.skills.filter(s => s.domain === "cloud").length, 
      icon: Database 
    },
    { 
      id: "ai", 
      label: "AI & Applied ML", 
      count: profile.skills.filter(s => s.domain === "ai").length, 
      icon: Sparkles 
    },
  ];

  const totalXp = profile.skills.reduce((acc, s) => acc + s.xp, 0);

  return (
    <section className="w-full pt-8 pb-6 border-b border-white/[0.06] bg-[#090A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Profile Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
          {/* Identity Info */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl shadow-black/80"
              />
              <div 
                title="Cryptographically Verified Identity"
                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#090A0F] flex items-center justify-center shadow-md"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#042F2E]" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                  {profile.displayName}
                </h1>
                <span className="text-xs font-mono text-zinc-400">
                  @{profile.username}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
                  VERIFIED PASSPORT
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 font-normal mt-1 max-w-2xl leading-relaxed">
                {profile.bio}
              </p>

              {/* Cryptographic DID Pill */}
              <div className="flex items-center space-x-2 mt-2.5">
                <div 
                  onClick={handleCopyDid}
                  className="group flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#12131A] border border-white/[0.08] hover:border-white/[0.18] cursor-pointer transition-all"
                  title="Click to copy Decentralized Identifier (DID)"
                >
                  <span className="text-[11px] text-zinc-500 font-mono">DID:</span>
                  <span className="text-[11px] text-zinc-300 font-mono tracking-tight group-hover:text-emerald-400 transition-colors">
                    {profile.did.substring(0, 24)}...
                  </span>
                  {copiedKey ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
                  )}
                </div>

                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#12131A] border border-white/[0.08] text-[11px] text-zinc-400 hover:text-white hover:border-white/[0.18] transition-all"
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Verification Index */}
            <div className="tactile-card p-3 rounded-xl flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-medium">
                Competence Index
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {profile.verificationScore}%
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Top 0.1% Global Tier
              </span>
            </div>

            {/* Total Attested Nodes */}
            <div className="tactile-card p-3 rounded-xl flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-medium">
                Verified Nodes
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {profile.totalVerifiedSkills}
                </span>
                <span className="text-xs text-zinc-500 font-mono">
                  / {profile.skills.length}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                100% Attested
              </span>
            </div>

            {/* Total Skill XP */}
            <div className="tactile-card p-3 rounded-xl flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-medium">
                Attested XP
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-white">
                  {totalXp.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Proof Units
              </span>
            </div>

            {/* Global Rank */}
            <div className="tactile-card p-3 rounded-xl flex flex-col justify-between min-w-[120px]">
              <span className="text-[10px] uppercase font-mono text-zinc-400 font-medium">
                Global Standing
              </span>
              <div className="flex items-baseline space-x-1.5 mt-1">
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {profile.globalRank}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                Zero Self-Reported
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Domain Tabs */}
          <div className="flex items-center overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 space-x-1.5 scrollbar-none">
            {domainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = domainFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDomainFilter(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-white/[0.12] text-white border border-white/[0.18] shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${
                    tab.id === "systems" ? "text-cyan-400" :
                    tab.id === "frontend" ? "text-purple-400" :
                    tab.id === "cloud" ? "text-amber-400" :
                    tab.id === "ai" ? "text-emerald-400" : "text-zinc-400"
                  }`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? "bg-white/20 text-white" : "bg-white/[0.06] text-zinc-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proof nodes..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#12131A] border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 font-mono transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
