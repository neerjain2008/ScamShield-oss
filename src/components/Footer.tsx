'use client';

import React from 'react';
import Link from 'next/link';

import { BrandLogo } from './BrandLogo';
import { GithubIcon } from './icons/GithubIcon';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050505] py-12 text-xs text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <BrandLogo size="sm" href="/" />
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="text-zinc-400">Zero-Log Client-Side Threat Intelligence</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
            <a
              href="https://github.com/neerjain2008/ScamShield"
              target="_blank"
              rel="noreferrer"
              className="text-[#A1A1AA] hover:text-white transition flex items-center gap-1.5"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>

            <Link href="/privacy" className="text-[#A1A1AA] hover:text-white transition">
              Privacy Policy
            </Link>

            <Link href="/why-local-matters" className="text-[#A1A1AA] hover:text-white transition">
              Why Local Matters
            </Link>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-[#00E5A8] hover:underline"
            >
              Helpline 1930
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 ScamShield OSS. Open source cybersecurity software.</p>
          <p className="flex items-center gap-1">
            <span>Built for hackathon demonstration with</span>
            <span className="text-[#00E5A8]">Zero Data Tracking</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
