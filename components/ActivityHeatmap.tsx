"use client";

import React, { useState, useMemo } from "react";
import { 
  Calendar, Zap, Flame, ShieldCheck, Info, ChevronRight, Sparkles 
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

interface HeatmapDay {
  date: string;
  count: number;
  xp: number;
  level: 0 | 1 | 2 | 3 | 4;
  type?: "verification" | "peer_voucher" | "mastery";
}

export function ActivityHeatmap() {
  const { profile } = useApp();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [selectedYear, setSelectedYear] = useState("2026");

  // Generate 52 weeks (364 days) of realistic cryptographic attestation data
  const heatmapData = useMemo(() => {
    const days: HeatmapDay[] = [];
    const baseDate = new Date("2025-09-08"); // 52 weeks ago

    // Deterministic pseudo-random distribution based on persona username
    const seed = profile.username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    for (let i = 0; i < 52 * 7; i++) {
      const current = new Date(baseDate);
      current.setDate(baseDate.getDate() + i);
      const dateStr = current.toISOString().split("T")[0];

      // Workday weighting: Tue/Wed/Thu higher, weekend lighter (humane rhythm)
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const pseudoRand = ((seed * (i + 13) * 9301 + 49297) % 233280) / 233280;

      let count = 0;
      let xp = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (!isWeekend) {
        if (pseudoRand > 0.82) {
          count = 4 + Math.floor(pseudoRand * 4);
          xp = count * 220;
          level = 4;
        } else if (pseudoRand > 0.55) {
          count = 2 + Math.floor(pseudoRand * 3);
          xp = count * 180;
          level = 3;
        } else if (pseudoRand > 0.28) {
          count = 1 + Math.floor(pseudoRand * 2);
          xp = count * 140;
          level = 2;
        } else if (pseudoRand > 0.1) {
          count = 1;
          xp = 120;
          level = 1;
        }
      } else {
        // Humane weekend rhythm - mostly resting, occasional light review
        if (pseudoRand > 0.88) {
          count = 1;
          xp = 100;
          level = 1;
        }
      }

      days.push({
        date: dateStr,
        count,
        xp,
        level
      });
    }

    return days;
  }, [profile.username]);

  const totalAttestations = useMemo(() => {
    return heatmapData.reduce((sum, d) => sum + d.count, 0);
  }, [heatmapData]);

  const totalXp = useMemo(() => {
    return heatmapData.reduce((sum, d) => sum + d.xp, 0);
  }, [heatmapData]);

  // Group into 52 weeks
  const weeks = useMemo(() => {
    const chunked: HeatmapDay[][] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      chunked.push(heatmapData.slice(i, i + 7));
    }
    return chunked;
  }, [heatmapData]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-emerald-400 border border-emerald-300 shadow-sm shadow-emerald-500/40";
      case 3:
        return "bg-emerald-500/90 border border-emerald-400/40";
      case 2:
        return "bg-emerald-600/60 border border-emerald-500/20";
      case 1:
        return "bg-emerald-800/40 border border-emerald-700/20";
      default:
        return "bg-white/[0.03] border border-white/[0.04]";
    }
  };

  const monthLabels = [
    "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"
  ];

  return (
    <div className="tactile-card rounded-2xl p-6 border border-white/10 bg-[#0F111A]/90 backdrop-blur-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Cryptographic Attestation Cadence</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              52 Weeks
            </span>
          </div>
          <p className="text-xs text-white/50 mt-1 font-mono">
            {totalAttestations.toLocaleString()} cryptographically signed code proofs & peer vouchers in the past year
          </p>
        </div>

        {/* Top summary stat pills */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Streak</div>
              <div className="text-xs font-bold text-white font-mono">{profile.streakDays} Days</div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono">Total XP</div>
              <div className="text-xs font-bold text-emerald-300 font-mono">+{totalXp.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Month header labels */}
      <div className="relative mt-5 mb-2 overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="flex justify-between text-[11px] text-white/40 font-mono pl-6 pr-2 mb-1">
            {monthLabels.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          {/* Grid Layout (7 rows, 52 cols) */}
          <div className="flex gap-1.5 items-start">
            {/* Days of week indicators */}
            <div className="flex flex-col gap-1.5 text-[9px] text-white/30 font-mono pt-1 select-none pr-1">
              <span>Mon</span>
              <span className="opacity-0">Tue</span>
              <span>Wed</span>
              <span className="opacity-0">Thu</span>
              <span>Fri</span>
              <span className="opacity-0">Sat</span>
              <span className="opacity-0">Sun</span>
            </div>

            {/* Weeks columns */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1">
                  {week.map((day, dIdx) => (
                    <div
                      key={`${wIdx}-${dIdx}`}
                      onMouseEnter={() => {
                        setHoveredDay(day);
                        if (day.count > 0) sound.playClick(1200);
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-3 h-3 rounded-[3px] transition-all cursor-pointer hover:scale-125 hover:z-20 ${getLevelColor(
                        day.level
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Inspection Bar & Legend */}
      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 font-mono">
        <div className="min-h-[22px] flex items-center gap-2">
          {hoveredDay ? (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="font-semibold text-white">{hoveredDay.date}:</span>
              {hoveredDay.count > 0 ? (
                <span className="text-emerald-300">
                  {hoveredDay.count} verified {hoveredDay.count === 1 ? "attestation" : "attestations"} (+{hoveredDay.xp} XP)
                </span>
              ) : (
                <span className="text-white/40">Resting day (Zero Burnout Policy)</span>
              )}
            </div>
          ) : (
            <span className="text-white/30">Hover over any day to inspect verified cryptographic receipts</span>
          )}
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-white/40 mr-1">Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.03] border border-white/[0.04]" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800/40 border border-emerald-700/20" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600/60 border border-emerald-500/20" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/90 border border-emerald-400/40" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
          <span className="text-[11px] text-white/40 ml-1">More</span>
        </div>
      </div>
    </div>
  );
}
