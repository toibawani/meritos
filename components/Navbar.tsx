"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, Plus, FileText, Volume2, VolumeX, Share2, 
  ChevronDown, Award, Zap, User, HeartHandshake, EyeOff, Sparkles, Feather, Search
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function Navbar() {
  const pathname = usePathname();
  const { 
    profile, availablePersonas, switchPersona,
    soundMuted, toggleSound, 
    setIsDossierOpen, setIsBadgeModalOpen, setIsAttestModalOpen,
    setIsHumaneLedgerOpen, setIsRecruiterFastTrackOpen,
    isCommandPaletteOpen, setIsCommandPaletteOpen,
    setIsShareModalOpen, setIsTeamFitOpen,
    isBlindEvaluationMode, isHumaneTheme, toggleHumaneTheme
  } = useApp();
  const [personaOpen, setPersonaOpen] = useState(false);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));
  const displayName = isBlindEvaluationMode ? "Candidate #8945" : profile.displayName;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06]" style={{ background: isHumaneTheme ? "rgba(14,16,24,0.92)" : "rgba(8,9,12,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center space-x-5 shrink-0">
          <Link href="/" onClick={() => sound.playClick(900)} className="flex items-center space-x-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center border border-emerald-300/30 shadow-md shadow-emerald-950/60 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4 text-[#042F2E]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white font-sans">
              Merit<span className="text-emerald-400">OS</span>
            </span>
            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline">
              Ed25519
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-0.5">
            {[
              { href: "/", label: "Competence Tree" },
              { href: "/verify", label: "Verifier" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => sound.playClick()} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${pathname === href ? "bg-white/[0.09] text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"}`}>
                {label}
              </Link>
            ))}

            {/* Peer Vouchers Modal Link */}
            <button 
              onClick={() => { sound.playHumaneChime(); setIsHumaneLedgerOpen(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-500/10 transition-all flex items-center space-x-1.5 border border-rose-500/20"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Peer Vouchers</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/20 text-rose-300">
                {profile.peerAttestations?.length || 5}
              </span>
            </button>

            {/* Skip Take-Home Fast Track */}
            <button 
              onClick={() => { sound.playClick(); setIsRecruiterFastTrackOpen(true); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-cyan-100 hover:bg-cyan-500/10 transition-all flex items-center space-x-1.5 border border-cyan-500/20"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Skip Take-Home</span>
            </button>

            <button onClick={() => { sound.playClick(); setIsBadgeModalOpen(true); }} className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all flex items-center space-x-1.5">
              <Award className="w-3 h-3 text-cyan-400" />
              <span>Badges</span>
            </button>
          </nav>

          {/* Quick Command Palette Launcher */}
          <button
            onClick={() => { sound.playClick(950); setIsCommandPaletteOpen(true); }}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs text-white/50 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all font-mono"
            title="Open Universal Command Palette (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">⌘K</kbd>
          </button>
        </div>

        {/* Center: XP Level Bar or Blind Mode Notice */}
        <div className="hidden lg:flex flex-col items-center gap-0.5 min-w-[220px]">
          {isBlindEvaluationMode ? (
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
              <EyeOff className="w-3.5 h-3.5" />
              <span>Blind Evaluation Mode Active (Zero-Bias)</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-1.5">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-mono text-amber-400 font-bold">Lv.{profile.level}</span>
                  <span className="text-[10px] font-mono text-zinc-500">{profile.rankTitle}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">{profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700"
                  style={{ width: `${xpPercent}%`, boxShadow: "0 0 6px rgba(251,191,36,0.5)" }} 
                />
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[9px] font-mono text-emerald-500">{profile.streakDays}d streak</span>
              </div>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => { sound.playClick(); setPersonaOpen(!personaOpen); }}
              className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white border border-white/[0.08] hover:border-white/[0.18] transition-all"
              style={{ background: "#0E1015" }}
            >
              {isBlindEvaluationMode ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                  #
                </div>
              ) : (
                <img src={profile.avatarUrl} alt={profile.displayName} className="w-5 h-5 rounded-full object-cover" />
              )}
              <span className="hidden sm:inline">{displayName.split(" ")[0]}</span>
              <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${personaOpen ? "rotate-180" : ""}`} />
            </button>
            {personaOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/[0.10] overflow-hidden z-50 shadow-2xl shadow-black/80" style={{ background: "#0E1015" }}>
                <div className="px-3 py-2 border-b border-white/[0.06]">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Switch Profile</span>
                </div>
                {availablePersonas.map(persona => (
                  <button
                    key={persona.username}
                    onClick={() => { switchPersona(persona.username); setPersonaOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-white/[0.05] transition-colors ${profile.username === persona.username ? "bg-white/[0.04]" : ""}`}
                  >
                    <img src={persona.avatarUrl} alt={persona.displayName} className="w-8 h-8 rounded-lg object-cover border border-white/[0.08]" />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{persona.displayName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Lv.{persona.level} · {persona.totalVerifiedSkills} verified skills</span>
                    </div>
                    {profile.username === persona.username && (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Humane Ambient Mode Toggle */}
          <button
            onClick={toggleHumaneTheme}
            title={isHumaneTheme ? "Switch to Cyber Linear Mode" : "Switch to Humane Organic Calm Mode"}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
              isHumaneTheme 
                ? "text-rose-300 border-rose-500/30 bg-rose-500/15" 
                : "text-zinc-400 hover:text-white border-transparent hover:border-white/[0.08] hover:bg-white/[0.04]"
            }`}
          >
            <Feather className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Unmute" : "Mute"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Share */}
          <button
            onClick={() => { sound.playClick(900); setIsShareModalOpen(true); }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:text-white border border-emerald-500/20 hover:border-emerald-500/40 bg-emerald-500/10 transition-all"
            title="Share profile & QR code"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share</span>
          </button>

          {/* Export */}
          <button
            onClick={() => { sound.playClick(); setIsDossierOpen(true); }}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-white border border-white/[0.08] hover:border-white/[0.14] transition-all"
            style={{ background: "#0E1015" }}
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => { sound.playClick(1100); setIsAttestModalOpen(true); }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg tactile-btn-primary text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-[#042F2E]" />
            <span>Attest</span>
          </button>
        </div>
      </div>

      {/* Click-outside to close persona dropdown */}
      {personaOpen && <div className="fixed inset-0 z-40" onClick={() => setPersonaOpen(false)} />}
    </header>
  );
}

