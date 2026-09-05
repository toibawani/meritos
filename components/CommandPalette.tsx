"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Search, Terminal, ShieldCheck, HeartHandshake, FileText, Award, 
  Users, Zap, Radio, Eye, EyeOff, Volume2, VolumeX, ArrowRight, 
  CornerDownLeft, Compass, Sparkles, X, Share2
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

interface CommandItem {
  id: string;
  category: "Navigation" | "Personas" | "Skills" | "Preferences" | "Actions";
  title: string;
  subtitle?: string;
  icon: any;
  action: () => void;
  badge?: string;
}

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    profile,
    switchPersona,
    setSelectedSkill,
    setIsDossierOpen,
    setIsBadgeModalOpen,
    setIsAttestModalOpen,
    setIsHumaneLedgerOpen,
    setIsRecruiterFastTrackOpen,
    isBlindEvaluationMode,
    toggleBlindEvaluationMode,
    soundMuted,
    toggleSound,
    radarMode,
    setRadarMode,
    setIsShareModalOpen,
    setIsTeamFitOpen
  } = useApp();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      sound.playClick(950);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      } else if (e.key === "Escape" && isCommandPaletteOpen) {
        e.preventDefault();
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  const closeAndRun = (fn: () => void) => {
    sound.playClick(800);
    setIsCommandPaletteOpen(false);
    fn();
  };

  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [
      // Actions & Tools
      {
        id: "action-dossier",
        category: "Actions",
        title: "Export Cryptographic Hiring Dossier",
        subtitle: "Audit scorecard, verified proofs & peer vouchers for hiring committees",
        icon: FileText,
        badge: "PDF / Print",
        action: () => closeAndRun(() => setIsDossierOpen(true))
      },
      {
        id: "action-humane-ledger",
        category: "Actions",
        title: "Peer Mentorship & Humane Craft Ledger",
        subtitle: "Review Ed25519 peer attestations across 5 humane pillars",
        icon: HeartHandshake,
        badge: "Cryptographic",
        action: () => closeAndRun(() => setIsHumaneLedgerOpen(true))
      },
      {
        id: "action-fast-track",
        category: "Actions",
        title: "Skip the Take-Home Recruiter Fast-Track",
        subtitle: "Calculate candidate hours saved and review zero-bias packet",
        icon: Zap,
        badge: "48h Saved",
        action: () => closeAndRun(() => setIsRecruiterFastTrackOpen(true))
      },
      {
        id: "action-badge",
        category: "Actions",
        title: "Generate Verified Embed Badges",
        subtitle: "SVG markdown badges for GitHub READMEs and portfolios",
        icon: Award,
        action: () => closeAndRun(() => setIsBadgeModalOpen(true))
      },
      {
        id: "action-attest-new",
        category: "Actions",
        title: "Sign New Attestation Claim",
        subtitle: "Launch WebCrypto keypair signing wizard with Merkle leaf commit",
        icon: Terminal,
        badge: "WebCrypto",
        action: () => closeAndRun(() => setIsAttestModalOpen(true))
      },
      {
        id: "action-share",
        category: "Actions",
        title: "Share Verified Profile / QR Code",
        subtitle: "Direct URL, vector QR code & decentralized ID assertion",
        icon: Share2,
        action: () => closeAndRun(() => setIsShareModalOpen(true))
      },
      {
        id: "action-team-fit",
        category: "Actions",
        title: "Simulate Team Fit & Skill Gap Mitigation",
        subtitle: "Model squad tech stack coverage and mentorship leverage",
        icon: Users,
        badge: "Simulator",
        action: () => closeAndRun(() => setIsTeamFitOpen(true))
      },

      // Personas
      {
        id: "persona-toiba",
        category: "Personas",
        title: "Switch Persona: Toiba Wani",
        subtitle: "Grandmaster Systems Architect (Rust, WASM, AST, Distributed Raft)",
        icon: Terminal,
        badge: "Active",
        action: () => closeAndRun(() => switchPersona("toibawani"))
      },
      {
        id: "persona-alex",
        category: "Personas",
        title: "Switch Persona: Alex Rivera",
        subtitle: "Principal Frontend Architect (React Fiber, WebGPU, Micro-Frontends)",
        icon: Sparkles,
        action: () => closeAndRun(() => switchPersona("alex_rivera"))
      },
      {
        id: "persona-elena",
        category: "Personas",
        title: "Switch Persona: Elena Rostova",
        subtitle: "Staff Cloud & AI Platform Engineer (eBPF, Kubernetes CRDs, AWQ Quantization)",
        icon: Radio,
        action: () => closeAndRun(() => switchPersona("elena_rostova"))
      },

      // Preferences & Toggles
      {
        id: "pref-blind-eval",
        category: "Preferences",
        title: isBlindEvaluationMode ? "Disable Zero-Bias Mode" : "Enable Zero-Bias / Blind Evaluation Mode",
        subtitle: "Mask candidate avatar, name, and pedigree to prevent unconscious bias",
        icon: isBlindEvaluationMode ? EyeOff : Eye,
        badge: isBlindEvaluationMode ? "Enabled" : "Off",
        action: () => closeAndRun(() => toggleBlindEvaluationMode())
      },
      {
        id: "pref-radar-toggle",
        category: "Preferences",
        title: `Switch Competence Radar: ${radarMode === "systems" ? "Humane Impact" : "Technical Architecture"}`,
        subtitle: "Toggle between technical capabilities and mentorship empathy metrics",
        icon: Compass,
        action: () => closeAndRun(() => setRadarMode(radarMode === "systems" ? "humane" : "systems"))
      },
      {
        id: "pref-sound-toggle",
        category: "Preferences",
        title: soundMuted ? "Unmute Tactile Sound Effects" : "Mute Sound Synthesizer",
        subtitle: "Web Audio harmonic feedback for clicks, verifications and chimes",
        icon: soundMuted ? VolumeX : Volume2,
        action: () => closeAndRun(() => toggleSound())
      },
      {
        id: "pref-focus-drone",
        category: "Preferences",
        title: sound.isFocusDroneActive() ? "Stop 432Hz Focus Drone" : "Start 432Hz Deep Focus Ambient Drone",
        subtitle: "Sacred Solfeggio natural bilateral drone for deep code review",
        icon: Radio,
        badge: "432Hz",
        action: () => closeAndRun(() => sound.playFocusDrone())
      }
    ];

    // Add profile skills
    if (profile && profile.skills) {
      profile.skills.forEach(skill => {
        items.push({
          id: `skill-${skill.id}`,
          category: "Skills",
          title: skill.label,
          subtitle: `${skill.shortCode} • Level: ${skill.level.toUpperCase()} • XP: ${skill.xp} • ${skill.domain.toUpperCase()}`,
          icon: ShieldCheck,
          badge: skill.status === "verified" ? "Verified" : "In Progress",
          action: () => closeAndRun(() => setSelectedSkill(skill))
        });
      });
    }

    return items;
  }, [
    profile,
    radarMode,
    isBlindEvaluationMode,
    soundMuted,
    switchPersona,
    setSelectedSkill,
    setIsDossierOpen,
    setIsBadgeModalOpen,
    setIsAttestModalOpen,
    setIsHumaneLedgerOpen,
    setIsRecruiterFastTrackOpen,
    setIsShareModalOpen,
    setIsTeamFitOpen,
    toggleBlindEvaluationMode,
    toggleSound,
    setRadarMode
  ]);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    const lower = query.toLowerCase();
    return allCommands.filter(item => 
      item.title.toLowerCase().includes(lower) || 
      (item.subtitle && item.subtitle.toLowerCase().includes(lower)) ||
      item.category.toLowerCase().includes(lower) ||
      (item.badge && item.badge.toLowerCase().includes(lower))
    );
  }, [allCommands, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredCommands.length));
      sound.playClick(1000);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      sound.playClick(1000);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsCommandPaletteOpen(false)} 
      />

      <div className="relative w-full max-w-2xl bg-[#0F111A]/95 border border-white/10 rounded-2xl shadow-2xl shadow-emerald-950/30 overflow-hidden z-10 flex flex-col max-h-[80vh] backdrop-blur-xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-emerald-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
              sound.playKeyboardThud();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, search skills, switch persona, or toggle settings..."
            className="flex-1 bg-transparent text-white placeholder-white/40 text-sm sm:text-base outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-white/40 hover:text-white p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-white/50 bg-white/5 border border-white/10 rounded font-mono">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-white/[0.04]">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-white" />
              <p className="text-sm">No commands or verified skills matching &quot;{query}&quot;</p>
              <p className="text-xs text-white/30 mt-1">Try &quot;mentor&quot;, &quot;toiba&quot;, &quot;ast&quot;, or &quot;drone&quot;</p>
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-white translate-x-1" 
                      : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-white truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                            item.badge === "Active" || item.badge === "Verified"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-white/10 text-white/60 border border-white/10"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-white/40 truncate font-mono mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/40">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-black/40 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 font-mono">
          <div className="flex items-center gap-4">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to dismiss</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>MeritOS Universal Command Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
}
