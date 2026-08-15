import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { ProofSandboxModal } from "@/components/ProofSandboxModal";
import { BadgeGenerator } from "@/components/BadgeGenerator";
import { AttestationWizard } from "@/components/AttestationWizard";
import { DossierExportModal } from "@/components/DossierExportModal";

export const metadata: Metadata = {
  title: "MeritOS | The Proof-of-Competence Platform",
  description: "Lifelong, portable identity for verified developer competence. Real work cryptographically verified and signed into immutable attestation receipts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090A0F] text-[#E2E8F0] min-h-screen antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            {/* Global Modals & Drawers */}
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
