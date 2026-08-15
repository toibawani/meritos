"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, Sparkles, ExternalLink } from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function BadgeGenerator() {
  const { profile, isBadgeModalOpen, setIsBadgeModalOpen } = useApp();
  const [badgeStyle, setBadgeStyle] = useState<"default" | "compact" | "shield">("default");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isBadgeModalOpen) return null;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://meritos.id";
  const badgeUrl = `${baseUrl}/api/badge/${profile.username}?style=${badgeStyle}`;
  const profileUrl = `${baseUrl}/p/${profile.username}`;

  const markdownSnippet = `[![MeritOS: Verified Competence Index](${badgeUrl})](${profileUrl})`;
  const htmlSnippet = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="MeritOS Verified Competence" /></a>`;

  const copyToClipboard = (text: string, type: string) => {
    sound.playClick(1000);
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#0E1017] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-sans">
              Dynamic Live GitHub Badges
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsBadgeModalOpen(false);
            }}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Embed an auto-updating, cryptographically verified badge in your GitHub profile <code className="text-zinc-300 font-mono bg-white/[0.06] px-1 py-0.5 rounded">README.md</code>.
          </p>

          {/* Style Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
              Choose Badge Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "default", label: "Linear Dark" },
                { id: "shield", label: "Dossier Shield" },
                { id: "compact", label: "Minimalist Inline" },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    sound.playClick();
                    setBadgeStyle(style.id as any);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                    badgeStyle === style.id
                      ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold"
                      : "tactile-card text-zinc-400 hover:text-white"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Badge Preview Area */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
              Live SVG Preview
            </label>
            <div className="p-6 rounded-xl bg-[#090A0F] border border-white/[0.06] flex items-center justify-center min-h-[90px]">
              <img
                src={badgeUrl}
                alt="MeritOS Verified Badge"
                className="max-w-full h-auto drop-shadow-md"
              />
            </div>
          </div>

          {/* Snippets to Copy */}
          <div className="space-y-4">
            {/* Markdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Markdown (for GitHub README)</span>
                <button
                  onClick={() => copyToClipboard(markdownSnippet, "markdown")}
                  className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedType === "markdown" ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
              </div>
              <input
                readOnly
                value={markdownSnippet}
                className="w-full px-3 py-2 rounded-lg bg-[#090A0F] border border-white/[0.08] text-xs text-zinc-300 font-mono focus:outline-none"
              />
            </div>

            {/* Direct URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Direct SVG URL</span>
                <button
                  onClick={() => copyToClipboard(badgeUrl, "url")}
                  className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copiedType === "url" ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
              <input
                readOnly
                value={badgeUrl}
                className="w-full px-3 py-2 rounded-lg bg-[#090A0F] border border-white/[0.08] text-xs text-zinc-400 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#12131A] border-t border-white/[0.06] flex items-center justify-end">
          <button
            onClick={() => {
              sound.playClick();
              setIsBadgeModalOpen(false);
            }}
            className="px-4 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
