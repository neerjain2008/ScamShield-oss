'use client';

import React from 'react';
import { Clipboard, Trash2, Sparkles, MessageSquare } from 'lucide-react';
import { sound } from '@/lib/audio';

interface MessageScannerProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export function MessageScanner({
  value,
  onChange,
  onClear,
  isAnalyzing,
}: MessageScannerProps) {
  const handlePaste = async () => {
    try {
      sound.playClick();
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // clipboard permission denied or not supported
    }
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
          <span>Suspicious Text / Message Input</span>
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
            <span>Paste Clipboard</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste suspicious SMS, WhatsApp message, email, or Telegram text here...&#10;&#10;Example:&#10;Congratulations! You've won ₹50,000. Click now to claim."
          className="w-full bg-[#161720] text-zinc-100 placeholder-zinc-500 rounded-xl border border-white/[0.08] focus:border-white/30 p-4 text-sm font-sans resize-y leading-relaxed outline-none transition"
        />

        {/* Character / Word count footer */}
        <div className="absolute right-3 bottom-3 flex items-center gap-3 text-[11px] font-mono text-zinc-500 pointer-events-none">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Heuristic engine checks 25+ psychological and structural indicators instantly
        </span>
        <span className="hidden sm:inline font-mono text-[11px]">
          Press Ctrl + Enter to analyze
        </span>
      </div>
    </div>
  );
}
