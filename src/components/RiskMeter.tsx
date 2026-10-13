'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  riskLevel: 'SAFE' | 'LOW_RISK' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_THREAT';
  riskLabel: string;
}

export function RiskMeter({ score, riskLevel, riskLabel }: RiskMeterProps) {
  const [animatedScore, setAnimatedScore] = useState<number>(0);

  // Smooth counter animation from 0 to score
  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color config based on risk level
  const config = {
    SAFE: {
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    },
    LOW_RISK: {
      color: '#34d399',
      bgGlow: 'rgba(52, 211, 153, 0.15)',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-300',
      badgeBg: 'bg-emerald-500/10',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-300" />,
    },
    SUSPICIOUS: {
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    },
    HIGH_RISK: {
      color: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.2)',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      badgeBg: 'bg-orange-500/10',
      icon: <ShieldAlert className="w-5 h-5 text-orange-400" />,
    },
    CRITICAL_THREAT: {
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.25)',
      borderColor: 'border-rose-500/40',
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/15',
      icon: <Flame className="w-5 h-5 text-rose-400 animate-pulse" />,
    },
  }[riskLevel];

  // SVG circular arc calculations
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc representation (270 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (animatedScore / 100) * arcLength;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#101117] border border-white/[0.08] relative overflow-hidden shadow-xl">
      {/* Background radial glow */}
      <div
        className="absolute w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: config.bgGlow }}
      />

      {/* Circular Gauge */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
          {/* Background track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Glowing Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={config.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${config.color})`,
            }}
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
            {animatedScore}
            <span className="text-xl text-slate-400 font-sans">%</span>
          </span>
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Threat Level Badge */}
      <div
        className={`mt-2 px-3.5 py-1.5 rounded-full border ${config.borderColor} ${config.badgeBg} flex items-center gap-2 shadow-sm`}
      >
        {config.icon}
        <span className={`text-xs font-bold uppercase tracking-wider ${config.textColor}`}>
          {riskLabel}
        </span>
      </div>

      {/* Probabilistic meter subtitle */}
      <p className="text-xs text-slate-400 mt-2 text-center max-w-xs font-sans">
        {score >= 80
          ? 'Extreme scam indicators present. Do not interact.'
          : score >= 60
          ? 'Strong malicious indicators detected. High danger.'
          : score >= 35
          ? 'Suspicious elements detected. Proceed with extreme caution.'
          : 'Low threat profile detected. Safe standard message.'}
      </p>
    </div>
  );
}
