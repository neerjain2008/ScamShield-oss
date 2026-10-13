'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Trash2, Check, RefreshCw, FileText, Sparkles, Image as ImageIcon } from 'lucide-react';
import { sound } from '@/lib/audio';

interface ScreenshotScannerProps {
  onTextExtracted: (text: string) => void;
  extractedText: string;
  isAnalyzing: boolean;
}

export function ScreenshotScanner({
  onTextExtracted,
  extractedText,
  isAnalyzing,
}: ScreenshotScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [ocrLoading, setOcrLoading] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process image with Tesseract.js
  const processImageWithOCR = useCallback(async (imageSource: string | File) => {
    try {
      setOcrLoading(true);
      setOcrProgress(10);
      setOcrStatus('Initializing in-browser OCR engine (Tesseract.js)...');
      sound.playScan();

      // Dynamically import Tesseract to ensure lightweight initial bundle
      const { createWorker } = await import('tesseract.js');

      setOcrProgress(30);
      setOcrStatus('Loading English OCR recognition model...');

      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(40 + m.progress * 55));
            setOcrStatus(`Recognizing text (${Math.round(m.progress * 100)}%)...`);
          }
        },
      });

      setOcrProgress(60);
      setOcrStatus('Analyzing pixel data & extracting text...');

      const ret = await worker.recognize(imageSource);
      const rawText = ret.data.text.trim();

      await worker.terminate();

      setOcrProgress(100);
      setOcrStatus('OCR complete!');
      setOcrLoading(false);

      if (rawText) {
        sound.playThreatAlert();
        onTextExtracted(rawText);
      } else {
        setOcrStatus('No legible text recognized in image.');
      }
    } catch (err: unknown) {
      console.error('OCR Error:', err);
      setOcrLoading(false);
      setOcrStatus('Failed to process image OCR. Please try another image.');
    }
  }, [onTextExtracted]);

  // Handle file input
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

  // Drag and drop handlers
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

  // Listen to paste event (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
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
  }, [processImageWithOCR]);

  // Instant Sample Generator (For Judges with 0 image files!)
  const generateSampleScamImage = () => {
    sound.playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark chat mock background
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, 600, 360);

    // Header bar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 600, 50);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Bank Alert / SMS (VK-SBIBNK)', 20, 32);

    // Chat bubble
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(30, 70, 540, 250, 12);
    ctx.fill();

    // Message Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = '16px sans-serif';
    ctx.fillText('Dear SBI Customer,', 50, 110);

    ctx.fillStyle = '#fca5a5';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Your Account will be SUSPENDED within 24 hours!', 50, 145);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '15px sans-serif';
    ctx.fillText('Your KYC documents have expired.', 50, 185);
    ctx.fillText('Click immediately to verify and update KYC:', 50, 215);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('http://sbi-kyc-update2026.xyz', 50, 255);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText('Do not ignore. Failure will result in permanent freeze.', 50, 290);

    const dataUrl = canvas.toDataURL('image/png');
    setImagePreview(dataUrl);
    processImageWithOCR(dataUrl);
  };

  const clearAll = () => {
    sound.playClick();
    setImagePreview(null);
    setOcrProgress(0);
    setOcrStatus('');
    onTextExtracted('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-zinc-400" />
          <span>Upload or Paste Screenshot (Chat / SMS / Email)</span>
        </label>

        <div className="flex items-center gap-2">
          {imagePreview && (
            <button
              onClick={clearAll}
              className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" />
              <span>Remove</span>
            </button>
          )}

          <button
            onClick={generateSampleScamImage}
            className="text-xs px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 flex items-center gap-1.5 transition shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Generate Sample Scam Image</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      {!imagePreview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 relative overflow-hidden ${
            isDragging
              ? 'border-white/40 bg-white/5'
              : 'border-white/[0.08] hover:border-white/20 bg-[#14151d]/60 hover:bg-[#14151d]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white">
            <Upload className="w-6 h-6 animate-bounce" />
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-200">
              Drag & Drop your screenshot here, or{' '}
              <span className="text-white underline underline-offset-4">browse</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Supports PNG, JPG, WebP. You can also press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">Ctrl+V</kbd> to paste!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Image Thumbnail Preview */}
          <div className="relative rounded-xl border border-white/[0.08] bg-[#14151d] overflow-hidden flex flex-col items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Screenshot for OCR"
              className="max-h-56 w-auto object-contain rounded-lg shadow-md"
            />
            <div className="absolute top-3 left-3 bg-[#101117]/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-zinc-300 border border-white/[0.08] flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-zinc-400" />
              <span>Loaded Image</span>
            </div>
          </div>

          {/* OCR Processing & Extracted Text */}
          <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#14151d] p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>OCR Extracted Text</span>
                </span>
                {ocrLoading && (
                  <span className="text-zinc-200 font-mono text-[11px] animate-pulse">
                    {ocrProgress}%
                  </span>
                )}
              </div>

              {ocrLoading && (
                <div className="space-y-1.5 py-2">
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono">{ocrStatus}</p>
                </div>
              )}

              <textarea
                rows={5}
                value={extractedText}
                onChange={(e) => onTextExtracted(e.target.value)}
                placeholder="Extracted text will appear here automatically..."
                className="w-full bg-[#161720] text-zinc-200 placeholder-zinc-600 rounded-lg border border-white/[0.08] focus:border-white/30 p-3 text-xs font-mono resize-none outline-none leading-relaxed"
              />
            </div>

            <p className="text-[11px] text-zinc-500 mt-2">
              ✓ Client-side OCR via WebAssembly Tesseract. No images leave your browser.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
