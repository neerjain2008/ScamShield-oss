'use client';

import React, { useState } from 'react';
import {
  X,
  Cpu,
  Globe,
  FileText,
  ShieldCheck,
  Volume2,
  VolumeX,
  Sliders,
  Check,
  Server,
} from 'lucide-react';
import { sound } from '@/lib/audio';

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  useUrlScan: boolean;
  onToggleUrlScan: () => void;
  ocrLanguage: string;
  onSelectOcrLanguage: (lang: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function AdvancedSettingsModal({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  useUrlScan,
  onToggleUrlScan,
  ocrLanguage,
  onSelectOcrLanguage,
  soundEnabled,
  onToggleSound,
}: AdvancedSettingsModalProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const localModels = [
    { id: 'gemma4:e2b', name: 'Google Gemma 4:e2b (Local Ollama • Metal GPU)' },
    { id: 'llama3.2:3b', name: 'Meta Llama 3.2:3b (Local Ollama • Fast 2GB)' },
    { id: 'qwen2.5:7b', name: 'Qwen 2.5:7b (Local Ollama • Reasoning)' },
    { id: 'gemma2:2b', name: 'Google Gemma 2:2b (Local Ollama • 1.6GB)' },
  ];

  const languages = [
    { id: 'eng', name: 'English (eng)' },
    { id: 'hin', name: 'Hindi (hin)' },
    { id: 'spa', name: 'Spanish (spa)' },
    { id: 'fra', name: 'French (fra)' },
  ];

  const handleSave = () => {
    sound.playClick();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#111827] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white space-y-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00E5A8]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">Local Settings</h3>
              <p className="text-xs text-[#A1A1AA]">100% on-device models, OCR and privacy controls</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.06] transition"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="space-y-5 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Local Model Selection */}
          <div className="space-y-2">
            <label className="font-medium text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#00E5A8]" />
                <span>Local Ollama Model</span>
              </span>
              <span className="text-[10px] font-mono text-[#00E5A8] bg-[#00E5A8]/10 px-2 py-0.5 rounded border border-[#00E5A8]/20">
                100% On-Device
              </span>
            </label>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                className="w-full appearance-none bg-[#050505] text-zinc-200 text-xs rounded-xl border border-white/[0.08] px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#00E5A8] font-mono transition cursor-pointer"
              >
                {localModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#111827] text-zinc-200">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Inference runs entirely in your local Ollama instance on this Mac with Metal GPU
              acceleration. Zero cloud transmission.
            </p>
          </div>

          {/* 2. Local Ollama Server Status */}
          <div className="p-3.5 rounded-xl bg-[#050505]/70 border border-white/[0.08] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Server className="w-4 h-4 text-[#00E5A8]" />
                <span>Local Server Endpoint</span>
              </div>
              <span className="text-[10px] font-mono text-[#00E5A8] bg-[#00E5A8]/10 px-2 py-0.5 rounded">
                Active: port 11434
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] font-mono">http://localhost:11434</p>
          </div>

          {/* 3. OCR Language Selection */}
          <div className="space-y-2">
            <label className="font-medium text-zinc-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#00E5A8]" />
                <span>Tesseract OCR Language</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400">In-Browser Wasm</span>
            </label>
            <select
              value={ocrLanguage}
              onChange={(e) => onSelectOcrLanguage(e.target.value)}
              className="w-full appearance-none bg-[#050505] text-zinc-200 text-xs rounded-xl border border-white/[0.08] px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#00E5A8] font-mono transition cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#111827] text-zinc-200">
                  {l.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#A1A1AA]">
              Text extraction runs 100% locally in your browser WebAssembly sandbox.
            </p>
          </div>

          {/* 4. URLScan.io Toggle */}
          <div className="p-3.5 rounded-xl bg-[#050505]/70 border border-white/[0.08] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                <Globe className="w-4 h-4 text-[#00E5A8]" />
                <span>External URLScan.io Lookup</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                {useUrlScan
                  ? 'Enabled: Queries public domain reputation during URL analysis.'
                  : 'Disabled by default for 100% offline zero-network privacy.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onToggleUrlScan();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                useUrlScan ? 'bg-[#00E5A8]' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${
                  useUrlScan ? 'left-6 bg-[#050505]' : 'left-1 bg-zinc-400'
                }`}
              />
            </button>
          </div>

          {/* 5. Audio Sound Effects Toggle */}
          <div className="p-3.5 rounded-xl bg-[#050505]/70 border border-white/[0.08] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-zinc-200">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#00E5A8]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-zinc-500" />
                )}
                <span>Auditory Feedback & Alerts</span>
              </div>
              <p className="text-[11px] text-[#A1A1AA]">
                Play subtle synthesizer sound cues on scan and threat detection.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onToggleSound();
                sound.playClick();
              }}
              className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                soundEnabled ? 'bg-[#00E5A8]' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${
                  soundEnabled ? 'left-6 bg-[#050505]' : 'left-1 bg-zinc-400'
                }`}
              />
            </button>
          </div>

          {/* Zero Cloud Guarantee Note */}
          <div className="p-3.5 rounded-xl bg-[#00E5A8]/5 border border-[#00E5A8]/20 flex items-start gap-2.5 text-[#A1A1AA]">
            <ShieldCheck className="w-4 h-4 text-[#00E5A8] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-white">Zero Cloud Guarantee:</strong> No cloud LLMs, no remote
              telemetry, no external prompt storage. Everything runs on this machine.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#A1A1AA] hover:text-white hover:bg-white/[0.06] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-[#00E5A8] hover:bg-[#00c993] text-[#050505] transition shadow-lg shadow-[#00E5A8]/20 active:scale-[0.98] cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#050505]" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Close</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdvancedSettingsModal;
