'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Cpu,
  Layers,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';
import { AnalysisSidebar } from '@/components/AnalysisSidebar';
import { ScreenshotScanner } from '@/components/ScreenshotScanner';
import { ResultPanel } from '@/components/ResultPanel';
import { QuickA11yBanner } from '@/components/QuickA11yBanner';
import { ElegantShape } from '@/components/ui/shape-landing-hero';
import { analyzeScamContent, AnalysisResult } from '@/lib/scamEngine';
import { sound } from '@/lib/audio';
import { BrandLogo, ScamShieldIcon } from '@/components/BrandLogo';

export type ScannerTabType = 'message' | 'screenshot' | 'url';

export default function ScamShieldHome() {
  const [activeTab, setActiveTab] = useState<ScannerTabType>('message');
  const [messageInput, setMessageInput] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [screenshotText, setScreenshotText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAnalyzedInput, setCurrentAnalyzedInput] = useState<string>('');

  // Sidebar settings state
  const [selectedModel, setSelectedModel] = useState<string>('gemma-4:31b');
  const [useUrlScan, setUseUrlScan] = useState<boolean>(false);
  const [ocrLanguage, setOcrLanguage] = useState<string>('eng');
  const [apiKey, setApiKey] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Load API key & settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey =
        localStorage.getItem('scamshield_gemma_api_key') ||
        localStorage.getItem('scamshield_gemini_api_key') ||
        '';
      setApiKey(savedKey);

      const savedSound = localStorage.getItem('scamshield_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
        sound.enabled = savedSound === 'true';
      }
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scamshield_gemma_api_key', key);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (typeof window !== 'undefined') {
      localStorage.setItem('scamshield_sound_enabled', String(next));
    }
  };

  const handleSpeakThreat = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!analysisResult) return;
    const indicatorText = analysisResult.indicators.map((i) => i.title).join(', ');
    const textToRead = `ScamShield Threat Analysis. Risk Score: ${analysisResult.riskScore} percent, ${analysisResult.riskLabel}. Detected reasons: ${indicatorText || 'none'}. ${analysisResult.explanation?.summary}. Recommended protective steps: ${analysisResult.explanation?.actionItems.join('. ')}.`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getActiveInput = useCallback(() => {
    switch (activeTab) {
      case 'message':
        return messageInput;
      case 'url':
        return urlInput;
      case 'screenshot':
        return screenshotText;
      default:
        return '';
    }
  }, [activeTab, messageInput, urlInput, screenshotText]);

  // Main Analysis Pipeline
  const handleAnalyze = useCallback(
    async (forcedInput?: string, forcedType?: ScannerTabType) => {
      const rawContent = (forcedInput !== undefined ? forcedInput : getActiveInput()).trim();
      const type = forcedType || activeTab;

      if (!rawContent) {
        sound.playClick();
        return;
      }

      try {
        setIsAnalyzing(true);
        sound.playScan();

        // 1. Instant deterministic heuristic evaluation
        const initialEvaluation = analyzeScamContent(rawContent, type);
        setAnalysisResult(initialEvaluation);
        setCurrentAnalyzedInput(rawContent);

        // Scroll smoothly to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);

        // 2. Query dynamic Gemma 4 / Hermes synthesis
        try {
          const res = await fetch('/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: rawContent,
              riskScore: initialEvaluation.riskScore,
              riskLevel: initialEvaluation.riskLevel,
              indicators: initialEvaluation.indicators,
              apiKey: apiKey || undefined,
              model: selectedModel,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && data.explanation) {
              setAnalysisResult((prev) =>
                prev ? { ...prev, explanation: data.explanation } : null
              );
            }
          }
        } catch (apiErr) {
          console.warn('AI endpoint unreachable, local heuristic breakdown active:', apiErr);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [getActiveInput, activeTab, apiKey, selectedModel]
  );

  // Quick Preset Scenarios for Hackathon Demo
  const presets = [
    {
      id: 'prize',
      title: '🎁 Amazon ₹50k Prize',
      type: 'message' as ScannerTabType,
      content:
        "Congratulations! You've won ₹50,000 Amazon Festival Lucky Draw. Claim now within 15 minutes: http://amazon-prize-2026.net",
    },
    {
      id: 'kyc',
      title: '🚨 Fake SBI Bank KYC',
      type: 'message' as ScannerTabType,
      content:
        'Dear SBI User, your account will be suspended within 24 hours due to pending KYC. Click immediately to update documents: http://sbi-kyc-verify.xyz',
    },
    {
      id: 'job',
      title: '💼 Telegram Work-from-Home',
      type: 'message' as ScannerTabType,
      content:
        'Part-time job offer! Earn ₹8,000 daily by liking YouTube videos. Deposit ₹1,500 registration fee to activate tasks. Join t.me/fast_earn_2026',
    },
    {
      id: 'clean',
      title: '✅ Clean GitHub Alert',
      type: 'message' as ScannerTabType,
      content:
        'GitHub Security: A new personal access token was generated. Review your active sessions at https://github.com/settings/tokens',
    },
  ];

  const handleSelectPreset = (preset: (typeof presets)[0]) => {
    sound.playClick();
    setActiveTab(preset.type);
    if (preset.type === 'message') setMessageInput(preset.content);
    if (preset.type === 'url') setUrlInput(preset.content);
    if (preset.type === 'screenshot') setScreenshotText(preset.content);
    handleAnalyze(preset.content, preset.type);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 flex flex-col relative overflow-hidden font-sans selection:bg-white/20 selection:text-white">
      {/* Floating 3D Geometric Gradient Capsules (matching screenshot 1) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top Left: Deep slate-indigo pill */}
        <ElegantShape
          delay={0.2}
          width={480}
          height={115}
          rotate={14}
          y={15}
          gradient="from-slate-700/[0.18]"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[12%]"
        />
        {/* Top Right: Warm bronze / amber pill (Screenshot 1 top-right) */}
        <ElegantShape
          delay={0.4}
          width={450}
          height={110}
          rotate={-16}
          y={15}
          gradient="from-amber-600/[0.22]"
          className="right-[-8%] md:right-[-2%] top-[8%] md:top-[12%]"
        />
        {/* Bottom Right: Deep wine / crimson burgundy pill (Screenshot 1 bottom-right) */}
        <ElegantShape
          delay={0.5}
          width={380}
          height={95}
          rotate={-8}
          y={15}
          gradient="from-rose-900/[0.25]"
          className="right-[-5%] md:right-[2%] top-[65%] md:top-[70%]"
        />
        {/* Bottom Left: Subtle slate pill */}
        <ElegantShape
          delay={0.3}
          width={300}
          height={80}
          rotate={22}
          y={15}
          gradient="from-slate-800/[0.18]"
          className="left-[4%] md:left-[8%] bottom-[8%] md:bottom-[12%]"
        />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 w-full border-b border-white/[0.04] bg-[#050505]/70 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08]"
              title="Toggle Analysis Settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <BrandLogo size="md" href="/" />
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/why-local-matters"
              className="text-slate-400 hover:text-white transition flex items-center gap-1 font-medium"
            >
              <span>Why local matters</span>
              <span className="text-slate-600">→</span>
            </Link>

            <Link
              href="/privacy"
              className="hidden sm:flex text-slate-400 hover:text-white transition items-center gap-1 font-medium"
            >
              <span>Privacy</span>
            </Link>

            <a
              href="https://cloud.digitalocean.com/apps/new"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition font-mono text-[11px]"
            >
              <span>Deploy</span>
              <span className="text-zinc-400">⋮</span>
            </a>
          </div>
        </div>
      </header>

      {/* Accessibility Toolbar */}
      <QuickA11yBanner
        onSpeakThreat={analysisResult ? handleSpeakThreat : undefined}
        isSpeaking={isSpeaking}
      />

      {/* Main Container Layout: Left Sidebar + Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop & Mobile Left Sidebar */}
        <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 lg:sticky lg:top-20`}>
          <AnalysisSidebar
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            useUrlScan={useUrlScan}
            onToggleUrlScan={() => setUseUrlScan(!useUrlScan)}
            ocrLanguage={ocrLanguage}
            onSelectOcrLanguage={setOcrLanguage}
            apiKey={apiKey}
            onSaveApiKey={handleSaveApiKey}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        </div>

        {/* Center / Main Content Area */}
        <main className="flex-1 w-full max-w-3xl mx-auto space-y-8">
          {/* Hero Section matching Screenshot 1 */}
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#14151b] border border-white/[0.08] text-xs font-medium backdrop-blur-md shadow-md">
              <ScamShieldIcon className="w-4 h-4.5" />
              <span className="text-zinc-300">Local-first scam intelligence</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#05b292] text-[#0b1320] text-[9px] font-bold lowercase">oss</span>
            </div>

            {/* Massive Bold Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Scan. Understand. <br />
              Stay safe.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              Check suspicious messages, screenshots, job offers, and links before you trust them.
            </p>

            {/* Info Callout Card */}
            <div className="p-4 rounded-xl bg-[#13141a]/90 border border-white/[0.07] text-xs text-zinc-400 leading-relaxed backdrop-blur-sm">
              <p>
                Text and screenshot analysis stay on this device when Ollama is available. URLScan is
                an optional external network lookup and is off by default.
              </p>
            </div>
          </div>

          {/* Quick Preset Scenario Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              1-Click Test Scenarios:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="px-3 py-1.5 rounded-full bg-[#14151d] hover:bg-[#1a1c26] border border-white/[0.08] hover:border-white/30 text-xs text-zinc-300 hover:text-white transition font-medium"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Input Selector Radio Tabs */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-400">
              What would you like to check?
            </label>
            <div className="flex items-center gap-6">
              {[
                { id: 'message', label: 'Message' },
                { id: 'screenshot', label: 'Screenshot' },
                { id: 'url', label: 'URL' },
              ].map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id as ScannerTabType);
                    }}
                    className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer select-none"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition ${
                        isSelected
                          ? 'border border-rose-500'
                          : 'border border-zinc-600'
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      )}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Analysis Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#101117]/90 border border-white/[0.08] shadow-2xl space-y-5 backdrop-blur-xl relative overflow-hidden">
            {/* Active scanline bar during analysis */}
            {isAnalyzing && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 animate-pulse" />
            )}

            {/* Dynamic Card Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-zinc-300 tracking-tight">
                {activeTab === 'message' && 'Paste the suspicious message'}
                {activeTab === 'screenshot' && 'Upload screenshot for on-device OCR'}
                {activeTab === 'url' && 'Paste suspicious URL'}
              </h2>
              {getActiveInput().length > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setMessageInput('');
                    setUrlInput('');
                    setScreenshotText('');
                    setAnalysisResult(null);
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Input Container */}
            <div>
              {activeTab === 'message' && (
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Paste an SMS, WhatsApp message, email, or job offer here..."
                  rows={6}
                  className="w-full bg-[#161720] text-zinc-100 placeholder:text-zinc-600 rounded-xl border border-white/[0.08] p-4 text-sm leading-relaxed outline-none focus:border-white/30 transition resize-y font-sans"
                />
              )}

              {activeTab === 'screenshot' && (
                <div className="bg-[#161720] rounded-xl border border-white/[0.08] p-4">
                  <ScreenshotScanner
                    onTextExtracted={(txt) => {
                      setScreenshotText(txt);
                      handleAnalyze(txt, 'screenshot');
                    }}
                    extractedText={screenshotText}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="e.g. amazon-login-verify2026.net or sbi-kyc-update.xyz"
                    className="w-full bg-[#161720] text-zinc-100 placeholder:text-zinc-600 rounded-xl border border-white/[0.08] p-4 text-sm outline-none focus:border-white/30 transition font-mono"
                  />
                  <p className="text-[11px] text-zinc-500">
                    URLs are parsed locally for typo-squatting, hyphen spoofing, and high-risk TLDs.
                  </p>
                </div>
              )}
            </div>

            {/* Large Full-Width White CTA Button */}
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !getActiveInput().trim()}
              className={`w-full py-3.5 rounded-full font-medium text-sm transition-all duration-200 shadow-xl flex items-center justify-center gap-2 ${
                isAnalyzing || !getActiveInput().trim()
                  ? 'bg-white/40 text-black/60 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-zinc-200 shadow-white/5 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>Evaluating heuristic signals...</span>
                </>
              ) : (
                <span>Analyze risk</span>
              )}
            </button>

            {/* Disclaimer Under Button */}
            <p className="text-center text-[11px] text-zinc-500 leading-relaxed font-light">
              No data is stored by ScamShield. Review URLScan&apos;s privacy policy before enabling it.
            </p>
          </div>

          {/* Results Dashboard Section */}
          {analysisResult && (
            <div ref={resultsRef} className="pt-4 scroll-mt-20">
              <ResultPanel
                result={analysisResult}
                onScanAnother={() => {
                  sound.playClick();
                  setMessageInput('');
                  setUrlInput('');
                  setScreenshotText('');
                  setAnalysisResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                rawInput={currentAnalyzedInput}
              />
            </div>
          )}
        </main>
      </div>

      {/* Minimalist SaaS Footer */}
      <footer className="border-t border-white/[0.04] bg-[#050505]/80 py-8 mt-20 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showTagline={true} href="/" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <Link href="/why-local-matters" className="hover:text-white transition">
              Why Local Matters
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy (Zero-Log)
            </Link>
            <span>•</span>
            <span>Google Gemma 4 (Apache 2.0)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
