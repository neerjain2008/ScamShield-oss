'use client';

import React, { useState, useEffect } from 'react';
import { Accessibility, Type, Sun, Moon, Volume2, Sparkles } from 'lucide-react';
import { sound } from '@/lib/audio';
import { TextScale, ContrastMode, AccessibilitySettings } from './AccessibilityBar';

interface QuickA11yBannerProps {
  onSpeakThreat?: () => void;
  isSpeaking?: boolean;
}

export function QuickA11yBanner({ onSpeakThreat, isSpeaking }: QuickA11yBannerProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    textScale: 'normal',
    contrast: 'default',
    dyslexia: false,
    reducedMotion: false,
  });

  const applySettings = (s: AccessibilitySettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-text-scale', s.textScale);
    root.setAttribute('data-contrast', s.contrast);
    root.setAttribute('data-dyslexia', String(s.dyslexia));
    root.setAttribute('data-reduced-motion', String(s.reducedMotion));

    // Direct root fontSize scaling for immediate visible magnification across all rem classes
    if (s.textScale === 'normal') root.style.fontSize = '16px';
    if (s.textScale === 'large') root.style.fontSize = '19px';
    if (s.textScale === 'xlarge') root.style.fontSize = '22px';
    if (s.textScale === 'max') root.style.fontSize = '26px';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('scamshield_a11y_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        applySettings(parsed);
      }
    } catch {
      // safe ignore
    }
  }, []);

  const setScale = (scale: TextScale) => {
    sound.playClick();
    const next = { ...settings, textScale: scale };
    setSettings(next);
    applySettings(next);
    localStorage.setItem('scamshield_a11y_settings', JSON.stringify(next));
  };

  const setContrast = (mode: ContrastMode) => {
    sound.playClick();
    const next = { ...settings, contrast: mode };
    setSettings(next);
    applySettings(next);
    localStorage.setItem('scamshield_a11y_settings', JSON.stringify(next));
  };

  const toggleDyslexia = () => {
    sound.playClick();
    const next = { ...settings, dyslexia: !settings.dyslexia };
    setSettings(next);
    applySettings(next);
    localStorage.setItem('scamshield_a11y_settings', JSON.stringify(next));
  };

  return (
    <div
      role="region"
      aria-label="Quick Accessibility Controls"
      className="w-full bg-[#0a0c12]/90 border-b border-white/[0.04] py-1.5 px-4 text-xs backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Text Magnifier Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-semibold flex items-center gap-1 text-[11px]">
            <Type className="w-3.5 h-3.5 text-zinc-300" />
            <span>Text Magnifier:</span>
          </span>

          <div className="inline-flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              onClick={() => setScale('normal')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.textScale === 'normal'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="100% Normal Font Size"
            >
              100%
            </button>
            <button
              onClick={() => setScale('large')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.textScale === 'large'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="115% Large Magnification"
            >
              115% A+
            </button>
            <button
              onClick={() => setScale('xlarge')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.textScale === 'xlarge'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="130% X-Large Magnification"
            >
              130% A++
            </button>
            <button
              onClick={() => setScale('max')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.textScale === 'max'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="145% Maximum Zoom"
            >
              145% Max
            </button>
          </div>
        </div>

        {/* Center: Contrast Profiles */}
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-semibold flex items-center gap-1 text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Contrast:</span>
          </span>

          <div className="inline-flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              onClick={() => setContrast('default')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.contrast === 'default'
                  ? 'bg-white text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🌙 Dark
            </button>
            <button
              onClick={() => setContrast('high-dark')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.contrast === 'high-dark'
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="High Contrast Dark (AAA)"
            >
              ⬛ High-Dark
            </button>
            <button
              onClick={() => setContrast('high-light')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                settings.contrast === 'high-light'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="High Contrast Light (AAA)"
            >
              ☀️ High-Light
            </button>
          </div>
        </div>

        {/* Right: Dyslexia & Speech */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDyslexia}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
              settings.dyslexia
                ? 'bg-white/20 text-white border-white/40 ring-1 ring-white/20'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
            title="Toggle high legibility letter and word spacing"
          >
            🔤 {settings.dyslexia ? 'Dyslexia ON' : 'Dyslexia Spacing'}
          </button>

          {onSpeakThreat && (
            <button
              onClick={() => {
                sound.playClick();
                onSpeakThreat();
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center gap-1 ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/60'
                  : 'bg-zinc-900 text-zinc-200 border-zinc-800 hover:bg-zinc-800'
              }`}
              title="Read threat analysis aloud with voice speech synthesizer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-rose-400' : ''}`} />
              <span>{isSpeaking ? 'Stop Voice' : '🗣️ Read Aloud'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
