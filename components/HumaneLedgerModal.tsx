"use client";

import React, { useState } from "react";
import { 
  X, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  MessageSquareHeart, 
  Award, 
  Clock, 
  Check, 
  Copy, 
  Plus, 
  Users, 
  Compass, 
  Flame, 
  BookOpen, 
  Feather
} from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";
import { PeerAttestation, HumanePillar } from "@/lib/types";

const PILLAR_CONFIG: Record<HumanePillar | "all", { label: string; icon: any; color: string; bg: string; border: string }> = {
  all: {
    label: "All Vouchers",
    icon: HeartHandshake,
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/20"
  },
  mentorship: {
    label: "Mentorship & Growth",
    icon: Compass,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25"
  },
  review_empathy: {
    label: "Empathetic Reviews",
    icon: MessageSquareHeart,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/25"
  },
  blameless_culture: {
    label: "Blameless Culture",
    icon: ShieldCheck,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25"
  },
  async_clarity: {
    label: "Async RFC Clarity",
    icon: BookOpen,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25"
  },
  sustainable_cadence: {
    label: "Sustainable Rhythm",
    icon: Feather,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/25"
  }
};

export function HumaneLedgerModal() {
  const { profile, isHumaneLedgerOpen, setIsHumaneLedgerOpen, addPeerVoucher } = useApp();
  const [selectedPillar, setSelectedPillar] = useState<HumanePillar | "all">("all");
  const [isVouchFormOpen, setIsVouchFormOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    relationship: "Teammate" as "Mentee" | "Teammate" | "Engineering Lead" | "Cross-Functional Peer",
    pillar: "mentorship" as HumanePillar,
    testimony: "",
  });
  const [isSigning, setIsSigning] = useState(false);

  if (!isHumaneLedgerOpen) return null;

  const filteredVouchers = (profile.peerAttestations || []).filter(v => 
    selectedPillar === "all" ? true : v.pillar === selectedPillar
  );

  const handleCopySignature = (id: string, sig: string) => {
    sound.playClick(1000);
    navigator.clipboard.writeText(sig);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSignVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.testimony) return;

    setIsSigning(true);
    sound.playClick(900);

    // Simulate WebCrypto Ed25519 signature creation
    setTimeout(() => {
      const randomBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");
      const merkleBytes = Array.from({ length: 32 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join("");

      const newVoucher: PeerAttestation = {
        id: `peer-${Date.now()}`,
        voucherName: formData.name,
        voucherTitle: formData.title || "Senior Software Engineer",
        voucherCompany: formData.company || "Independent Collaborator",
        voucherAvatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        voucherDid: `did:merit:peer:${formData.name.toLowerCase().replace(/\s+/g, "_")}:${randomBytes.substring(0, 6)}`,
        pillar: formData.pillar,
        relationship: formData.relationship,
        testimony: formData.testimony,
        dateAttested: new Date().toISOString(),
        verifiedBadge: "Cryptographic Peer Voucher",
        signature: randomBytes,
        merkleLeaf: `0x${merkleBytes}`,
      };

      addPeerVoucher(newVoucher);
      setIsSigning(false);
      setIsVouchFormOpen(false);
      setFormData({
        name: "",
        title: "",
        company: "",
        relationship: "Teammate",
        pillar: "mentorship",
        testimony: "",
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-[#0C0E15] border border-white/[0.10] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        style={{ boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.9)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] bg-gradient-to-r from-[#10121D] via-[#141724] to-[#1A1D2D] flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px] font-mono">
              <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
              <span>Humane Engineering Standard</span>
              <span>•</span>
              <span className="text-white font-semibold">{profile.peerAttestations?.length || 0} Cryptographic Vouchers</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
              Peer Attestation & Mentorship Ledger
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Software is crafted by humans, for humans. Real teammates and mentees sign cryptographic vouchers attesting to mentorship, psychological safety, and kind collaboration.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsHumaneLedgerOpen(false);
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Subtle warm glow background */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Humane Capability Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-4 sm:px-6 bg-[#08090E] border-b border-white/[0.06]">
          {[
            { label: "Review Empathy", score: `${profile.humaneScores?.reviewEmpathy || 99}%`, desc: "Constructive feedback tone", color: "text-rose-400" },
            { label: "Mentorship Growth", score: `${profile.humaneScores?.mentorshipGrowth || 98}%`, desc: "3 junior engineers leveled", color: "text-emerald-400" },
            { label: "Blameless Culture", score: `${profile.humaneScores?.blamelessCulture || 100}%`, desc: "Zero-blame outage leader", color: "text-amber-400" },
            { label: "Async RFC Clarity", score: `${profile.humaneScores?.asyncRfcClarity || 97}%`, desc: "High-context decisions", color: "text-cyan-400" },
            { label: "Sustainable Cadence", score: `${profile.sustainableRhythm?.deepWorkRatio || 94}%`, desc: "Anti-burnout boundary", color: "text-violet-400" },
          ].map(({ label, score, desc, color }) => (
            <div key={label} className="p-2.5 rounded-xl bg-[#10121B] border border-white/[0.05] flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block truncate">{label}</span>
              <span className={`text-base sm:text-lg font-bold font-mono ${color} leading-none mt-1`}>{score}</span>
              <span className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate">{desc}</span>
            </div>
          ))}
        </div>

        {/* Action & Filter Toolbar */}
        <div className="px-6 py-3 border-b border-white/[0.06] bg-[#0E1018] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Pillar Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {(Object.keys(PILLAR_CONFIG) as (HumanePillar | "all")[]).map((key) => {
              const cfg = PILLAR_CONFIG[key];
              const Icon = cfg.icon;
              const isSelected = selectedPillar === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    sound.playClick();
                    setSelectedPillar(key);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : "text-zinc-400 hover:text-white border-transparent hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>

          {/* Vouch Button */}
          <button
            onClick={() => {
              sound.playClick(1000);
              setIsVouchFormOpen(!isVouchFormOpen);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs shrink-0 shadow-md shadow-rose-950/40 hover:opacity-95 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>{isVouchFormOpen ? "Cancel Form" : "Sign Peer Voucher"}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Interactive Form for Signing New Voucher */}
          {isVouchFormOpen && (
            <form 
              onSubmit={handleSignVoucher}
              className="p-5 rounded-xl bg-gradient-to-b from-[#141725] to-[#10121B] border border-rose-500/30 shadow-xl space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HeartHandshake className="w-4 h-4 text-rose-400" />
                  <h4 className="text-sm font-bold text-white">Sign a Humane Competence Voucher</h4>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Ed25519 WebCrypto Signed</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#08090E] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500/50 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Title & Organization</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Staff Distributed Architect @ Stripe"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#08090E] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500/50 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Working Relationship</label>
                  <select
                    value={formData.relationship}
                    onChange={e => setFormData({ ...formData, relationship: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#08090E] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500/50 font-sans"
                  >
                    <option value="Mentee">Mentee (Was guided/taught by candidate)</option>
                    <option value="Teammate">Teammate (Engineered together)</option>
                    <option value="Engineering Lead">Engineering Lead (Managed/mentored candidate)</option>
                    <option value="Cross-Functional Peer">Cross-Functional Peer (Product / SRE / Security)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-zinc-400 mb-1">Humane Pillar</label>
                  <select
                    value={formData.pillar}
                    onChange={e => setFormData({ ...formData, pillar: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#08090E] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500/50 font-sans"
                  >
                    <option value="mentorship">Mentorship & Growing Others</option>
                    <option value="review_empathy">Empathetic Code Reviews</option>
                    <option value="blameless_culture">Blameless Incident Culture</option>
                    <option value="async_clarity">Async RFC Clarity</option>
                    <option value="sustainable_cadence">Sustainable Rhythm & Boundaries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                  Voucher Testimony (What makes this engineer extraordinary to work with?)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.testimony}
                  onChange={e => setFormData({ ...formData, testimony: e.target.value })}
                  placeholder="Share authentic observations of how they mentored others, handled production stress without blame, or elevated code quality through kindness..."
                  className="w-full p-3 rounded-lg bg-[#08090E] border border-white/[0.1] text-white focus:outline-none focus:border-rose-500/50 text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVouchFormOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigning}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-xs hover:opacity-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSigning ? "Signing with Ed25519..." : "Cryptographically Sign & Post"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Vouchers List */}
          <div className="space-y-4">
            {filteredVouchers.map((voucher) => {
              const cfg = PILLAR_CONFIG[voucher.pillar] || PILLAR_CONFIG.mentorship;
              const Icon = cfg.icon;
              return (
                <div 
                  key={voucher.id}
                  className="p-5 rounded-2xl bg-[#11131E] border border-white/[0.07] hover:border-white/[0.14] transition-all relative overflow-hidden"
                >
                  {/* Top line: Author info & Pillar pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.04]">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={voucher.voucherAvatarUrl} 
                        alt={voucher.voucherName} 
                        className="w-10 h-10 rounded-full object-cover border border-white/[0.10]"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white font-sans">{voucher.voucherName}</h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                            {voucher.relationship}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          {voucher.voucherTitle} • {voucher.voucherCompany}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                        <Icon className="w-3 h-3" />
                        <span>{cfg.label}</span>
                      </span>

                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{voucher.verifiedBadge}</span>
                      </span>
                    </div>
                  </div>

                  {/* Testimony quote */}
                  <div className="py-3">
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed italic">
                      "{voucher.testimony}"
                    </p>
                  </div>

                  {/* Bottom: Cryptographic receipt stamp */}
                  <div className="pt-3 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-600">DID:</span>
                      <span className="text-zinc-400">{voucher.voucherDid}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span>Attested: {new Date(voucher.dateAttested).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleCopySignature(voucher.id, voucher.signature)}
                        className="flex items-center space-x-1 hover:text-emerald-400 text-zinc-500 transition-colors"
                        title="Copy Ed25519 signature"
                      >
                        <span>Sig: {voucher.signature.substring(0, 10)}…</span>
                        {copiedId === voucher.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0E1017] flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Decentralized Peer Web: Zero fake recommendations, 100% DID anchored</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsHumaneLedgerOpen(false);
            }}
            className="px-4 py-1.5 rounded-lg tactile-btn text-xs font-medium text-zinc-300 hover:text-white"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
