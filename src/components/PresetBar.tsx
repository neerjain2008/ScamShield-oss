'use client';

import React from 'react';
import { Zap, AlertTriangle, ShieldCheck, Gift, Globe, DollarSign, Smartphone } from 'lucide-react';
import { sound } from '@/lib/audio';

export interface PresetItem {
  id: string;
  name: string;
  type: 'message' | 'url' | 'screenshot';
  tag: string;
  badgeColor: string;
  icon: React.ReactNode;
  content: string;
  expectedRisk: string;
}

interface PresetBarProps {
  onSelectPreset: (preset: PresetItem) => void;
}

export const PRESETS: PresetItem[] = [
  {
    id: 'amazon_prize',
    name: 'Amazon ₹50k Prize Bait',
    type: 'message',
    tag: 'Critical Risk',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    icon: <Gift className="w-3.5 h-3.5 text-rose-400" />,
    content: "Congratulations! You've won ₹50,000 in Amazon Festival Draw. Click now to claim: http://amazon-prize-winner2026.net. Pay ₹499 registration fee.",
    expectedRisk: '95%',
  },
  {
    id: 'sbi_kyc',
    name: 'Fake SBI KYC SMS',
    type: 'message',
    tag: 'High Urgency',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    icon: <Smartphone className="w-3.5 h-3.5 text-rose-400" />,
    content: "Dear SBI User, your bank account will be blocked within 24 hours due to pending KYC documents. Click immediately to verify account: http://sbi-kyc-update.xyz",
    expectedRisk: '92%',
  },
  {
    id: 'phishing_url_1',
    name: 'amazon-prize-2026.net',
    type: 'url',
    tag: 'Phishing URL',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    icon: <Globe className="w-3.5 h-3.5 text-amber-400" />,
    content: 'amazon-prize-2026.net',
    expectedRisk: '78%',
  },
  {
    id: 'phishing_url_2',
    name: 'netflix-login-verify.top',
    type: 'url',
    tag: 'Credential Trap',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    icon: <Globe className="w-3.5 h-3.5 text-amber-400" />,
    content: 'http://netflix-billing-update-login2026.top',
    expectedRisk: '86%',
  },
  {
    id: 'telegram_job',
    name: 'Telegram YouTube Job',
    type: 'message',
    tag: 'Advance Fee',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    icon: <DollarSign className="w-3.5 h-3.5 text-rose-400" />,
    content: "Urgent Hiring: Part-time work from home! Earn ₹5,000 to ₹10,000 daily by liking YouTube videos. Deposit ₹1,500 security fee to activate your account. Join t.me/daily_task_earning",
    expectedRisk: '89%',
  },
  {
    id: 'legit_alert',
    name: 'Legit GitHub Notice',
    type: 'message',
    tag: 'Legitimate',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
    content: "GitHub Security: A new personal access token was generated from your account. If this was not you, review your active sessions at https://github.com/settings/tokens",
    expectedRisk: '4% (Safe)',
  },
];

export function PresetBar({ onSelectPreset }: PresetBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Quick Hackathon Test Scenarios (1-Click Load)</span>
        </div>
        <span className="text-[11px] text-zinc-500 hidden sm:inline">
          Click any preset to inspect detection logic
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              sound.playClick();
              onSelectPreset(preset);
            }}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 text-left transition group shadow-sm"
          >
            <div className="flex items-center justify-center w-5 h-5 rounded bg-zinc-950/80 border border-zinc-800 group-hover:border-zinc-700">
              {preset.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-1">
                {preset.name}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${preset.badgeColor}`}
            >
              {preset.expectedRisk}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
