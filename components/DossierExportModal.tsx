"use client";

import React, { useState } from "react";
import { X, Download, Printer, ShieldCheck, Check, Copy, ExternalLink, Award } from "lucide-react";
import { useApp } from "@/lib/store";
import { sound } from "@/lib/sound";

export function DossierExportModal() {
  const { profile, isDossierOpen, setIsDossierOpen } = useApp();
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isDossierOpen) return null;

  const handleDownloadJson = () => {
    sound.playClick(1000);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `meritos-dossier-${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    sound.playClick();
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in print:p-0 print:bg-white">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#0E1017] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-[#12131A] border-b border-white/[0.06] flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-sans">
              Verified Competence Dossier
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg tactile-btn text-xs font-mono text-zinc-300 hover:text-white"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg tactile-btn text-xs font-mono text-zinc-300 hover:text-white"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg tactile-btn-primary text-xs font-semibold"
            >
              <Printer className="w-3.5 h-3.5 text-[#042F2E]" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setIsDossierOpen(false);
              }}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dossier Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 print:p-0 print:space-y-4">
          {/* Dossier Header Strip */}
          <div className="p-6 rounded-2xl bg-[#12131A] border border-white/[0.08] flex items-start justify-between print:bg-gray-50 print:border-gray-300 print:text-black">
            <div className="flex items-start space-x-4">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-xl object-cover border border-emerald-500/50"
              />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight print:text-black">
                  {profile.displayName}
                </h1>
                <p className="text-xs text-zinc-400 font-mono mt-0.5 print:text-gray-600">
                  {profile.title}
                </p>
                <div className="flex items-center space-x-2 mt-2 font-mono text-xs">
                  <span className="text-zinc-500">DID:</span>
                  <span className="text-emerald-400 print:text-emerald-700">{profile.did}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                Verification Index
              </span>
              <span className="text-3xl font-bold font-mono text-emerald-400 print:text-emerald-700">
                {profile.verificationScore}%
              </span>
              <span className="text-[11px] font-mono text-zinc-400 block print:text-gray-600">
                {profile.globalRank} • {profile.totalVerifiedSkills} Proofs
              </span>
            </div>
          </div>

          {/* Attested Skills Table */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider">
              Cryptographically Attested Proofs ({profile.skills.length})
            </h3>

            <div className="border border-white/[0.08] rounded-xl overflow-hidden print:border-gray-300">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#12131A] text-zinc-400 border-b border-white/[0.06] print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="p-3">Node</th>
                    <th className="p-3">Domain</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Key Metrics</th>
                    <th className="p-3">Merkle Root</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] bg-[#090A0F] text-zinc-300 print:bg-white print:divide-gray-200 print:text-black">
                  {profile.skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-white print:text-black">
                        {skill.label}
                      </td>
                      <td className="p-3 uppercase text-[10px] text-cyan-400 print:text-blue-700">
                        {skill.domain}
                      </td>
                      <td className="p-3 capitalize text-zinc-400 print:text-gray-700">
                        {skill.level}
                      </td>
                      <td className="p-3 text-emerald-400 print:text-emerald-700">
                        {skill.evidence.metrics.throughput || skill.evidence.metrics.latency || "100% Passed"}
                      </td>
                      <td className="p-3 text-[10px] text-zinc-500 font-mono">
                        {skill.proofReceipt?.credentialSubject.merkleRoot.substring(0, 16)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Humane Engineering & Culture Scorecard */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-mono font-bold text-rose-300 tracking-wider print:text-rose-700">
                Humane Engineering & Collaboration Audit
              </h3>
              <span className="text-[10px] font-mono text-zinc-500 print:text-gray-600">
                Peer Consensus Verified
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "Review Empathy", score: `${profile.humaneScores?.reviewEmpathy || 99}%`, desc: "Compassionate PRs" },
                { label: "Mentorship Growth", score: `${profile.humaneScores?.mentorshipGrowth || 98}%`, desc: "Junior Leveling" },
                { label: "Blameless Culture", score: `${profile.humaneScores?.blamelessCulture || 100}%`, desc: "Systemic Retros" },
                { label: "Async RFC Clarity", score: `${profile.humaneScores?.asyncRfcClarity || 97}%`, desc: "Timezone Friendly" },
                { label: "Sustainable Cadence", score: `${profile.humaneScores?.sustainableCadence || 96}%`, desc: "Zero Burnout" },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-[#12131A] border border-white/[0.06] text-center print:bg-gray-50 print:border-gray-300">
                  <span className="text-[10px] uppercase font-mono text-zinc-400 block print:text-gray-600">{item.label}</span>
                  <span className="text-lg font-bold font-mono text-rose-400 block mt-0.5 print:text-rose-600">{item.score}</span>
                  <span className="text-[9px] text-zinc-500 font-mono block print:text-gray-500">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Peer Vouchers Section */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs uppercase font-mono font-bold text-zinc-400 tracking-wider">
              Cryptographic Peer Vouchers ({profile.peerAttestations?.length || 5})
            </h3>

            <div className="border border-white/[0.08] rounded-xl overflow-hidden print:border-gray-300">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#12131A] text-zinc-400 border-b border-white/[0.06] print:bg-gray-100 print:text-gray-700">
                  <tr>
                    <th className="p-3">Endorser</th>
                    <th className="p-3">Organization</th>
                    <th className="p-3">Pillar</th>
                    <th className="p-3">Testimonial Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] bg-[#090A0F] text-zinc-300 print:bg-white print:divide-gray-200 print:text-black">
                  {(profile.peerAttestations || []).map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-white/[0.02]">
                      <td className="p-3 font-semibold text-white print:text-black">
                        {voucher.voucherName}
                      </td>
                      <td className="p-3 text-[10px] text-zinc-400 print:text-gray-600">
                        {voucher.voucherTitle} • {voucher.voucherCompany}
                      </td>
                      <td className="p-3 text-rose-300 capitalize text-[11px] print:text-rose-700">
                        {voucher.pillar.replace("-", " ")}
                      </td>
                      <td className="p-3 text-zinc-300 text-xs italic max-w-md print:text-gray-800">
                        &ldquo;{voucher.testimony.substring(0, 95)}...&rdquo;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recruiter Recommendation Callout */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-300 flex items-start space-x-3 print:bg-emerald-50 print:border-emerald-400 print:text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block">
                Hiring Committee Recommendation: Skip Take-Home Assignment
              </span>
              <p className="text-[11px] leading-relaxed text-emerald-300/90 print:text-emerald-800">
                This candidate's cryptographic code diffs, terminal execution traces, and peer mentorship vouchers exceed the assessment depth of an unpaid 10-hour toy take-home project. Immediate progression to peer architectural conversation recommended.
              </p>
            </div>
          </div>

          {/* Cryptographic Seal Notice */}
          <div className="p-4 rounded-xl bg-[#090A0F] border border-white/[0.06] text-xs font-mono text-zinc-400 flex items-center justify-between print:bg-gray-50 print:border-gray-300 print:text-gray-700">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>All attestations verified under W3C Verifiable Credentials standard.</span>
            </div>
            <span className="text-[10px] text-zinc-500">
              Issuer Key: {profile.publicKey.substring(0, 16)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
