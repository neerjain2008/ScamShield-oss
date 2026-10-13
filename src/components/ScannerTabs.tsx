'use client';

import React from 'react';
import { MessageSquare, Link2, Camera } from 'lucide-react';
import { sound } from '@/lib/audio';

export type ScannerTabType = 'message' | 'url' | 'screenshot';

interface ScannerTabsProps {
  activeTab: ScannerTabType;
  onChangeTab: (tab: ScannerTabType) => void;
}

export function ScannerTabs({ activeTab, onChangeTab }: ScannerTabsProps) {
  const tabs = [
    {
      id: 'message' as ScannerTabType,
      label: 'Message Scanner',
      icon: MessageSquare,
      badge: 'SMS / Chat / Email',
      desc: 'Heuristic keyword & urgency engine',
    },
    {
      id: 'url' as ScannerTabType,
      label: 'URL Scanner',
      icon: Link2,
      badge: 'Domain / Links',
      desc: 'Structural phishing & brand spoof analysis',
    },
    {
      id: 'screenshot' as ScannerTabType,
      label: 'Screenshot Scanner',
      icon: Camera,
      badge: 'OCR In-Browser',
      desc: 'Tesseract.js image-to-threat extraction',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              onChangeTab(tab.id);
            }}
            className={`flex items-start gap-3 p-3 rounded-lg text-left transition relative overflow-hidden ${
              isActive
                ? 'bg-zinc-800/80 text-white border border-white/20 shadow-lg'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent'
            }`}
          >
            {isActive && (
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l"></span>
            )}
            <div
              className={`p-2 rounded-lg ${
                isActive
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-zinc-950 text-zinc-400 border border-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-sm tracking-tight text-slate-100">
                  {tab.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {tab.desc}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
