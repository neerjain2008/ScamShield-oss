'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '@/lib/scamEngine';
import { RiskMeter } from './RiskMeter';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Shield,
  Brain,
  Share2,
  Flame,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '@/lib/audio';

interface ResultPanelProps {
  result: AnalysisResult;
  onScanAnother: () => void;
  rawInput: string;
}

export function ResultPanel({ result, onScanAnother, rawInput }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up speech synthesis if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyReport = () => {
    sound.playClick();
    const report = `🚨 SCAMSHIELD THREAT INTELLIGENCE REPORT
----------------------------------------
Risk Score: ${result.riskScore}%
Threat Level: ${result.riskLabel}
Analysis Time: ${new Date(result.analyzedAt).toLocaleString()}

DETECTED INDICATORS:
${result.indicators.map((ind) => `✓ ${ind.title}: ${ind.description}`).join('\n') || '✓ No active threats detected.'}

AI INTELLIGENCE BREAKDOWN:
${result.explanation?.summary || 'Standard analysis complete.'}

PSYCHOLOGICAL TRAP:
${result.explanation?.psychologicalTrigger || 'None'}

RECOMMENDED PROTECTIVE ACTIONS:
${result.explanation?.actionItems.map((action, i) => `${i + 1}. ${action}`).join('\n') || 'Stay alert.'}

Analyzed by ScamShield OSS (Zero-Log Privacy Scanner)
`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Accessibility: Text-to-Speech (Screen Reader Voice Readout)
  const toggleSpeech = () => {
    sound.playClick();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterances
    const indicatorText = result.indicators.map((i) => i.title).join(', ');
    const textToRead = `ScamShield Threat Intelligence Analysis. Calculated Risk Score: ${result.riskScore} percent, classified as ${result.riskLabel}. Detected reasons include: ${indicatorText || 'none'}. Threat Summary: ${result.explanation?.summary}. Recommended protective steps: ${result.explanation?.actionItems.join('. ')}.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Scam Threat Analysis Results"
      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      {/* Top Grid: Risk Gauge + Detected Reasons Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Circular Risk Meter */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <RiskMeter
            score={result.riskScore}
            riskLevel={result.riskLevel}
            riskLabel={result.riskLabel}
          />
        </div>

        {/* Right: Heuristic Reasons Detected */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#101117] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-300" />
                <h3 className="font-bold text-sm tracking-tight text-white uppercase">
                  Detected Threat Reasons ({result.indicators.length})
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                Rule Engine
              </span>
            </div>

            {/* List of Reasons */}
            <div className="mt-4 space-y-2.5">
              {result.indicators.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">No scam signatures detected.</p>
                    <p className="text-xs text-emerald-400/80 mt-0.5">
                      The text or link did not trigger known urgency traps, prize lures, or spoofed brand signatures.
                    </p>
                  </div>
                </div>
              ) : (
                result.indicators.map((ind, idx) => (
                  <div
                    key={`${ind.ruleId}-${idx}`}
                    className="p-3 rounded-xl bg-zinc-950/70 border border-white/[0.06] hover:border-white/[0.12] transition flex items-start gap-3"
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        ind.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : ind.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-zinc-100">
                          {ind.title}
                        </span>
                        <span
                          className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                            ind.severity === 'critical'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : ind.severity === 'high'
                              ? 'bg-orange-950 text-orange-400 border border-orange-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {ind.severity}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {ind.description}
                      </p>
                      {ind.matchedSnippet && (
                        <span className="inline-block mt-1 font-mono text-[10px] bg-zinc-900 text-zinc-300 px-2 py-0.5 rounded border border-zinc-800">
                          Snippet: &quot;{ind.matchedSnippet}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions Footer with Screen Reader Voice Button */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Copy Report */}
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Report Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Threat Report</span>
                  </>
                )}
              </button>

              {/* Text-to-Speech Accessibility Read Aloud */}
              <button
                onClick={toggleSpeech}
                className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg border transition ${
                  isSpeaking
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                }`}
                title="Voice read-aloud for visually impaired or elderly users"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                    <span>Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Listen Aloud (TTS)</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(false);
                onScanAnother();
              }}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Intelligence Explanation Card */}
      <div className="p-6 rounded-2xl bg-[#101117] border border-white/[0.08] shadow-2xl relative overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white tracking-tight flex items-center gap-2">
                ScamShield AI Intelligence Analysis
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                  {result.explanation?.source === 'gemma'
                    ? 'Gemma 4 (Apache 2.0)'
                    : result.explanation?.source === 'digitalocean'
                    ? 'DigitalOcean Hermes'
                    : result.explanation?.source === 'gemini'
                    ? 'Gemma 4 / Gemini'
                    : 'Deterministic AI Engine'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                &quot;This content has risk score {result.riskScore}%. Explain why this looks suspicious.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Executive Summary & Psychological Manipulation */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Strategic Threat Breakdown
              </h4>
              <p className="text-sm text-zinc-200 leading-relaxed bg-[#14151d] p-3.5 rounded-xl border border-white/[0.06]">
                {result.explanation?.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-1.5">
                <Brain className="w-3.5 h-3.5 text-amber-400" />
                Psychological Manipulation Tactic
              </h4>
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-sans">
                {result.explanation?.psychologicalTrigger}
              </div>
            </div>
          </div>

          {/* Actionable Protection Steps */}
          <div className="md:col-span-5 flex flex-col justify-between bg-[#14151d] p-4 rounded-xl border border-white/[0.06]">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Defensive Action Checklist
              </h4>

              <ul className="space-y-2">
                {result.explanation?.actionItems.map((action, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] flex items-center justify-center font-mono mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-zinc-400">
              <span>National Cyber Helpline: <strong>1930</strong></span>
              <span className="font-mono text-zinc-300">cybercrime.gov.in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
