'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, FileSearch, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/audio';
import { GithubIcon } from './icons/GithubIcon';

export function OpenSourceSection() {
  const cards = [
    {
      title: 'Open Source',
      description:
        '100% transparent codebase licensed under Apache/MIT. Inspect every heuristic rule, weight, and privacy guarantee yourself.',
      icon: <Code2 className="w-6 h-6 text-[#00E5A8]" />,
    },
    {
      title: 'Community Driven',
      description:
        'Continuously improved by cybersecurity researchers, open-source contributors, and digital safety advocates.',
      icon: <Users className="w-6 h-6 text-[#00E5A8]" />,
    },
    {
      title: 'Transparent Detection Logic',
      description:
        'Zero black-box mystery. Every scam score is traceable to explicit linguistic patterns, URL anomalies, and psychological triggers.',
      icon: <FileSearch className="w-6 h-6 text-[#00E5A8]" />,
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-[#00E5A8] font-semibold">
          Transparency & Integrity
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2.5 mb-4">
          Built in Public
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          ScamShield OSS believes security tools protecting ordinary citizens must never be locked
          behind proprietary surveillance walls.
        </p>
      </div>

      {/* 3 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-3xl bg-[#111827] border border-white/[0.08] p-8 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{card.title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed font-normal">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Prominent GitHub Button */}
      <div className="flex flex-col items-center justify-center text-center">
        <a
          href="https://github.com/neerjain2008/ScamShield"
          target="_blank"
          rel="noreferrer"
          onClick={() => sound.playClick()}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-[#050505] hover:bg-zinc-200 font-bold text-sm sm:text-base transition-all duration-200 shadow-xl shadow-white/5 active:scale-[0.98] cursor-pointer"
        >
          <GithubIcon className="w-5 h-5 text-[#050505]" />
          <span>View GitHub Repository</span>
          <ArrowRight className="w-4 h-4 text-[#050505]" />
        </a>
        <p className="text-xs text-[#A1A1AA] mt-3 font-mono">
          Star us on GitHub • Pull requests & new scam rules welcome
        </p>
      </div>
    </section>
  );
}
export default OpenSourceSection;
