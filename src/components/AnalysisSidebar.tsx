'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Cpu,
  Globe,
  FileText,
  Key,
  Shield,
  ExternalLink,
  ChevronDown,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AnalysisSidebarProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
  useUrlScan: boolean;
  onToggleUrlScan: () => void;
  ocrLanguage: string;
  onSelectOcrLanguage: (lang: string) => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function AnalysisSidebar({
  selectedModel,
  onSelectModel,
  useUrlScan,
  onToggleUrlScan,
  ocrLanguage,
  onSelectOcrLanguage,
  apiKey,
  onSaveApiKey,
  soundEnabled,
  onToggleSound,
}: AnalysisSidebarProps) {
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyVal, setKeyVal] = useState(apiKey);

  const models = [
    { id: 'gemma-4:31b', name: 'gemma-4:31b (Google DeepMind)' },
    { id: 'gemma-4:26b', name: 'gemma-4:26b (MoE Active)' },
    { id: 'gemma2:2b', name: 'gemma2:2b (Local Fast)' },
    { id: 'hermes3:8b', name: 'hermes3:8b (Nous Research)' },
    { id: 'gemini-1.5-flash', name: 'gemini-1.5-flash (Cloud)' },
  ];

  const languages = [
    { id: 'eng', name: 'eng (English)' },
    { id: 'hin', name: 'hin (Hindi)' },
    { id: 'spa', name: 'spa (Spanish)' },
    { id: 'fra', name: 'fra (French)' },
  ];

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 bg-[#0d0e13]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between shadow-2xl space-y-6">
      <div className="space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            Analysis settings
            <span
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              title="Configure local Ollama, OCR language, and external intelligence lookups."
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </h2>
          <button
            onClick={onToggleSound}
            className="text-zinc-400 hover:text-white transition p-1 rounded-md"
            title={soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            )}
          </button>
        </div>

        {/* Local Ollama Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-400" />
            <span>Local Ollama model</span>
            <span
              className="text-zinc-500 hover:text-zinc-400 cursor-pointer"
              title="Runs locally on your device without transmitting prompts to third-party clouds."
            >
              <HelpCircle className="w-3 h-3" />
            </span>
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full appearance-none bg-[#161720] text-zinc-200 text-xs rounded-xl border border-white/[0.08] px-3 py-2.5 pr-8 focus:outline-none focus:border-white/30 font-mono transition"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#101117] text-zinc-200">
                  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* URLScan.io Reputation Toggle */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span>Use URLScan.io reputation</span>
              <span
                className="text-zinc-500 hover:text-zinc-400 cursor-pointer"
                title="Optional live DNS & reputation lookup. Disabled by default for 100% offline privacy."
              >
                <HelpCircle className="w-3 h-3" />
              </span>
            </label>
            <button
              type="button"
              onClick={onToggleUrlScan}
              className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                useUrlScan ? 'bg-white' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full absolute top-0.5 transition-transform ${
                  useUrlScan ? 'left-5 bg-black' : 'left-1 bg-zinc-400'
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            {useUrlScan
              ? 'External lookup enabled (queries domain reputation on scan).'
              : 'Off by default. Domain intelligence evaluates locally.'}
          </p>
        </div>

        {/* Tesseract Language */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Tesseract language</span>
            <span
              className="text-zinc-500 hover:text-zinc-400 cursor-pointer"
              title="WebAssembly OCR language dictionary running entirely in browser."
            >
              <HelpCircle className="w-3 h-3" />
            </span>
          </label>
          <div className="relative">
            <select
              value={ocrLanguage}
              onChange={(e) => onSelectOcrLanguage(e.target.value)}
              className="w-full appearance-none bg-[#161720] text-zinc-200 text-xs rounded-xl border border-white/[0.08] px-3 py-2.5 pr-8 focus:outline-none focus:border-white/30 font-mono transition"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#101117] text-zinc-200">
                  {l.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Optional AI Key Config */}
        <div className="pt-2 border-t border-white/[0.06]">
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="w-full flex items-center justify-between text-xs text-zinc-400 hover:text-white transition py-1 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>{apiKey ? 'AI API Key Set' : 'Custom AI Key (Optional)'}</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-300">
              {showKeyInput ? 'Hide' : apiKey ? 'Edit' : 'Add'}
            </span>
          </button>

          {showKeyInput && (
            <div className="mt-2 space-y-2">
              <input
                type="password"
                value={keyVal}
                onChange={(e) => setKeyVal(e.target.value)}
                placeholder="Google AI Studio key (AIzaSy...)"
                className="w-full bg-[#161720] text-zinc-100 placeholder-zinc-600 rounded-xl border border-white/[0.08] p-2 text-[11px] font-mono outline-none focus:border-white/30"
              />
              <button
                onClick={() => {
                  onSaveApiKey(keyVal);
                  setShowKeyInput(false);
                }}
                className="w-full py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition"
              >
                Save to Browser
              </button>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="pt-2 space-y-1.5 border-t border-white/[0.06] text-xs">
          <Link
            href="/why-local-matters"
            className="text-zinc-400 hover:text-white transition flex items-center justify-between py-1 group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">
              Why local matters
            </span>
            <span className="text-zinc-600 group-hover:text-white">→</span>
          </Link>
          <Link
            href="/privacy"
            className="text-zinc-400 hover:text-white transition flex items-center justify-between py-1 group"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">
              Privacy by default
            </span>
            <span className="text-zinc-600 group-hover:text-white">→</span>
          </Link>
        </div>
      </div>

      {/* Bottom Disclaimer */}
      <div className="pt-4 border-t border-white/[0.06] text-[11px] text-zinc-500 leading-relaxed">
        <p>ScamShield provides risk guidance, not a guarantee or legal advice.</p>
      </div>
    </aside>
  );
}
export default AnalysisSidebar;
