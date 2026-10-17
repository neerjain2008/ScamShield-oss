import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, EyeOff, ServerOff, DatabaseZap } from 'lucide-react';
import { BrandLogo, ScamShieldIcon } from '@/components/BrandLogo';

export const metadata = {
  title: 'Privacy Policy | ScamShield OSS',
  description: 'Zero-log privacy architecture and client-side scam detection security policy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-white/[0.04] bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <BrandLogo size="sm" href="/" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Log Architecture</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14151b] border border-white/[0.08] text-zinc-300 text-xs font-mono">
            <ScamShieldIcon className="w-3.5 h-4" />
            <span>100% Client-Side Privacy Guaranteed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            ScamShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9bb5fa] via-[#e28dad] to-[#fca5a5]">Privacy Architecture</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            ScamShield OSS is designed to protect citizens from deceptive fraud without creating surveillance or data leak risks. We do not store, track, or sell your scanned data.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#101117] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <ServerOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Cloud Uploads for OCR</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Screenshot scanning uses in-browser WebAssembly (Tesseract.js). Your confidential screenshots, bank SMS, or WhatsApp chats are parsed inside your browser memory and never uploaded to any server.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101117] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <DatabaseZap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Databases & User Accounts</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              There is no user authentication, no cookies, no tracking pixels, and no database backend. When you close or refresh your tab, all scanned content is instantly erased from RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101117] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Local Heuristic Scoring</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our 130+ scam pattern checks execute entirely in client-side TypeScript. Calculation of risk scores happens offline on your own CPU without calling external black-box APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#101117] border border-white/[0.08] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero Cloud Models & Zero Keys</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every cloud model has been removed. Threat intelligence runs 100% on-device via local Ollama or our deterministic engine. No API keys, cloud accounts, or remote connections are required.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6 text-sm text-zinc-300 bg-[#101117] p-8 rounded-2xl border border-white/[0.08]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-zinc-400" />
            <span>Open Source Transparency Guarantee</span>
          </h2>
          <p className="leading-relaxed text-zinc-400 text-xs">
            Every line of code is open source under the <strong>MIT License</strong>. You can inspect all network operations using your browser DevTools (Network tab) or run ScamShield completely offline within a local Docker container:
          </p>
          <pre className="p-4 rounded-xl bg-[#161720] text-xs font-mono text-zinc-200 border border-white/[0.08] overflow-x-auto">
{`docker build -t scamshield-oss .
docker run -p 3000:3000 scamshield-oss`}
          </pre>
          <div className="pt-4 flex items-center justify-between border-t border-white/[0.06] text-xs text-zinc-500">
            <span>Published under MIT License • Hacktoberfest & MLH Challenge</span>
            <Link href="/" className="text-zinc-300 hover:text-white underline">
              Return to Scam Scanner →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
