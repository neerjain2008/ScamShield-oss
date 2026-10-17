'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Image as ImageIcon,
  Globe,
  Upload,
  Sparkles,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Camera,
  Clipboard,
} from 'lucide-react';
import { sound } from '@/lib/audio';

export type ScannerTabType = 'message' | 'screenshot' | 'url';

interface AnalysisCardProps {
  activeTab: ScannerTabType;
  onTabChange: (tab: ScannerTabType) => void;
  messageInput: string;
  onMessageChange: (val: string) => void;
  urlInput: string;
  onUrlChange: (val: string) => void;
  screenshotText: string;
  onScreenshotTextChange: (val: string) => void;
  isAnalyzing: boolean;
  onAnalyze: (forcedInput?: string, forcedType?: ScannerTabType) => void;
  onClear: () => void;
}

export function AnalysisCard({
  activeTab,
  onTabChange,
  messageInput,
  onMessageChange,
  urlInput,
  onUrlChange,
  screenshotText,
  onScreenshotTextChange,
  isAnalyzing,
  onAnalyze,
  onClear,
}: AnalysisCardProps) {
  // Screenshot drag & drop state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process image with Tesseract.js locally in browser
  const processImageWithOCR = useCallback(
    async (imageSource: string | File) => {
      try {
        setOcrLoading(true);
        setOcrProgress(15);
        setOcrStatus('Initializing client-side Tesseract.js...');
        sound.playScan();

        const { createWorker } = await import('tesseract.js');

        setOcrProgress(35);
        setOcrStatus('Loading English OCR model...');

        const worker = await createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(40 + m.progress * 55));
              setOcrStatus(`Extracting text (${Math.round(m.progress * 100)}%)...`);
            }
          },
        });

        setOcrProgress(65);
        setOcrStatus('Analyzing image pixels for scam signatures...');

        const ret = await worker.recognize(imageSource);
        const rawText = ret.data.text.trim();

        await worker.terminate();

        setOcrProgress(100);
        setOcrStatus('OCR complete!');
        setOcrLoading(false);

        if (rawText) {
          sound.playThreatAlert();
          onScreenshotTextChange(rawText);
        } else {
          setOcrStatus('No legible text found in this screenshot.');
        }
      } catch (err: unknown) {
        console.error('OCR Error:', err);
        setOcrLoading(false);
        setOcrStatus('Failed to process OCR. Please try another image.');
      }
    },
    [onScreenshotTextChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        processImageWithOCR(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        processImageWithOCR(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Keyboard paste (Ctrl+V / Cmd+V) for screenshot tab
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (activeTab !== 'screenshot') return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const result = event.target?.result as string;
              setImagePreview(result);
              processImageWithOCR(file);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeTab, processImageWithOCR]);

  // Demo Sample generator for judges
  const generateSampleScreenshot = () => {
    sound.playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 620;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 620, 360);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 620, 50);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Bank Security Alert (VK-HDFCBK)', 24, 32);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(30, 75, 560, 245, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Dear Customer,', 50, 115);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('URGENT: Your NetBanking access will be BLOCKED today!', 50, 150);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px sans-serif';
    ctx.fillText('Mandatory PAN-Aadhaar KYC link is pending.', 50, 190);
    ctx.fillText('Click immediately to authenticate details:', 50, 220);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('http://hdfc-kyc-auth2026.net/verify', 50, 260);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Failure to verify will lead to immediate debit freeze.', 50, 295);

    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);
    processImageWithOCR(dataUrl);
  };

  const clearScreenshot = () => {
    sound.playClick();
    setImagePreview(null);
    setOcrProgress(0);
    setOcrStatus('');
    onScreenshotTextChange('');
  };

  const getActiveContent = () => {
    if (activeTab === 'message') return messageInput;
    if (activeTab === 'screenshot') return screenshotText;
    if (activeTab === 'url') return urlInput;
    return '';
  };

  const hasInput = getActiveContent().trim().length > 0;

  return (
    <div id="analysis-card" className="w-full max-w-4xl mx-auto scroll-mt-24">
      {/* Centerpiece Analysis Card Container */}
      <div className="relative rounded-3xl bg-[#111827] border border-white/[0.1] shadow-[0_15px_60px_-15px_rgba(0,0,0,0.8),0_0_50px_-20px_rgba(0,229,168,0.18)] p-6 sm:p-8 backdrop-blur-2xl overflow-hidden transition-all duration-300">
        {/* Active scanline beam when analyzing */}
        {isAnalyzing && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E5A8] to-transparent animate-pulse" />
        )}

        {/* Tab Switcher */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] flex-wrap gap-4">
          <div className="flex items-center p-1 rounded-2xl bg-[#050505] border border-white/[0.08]">
            <button
              onClick={() => {
                sound.playClick();
                onTabChange('message');
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'message'
                  ? 'bg-[#111827] text-white shadow-md border border-white/[0.08]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <MessageSquare
                className={`w-4 h-4 ${
                  activeTab === 'message' ? 'text-[#00E5A8]' : 'text-[#A1A1AA]'
                }`}
              />
              <span>Message</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onTabChange('screenshot');
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'screenshot'
                  ? 'bg-[#111827] text-white shadow-md border border-white/[0.08]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <ImageIcon
                className={`w-4 h-4 ${
                  activeTab === 'screenshot' ? 'text-[#00E5A8]' : 'text-[#A1A1AA]'
                }`}
              />
              <span>Screenshot</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onTabChange('url');
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#111827] text-white shadow-md border border-white/[0.08]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Globe
                className={`w-4 h-4 ${
                  activeTab === 'url' ? 'text-[#00E5A8]' : 'text-[#A1A1AA]'
                }`}
              />
              <span>URL</span>
            </button>
          </div>

          {/* Quick Clear Action */}
          {hasInput && (
            <button
              onClick={() => {
                sound.playClick();
                onClear();
                if (activeTab === 'screenshot') clearScreenshot();
              }}
              className="text-xs text-[#A1A1AA] hover:text-white flex items-center gap-1.5 transition py-1 px-2.5 rounded-lg hover:bg-white/[0.05]"
            >
              <Trash2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Input Bodies */}
        <div className="py-6">
          <AnimatePresence mode="wait">
            {/* 1. Message Tab */}
            {activeTab === 'message' && (
              <motion.div
                key="tab-message"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => onMessageChange(e.target.value)}
                    placeholder="Paste suspicious message here..."
                    rows={6}
                    className="w-full bg-[#050505] text-white placeholder-[#71717A] rounded-2xl border border-white/[0.08] focus:border-[#00E5A8] p-5 text-base sm:text-lg leading-relaxed outline-none transition font-sans resize-y shadow-inner"
                  />
                  {messageInput && (
                    <div className="absolute bottom-4 right-4 text-[11px] font-mono text-zinc-500 bg-[#111827]/90 px-2.5 py-1 rounded-md border border-white/[0.06]">
                      {messageInput.length} chars
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 2. Screenshot Tab */}
            {activeTab === 'screenshot' && (
              <motion.div
                key="tab-screenshot"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {!imagePreview ? (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden ${
                      isDragging
                        ? 'border-[#00E5A8] bg-[#00E5A8]/5'
                        : 'border-white/[0.1] hover:border-white/30 bg-[#050505] hover:bg-black/80'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#00E5A8] shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-base font-semibold text-white">
                        Drag and drop screenshot here, or{' '}
                        <span className="text-[#00E5A8] hover:underline underline-offset-4">
                          browse files
                        </span>
                      </p>
                      <p className="text-xs text-[#A1A1AA]">
                        Supports PNG, JPG, WebP. You can also press{' '}
                        <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-mono text-[11px] border border-zinc-700">
                          Ctrl+V
                        </kbd>{' '}
                        to paste.
                      </p>
                    </div>

                    {/* Quick Demo Screenshot generator */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateSampleScreenshot();
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate Sample Scam Screenshot</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Image Preview */}
                    <div className="relative rounded-2xl border border-white/[0.08] bg-[#050505] p-3 flex flex-col items-center justify-center min-h-[220px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Scanned screenshot"
                        className="max-h-56 w-auto object-contain rounded-xl shadow-md"
                      />
                      <button
                        onClick={clearScreenshot}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-rose-950/80 text-zinc-300 hover:text-rose-400 border border-white/[0.08] transition"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* OCR Results Container */}
                    <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#050505] p-4 space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-[#00E5A8]" />
                            <span>Extracted Text</span>
                          </span>
                          {ocrLoading && (
                            <span className="text-[#00E5A8] font-mono text-[11px] animate-pulse">
                              {ocrProgress}%
                            </span>
                          )}
                        </div>

                        {ocrLoading && (
                          <div className="space-y-1.5">
                            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#00E5A8] h-full transition-all duration-300"
                                style={{ width: `${ocrProgress}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-zinc-400 font-mono">{ocrStatus}</p>
                          </div>
                        )}

                        <textarea
                          rows={5}
                          value={screenshotText}
                          onChange={(e) => onScreenshotTextChange(e.target.value)}
                          placeholder="Extracted text will appear here automatically..."
                          className="w-full bg-[#111827] text-zinc-100 placeholder-zinc-600 rounded-xl border border-white/[0.08] focus:border-[#00E5A8] p-3 text-xs sm:text-sm font-sans resize-none outline-none leading-relaxed"
                        />
                      </div>

                      <p className="text-[11px] text-[#A1A1AA]">
                        ✓ On-device OCR via Tesseract.js WebAssembly. No data leaves your machine.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3. URL Tab */}
            {activeTab === 'url' && (
              <motion.div
                key="tab-url"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-zinc-400">
                    <Globe className="w-5 h-5 text-[#00E5A8]" />
                  </div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => onUrlChange(e.target.value)}
                    placeholder="e.g. amazon-prize-2026.net or http://sbi-kyc-verify.xyz"
                    className="w-full bg-[#050505] text-white placeholder-[#71717A] rounded-2xl border border-white/[0.08] focus:border-[#00E5A8] py-4 pl-12 pr-28 text-base sm:text-lg font-mono outline-none transition shadow-inner"
                  />
                  <div className="absolute right-3 flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        try {
                          sound.playClick();
                          const txt = await navigator.clipboard.readText();
                          if (txt) onUrlChange(txt.trim());
                        } catch {
                          // clipboard permission error
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#111827] hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white border border-white/[0.08] transition flex items-center gap-1"
                    >
                      <Clipboard className="w-3 h-3" />
                      <span>Paste</span>
                    </button>
                  </div>
                </div>

                {/* Instant URL heuristics preview if text exists */}
                {urlInput.trim() && (
                  <div className="p-3.5 rounded-xl bg-[#050505] border border-white/[0.08] flex items-center flex-wrap gap-2 text-xs">
                    <span className="font-mono text-zinc-400 text-[11px]">Pattern signals:</span>
                    {urlInput.includes('-') && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
                        Hyphen spoofing detected
                      </span>
                    )}
                    {/[0-9]/.test(urlInput) && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px]">
                        Numerics in domain
                      </span>
                    )}
                    {urlInput.startsWith('http://') && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
                        Insecure HTTP protocol
                      </span>
                    )}
                    {['xyz', 'top', 'net', 'click', 'live', 'link'].some((tld) =>
                      urlInput.toLowerCase().includes(`.${tld}`)
                    ) && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[11px]">
                        High-risk TLD signature
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button: "Analyse Scam" */}
        <div className="pt-2">
          <button
            onClick={() => onAnalyze()}
            disabled={isAnalyzing || !hasInput}
            className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2.5 ${
              isAnalyzing || !hasInput
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/[0.04]'
                : 'bg-[#00E5A8] hover:bg-[#00c993] text-[#050505] shadow-[0_0_30px_rgba(0,229,168,0.3)] hover:shadow-[0_0_40px_rgba(0,229,168,0.5)] active:scale-[0.99] cursor-pointer'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-[#050505]" />
                <span>Evaluating Scam Risk...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[#050505]" />
                <span>Analyse Scam</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* REPLACE PRIVACY PARAGRAPH WITH 4 BADGES */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 border border-white/[0.08] text-white shadow-sm hover:border-[#00E5A8]/40 transition">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8]" />
          <span>Privacy First</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 border border-white/[0.08] text-white shadow-sm hover:border-[#00E5A8]/40 transition">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8]" />
          <span>Local AI</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 border border-white/[0.08] text-white shadow-sm hover:border-[#00E5A8]/40 transition">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8]" />
          <span>Open Source</span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111827]/80 border border-white/[0.08] text-white shadow-sm hover:border-[#00E5A8]/40 transition">
          <span className="w-2 h-2 rounded-full bg-[#00E5A8]" />
          <span>No Data Collection</span>
        </div>
      </div>
    </div>
  );
}
export default AnalysisCard;
