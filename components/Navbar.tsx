"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, Plus, FileText, Volume2, VolumeX, Share2, 
  ChevronDown, Award, Zap, User
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function Navbar() {
  const pathname = usePathname();
  const { 
    profile, availablePersonas, switchPersona,
    soundMuted, toggleSound, 
    setIsDossierOpen, setIsBadgeModalOpen, setIsAttestModalOpen 
  } = useApp();
  const [personaOpen, setPersonaOpen] = useState(false);

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06]" style={{ background: "rgba(8,9,12,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
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
            <button onClick={() => { sound.playClick(); setIsBadgeModalOpen(true); }} className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-all flex items-center space-x-1.5">
              <Share2 className="w-3 h-3 text-cyan-400" />
              <span>Badges</span>
            </button>
          </nav>
        </div>

        {/* Center: XP Level Bar */}
        <div className="hidden lg:flex flex-col items-center gap-0.5 min-w-[220px]">
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
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-5 h-5 rounded-full object-cover" />
              <span className="hidden sm:inline">{profile.displayName.split(" ")[0]}</span>
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

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Unmute" : "Mute"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white border border-transparent hover:border-white/[0.08] hover:bg-white/[0.04] transition-all"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
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
