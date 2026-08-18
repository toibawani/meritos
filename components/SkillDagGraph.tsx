"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Database, 
  Sparkles, 
  Binary, 
  Layers, 
  Shield, 
  Layout, 
  Share2, 
  GitMerge, 
  Info,
  Star,
  TrendingUp,
  Award,
  Lock
} from "lucide-react";
import { useApp } from "@/lib/store";
import { SkillNode, DomainType } from "@/lib/types";
import { sound } from "@/lib/sound";

interface Position {
  x: number;
  y: number;
}

const DOMAIN_CONFIG: Record<DomainType, { label: string; color: string; bg: string; border: string }> = {
  systems: {
    label: "Systems & Low-Level",
    color: "#06B6D4",
    bg: "rgba(6, 182, 212, 0.08)",
    border: "rgba(6, 182, 212, 0.3)",
  },
  frontend: {
    label: "Frontend Architecture",
    color: "#8B5CF6",
    bg: "rgba(139, 92, 246, 0.08)",
    border: "rgba(139, 92, 246, 0.3)",
  },
  cloud: {
    label: "Cloud & Distributed",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.08)",
    border: "rgba(245, 158, 11, 0.3)",
  },
  ai: {
    label: "AI & Applied ML",
    color: "#10B981",
    bg: "rgba(16, 185, 129, 0.08)",
    border: "rgba(16, 185, 129, 0.3)",
  },
};

const ICON_MAP: Record<string, any> = {
  Binary,
  Cpu,
  Layers,
  Shield,
  Layout,
  Zap,
  Share2,
  Database,
  Cloud: Database,
  Lock,
  Sparkles,
  GitMerge,
};

