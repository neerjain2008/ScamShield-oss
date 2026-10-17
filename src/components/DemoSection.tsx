'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Gift, AlertCircle, Briefcase, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '@/lib/audio';

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  expectedScore: string;
  expectedLevel: string;
  badgeColor: string;
  icon: React.ReactNode;
  content: string;
  explanation: string;
}

interface DemoSectionProps {
  onSelectDemo: (demo: DemoScenario) => void;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'amazon_prize',
    title: 'Amazon ₹50k Prize Scam',
    category: 'Prize Bait / Phishing',
    expectedScore: '95%',
    expectedLevel: 'CRITICAL',
    badgeColor: 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10',
    icon: <Gift className="w-5 h-5 text-[#FF4D4D]" />,
    content:
      "Congratulations! You've won ₹50,000 Amazon Festival Lucky Draw. Claim now within 15 minutes: http://amazon-prize-2026.net. Pay ₹499 registration fee to verify identity.",
    explanation: 'Urgency countdown + advance registration fee + spoofed domain.',
  },
  {
    id: 'sbi_kyc',
    title: 'Fake SBI KYC Update',
    category: 'Banking Urgency / Credential Theft',
    expectedScore: '92%',
    expectedLevel: 'HIGH',
    badgeColor: 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10',
    icon: <AlertCircle className="w-5 h-5 text-[#FF4D4D]" />,
    content:
      'Dear SBI User, your bank account will be suspended within 24 hours due to pending KYC verification. Click immediately to update documents: http://sbi-kyc-verify.xyz',
    explanation: 'Account suspension threat + phishing URL with suspicious .xyz TLD.',
  },
  {
    id: 'telegram_job',
    title: 'Telegram Work-from-Home Scam',
    category: 'Employment Fraud / Advance Fee',
    expectedScore: '89%',
    expectedLevel: 'HIGH',
    badgeColor: 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10',
    icon: <Briefcase className="w-5 h-5 text-amber-400" />,
    content:
      'Part-time job offer! Earn ₹8,000 daily by liking YouTube videos. Deposit ₹1,500 security registration fee to activate tasks. Join t.me/fast_earn_2026',
    explanation: 'Unrealistic daily earnings promise + required upfront activation deposit.',
  },
  {
    id: 'fake_investment',
    title: 'Fake Investment Opportunity',
    category: 'Ponzi / High-Yield Fraud',
    expectedScore: '94%',
    expectedLevel: 'CRITICAL',
    badgeColor: 'text-[#FF4D4D] border-[#FF4D4D]/30 bg-[#FF4D4D]/10',
    icon: <TrendingUp className="w-5 h-5 text-[#FF4D4D]" />,
    content:
      'Exclusive VIP Crypto Club: Guaranteed 300% profit in 7 days! Invest ₹5,000 today and receive ₹20,000 weekly returns. Instant withdrawal: http://crypto-wealth-fund2026.top',
    explanation: 'Guaranteed impossible returns + high-risk TLD + fake investment fund.',
  },
];

export function DemoSection({ onSelectDemo }: DemoSectionProps) {
  return (
    <section id="demo-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-white/[0.08] text-xs font-mono text-amber-400 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Hackathon Demo</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Experience Live Detection
        </h2>
        <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
          Select any real-world scam scenario below to test ScamShield&apos;s heuristic scoring,
          threat breakdown, and safety advice in one click.
        </p>
      </div>

      {/* 4 Clickable Demo Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_SCENARIOS.map((scenario, idx) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            onClick={() => {
              sound.playClick();
              onSelectDemo(scenario);
            }}
            className="group relative rounded-3xl bg-[#111827] border border-white/[0.08] hover:border-[#00E5A8]/50 p-6 sm:p-7 shadow-xl hover:shadow-[0_0_35px_rgba(0,229,168,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                    {scenario.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00E5A8] transition-colors">
                      {scenario.title}
                    </h3>
                    <p className="text-xs text-[#A1A1AA]">{scenario.category}</p>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold ${scenario.badgeColor}`}
                >
                  {scenario.expectedScore} Risk
                </div>
              </div>

              {/* Message snippet */}
              <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.06] text-xs text-zinc-300 font-sans leading-relaxed line-clamp-3">
                &ldquo;{scenario.content}&rdquo;
              </div>

              <p className="text-[11px] text-[#A1A1AA] mt-3 flex items-center gap-1.5">
                <span className="font-semibold text-zinc-300">Vectors:</span>
                <span>{scenario.explanation}</span>
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#00E5A8]">
              <span>Run Live Analysis</span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Test Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
export default DemoSection;
