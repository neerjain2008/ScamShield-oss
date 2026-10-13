import Link from "next/link";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ArrowRight, ShieldAlert, Cpu } from "lucide-react";

const settings = {
  rotate: 12,
  width: 600,
  height: 140,
  y: 15,
  badge: "ScamShield OSS • Open Source Security",
  title1: "Zero-Log Fraud Defense",
  title2: "Instant Scam Intelligence",
  description:
    "Detect SMS fraud, phishing URLs, and deceptive screenshots using deterministic heuristics and Google Gemma 4 AI explanation.",
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="min-h-screen w-full bg-[#070a11] flex flex-col justify-between">
      <HeroGeometric {...s}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition hover:scale-105 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Launch Live Scam Scanner</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            href="/#presets"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white font-medium text-sm transition"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Test Heuristic Scenarios</span>
          </Link>
        </div>
      </HeroGeometric>
    </div>
  );
}