export function SkillDagGraph() {
  const { 
    profile, 
    selectedSkill, 
    setSelectedSkill, 
    domainFilter, 
    searchQuery,
    claimMastery
  } = useApp();
  const [masteryClaimedId, setMasteryClaimedId] = useState<string | null>(null);

  const handleClaimMastery = (e: React.MouseEvent, skillId: string) => {
    e.stopPropagation();
    sound.playVerifiedChime();
    claimMastery(skillId);
    setMasteryClaimedId(skillId);
    setTimeout(() => setMasteryClaimedId(null), 1800);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState<Position>({ x: 60, y: 40 });
  const [zoom, setZoom] = useState<number>(0.95);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Filter skills based on domain and search
  const filteredSkills = useMemo(() => {
    return profile.skills.filter((skill) => {
      const matchesDomain = domainFilter === "all" || skill.domain === domainFilter;
      const matchesSearch = 
        !searchQuery || 
        skill.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.shortCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDomain && matchesSearch;
    });
  }, [profile.skills, domainFilter, searchQuery]);

  // Map of skill by ID
  const skillMap = useMemo(() => {
    const map = new Map<string, SkillNode>();
    profile.skills.forEach((s) => map.set(s.id, s));
    return map;
  }, [profile.skills]);

  // Edges: calculate SVG curved paths between prerequisites and target skills
  const edges = useMemo(() => {
    const edgeList: {
      from: SkillNode;
      to: SkillNode;
      isHighlighted: boolean;
      isVerifiedPath: boolean;
    }[] = [];

    profile.skills.forEach((target) => {
      target.prerequisites.forEach((prereqId) => {
        const source = skillMap.get(prereqId);
        if (source) {
          const isHighlighted = 
            hoveredNodeId === source.id || 
            hoveredNodeId === target.id ||
            selectedSkill?.id === source.id || 
            selectedSkill?.id === target.id;
            
          const isVerifiedPath = source.status === "verified" && target.status === "verified";

          edgeList.push({
            from: source,
            to: target,
            isHighlighted,
            isVerifiedPath,
          });
        }
      });
    });

    return edgeList;
  }, [profile.skills, skillMap, hoveredNodeId, selectedSkill]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".node-element")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(0.4, zoom * zoomFactor), 2.0);
    setZoom(newZoom);
  };

  const handleResetView = () => {
    sound.playClick();
    setPan({ x: 60, y: 40 });
    setZoom(0.95);
  };

  const handleZoomIn = () => {
    sound.playClick();
    setZoom((prev) => Math.min(2.0, prev * 1.15));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setZoom((prev) => Math.max(0.4, prev * 0.85));
  };

  return (
    <div className="relative w-full h-[650px] sm:h-[720px] bg-[#090A0F] overflow-hidden select-none border-b border-white/[0.06]">
      {/* Background Grid Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
          `,
          backgroundSize: "32px 32px",
          transform: `translate(${pan.x % 32}px, ${pan.y % 32}px)`,
        }}
      />

      {/* Floating Viewport Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-1.5 bg-[#12131A]/90 backdrop-blur-md border border-white/[0.08] p-1.5 rounded-xl shadow-xl shadow-black/60">
        <button
          onClick={handleZoomIn}
          title="Zoom In (+)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out (-)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-white/[0.08]" />
        <button
          onClick={handleResetView}
          title="Reset Center"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legend & Instructions */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-4 bg-[#12131A]/85 backdrop-blur-md border border-white/[0.08] px-3.5 py-2 rounded-xl text-[11px] text-zinc-400 font-mono shadow-xl">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Verified Node</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-0.5 bg-cyan-400/80 rounded" />
          <span>Prerequisite Link</span>
        </div>
        <div className="flex items-center space-x-1.5 text-zinc-500">
          <Info className="w-3 h-3 text-zinc-400" />
          <span>Click any node to inspect commit diffs & terminal traces</span>
        </div>
      </div>

      {/* Interactive Drag & Canvas Surface */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`w-full h-full cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.08s ease-out",
          }}
          className="relative w-[1200px] h-[900px]"
        >
          {/* Domain Track Background Lanes */}
          <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
            {/* Systems Lane */}
            <div className="absolute left-4 top-[80px] text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400/50 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400/60" />
              <span>Systems & Low-Level</span>
            </div>
            
            {/* Frontend Lane */}
            <div className="absolute left-4 top-[240px] text-xs font-mono font-semibold uppercase tracking-wider text-purple-400/50 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-400/60" />
              <span>Frontend Architecture</span>
            </div>

            {/* Cloud Lane */}
            <div className="absolute left-4 top-[400px] text-xs font-mono font-semibold uppercase tracking-wider text-amber-400/50 flex items-center space-x-2">
              <Database className="w-4 h-4 text-amber-400/60" />
              <span>Cloud & Distributed</span>
            </div>

            {/* AI Lane */}
            <div className="absolute left-4 top-[560px] text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400/50 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400/60" />
              <span>AI & Applied ML</span>
            </div>
          </div>

          {/* SVG Connector Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
            <defs>
              <linearGradient id="edge-verified-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow-edge" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {edges.map((edge, idx) => {
              // Calculate Node Center coordinates
              // Node width is approx 160px, height is approx 80px
              const startX = edge.from.x + 145;
              const startY = edge.from.y + 42;
              const endX = edge.to.x;
              const endY = edge.to.y + 42;

              // Cubic Bezier curve control points
              const dx = endX - startX;
              const cp1X = startX + Math.max(30, dx * 0.5);
              const cp1Y = startY;
              const cp2X = endX - Math.max(30, dx * 0.5);
              const cp2Y = endY;

              const pathData = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;

              return (
                <g key={`edge-${edge.from.id}-${edge.to.id}-${idx}`}>
                  {/* Background glow path when hovered */}
                  {edge.isHighlighted && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="6"
                      opacity="0.3"
                      filter="url(#glow-edge)"
                    />
                  )}

                  {/* Main connection curve */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={
                      edge.isHighlighted
                        ? "#10B981"
                        : edge.isVerifiedPath
                        ? "rgba(16, 185, 129, 0.45)"
                        : "rgba(255, 255, 255, 0.12)"
                    }
                    strokeWidth={edge.isHighlighted ? "2.5" : "1.8"}
                    strokeDasharray={edge.isVerifiedPath ? "none" : "4 4"}
                    className="transition-colors duration-200"
                  />

                  {/* Animated energy pulse particle along verified paths */}
                  {edge.isVerifiedPath && (
                    <circle r="3" fill="#34D399">
                      <animateMotion
                        path={pathData}
                        dur="3.2s"
                        repeatCount="indefinite"
                        keyPoints="0;1"
                        keyTimes="0;1"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive DAG Nodes */}
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            const isHovered = hoveredNodeId === skill.id;
            const isMasteryClaimed = masteryClaimedId === skill.id;
            const domainStyle = DOMAIN_CONFIG[skill.domain];
            const IconComponent = ICON_MAP[skill.iconName] || Cpu;
            const masteryCount = skill.masteryCount || 0;

            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                onMouseEnter={() => setHoveredNodeId(skill.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`node-element absolute w-[155px] p-2.5 rounded-xl z-10 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#1A1D2B] shadow-2xl"
                    : isHovered
                    ? "bg-[#141720]"
                    : "bg-[#10121A]"
                }`}
                style={{
                  left: `${skill.x}px`, top: `${skill.y}px`,
                  border: isSelected
                    ? `1.5px solid ${domainStyle.color}55`
                    : `1px solid rgba(255,255,255,${isHovered ? '0.12' : '0.07'})`,
                  boxShadow: isSelected
                    ? `0 0 24px -4px ${domainStyle.color}30, 0 8px 24px -4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)`
                    : isHovered
                    ? '0 6px 20px -4px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)'
                    : '0 2px 8px -2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
              >
                {/* Top Row: code + status */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: domainStyle.bg, color: domainStyle.color }}
                  >
                    {skill.shortCode}
                  </span>
                  <div className="flex items-center gap-1">
                    {masteryCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: Math.min(masteryCount, 3) }).map((_, i) => (
                          <Star key={i} className="w-2 h-2 text-amber-400" fill="#FBBF24" />
                        ))}
                      </div>
                    )}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-2 my-1">
                  <div className="p-1 rounded-lg shrink-0 mt-0.5" style={{ backgroundColor: domainStyle.bg }}>
                    <IconComponent className="w-3.5 h-3.5" style={{ color: domainStyle.color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-white leading-tight line-clamp-2">{skill.label}</span>
                </div>

                {/* XP mini-bar */}
                <div className="mt-1.5 h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, (skill.xp / 1500) * 100)}%`, background: domainStyle.color, opacity: 0.7 }}
                  />
                </div>

                {/* Bottom stats */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500">+{skill.xp} XP</span>
                  <span className="font-medium" style={{ color: domainStyle.color }}>
                    {skill.level === 'master' ? 'MASTER' : skill.level === 'expert' ? 'EXPERT' : 'PRO'}
                  </span>
                </div>

                {/* Claim Mastery overlay (on hover) */}
                {isHovered && (
                  <button
                    onClick={(e) => handleClaimMastery(e, skill.id)}
                    className="absolute inset-x-0 -bottom-8 mx-auto flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all z-20"
                    style={{
                      background: isMasteryClaimed ? '#10B981' : domainStyle.bg,
                      border: `1px solid ${domainStyle.color}50`,
                      color: isMasteryClaimed ? '#042F2E' : domainStyle.color,
                      width: 'fit-content',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Award className="w-3 h-3" />
                    {isMasteryClaimed ? 'Claimed!' : 'Claim Mastery'}
                  </button>
                )}

                {/* Edge connector dots */}
                {skill.prerequisites.length > 0 && (
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-cyan-500/60 flex items-center justify-center" style={{ background: '#0E1015' }}>
                    <div className="w-1 h-1 rounded-full bg-cyan-400" />
                  </div>
                )}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-emerald-500/60 flex items-center justify-center" style={{ background: '#0E1015' }}>
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
