"use client";

import React from "react";
import { ReceiptVerifier } from "@/components/ReceiptVerifier";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sound } from "@/lib/sound";

export default function VerifyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 min-h-[calc(100vh-64px)]">
      <div>
        <Link
          href="/"
          onClick={() => sound.playClick()}
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Competence Passport</span>
        </Link>
      </div>

      <ReceiptVerifier />
    </div>
  );
}
