'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ScanLine, Globe2, ArrowUpRight } from 'lucide-react';

export function FeatureSection() {
  const features = [
    {
      title: 'Scam Detection',
      description: 'Detect phishing, fake jobs, investment fraud and payment scams.',
      icon: <ShieldCheck className="w-6 h-6 text-[#00E5A8]" />,
      badge: 'Core Intelligence',
    },
    {
      title: 'Screenshot Analysis',
      description: 'Upload screenshots and identify scam indicators instantly.',
      icon: <ScanLine className="w-6 h-6 text-[#00E5A8]" />,
      badge: 'Client-Side OCR',
    },
    {
      title: 'URL Intelligence',
      description: 'Analyse suspicious websites and domains before visiting.',
      icon: <Globe2 className="w-6 h-6 text-[#00E5A8]" />,
      badge: 'Domain Heuristics',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#00E5A8] font-semibold">
          Comprehensive Defense
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5 mb-4">
          Built for Modern Threat Vectors
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Engineered with deterministic heuristic rules, computer vision OCR, and transparent
          scoring to keep citizens safe from digital fraud.
        </p>
      </div>

      {/* 3 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group relative rounded-3xl bg-[#111827] border border-white/[0.08] p-8 shadow-xl hover:border-[#00E5A8]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5A8]/[0.05] rounded-full blur-2xl group-hover:bg-[#00E5A8]/[0.12] transition-colors pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00E5A8]/40 transition-colors">
                  {feature.icon}
                </div>
                <span className="text-[11px] font-mono text-[#A1A1AA] bg-[#050505] px-2.5 py-1 rounded-full border border-white/[0.06]">
                  {feature.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#00E5A8] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed mt-2 font-normal">
                  {feature.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-semibold text-[#00E5A8] opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Explore Capability</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
export default FeatureSection;
