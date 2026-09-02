import { NextRequest, NextResponse } from "next/server";
import { MOCK_USER_PROFILE } from "@/lib/data/seedData";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username || "toibawani";
  const { searchParams } = new URL(request.url);
  const style = searchParams.get("style") || "default";

  // In production, query database; in demo, use profile
  const score = MOCK_USER_PROFILE.verificationScore;
  const verifiedCount = MOCK_USER_PROFILE.totalVerifiedSkills;
  const rank = MOCK_USER_PROFILE.globalRank;

  let svg = "";

  if (style === "compact") {
    svg = `
<svg width="260" height="28" viewBox="0 0 260 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="260" height="28" rx="6" fill="#090A0F" stroke="rgba(255,255,255,0.12)" />
  <rect x="1" y="1" width="105" height="26" rx="5" fill="#12131A" />
  <text x="12" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#E2E8F0">
    Merit<tspan fill="#10B981">OS</tspan>
  </text>
  <text x="58" y="18" font-family="'JetBrains Mono', monospace" font-size="10" fill="#94A3B8">
    ${username}
  </text>
  <circle cx="120" cy="14" r="3.5" fill="#10B981" />
  <text x="130" y="18" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" fill="#10B981">
    ${score}% Verified
  </text>
</svg>
`.trim();
  } else if (style === "shield") {
    svg = `
<svg width="340" height="50" viewBox="0 0 340 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#12131A" />
      <stop offset="100%" stopColor="#1A1C26" />
    </linearGradient>
  </defs>
  <rect width="340" height="50" rx="10" fill="url(#shieldBg)" stroke="rgba(255,255,255,0.1)" />
  
  <!-- Left Shield Badge -->
  <rect x="10" y="10" width="30" height="30" rx="6" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1.2" />
  <path d="M25 18L19 21V26C19 29.5 21.5 32.5 25 33.5C28.5 32.5 31 29.5 31 26V21L25 18Z" fill="#10B981" />
  
  <text x="50" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">
    MeritOS Competence Passport
  </text>
  <text x="50" y="38" font-family="'JetBrains Mono', monospace" font-size="10" fill="#94A3B8">
    ${rank} • ${verifiedCount} Cryptographic Proofs
  </text>

  <rect x="250" y="12" width="78" height="26" rx="6" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1" />
  <text x="289" y="29" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#10B981" text-anchor="middle">
    ${score}%
  </text>
</svg>
`.trim();
  } else if (style === "humane") {
    const empathyScore = MOCK_USER_PROFILE.humaneScores?.reviewEmpathy || 99;
    const peerVoucherCount = MOCK_USER_PROFILE.peerAttestations?.length || 5;

    svg = `
<svg width="380" height="46" viewBox="0 0 380 46" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="humaneBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#171221" />
      <stop offset="100%" stopColor="#1F1528" />
    </linearGradient>
  </defs>
  <rect width="380" height="46" rx="8" fill="url(#humaneBg)" stroke="rgba(244,63,94,0.3)" stroke-width="1.2" />
  
  <!-- Rose Heart / Shield Badge -->
  <rect x="8" y="8" width="30" height="30" rx="6" fill="#F43F5E" fill-opacity="0.15" stroke="#F43F5E" stroke-width="1.2" />
  <path d="M23 16C21.5 14.5 19 14.5 17.5 16C16 17.5 16 20 17.5 21.5L23 27L28.5 21.5C30 20 30 17.5 28.5 16C27 14.5 24.5 14.5 23 16Z" fill="#F43F5E" />

  <text x="46" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF">
    MeritOS <tspan fill="#F43F5E">Humane Certified</tspan>
  </text>
  <text x="46" y="34" font-family="'JetBrains Mono', monospace" font-size="9" fill="#FDA4AF">
    ${empathyScore}% Review Empathy • ${peerVoucherCount} Peer Vouchers
  </text>

  <!-- Verified Pill -->
  <rect x="290" y="12" width="80" height="22" rx="5" fill="#F43F5E" fill-opacity="0.15" stroke="#F43F5E" stroke-width="1" />
  <text x="330" y="27" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#FDA4AF" text-anchor="middle">
    HUMANE ✓
  </text>
</svg>
`.trim();
  } else {
    // Default Linear-Grade Dark Badge
    svg = `
<svg width="400" height="42" viewBox="0 0 400 42" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#090A0F" />
      <stop offset="100%" stopColor="#12131A" />
    </linearGradient>
    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#10B981" />
      <stop offset="100%" stopColor="#34D399" />
    </linearGradient>
  </defs>
  
  <rect width="400" height="42" rx="8" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.08)" />
  
  <!-- Logo Mark -->
  <rect x="8" y="7" width="28" height="28" rx="6" fill="#10B981" fill-opacity="0.15" stroke="#10B981" stroke-width="1" />
  <path d="M22 15L17 18V22C17 25 19 27.5 22 28.5C25 27.5 27 25 27 22V18L22 15Z" fill="#10B981" />

  <text x="44" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#FFFFFF">
    MeritOS Identity
  </text>
  <text x="44" y="34" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748B">
    did:merit:${username}
  </text>

  <!-- Divider -->
  <line x1="175" y1="10" x2="175" y2="32" stroke="rgba(255,255,255,0.08)" />

  <!-- Score & Skills -->
  <text x="190" y="21" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="600" fill="#E2E8F0">
    Index: <tspan fill="#10B981">${score}%</tspan>
  </text>
  <text x="190" y="33" font-family="'JetBrains Mono', monospace" font-size="9" fill="#94A3B8">
    ${verifiedCount} Verified Proofs • ${rank}
  </text>

  <!-- Verified Pill -->
  <rect x="312" y="11" width="76" height="20" rx="4" fill="#10B981" fill-opacity="0.12" stroke="#10B981" stroke-width="1" />
  <circle cx="323" cy="21" r="2.5" fill="#10B981" />
  <text x="331" y="24" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700" fill="#10B981">
    VERIFIED
  </text>
</svg>
`.trim();
  }

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
