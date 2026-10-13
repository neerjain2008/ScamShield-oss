'use client';

import React from 'react';
import { Shield, Volume2, VolumeX, Key, Terminal, Lock } from 'lucide-react';
import { sound } from '@/lib/audio';
import { AccessibilityBar } from './AccessibilityBar';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenSettings: () => void;
  hasCustomKey: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSpeakThreat?: () => void;
  isSpeaking?: boolean;
}

export function Header({
  onOpenSettings,
  hasCustomKey,
  soundEnabled,
  onToggleSound,
  onSpeakThreat,
  isSpeaking,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" showTagline={true} href="/" />
          <span className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#05b292]/10 text-[#05b292] border border-[#05b292]/30">
            Active Intelligence
          </span>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Privacy Guarantee Pill */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-lg">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Tracking • No DB</span>
          </div>

          {/* Accessibility Dropdown Controller */}
          <AccessibilityBar onSpeakThreat={onSpeakThreat} isSpeaking={isSpeaking} />

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={soundEnabled ? 'Mute Audio Effects' : 'Enable Audio Effects'}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-zinc-300" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white transition shadow-sm"
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKey ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{hasCustomKey ? 'Gemma 4 Active' : 'AI Config'}</span>
          </button>

          {/* Hackathon & DigitalOcean Badge */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-blue-950/40 border border-blue-800/50 text-blue-300 px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span>DigitalOcean Ready • MLH Challenge</span>
          </div>
        </div>
      </div>
    </header>
  );
}
