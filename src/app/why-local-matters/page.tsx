'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Laptop, Eye, Image as ImageIcon, Globe, Shield } from 'lucide-react';
import { ElegantShape } from '@/components/ui/shape-landing-hero';
import { BrandLogo, ScamShieldIcon } from '@/components/BrandLogo';

export default function WhyLocalMattersPage() {
  const pillars = [
    {
      icon: Laptop,
      title: 'Messages stay local',
      description:
        'When the analyzer runs on this device, messages and screenshots are processed locally by Ollama and OCR. A remote analyzer changes that boundary.',
    },
    {
      icon: Eye,
      title: 'Every score is explainable',
      description:
        'See the tactics, URL signals, and community patterns behind a risk score instead of receiving a black-box verdict.',
    },
    {
      icon: ImageIcon,
      title: 'Screenshots work privately',
      description:
        'Optical character recognition extracts text directly in your browser or local server without shipping images to third-party vision APIs.',
    },
    {
      icon: Globe,
      title: 'External lookups are opt-in',
      description:
        'URL intelligence, community threat checks, and cloud models require explicit confirmation before making network requests.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* Floating 3D Geometric Gradient Capsules (matching screenshot 2) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.2}
          width={450}
          height={110}
          rotate={14}
          y={15}
          gradient="from-slate-700/[0.16]"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[12%]"
        />
        <ElegantShape
          delay={0.4}
          width={420}
          height={100}
          rotate={-16}
          y={15}
          gradient="from-rose-900/[0.22]"
          className="right-[-8%] md:right-[-2%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.5}
          width={320}
          height={80}
          rotate={-8}
          y={15}
          gradient="from-amber-600/[0.20]"
          className="right-[10%] md:right-[15%] top-[8%] md:top-[12%]"
        />
        <ElegantShape
          delay={0.3}
          width={280}
          height={75}
          rotate={22}
          y={15}
          gradient="from-slate-800/[0.16]"
          className="left-[6%] md:left-[10%] bottom-[8%] md:bottom-[12%]"
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full border-b border-white/[0.04] bg-[#050505]/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </Link>
            <BrandLogo size="sm" href="/" />
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>PRIVACY BY DEFAULT</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto mb-16">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14151b] border border-white/[0.08] text-xs font-medium backdrop-blur-md shadow-lg shadow-black/40">
            <ScamShieldIcon className="w-3.5 h-4" />
            <span className="text-zinc-300">Understand before you act</span>
          </div>

          {/* Large Headline with Lavender-Rose-Peach gradient on "matters." */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Why local <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9bb5fa] via-[#e28dad] to-[#fca5a5]">
              matters.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
            ScamShield is designed to help you slow down, see the evidence, and keep sensitive content under your control.
          </p>
        </div>

        {/* 2x2 Grid of Dark Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto w-full">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-7 rounded-2xl bg-[#101117]/80 hover:bg-[#14151e]/90 border border-white/[0.08] hover:border-white/[0.14] transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-white/5"
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors mb-4">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-zinc-200 transition font-semibold text-xs shadow-xl shadow-white/5 active:scale-95"
          >
            <span>Scan suspicious content now</span>
            <span>→</span>
          </Link>
        </div>
      </main>

      {/* Subtle bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
}
