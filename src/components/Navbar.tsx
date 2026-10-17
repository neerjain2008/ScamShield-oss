'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './icons/GithubIcon';

interface NavbarProps {
  onOpenSettings: () => void;
  hasCustomKey?: boolean;
}

export function Navbar({ onOpenSettings }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050505]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: ScamShield Logo + OSS badge */}
        <div className="flex items-center gap-3">
          <BrandLogo size="md" href="/" />
        </div>

        {/* Right: GitHub, Privacy, About, Settings Gear */}
        <div className="flex items-center gap-1 sm:gap-4 text-sm font-medium">
          <a
            href="https://github.com/neerjain2008/ScamShield-oss"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition text-xs sm:text-sm"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <Link
            href="/privacy"
            className="px-3 py-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition text-xs sm:text-sm"
          >
            Privacy
          </Link>

          <a
            href="#about"
            className="px-3 py-1.5 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/[0.05] transition text-xs sm:text-sm"
          >
            About
          </a>

          {/* Advanced Settings Gear Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#A1A1AA] hover:text-white transition group cursor-pointer"
            title="Open Advanced Settings"
            aria-label="Open Advanced Settings"
          >
            <Settings className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#00E5A8] group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden md:inline text-xs font-mono">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
