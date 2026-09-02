"use client";

import React, { useState, useEffect, useRef } from "react";
import { Activity, GitCommit, ShieldCheck, Zap, HeartHandshake, Globe2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

interface PulseEvent {
  id: string;
  persona: string;
  avatar: string;
  action: string;
  skill: string;
  domain: "systems" | "frontend" | "cloud" | "ai" | "humane";
  timestamp: string;
  xp: number;
}

const LIVE_EVENTS: PulseEvent[] = [
  { id: "e1", persona: "toibawani", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=toibawani&backgroundColor=0f1117", action: "attested", skill: "TypeScript AST Engine", domain: "systems", timestamp: "just now", xp: 850 },
  { id: "e2", persona: "alex_rivera", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex_rivera&backgroundColor=0f1117", action: "verified", skill: "React Fiber Reconciler", domain: "frontend", timestamp: "2m ago", xp: 780 },
  { id: "e3", persona: "elena_rostova", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elena_rostova&backgroundColor=0f1117", action: "peer-vouched", skill: "Async RFC Clarity", domain: "humane", timestamp: "4m ago", xp: 400 },
  { id: "e4", persona: "toibawani", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=toibawani&backgroundColor=0f1117", action: "mastered", skill: "WASM Slab Allocator", domain: "systems", timestamp: "8m ago", xp: 920 },
  { id: "e5", persona: "alex_rivera", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex_rivera&backgroundColor=0f1117", action: "attested", skill: "WebGPU Compute Shaders", domain: "frontend", timestamp: "14m ago", xp: 870 },
  { id: "e6", persona: "elena_rostova", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elena_rostova&backgroundColor=0f1117", action: "verified", skill: "Kubernetes CRD Operator", domain: "cloud", timestamp: "22m ago", xp: 810 },
  { id: "e7", persona: "toibawani", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=toibawani&backgroundColor=0f1117", action: "chaos-tested", skill: "Raft Consensus Engine", domain: "systems", timestamp: "31m ago", xp: 950 },
  { id: "e8", persona: "elena_rostova", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elena_rostova&backgroundColor=0f1117", action: "attested", skill: "4-bit Quantized Inference", domain: "ai", timestamp: "45m ago", xp: 900 },
];

const DOMAIN_COLOR: Record<string, string> = {
  systems:  "text-cyan-400 bg-cyan-500/10 border-cyan-500/25",
  frontend: "text-violet-400 bg-violet-500/10 border-violet-500/25",
  cloud:    "text-amber-400 bg-amber-500/10 border-amber-500/25",
  ai:       "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  humane:   "text-rose-400 bg-rose-500/10 border-rose-500/25",
};

const ACTION_ICON: Record<string, any> = {
  attested: ShieldCheck,
  verified: ShieldCheck,
  mastered: Zap,
  "chaos-tested": Activity,
  "peer-vouched": HeartHandshake,
};

// Contribution heatmap (last 12 weeks × 7 days) -- synthetic data
const HEATMAP: number[] = Array.from({ length: 84 }, (_, i) => {
  const v = Math.sin(i * 0.4) * 0.5 + 0.5;
  return Math.floor(v * 5);
});
const HEATMAP_COLOR = ["bg-white/[0.03]", "bg-emerald-500/20", "bg-emerald-500/40", "bg-emerald-500/65", "bg-emerald-500/90", "bg-emerald-400"];

export function LivePulse() {
  const [tick, setTick] = useState(0);

  // Simulated live ticker
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleEvents = LIVE_EVENTS.slice(0, 6);

  return (
    <div className="tactile-card rounded-2xl p-5 border border-white/[0.06] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">Live Network Pulse</h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>3 Engineers Active</span>
        </div>
      </div>

      {/* Contribution Heatmap */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Contribution Heatmap — last 12 weeks</span>
          <span className="text-emerald-400">84d streak</span>
        </div>
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(12, 1fr)" }}>
          {Array.from({ length: 12 }, (_, week) => (
            <div key={week} className="grid gap-[3px]" style={{ gridTemplateRows: "repeat(7, 1fr)" }}>
              {Array.from({ length: 7 }, (_, day) => {
                const val = HEATMAP[week * 7 + day];
                return (
                  <div
                    key={day}
                    className={`w-full aspect-square rounded-[2px] ${HEATMAP_COLOR[val]} transition-all`}
                    title={`${val > 0 ? val + " commits" : "No activity"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-zinc-600">
          <span>Less</span>
          {HEATMAP_COLOR.map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-[2px] ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Live Feed */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">Recent Activity</div>
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-0.5">
          {visibleEvents.map((event, idx) => {
            const Icon = ACTION_ICON[event.action] || ShieldCheck;
            const domainCls = DOMAIN_COLOR[event.domain];
            return (
              <div
                key={event.id}
                className="flex items-center space-x-3 p-2.5 rounded-xl bg-[#0E1015] border border-white/[0.04] hover:border-white/[0.10] transition-all group"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <img src={event.avatar} alt={event.persona} className="w-7 h-7 rounded-lg object-cover border border-white/[0.08] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                    <span className="text-[11px] font-mono font-semibold text-white">{event.persona}</span>
                    <span className="text-[10px] text-zinc-500">{event.action}</span>
                    <span className="text-[10px] font-semibold text-zinc-200 truncate">{event.skill}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${domainCls}`}>
                    {event.domain}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">+{event.xp}</span>
                  <span className="text-[9px] text-zinc-600">{event.timestamp}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persona Activity Summary */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
        {[
          { name: "toibawani", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=toibawani&backgroundColor=0f1117", events: 3, xp: 2720, color: "bg-emerald-400" },
          { name: "alex_rivera", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex_rivera&backgroundColor=0f1117", events: 2, xp: 1650, color: "bg-cyan-400" },
          { name: "elena_rostova", avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=elena_rostova&backgroundColor=0f1117", events: 3, xp: 2110, color: "bg-violet-400" },
        ].map(persona => (
          <div key={persona.name} className="p-2.5 rounded-xl bg-[#0E1015] border border-white/[0.04] text-center">
            <div className="relative inline-block mb-1.5">
              <img src={persona.avatar} alt={persona.name} className="w-8 h-8 rounded-lg object-cover mx-auto border border-white/[0.08]" />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${persona.color} border border-[#0E1015]`} />
            </div>
            <div className="text-[10px] font-mono text-zinc-400 truncate">{persona.name.split("_")[0]}</div>
            <div className="text-[11px] font-bold text-amber-400">{persona.xp.toLocaleString()} XP</div>
          </div>
        ))}
      </div>
    </div>
  );
}
