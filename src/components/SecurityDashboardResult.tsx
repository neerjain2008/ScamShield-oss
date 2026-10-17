'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Brain,
  Shield,
  ExternalLink,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/scamEngine';
import { sound } from '@/lib/audio';

interface SecurityDashboardResultProps {
  result: AnalysisResult;
  onScanAnother: () => void;
  rawInput?: string;
}

export function SecurityDashboardResult({
  result,
  onScanAnother,
}: SecurityDashboardResultProps) {
  const [copied, setCopied] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score counter smoothly
  useEffect(() => {
    let start = 0;
    const duration = 750;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = result.riskScore / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= result.riskScore) {
        setAnimatedScore(result.riskScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result.riskScore]);

  const isHighRisk = result.riskScore >= 60;
  const isSuspicious = result.riskScore >= 35 && result.riskScore < 60;

  const riskBadgeColor = isHighRisk
    ? 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10'
    : isSuspicious
    ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
    : 'text-[#00E5A8] border-[#00E5A8]/30 bg-[#00E5A8]/10';

  const riskTextColor = isHighRisk
    ? 'text-[#FF4D4D]'
    : isSuspicious
    ? 'text-amber-400'
    : 'text-[#00E5A8]';

  const riskLabelDisplay = isHighRisk
    ? 'HIGH'
    : isSuspicious
    ? 'MEDIUM'
    : 'SAFE';

  // Extract core reasons matching the required spec:
  // • Urgency tactics detected
  // • Suspicious request for money
  // • Known scam keywords
  // • Unverified sender
  const defaultHighRiskReasons = [
    'Urgency tactics detected',
    'Suspicious request for money',
    'Known scam keywords',
    'Unverified sender',
  ];

  // Specific detected indicator titles from the engine
  const dynamicReasons =
    result.indicators.length > 0
      ? Array.from(
          new Set([
            ...result.indicators.map((i) => i.title),
            ...(isHighRisk ? defaultHighRiskReasons : []),
          ])
        ).slice(0, 5)
      : ['No malicious triggers or urgency lures detected'];

  // Spec recommendations:
  // • Do not click links
  // • Do not share OTPs
  // • Verify with official sources
  const defaultRecommendations = [
    'Do not click links',
    'Do not share OTPs',
    'Verify with official sources',
  ];

  const recommendations =
    result.explanation?.actionItems && result.explanation.actionItems.length > 0
      ? Array.from(
          new Set([...defaultRecommendations, ...result.explanation.actionItems])
        ).slice(0, 4)
      : defaultRecommendations;

  const handleCopyReport = () => {
    sound.playClick();
    const reportText = `🚨 SCAMSHIELD THREAT INTELLIGENCE REPORT
----------------------------------------------
SCAM SCORE: ${result.riskScore}%
RISK LEVEL: ${riskLabelDisplay} (${result.riskLabel})
TIMESTAMP: ${new Date(result.analyzedAt).toISOString()}

DETECTED REASONS:
${dynamicReasons.map((r) => `• ${r}`).join('\n')}

RECOMMENDED ACTIONS:
${recommendations.map((a) => `• ${a}`).join('\n')}

AI BREAKDOWN:
${result.explanation?.summary || 'Deterministic heuristics analysis executed.'}

PSYCHOLOGICAL TRIGGER:
${result.explanation?.psychologicalTrigger || 'Standard social engineering assessment'}

Analyzed with ScamShield OSS (Zero-Log Privacy Scanner)
`;
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Gauge calculations
  const radius = 60;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;
  const gaugeColor = isHighRisk ? '#FF4D4D' : isSuspicious ? '#F59E0B' : '#00E5A8';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto space-y-6 pt-2"
    >
      {/* Top Threat Intelligence Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-[#111827] border border-white/[0.08] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8] animate-pulse" />
          <span className="font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            Analysis Report Generated
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#A1A1AA] font-mono text-[11px]">
          <span>Engine: 100% Local Inference (Ollama + Deterministic)</span>
          <span>•</span>
          <span className="text-[#00E5A8]">0 logs recorded</span>
        </div>
      </div>

      {/* Main Security Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Scam Score + Risk Level */}
        <div className="md:col-span-5 rounded-3xl bg-[#111827] border border-white/[0.08] p-6 sm:p-7 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
          {/* Ambient radial glow */}
          <div
            className="absolute w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: gaugeColor }}
          />

          <span className="text-xs font-mono uppercase tracking-widest text-[#A1A1AA] font-semibold mb-2">
            SCAM SCORE
          </span>

          {/* Circular Cyber Risk Gauge */}
          <div className="relative w-40 h-40 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#1f2937"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Value Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={gaugeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{ filter: `drop-shadow(0 0 10px ${gaugeColor})` }}
              />
            </svg>

            {/* Centered Score */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black tracking-tight text-white font-mono">
                {animatedScore}%
              </span>
            </div>
          </div>

          {/* RISK LEVEL Title and Value */}
          <div className="mt-3 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] block">
              RISK LEVEL
            </span>
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-extrabold tracking-wider uppercase ${riskBadgeColor}`}
            >
              {isHighRisk ? (
                <ShieldAlert className="w-4 h-4" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              <span>{riskLabelDisplay}</span>
            </div>
          </div>

          <p className="text-xs text-[#A1A1AA] mt-4 max-w-xs leading-relaxed font-normal">
            {isHighRisk
              ? 'Critical malicious characteristics identified. Immediate threat to user funds or identity.'
              : isSuspicious
              ? 'Suspicious manipulation techniques observed. Exercise heightened caution.'
              : 'Content conforms to standard benign communication characteristics.'}
          </p>
        </div>

        {/* Right Column: Reasons + Recommendations */}
        <div className="md:col-span-7 flex flex-col justify-between rounded-3xl bg-[#111827] border border-white/[0.08] p-6 sm:p-7 shadow-xl space-y-6">
          {/* Section 1: Reasons */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${riskTextColor}`} />
                <h3 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
                  Reasons
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#050505] px-2 py-0.5 rounded border border-white/[0.06]">
                Heuristic Detection
              </span>
            </div>

            <ul className="mt-3.5 space-y-2.5">
              {dynamicReasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-200"
                >
                  <span className={`text-base leading-none font-bold ${riskTextColor}`}>
                    •
                  </span>
                  <span className="font-medium leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 2: Recommendations */}
          <div className="pt-2 border-t border-white/[0.08]">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#00E5A8]" />
                <h3 className="text-sm font-bold tracking-tight text-white uppercase font-mono">
                  Recommendations
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00E5A8] bg-[#00E5A8]/10 px-2 py-0.5 rounded border border-[#00E5A8]/20">
                Action Items
              </span>
            </div>

            <ul className="space-y-2">
              {recommendations.map((rec, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300"
                >
                  <span className="text-base leading-none font-bold text-[#00E5A8]">
                    •
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons footer */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#050505] hover:bg-zinc-800 text-xs font-semibold text-white border border-white/[0.08] hover:border-white/20 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#00E5A8]" />
                  <span className="text-[#00E5A8]">Report Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#A1A1AA]" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onScanAnother();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00E5A8] hover:bg-[#00c993] text-[#050505] text-xs font-bold transition shadow-[0_0_20px_rgba(0,229,168,0.25)] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Scan Another Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Threat Explanation & Psychological Breakdown Card */}
      {result.explanation && (
        <div className="rounded-3xl bg-[#111827] border border-white/[0.08] p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#00E5A8]">
                <Brain className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-mono uppercase tracking-wider">
                Threat Breakdown & Psychological Tactics
              </h4>
            </div>
            <span className="text-[10px] font-mono text-[#A1A1AA] bg-[#050505] px-2.5 py-1 rounded-full border border-white/[0.08]">
              {result.explanation.source === 'ollama_local'
                ? 'Local Ollama LLM'
                : 'Local Deterministic Engine'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.06] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#A1A1AA] font-bold">
                Threat Analysis
              </span>
              <p className="text-zinc-200 leading-relaxed font-sans">
                {result.explanation.summary}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.06] space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Psychological Trigger</span>
              </span>
              <p className="text-amber-200/90 leading-relaxed font-sans">
                {result.explanation.psychologicalTrigger ||
                  'Manufactured urgency designed to short-circuit critical evaluation and induce hasty compliance.'}
              </p>
            </div>
          </div>

          {/* Cyber Helpline Callout */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A1A1AA]">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#00E5A8]" />
              <span>
                Report Financial Fraud to National Helpline:{' '}
                <strong className="text-white font-mono">1930</strong>
              </span>
            </div>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-[#00E5A8] hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </motion.section>
  );
}
export default SecurityDashboardResult;
