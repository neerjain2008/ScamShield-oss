'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AnalysisCard, ScannerTabType } from '@/components/AnalysisCard';
import { SecurityDashboardResult } from '@/components/SecurityDashboardResult';
import { FeatureSection } from '@/components/FeatureSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { DemoSection, DemoScenario } from '@/components/DemoSection';
import { OpenSourceSection } from '@/components/OpenSourceSection';
import { Footer } from '@/components/Footer';
import { AdvancedSettingsModal } from '@/components/AdvancedSettingsModal';
import { analyzeScamContent, AnalysisResult } from '@/lib/scamEngine';
import { sound } from '@/lib/audio';

export default function ScamShieldHome() {
  // Input & Tab states
  const [activeTab, setActiveTab] = useState<ScannerTabType>('message');
  const [messageInput, setMessageInput] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [screenshotText, setScreenshotText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentAnalyzedInput, setCurrentAnalyzedInput] = useState<string>('');

  // Hidden Advanced Settings states
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemma4:e2b');
  const [useUrlScan, setUseUrlScan] = useState<boolean>(false);
  const [ocrLanguage, setOcrLanguage] = useState<string>('eng');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize stored settings on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('scamshield_sound_enabled');

      queueMicrotask(() => {
        if (savedSound !== null) {
          setSoundEnabled(savedSound === 'true');
          sound.enabled = savedSound === 'true';
        }
      });
    }
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (typeof window !== 'undefined') {
      localStorage.setItem('scamshield_sound_enabled', String(next));
    }
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

        // Smooth scroll to the results view
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);

        // 2. Query Local Ollama / Local Heuristic synthesis
        try {
          const res = await fetch('/api/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: rawContent,
              riskScore: initialEvaluation.riskScore,
              riskLevel: initialEvaluation.riskLevel,
              indicators: initialEvaluation.indicators,
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
          console.warn('AI synthesis endpoint unreachable, local heuristic active:', apiErr);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [getActiveInput, activeTab, selectedModel]
  );

  // Clear inputs & result
  const handleClear = () => {
    setMessageInput('');
    setUrlInput('');
    setScreenshotText('');
    setAnalysisResult(null);
  };

  // Demo Scenario 1-click trigger
  const handleSelectDemo = (demo: DemoScenario) => {
    sound.playClick();
    setActiveTab('message');
    setMessageInput(demo.content);
    handleAnalyze(demo.content, 'message');
  };

  const handleAnalyseNowClick = () => {
    const el = document.getElementById('analysis-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleViewDemoClick = () => {
    const el = document.getElementById('demo-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col selection:bg-[#00E5A8]/30 selection:text-white">
      {/* 1. Startup Navbar */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Flow */}
      <main className="flex-1 w-full space-y-12 sm:space-y-16">
        {/* 2. Hero Section */}
        <HeroSection
          onAnalyseNow={handleAnalyseNowClick}
          onViewDemo={handleViewDemoClick}
        />

        {/* 3. Visual Centerpiece: Analysis Card + Privacy Badges */}
        <section className="px-4 sm:px-6 lg:px-8">
          <AnalysisCard
            activeTab={activeTab}
            onTabChange={setActiveTab}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            urlInput={urlInput}
            onUrlChange={setUrlInput}
            screenshotText={screenshotText}
            onScreenshotTextChange={setScreenshotText}
            isAnalyzing={isAnalyzing}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        </section>

        {/* 4. Results Section (Appears after analysis) */}
        {analysisResult && (
          <div ref={resultsRef} className="px-4 sm:px-6 lg:px-8 scroll-mt-24">
            <SecurityDashboardResult
              result={analysisResult}
              onScanAnother={() => {
                handleClear();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              rawInput={currentAnalyzedInput}
            />
          </div>
        )}

        {/* 5. Clickable Interactive Demo Section */}
        <DemoSection onSelectDemo={handleSelectDemo} />

        {/* 6. How It Works Section */}
        <HowItWorksSection />

        {/* 7. Feature Section (Scam Detection, Screenshot Analysis, URL Intelligence) */}
        <FeatureSection />

        {/* 8. Open Source Section (Built in Public, GitHub Repo CTA) */}
        <OpenSourceSection />
      </main>

      {/* 9. Minimalist Startup Footer */}
      <Footer />

      {/* 10. Hidden Advanced Settings Modal */}
      <AdvancedSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        useUrlScan={useUrlScan}
        onToggleUrlScan={() => setUseUrlScan(!useUrlScan)}
        ocrLanguage={ocrLanguage}
        onSelectOcrLanguage={setOcrLanguage}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    </div>
  );
}
