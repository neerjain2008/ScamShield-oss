'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '@/lib/audio';

interface HeroSectionProps {
  onAnalyseNow: () => void;
  onViewDemo: () => void;
}

export function HeroSection({ onAnalyseNow, onViewDemo }: HeroSectionProps) {
  return (
    <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Subtle ambient cyber glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#00E5A8]/[0.07] rounded-full blur-[100px] pointer-events-none" />

      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827] border border-white/[0.08] text-xs font-medium text-[#A1A1AA] mb-6 shadow-lg shadow-black/40 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-[#00E5A8] animate-pulse" />
        <span className="text-zinc-200">Next-Gen Scam Intelligence</span>
        <span className="text-zinc-500">•</span>
        <span className="font-mono text-[#00E5A8] text-[11px]">v2.0 OSS</span>
      </motion.div>

      {/* Primary Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6"
      >
        Detect Scams <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#A1A1AA]">
          Before They Cost You
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed mb-8 font-normal"
      >
        Analyse suspicious messages, screenshots, phishing links, and fake job offers in seconds.
      </motion.p>

      {/* Action CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4"
      >
        <button
          onClick={() => {
            sound.playClick();
            onAnalyseNow();
          }}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#00E5A8] hover:bg-[#00c993] text-[#050505] font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_30px_rgba(0,229,168,0.35)] hover:shadow-[0_0_40px_rgba(0,229,168,0.5)] active:scale-[0.98] cursor-pointer"
        >
          <span>Analyse Now</span>
          <ArrowRight className="w-4 h-4 text-[#050505]" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onViewDemo();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#111827] hover:bg-zinc-800/80 border border-white/[0.08] hover:border-white/20 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>View Demo</span>
        </button>
      </motion.div>
    </section>
  );
}
export default HeroSection;
