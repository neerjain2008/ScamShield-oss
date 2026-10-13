'use client';

import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, ExternalLink, Trash2 } from 'lucide-react';
import { sound } from '@/lib/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}: SettingsModalProps) {
  const [inputVal, setInputVal] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playClick();
    onSaveKey(inputVal.trim());
    onClose();
  };

  const handleRemove = () => {
    sound.playClick();
    setInputVal('');
    onSaveKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white">
            <Key className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Engine Configuration</h3>
            <p className="text-xs text-zinc-400">Google Gemma 4 (Apache 2.0) / Open Intelligence Setup</p>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4 text-xs text-zinc-300">
          <p className="leading-relaxed">
            ScamShield OSS uses a <strong>deterministic heuristic scoring engine</strong> first, then queries <strong>Google Gemma 4</strong> (frontier open-weights intelligence) to synthesize psychological manipulation breakdowns and safety action items.
          </p>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero-Setup Guaranteed</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              If no API key is provided, ScamShield automatically uses its high-accuracy deterministic engine. Adding your Google AI Studio key enables dynamic <strong>Google Gemma 4</strong> synthesis.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              AI Provider Key (Google AI Studio for Gemma 4 or DigitalOcean GenAI)
            </label>
            <input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter Google AI Studio key (AIzaSy...) for Gemma 4 or DigitalOcean GenAI key..."
              className="w-full bg-[#161720] text-zinc-100 placeholder-zinc-600 rounded-xl border border-white/[0.08] focus:border-white/30 p-3 text-xs font-mono outline-none"
            />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 text-[11px]">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
              >
                <span>Google AI Studio Key</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              <a
                href="https://cloud.digitalocean.com/genai"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white hover:underline flex items-center gap-1"
              >
                <span>DigitalOcean GenAI / Hermes</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              {apiKey && (
                <button
                  onClick={handleRemove}
                  className="text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                  <span>Remove key</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Your API key is saved exclusively in your browser&apos;s <code className="text-zinc-300">localStorage</code>. It is never stored in any database or sent to external servers.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 font-sans shadow-lg shadow-white/5 transition"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
