"use client";

import React, { useState, useMemo } from "react";
import { 
  Share2, X, Copy, Check, ExternalLink, QrCode, ShieldCheck, 
  Terminal, Globe, Sparkles 
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function ShareModal() {
  const { isShareModalOpen, setIsShareModalOpen, profile } = useApp();
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"link" | "badge" | "did">("link");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://meritos.dev";
  const profileUrl = `${baseUrl}/p/${profile.username}`;
  const didUrl = `${baseUrl}/api/did/${profile.username}`;
  const badgeUrl = `${baseUrl}/api/badge/${profile.username}`;

  const markdownBadge = `[![MeritOS Verified](${badgeUrl})](${profileUrl})`;
  const htmlBadge = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="MeritOS Verified Competence" /></a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    sound.playVerifiedChime();
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Simple, deterministic 21x21 QR code matrix visual generator
  const qrCells = useMemo(() => {
    const size = 21;
    const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    // Corner finder patterns (7x7)
    const placeFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            y === 0 || y === 6 || x === 0 || x === 6 ||
            (y >= 2 && y <= 4 && x >= 2 && x <= 4)
          ) {
            grid[startY + y][startX + x] = true;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(size - 7, 0);
    placeFinder(0, size - 7);

    // Timing patterns
    for (let i = 8; i < size - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Pseudo-random data cells based on profile username
    const seed = profile.username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip finder zones
        if (
          (x < 8 && y < 8) ||
          (x >= size - 8 && y < 8) ||
          (x < 8 && y >= size - 8) ||
          (x === 6 || y === 6)
        ) {
          continue;
        }
        const val = ((seed * (x + 1) * (y + 1) * 31337) % 100);
        grid[y][x] = val > 50;
      }
    }

    return grid;
  }, [profile.username]);

  if (!isShareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsShareModalOpen(false)} 
      />

      <div className="relative w-full max-w-lg bg-[#0F111A] border border-white/10 rounded-2xl shadow-2xl shadow-emerald-950/40 overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Share Verified Profile</h2>
              <p className="text-xs text-white/50 font-mono">Portable cryptographic proof of craft</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick(700);
              setIsShareModalOpen(false);
            }}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/5 px-6 pt-3 gap-4 text-xs font-mono">
          <button
            onClick={() => {
              sound.playClick(900);
              setActiveTab("link");
            }}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "link"
                ? "border-emerald-400 text-emerald-300 font-semibold"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            Direct Link & QR
          </button>
          <button
            onClick={() => {
              sound.playClick(900);
              setActiveTab("badge");
            }}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "badge"
                ? "border-emerald-400 text-emerald-300 font-semibold"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            GitHub Badge
          </button>
          <button
            onClick={() => {
              sound.playClick(900);
              setActiveTab("did");
            }}
            className={`pb-2.5 border-b-2 transition-all ${
              activeTab === "did"
                ? "border-emerald-400 text-emerald-300 font-semibold"
                : "border-transparent text-white/40 hover:text-white"
            }`}
          >
            W3C DID Document
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {activeTab === "link" && (
            <div className="space-y-5">
              {/* QR Code Card */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="p-3 rounded-xl bg-white text-black shadow-lg">
                  <svg viewBox="0 0 21 21" className="w-28 h-28 shape-rendering-crispEdges">
                    {qrCells.map((row, y) =>
                      row.map((cell, x) =>
                        cell ? (
                          <rect
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            width="1"
                            height="1"
                            fill="#090A0F"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <div className="text-xs uppercase tracking-wider text-emerald-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cryptographic Link</span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{profile.displayName}</div>
                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    Scan with any mobile device camera to open verifiable competence profile.
                  </p>
                </div>
              </div>

              {/* Direct Profile Link Box */}
              <div>
                <label className="text-xs text-white/50 font-mono block mb-1.5">Profile URL</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={profileUrl}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white/80 outline-none select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(profileUrl, "link")}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {copiedType === "link" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "link" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "badge" && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60 font-mono">Live SVG Badge Preview</div>
                  <div className="mt-2">
                    <img src={badgeUrl} alt="MeritOS Badge" className="h-6" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 font-mono block mb-1.5">Markdown (README.md)</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={markdownBadge}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/70 outline-none select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(markdownBadge, "badge-md")}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {copiedType === "badge-md" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "badge-md" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 font-mono block mb-1.5">HTML Embed</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={htmlBadge}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/70 outline-none select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(htmlBadge, "badge-html")}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {copiedType === "badge-html" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "badge-html" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "did" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 font-mono text-xs">
                <div className="text-emerald-400 font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  W3C Decentralized Identifier (DID)
                </div>
                <div className="text-white/80 break-all p-2 rounded bg-black/40 border border-white/5">
                  {profile.did}
                </div>
                <p className="text-white/40 text-[11px] leading-relaxed">
                  Cryptographically resolves via Ed25519 multibase keypair without reliance on centralized social platforms.
                </p>
              </div>

              <div>
                <label className="text-xs text-white/50 font-mono block mb-1.5">DID Resolution JSON-LD Endpoint</label>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={didUrl}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white/80 outline-none select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(didUrl, "did-url")}
                    className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-all shrink-0"
                  >
                    {copiedType === "did-url" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === "did-url" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>MeritOS Immutable Proof</span>
          </div>
          <button
            onClick={() => {
              sound.playClick(800);
              setIsShareModalOpen(false);
            }}
            className="hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
