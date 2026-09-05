import { NextRequest, NextResponse } from "next/server";
import { TOIBA_PROFILE, ALEX_PROFILE, ELENA_PROFILE } from "@/lib/data/seedData";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username.toLowerCase();

  let profile = TOIBA_PROFILE;
  if (username === "alex" || username === "alex_rivera") {
    profile = ALEX_PROFILE;
  } else if (username === "elena" || username === "elena_rostova") {
    profile = ELENA_PROFILE;
  }

  const host = request.headers.get("host") || "meritos.dev";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const didDoc = {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/suites/ed25519-2020/v1",
      "https://schema.org"
    ],
    id: profile.did,
    alsoKnownAs: [
      profile.githubUrl,
      `${baseUrl}/p/${profile.username}`
    ],
    verificationMethod: [
      {
        id: `${profile.did}#key-1`,
        type: "Ed25519VerificationKey2020",
        controller: profile.did,
        publicKeyMultibase: `z${profile.publicKey}`,
        publicKeyHex: profile.publicKey
      }
    ],
    authentication: [`${profile.did}#key-1`],
    assertionMethod: [`${profile.did}#key-1`],
    capabilityInvocation: [`${profile.did}#key-1`],
    service: [
      {
        id: `${profile.did}#meritos-profile`,
        type: "VerifiableProfileService",
        serviceEndpoint: `${baseUrl}/p/${profile.username}`
      },
      {
        id: `${profile.did}#meritos-badge`,
        type: "AttestationBadgeService",
        serviceEndpoint: `${baseUrl}/api/badge/${profile.username}`
      },
      {
        id: `${profile.did}#meritos-verification`,
        type: "CryptographicVerifierService",
        serviceEndpoint: `${baseUrl}/verify`
      }
    ],
    meritProofLedger: {
      owner: profile.displayName,
      title: profile.title,
      rank: profile.rankTitle,
      level: profile.level,
      totalVerifiedSkills: profile.totalVerifiedSkills,
      verificationScore: profile.verificationScore,
      humaneImpactIndex: profile.sustainableRhythm?.humaneImpactIndex ?? 98.5,
      peerAttestationsCount: profile.peerAttestations?.length ?? 0,
      skillsCount: profile.skills?.length ?? 0
    }
  };

  return NextResponse.json(didDoc, {
    headers: {
      "Content-Type": "application/did+ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
