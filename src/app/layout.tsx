import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ScamShield OSS | Open Source Scam Intelligence',
  description: 'Deterministic scam detection engine with URL heuristics, in-browser Tesseract OCR screenshot analysis, and Google Gemma 4 open-weights AI threat synthesis.',
  icons: {
    icon: '/scamshield-icon.png',
    apple: '/scamshield-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-white/20 selection:text-white">
        {children}
      </body>
    </html>
  );
}
