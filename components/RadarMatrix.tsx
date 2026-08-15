"use client";

import React, { useState } from "react";
import { RadarCapabilityScores } from "@/lib/types";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";
import { ShieldCheck, Info } from "lucide-react";

export function RadarMatrix() {
  const { profile } = useApp();
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  const axes: { key: keyof RadarCapabilityScores; label: string; score: number; detail: string }[] = [
    { 
      key: "quality", 
      label: "Code Quality", 
      score: profile.radarScores.quality,
      detail: "Zero lint errors, strict type invariants, 98.4% average unit test coverage."
    },
    { 
      key: "architecture", 
      label: "Systems Architecture", 
      score: profile.radarScores.architecture,
      detail: "Clean separation of concerns, modular compilation passes, CQRS event sourcing."
    },
    { 
      key: "reliability", 
      label: "Fault Reliability", 
      score: profile.radarScores.reliability,
      detail: "Chaos test hardened, Raft partition auto-healing, deterministic state machines."
    },
    { 
      key: "speed", 
      label: "Execution Speed", 
      score: profile.radarScores.speed,
      detail: "Zero-copy WASM slab allocators, SIMD int4 quantization, 14.2 Mpps packet filtering."
    },
    { 
      key: "cryptographicDepth", 
      label: "Cryptographic Depth", 
      score: profile.radarScores.cryptographicDepth,
      detail: "Ed25519 verifiable credentials, SHA-256 Merkle root receipts, zero self-reporting."
    },
  ];

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
            Competence Matrix (Radar)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Multi-Axial Index
        </span>
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
            fill="rgba(16, 185, 129, 0.18)"
            stroke="#10B981"
            strokeWidth="2"
            className="transition-all duration-300"
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
                  fill={isHovered ? "#34D399" : "#10B981"}
                  stroke="#090A0F"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => {
                    sound.playClick(900);
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
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-zinc-300 text-[11px]">{axis.label}</span>
            </div>
            <span className="text-emerald-400 font-bold text-[11px]">
              {axis.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
