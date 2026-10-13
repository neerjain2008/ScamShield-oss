'use client';

import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Eye,
  Volume2,
  VolumeX,
  Type,
  RotateCcw,
  Sparkles,
  Accessibility,
  Check,
} from 'lucide-react';
import { sound } from '@/lib/audio';

export type TextScale = 'normal' | 'large' | 'xlarge' | 'max';
export type ContrastMode = 'default' | 'high-dark' | 'high-light';

export interface AccessibilitySettings {
  textScale: TextScale;
  contrast: ContrastMode;
  dyslexia: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  textScale: 'normal',
  contrast: 'default',
  dyslexia: false,
  reducedMotion: false,
};

interface AccessibilityBarProps {
  onSpeakThreat?: () => void;
  isSpeaking?: boolean;
}

export function AccessibilityBar({ onSpeakThreat, isSpeaking }: AccessibilityBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS);

  // Apply settings to <html> root element
  const applySettings = (s: AccessibilitySettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    root.setAttribute('data-text-scale', s.textScale);
    root.setAttribute('data-contrast', s.contrast);
    root.setAttribute('data-dyslexia', String(s.dyslexia));
    root.setAttribute('data-reduced-motion', String(s.reducedMotion));

    // Direct inline fallback to ensure 100% immediate effect in all browsers
    if (s.textScale === 'normal') root.style.fontSize = '16px';
    if (s.textScale === 'large') root.style.fontSize = '19px';
    if (s.textScale === 'xlarge') root.style.fontSize = '22px';
    if (s.textScale === 'max') root.style.fontSize = '26px';
  };

  // Load from localStorage on mount and apply immediately
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('scamshield_a11y_settings');
      if (stored) {
        const parsed: AccessibilitySettings = JSON.parse(stored);
        setSettings(parsed);
        applySettings(parsed);
      } else {
        applySettings(DEFAULT_SETTINGS);
      }
    } catch {
      applySettings(DEFAULT_SETTINGS);
    }
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    val: AccessibilitySettings[K]
  ) => {
    sound.playClick();
    const next = { ...settings, [key]: val };
    setSettings(next);
    applySettings(next);
    try {
      localStorage.setItem('scamshield_a11y_settings', JSON.stringify(next));
    } catch {
      // safe ignore
    }
  };

  const resetSettings = () => {
    sound.playClick();
    setSettings(DEFAULT_SETTINGS);
    applySettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem('scamshield_a11y_settings', JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // safe ignore
    }
  };

  return (
    <>
      {/* 1. Header Button */}
      <div className="relative">
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          aria-expanded={isOpen}
          aria-label="Open Accessibility Toolbar (Text Size, Contrast, Screen Reader)"
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition shadow-sm ${
            settings.contrast !== 'default' || settings.textScale !== 'normal' || settings.dyslexia
              ? 'bg-white/20 text-white border-white/40 ring-1 ring-white/20'
              : 'bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white'
          }`}
          title="Accessibility (Text Size, Contrast, Dyslexia Mode)"
        >
          <Accessibility className="w-3.5 h-3.5 text-zinc-300" />
          <span className="font-semibold">A11y</span>
          {settings.contrast !== 'default' || settings.textScale !== 'normal' ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          ) : null}
        </button>

        {/* Slide-out Accessibility Dropdown Menu */}
        {isOpen && (
          <div
            role="dialog"
            aria-label="Accessibility Settings"
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#101117] p-5 shadow-2xl border border-white/[0.08] z-50 text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-zinc-300" />
                <span className="font-bold text-sm text-white">Accessibility & Vision</span>
              </div>
              <button
                onClick={resetSettings}
                className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition"
                title="Reset to default settings"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Text Magnifier Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Text Magnifier</span>
                </label>
                <span className="font-mono text-[11px] text-zinc-300 uppercase font-bold">
                  {settings.textScale === 'normal' && '100% Normal'}
                  {settings.textScale === 'large' && '115% Large'}
                  {settings.textScale === 'xlarge' && '130% X-Large'}
                  {settings.textScale === 'max' && '145% Maximum'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <button
                  onClick={() => updateSetting('textScale', 'normal')}
                  className={`py-2 px-2 rounded-lg text-center font-bold transition flex items-center justify-center ${
                    settings.textScale === 'normal'
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs">100%</span>
                </button>

                <button
                  onClick={() => updateSetting('textScale', 'large')}
                  className={`py-2 px-2 rounded-lg text-center font-bold transition flex items-center justify-center ${
                    settings.textScale === 'large'
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-sm">115%</span>
                </button>

                <button
                  onClick={() => updateSetting('textScale', 'xlarge')}
                  className={`py-2 px-2 rounded-lg text-center font-bold transition flex items-center justify-center ${
                    settings.textScale === 'xlarge'
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-base">130%</span>
                </button>

                <button
                  onClick={() => updateSetting('textScale', 'max')}
                  className={`py-2 px-2 rounded-lg text-center font-bold transition flex items-center justify-center ${
                    settings.textScale === 'max'
                      ? 'bg-white text-black shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-lg">145%</span>
                </button>
              </div>
            </div>

            {/* 2. Contrast Modes */}
            <div className="space-y-2">
              <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Contrast Profiles (WCAG AAA)</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting('contrast', 'default')}
                  className={`p-2.5 rounded-xl text-left border transition flex flex-col items-center gap-1 text-center ${
                    settings.contrast === 'default'
                      ? 'border-white/40 bg-white/10 text-white ring-1 ring-white/20'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm">🌙</span>
                  <span className="font-semibold text-[11px]">Cyber Dark</span>
                  <span className="text-[9px] text-zinc-500">Standard</span>
                </button>

                <button
                  onClick={() => updateSetting('contrast', 'high-dark')}
                  className={`p-2.5 rounded-xl text-left border transition flex flex-col items-center gap-1 text-center ${
                    settings.contrast === 'high-dark'
                      ? 'border-yellow-400 bg-yellow-950/40 text-yellow-200 ring-1 ring-yellow-400'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm">⬛</span>
                  <span className="font-semibold text-[11px]">High Dark</span>
                  <span className="text-[9px] text-yellow-400 font-mono">AAA 7:1</span>
                </button>

                <button
                  onClick={() => updateSetting('contrast', 'high-light')}
                  className={`p-2.5 rounded-xl text-left border transition flex flex-col items-center gap-1 text-center ${
                    settings.contrast === 'high-light'
                      ? 'border-black bg-white text-black ring-1 ring-black'
                      : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-sm">☀️</span>
                  <span className="font-semibold text-[11px] text-zinc-900">High Light</span>
                  <span className="text-[9px] text-zinc-600 font-mono">AAA 7:1</span>
                </button>
              </div>
            </div>

            {/* 3. Dyslexia / Enhanced Reading Spacing */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-200">Dyslexia / Reading Spacing</p>
                <p className="text-[11px] text-zinc-400">
                  Increases letter, word, and line spacing
                </p>
              </div>
              <button
                onClick={() => updateSetting('dyslexia', !settings.dyslexia)}
                aria-pressed={settings.dyslexia}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.dyslexia ? 'bg-white' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full transition-transform transform shadow-sm ${
                    settings.dyslexia ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* 4. Reduced Motion */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/70 border border-zinc-800">
              <div>
                <p className="font-semibold text-zinc-200">Reduced Motion</p>
                <p className="text-[11px] text-zinc-400">
                  Halts scanlines and gauge animations
                </p>
              </div>
              <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                aria-pressed={settings.reducedMotion}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  settings.reducedMotion ? 'bg-white' : 'bg-zinc-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full transition-transform transform shadow-sm ${
                    settings.reducedMotion ? 'translate-x-5 bg-black' : 'translate-x-0 bg-white'
                  }`}
                />
              </button>
            </div>

            {/* 5. Audio Threat Readout CTA */}
            {onSpeakThreat && (
              <div className="pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSpeakThreat();
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce text-rose-400' : 'text-zinc-300'}`} />
                  <span>{isSpeaking ? 'Stop Threat Audio Readout' : 'Listen to Threat Audio Readout'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Floating Quick Accessibility Button (Bottom-Right Corner) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(!isOpen);
          }}
          aria-label="Toggle Accessibility Menu"
          className="w-12 h-12 rounded-full bg-white hover:bg-zinc-200 text-black shadow-xl shadow-black/40 flex items-center justify-center transition transform hover:scale-105 active:scale-95 border border-white/20"
          title="Accessibility Toolbar (Font Zoom, High Contrast, Voice Readout)"
        >
          <Accessibility className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </>
  );
}
