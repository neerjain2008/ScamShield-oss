'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardEdit, Cpu, ShieldCheck } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Paste Message',
      subtitle: 'Input SMS, job offer, or upload a screenshot to extract text locally.',
      icon: <ClipboardEdit className="w-6 h-6 text-[#00E5A8]" />,
    },
    {
      step: '02',
      title: 'AI Analyses Risk',
      subtitle: 'Engine matches heuristic triggers, urgency traps, and queries Gemma 4.',
      icon: <Cpu className="w-6 h-6 text-[#00E5A8]" />,
    },
    {
      step: '03',
      title: 'Get Scam Score & Safety Advice',
      subtitle: 'Receive instant risk percentage, detected signals, and actionable advice.',
      icon: <ShieldCheck className="w-6 h-6 text-[#00E5A8]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-b border-white/[0.06] bg-[#050505] relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#00E5A8]/[0.03] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00E5A8] font-semibold">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5 mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#A1A1AA]">
            Understand threats in seconds without compromising your privacy or data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative rounded-3xl bg-[#111827] border border-white/[0.08] p-7 sm:p-8 flex flex-col justify-between shadow-xl group hover:border-[#00E5A8]/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00E5A8]/40 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black font-mono text-zinc-700 group-hover:text-[#00E5A8]/50 transition-colors">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-[#00E5A8] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed font-normal">
                  {item.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] font-mono text-[#A1A1AA] flex items-center justify-between">
                <span>Step {idx + 1} of 3</span>
                <span className="text-[#00E5A8]">Instant</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default HowItWorksSection;
