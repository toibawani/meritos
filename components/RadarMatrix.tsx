"use client";

import React, { useState } from "react";
import { RadarCapabilityScores, HumaneCapabilityScores } from "@/lib/types";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";
import { ShieldCheck, HeartHandshake, Cpu, Sparkles } from "lucide-react";

export function RadarMatrix() {
  const { profile, radarMode, setRadarMode } = useApp();
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  const systemsAxes: { key: string; label: string; score: number; detail: string }[] = [
    { 
      key: "quality", 
      label: "Code Quality", 
      score: profile.radarScores?.quality || 98,
      detail: "Zero lint errors, strict type invariants, 98.4% average unit test coverage."
    },
    { 
      key: "architecture", 
      label: "Systems Architecture", 
      score: profile.radarScores?.architecture || 99,
      detail: "Clean separation of concerns, modular compilation passes, CQRS event sourcing."
    },
    { 
      key: "reliability", 
      label: "Fault Reliability", 
      score: profile.radarScores?.reliability || 97,
      detail: "Chaos test hardened, Raft partition auto-healing, deterministic state machines."
    },
    { 
      key: "speed", 
      label: "Execution Speed", 
      score: profile.radarScores?.speed || 99,
      detail: "Zero-copy WASM slab allocators, SIMD int4 quantization, 14.2 Mpps packet filtering."
    },
    { 
      key: "cryptographicDepth", 
      label: "Cryptographic Depth", 
      score: profile.radarScores?.cryptographicDepth || 100,
      detail: "Ed25519 verifiable credentials, SHA-256 Merkle root receipts, zero self-reporting."
    },
  ];

  const humaneAxes: { key: string; label: string; score: number; detail: string }[] = [
    { 
      key: "reviewEmpathy", 
      label: "Review Empathy", 
      score: profile.humaneScores?.reviewEmpathy || 99,
      detail: "Kind, actionable PR code reviews with positive reinforcement and zero snark."
    },
    { 
      key: "mentorshipGrowth", 
      label: "Mentorship Growth", 
      score: profile.humaneScores?.mentorshipGrowth || 98,
      detail: "Active pairing, onboarding junior contributors, and unblocking engineering peers."
    },
    { 
      key: "blamelessCulture", 
      label: "Blameless Culture", 
      score: profile.humaneScores?.blamelessCulture || 100,
      detail: "Zero-finger-pointing incident retrospectives; systemic prevention over blame."
    },
    { 
      key: "asyncRfcClarity", 
      label: "Async RFC Clarity", 
      score: profile.humaneScores?.asyncRfcClarity || 97,
      detail: "High-context written proposals respecting global time zones and deep focus time."
    },
    { 
      key: "sustainableCadence", 
      label: "Sustainable Cadence", 
      score: profile.humaneScores?.sustainableCadence || 96,
      detail: "Healthy on-call boundaries, 100% protected weekends, and steady long-term velocity."
    },
  ];

  const isHumane = radarMode === "humane";
  const axes = isHumane ? humaneAxes : systemsAxes;
  const primaryColor = isHumane ? "#F43F5E" : "#10B981";
  const fillColor = isHumane ? "rgba(244, 63, 94, 0.18)" : "rgba(16, 185, 129, 0.18)";
  const dotHoverColor = isHumane ? "#FB7185" : "#34D399";

  // Radar geometry
  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const numAxes = axes.length;

  const getCoordinates = (index: number, valueRatio: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const x = center + radius * valueRatio * Math.cos(angle);
    const y = center + radius * valueRatio * Math.sin(angle);
    return { x, y };
  };

  // Polygon points
  const polygonPoints = axes
    .map((axis, i) => {
      const coords = getCoordinates(i, axis.score / 100);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  return (
    <div className="tactile-card rounded-2xl p-5 border border-white/[0.06] flex flex-col justify-between">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isHumane ? (
            <HeartHandshake className="w-4 h-4 text-rose-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
            {isHumane ? "Humane Craft Matrix" : "Competence Matrix"}
          </h3>
        </div>

        {/* Dual-Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#090A10] border border-white/[0.06] text-[10px] font-mono">
          <button
            onClick={() => setRadarMode("systems")}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all ${
              !isHumane 
                ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Systems</span>
          </button>

          <button
            onClick={() => setRadarMode("humane")}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-md transition-all ${
              isHumane 
                ? "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Humane</span>
          </button>
        </div>
      </div>

      {/* SVG Radar Chart */}
      <div className="relative flex items-center justify-center my-2">
        <svg width={size} height={size} className="overflow-visible select-none">
          {/* Background Concentric Polygons */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => {
            const levelPoints = axes
              .map((_, i) => {
                const c = getCoordinates(i, level);
                return `${c.x},${c.y}`;
              })
              .join(" ");
            return (
              <polygon
                key={`level-${level}`}
                points={levelPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Spokes */}
          {axes.map((_, i) => {
            const edge = getCoordinates(i, 1.0);
            return (
              <line
                key={`spoke-${i}`}
                x1={center}
                y1={center}
                x2={edge.x}
                y2={edge.y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* User Score Filled Polygon */}
          <polygon
            points={polygonPoints}
            fill={fillColor}
            stroke={primaryColor}
            strokeWidth="2"
            className="transition-all duration-500 ease-out"
          />

          {/* Axis Vertex Dots */}
          {axes.map((axis, i) => {
            const coords = getCoordinates(i, axis.score / 100);
            const isHovered = hoveredAxis === axis.key;
            return (
              <g key={`dot-${axis.key}`}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isHovered ? 5 : 3.5}
                  fill={isHovered ? dotHoverColor : primaryColor}
                  stroke="#090A0F"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => {
                    if (isHumane) sound.playWarmNote(528);
                    else sound.playClick(900);
                    setHoveredAxis(axis.key);
                  }}
                  onMouseLeave={() => setHoveredAxis(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Axis Breakdown & Tooltip */}
      <div className="space-y-1.5 pt-2 border-t border-white/[0.04] text-xs font-mono">
        {axes.map((axis) => (
          <div
            key={axis.key}
            onMouseEnter={() => setHoveredAxis(axis.key)}
            onMouseLeave={() => setHoveredAxis(null)}
            className={`p-1.5 rounded-lg flex items-center justify-between cursor-default transition-colors ${
              hoveredAxis === axis.key ? "bg-white/[0.08]" : "hover:bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: primaryColor }} 
              />
              <span className="text-zinc-300 text-[11px]">{axis.label}</span>
            </div>
            <span 
              className="font-bold text-[11px]" 
              style={{ color: primaryColor }}
            >
              {axis.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

