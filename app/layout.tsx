import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { ProofSandboxModal } from "@/components/ProofSandboxModal";
import { BadgeGenerator } from "@/components/BadgeGenerator";
import { AttestationWizard } from "@/components/AttestationWizard";
import { DossierExportModal } from "@/components/DossierExportModal";
import { CommandPalette } from "@/components/CommandPalette";
import { ShareModal } from "@/components/ShareModal";
import { TeamFitSimulator } from "@/components/TeamFitSimulator";

export const metadata: Metadata = {
  title: "MeritOS | The Proof-of-Competence Platform",
  description: "Lifelong, portable identity for verified developer competence. Real work cryptographically verified with Ed25519 signatures and immutable Merkle attestation receipts.",
  keywords: [
    "developer portfolio",
    "proof of competence",
    "cryptographic attestations",
    "ed25519 signatures",
    "humane engineering",
    "developer identity",
    "peer mentorship ledger"
  ],
  authors: [{ name: "MeritOS Team" }],
  creator: "MeritOS Core",
  publisher: "MeritOS",
  metadataBase: new URL("https://meritos.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meritos.dev",
    siteName: "MeritOS",
    title: "MeritOS | The Proof-of-Competence Platform",
    description: "Cryptographically verified developer competence, humane engineering attestations, and immutable Merkle receipts.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "MeritOS - The Proof-of-Competence Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MeritOS | The Proof-of-Competence Platform",
    description: "Replace resume spam with cryptographically verified code proofs and humane engineering reviews.",
    creator: "@meritos_dev"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MeritOS",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "description": "Cryptographically verified proof-of-competence platform for modern software engineers.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className="bg-[#090A0F] text-[#E2E8F0] min-h-screen antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            {/* Global Modals & Drawers */}
            <CommandPalette />
            <ShareModal />
            <TeamFitSimulator />
            <ProofSandboxModal />
            <BadgeGenerator />
            <AttestationWizard />
            <DossierExportModal />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
