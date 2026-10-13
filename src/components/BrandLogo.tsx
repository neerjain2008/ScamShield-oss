'use client';

import React from 'react';
import Link from 'next/link';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export function ScamShieldIcon({
  className = 'w-7 h-8',
}: {
  className?: string;
}) {
  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/scamshield-icon.png"
        alt="ScamShield"
        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(5,178,146,0.3)]"
        loading="eager"
      />
    </div>
  );
}

export function BrandLogo({
  size = 'md',
  showTagline = false,
  className = '',
  href,
}: BrandLogoProps) {
  const sizeConfig = {
    sm: {
      icon: 'w-6 h-7',
      title: 'text-sm font-extrabold',
      badge: 'text-[10px] px-2 py-0.5',
      tagline: 'text-[10px]',
      gap: 'gap-2',
    },
    md: {
      icon: 'w-8 h-9',
      title: 'text-lg font-extrabold',
      badge: 'text-[11px] px-2.5 py-0.5',
      tagline: 'text-xs',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'w-11 h-12',
      title: 'text-2xl font-extrabold',
      badge: 'text-xs px-3 py-0.5',
      tagline: 'text-sm',
      gap: 'gap-3',
    },
    xl: {
      icon: 'w-16 h-18',
      title: 'text-4xl sm:text-5xl font-extrabold',
      badge: 'text-sm px-3.5 py-1',
      tagline: 'text-base sm:text-lg',
      gap: 'gap-4',
    },
  }[size];

  const content = (
    <div className={`flex items-center ${sizeConfig.gap} ${className}`}>
      {/* Shield Icon with Chat Bubble, Checkmark and Yellow Dot */}
      <ScamShieldIcon className={sizeConfig.icon} />

      {/* Brand Name + OSS Badge + Tagline */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span
            className={`text-white tracking-tight leading-none ${sizeConfig.title}`}
            style={{ fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            ScamShield
          </span>

          {/* Exact Teal OSS Pill with Dark Typography */}
          <span
            className={`font-bold lowercase leading-none rounded-full bg-[#05b292] text-[#0b1320] shadow-[0_0_12px_rgba(5,178,146,0.25)] ${sizeConfig.badge}`}
          >
            oss
          </span>
        </div>

        {/* Authentic Tagline */}
        {showTagline && (
          <p className={`text-zinc-400 font-normal tracking-wide mt-1 leading-normal ${sizeConfig.tagline}`}>
            Local. Explainable. Community-powered.
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center transition opacity-95 hover:opacity-100">
        {content}
      </Link>
    );
  }

  return content;
}
