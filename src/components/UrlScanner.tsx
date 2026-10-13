'use client';

import React from 'react';
import { Globe, Clipboard, Trash2, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import { sound } from '@/lib/audio';

interface UrlScannerProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function UrlScanner({
  value,
  onChange,
  onClear,
  isAnalyzing,
}: UrlScannerProps) {
  const handlePaste = async () => {
    try {
      sound.playClick();
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text.trim());
      }
    } catch {
      // safe ignore
    }
  };

  // Real-time quick inspection of URL structure
  const cleanInput = value.trim();
  const hasHyphens = cleanInput.includes('-');
  const hyphenCount = (cleanInput.match(/-/g) || []).length;
  const hasNumbers = /[0-9]/.test(cleanInput);
  const isHttps = cleanInput.startsWith('https://');
  const isHttp = cleanInput.startsWith('http://');

  const detectedKeywords = ['login', 'verify', 'update', 'secure', 'banking', 'prize', 'winner', 'kyc'].filter(
    (kw) => cleanInput.toLowerCase().includes(kw)
  );

  const sampleUrls = [
    'amazon-prize-2026.net',
    'sbi-kyc-update.xyz',
    'netflix-verify-billing.top',
    'https://google.com',
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-400" />
          <span>Suspicious URL or Domain Name</span>
        </label>

        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={() => {
                sound.playClick();
                onClear();
              }}
              className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={handlePaste}
            className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 flex items-center gap-1.5 transition"
          >
            <Clipboard className="w-3 h-3 text-zinc-400" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center rounded-xl bg-[#161720] border border-white/[0.08] focus-within:border-white/30 px-3.5 py-3 transition">
          <Globe className="w-5 h-5 text-zinc-500 mr-2.5 flex-shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. amazon-prize-2026.net or http://sbi-kyc-update.xyz"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none font-mono"
          />
        </div>
      </div>

      {/* Real-time Structural URL telemetry */}
      {cleanInput && (
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">Live Heuristics:</span>

          {hyphenCount > 0 ? (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
              ⚠️ {hyphenCount} Hyphen(s) detected (+{Math.min(25, hyphenCount * 12)}%)
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono text-[11px]">
              0 Hyphens
            </span>
          )}

          {hasNumbers && (
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
              ⚠️ Numerics in domain (+15%)
            </span>
          )}

          {detectedKeywords.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
              🚨 Keywords: {detectedKeywords.join(', ')}
            </span>
          )}

          {isHttp && (
            <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
              ⚠️ Insecure HTTP
            </span>
          )}
        </div>
      )}

      {/* Quick sample chips */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs text-zinc-500">
        <span>Try sample:</span>
        {sampleUrls.map((sample) => (
          <button
            key={sample}
            onClick={() => {
              sound.playClick();
              onChange(sample);
            }}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-mono text-[11px] transition"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
}
