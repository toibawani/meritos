"use client";

import React from "react";
import { Activity, ShieldCheck, CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function ActivityLedger() {
  const { profile, setSelectedSkill } = useApp();

  return (
    <div className="tactile-card rounded-2xl p-5 border border-white/[0.06] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
            Immutable Activity Ledger
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sync Active</span>
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
        {profile.activityLedger.map((entry) => {
          const matchedSkill = profile.skills.find((s) => s.id === entry.skillId);

          return (
            <div
              key={entry.id}
              onClick={() => {
                if (matchedSkill) {
                  sound.playClick();
                  setSelectedSkill(matchedSkill);
                }
              }}
              className="p-3 rounded-xl bg-[#0E1017] border border-white/[0.04] hover:border-white/[0.12] cursor-pointer transition-all flex flex-col space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {entry.skillName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  Block #{entry.blockHeight}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1 border-t border-white/[0.02]">
                <span className="text-zinc-500">
                  Receipt: <span className="text-cyan-400/90">{entry.receiptHash}</span>
                </span>
                <span className="text-zinc-500">
                  {new Date(entry.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>Zero-Knowledge Proof Validity: 100%</span>
        <span className="text-emerald-400">Decay: 0.0% (Fresh)</span>
      </div>
    </div>
  );
}
