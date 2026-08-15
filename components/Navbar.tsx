"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Plus, 
  FileText, 
  Volume2, 
  VolumeX, 
  Share2, 
  Search, 
  Sparkles,
  Award,
  Terminal,
  Activity
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function Navbar() {
  const pathname = usePathname();
  const { 
    profile, 
    soundMuted, 
    toggleSound, 
    setIsDossierOpen, 
    setIsBadgeModalOpen, 
    setIsAttestModalOpen 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#090A0F]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-6">
          <Link 
            href="/"
            onClick={() => sound.playClick(900)}
            className="flex items-center space-x-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-950/50 border border-emerald-300/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-[#042F2E]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  Merit<span className="text-emerald-400">OS</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  v2.4 Ed25519
                </span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline-block">
                Proof-of-Competence Ledger
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-white/[0.06]">
            <Link
              href="/"
              onClick={() => sound.playClick()}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                pathname === "/" 
                  ? "bg-white/[0.08] text-white" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              Competence Tree
            </Link>
            <Link
              href="/verify"
              onClick={() => sound.playClick()}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1.5 ${
                pathname === "/verify" 
                  ? "bg-white/[0.08] text-white" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Verifier</span>
            </Link>
            <button
              onClick={() => {
                sound.playClick();
                setIsBadgeModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors flex items-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>GitHub Badges</span>
            </button>
          </nav>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Export Dossier */}
          <button
            onClick={() => {
              sound.playClick();
              setIsDossierOpen(true);
            }}
            className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export Dossier</span>
          </button>

          {/* Attest New Proof */}
          <button
            onClick={() => {
              sound.playClick(1100);
              setIsAttestModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg tactile-btn-primary text-xs font-semibold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <Plus className="w-4 h-4 text-[#042F2E]" />
            <span>Attest Proof</span>
          </button>
        </div>
      </div>
    </header>
  );
}
