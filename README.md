# 🛡️ ScamShield OSS
### Open-Source Scam Intelligence Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-orange.svg)](https://hacktoberfest.com)
[![MLH Open Source AI Challenge](https://img.shields.io/badge/MLH-Open--Source%20AI%20Challenge-red.svg)](https://mlh.io)
[![DigitalOcean App Platform](https://img.shields.io/badge/DigitalOcean-Deploy%20Ready-0080FF.svg)](https://cloud.digitalocean.com/apps/new)
[![Accessibility: WCAG AAA](https://img.shields.io/badge/Accessibility-WCAG%20AAA-brightgreen.svg)](#accessibility--vision-suite)
[![Privacy: Zero-Log](https://img.shields.io/badge/Privacy-Zero--Log%20Guaranteed-emerald.svg)](PRIVACY.md)

> **ScamShield OSS** is a high-speed, privacy-first open-source scam detection and cyber defense platform. Built with a deterministic rule engine, in-browser WebAssembly OCR, and 100% on-device open models via local Ollama with zero cloud transmission. See [PRIVACY.md](PRIVACY.md) for full architectural guarantees.

---

## ⚡ 1-Click Deploy on DigitalOcean

Deploy ScamShield OSS instantly to **DigitalOcean App Platform** using the included `.do/app.yaml` configuration:

[![Deploy to DigitalOcean](https://www.deploytodo.com/do-btn-blue.svg)](https://cloud.digitalocean.com/apps/new)

Or run via Docker:
```bash
docker build -t scamshield-oss .
docker run -p 3000:3000 scamshield-oss
```

---

## 🎯 The Killer Feature: Deterministic Engine First

Unlike naive AI wrappers that suffer from hallucinations, high latency, and unpredictable scoring, ScamShield implements an **asymmetric hybrid architecture**:

```
[ Input Message / URL / Screenshot ]
              │
              ▼
   ┌────────────────────────────────────────┐
   │  Deterministic Heuristic Rule Engine   │  <-- 0ms, predictable, transparent
   └────────────────────────────────────────┘
              │
              ├─ Risk Score (e.g. 87%)
              ├─ Severity Classification (Safe -> Critical)
              └─ Specific Trigger Flags (Urgency, Impersonation, Prize Bait)
              │
              ▼
   ┌────────────────────────────────────────┐
   │  Local LLM Threat Synthesizer          │  <-- Local Ollama (gemma4:e2b / llama3.2)
   └────────────────────────────────────────┘
              │
              ▼
   ┌────────────────────────────────────────┐
   │  Executive Breakdown + Psychological   │
   │  Manipulation Trap + 3 Action Items    │
   └────────────────────────────────────────┘
```

### Why This Wins:
- ⚡ **Instant & Predictable**: Heuristics execute locally in 0 milliseconds.
- 🔒 **100% Privacy**: No user database, no authentication, no tracking cookies, no server-side message logs.
- 💰 **Ultra-Cheap**: Only one minimal explanation prompt sent to LLM per analysis.
- 🔬 **Explainable AI**: Users see exactly *which* words, patterns, and domain structures triggered the alert.

---

## 🔍 The 3 Scanners (1 Shared Scam Engine)

| Scanner | Input Format | Detection Capabilities |
| :--- | :--- | :--- |
| **💬 Message Scanner** | SMS, WhatsApp, Telegram, Email text | Scans for urgency traps (`within 24 hours`), advance fee demands (`registration fee`), lottery lures (`₹50,000 cash prize`), KYC bank impersonation (`SBI`, `HDFC`, `Netflix`), and credential theft. |
| **🔗 URL Scanner** | Raw URL or domain name | Evaluates hyphen stuffing, numeric patterns, deceptive brand keywords (`amazon-`, `netflix-`), abusive TLDs (`.xyz`, `.top`), naked IP hosts, and nested subdomain cloaking. |
| **📸 Screenshot Scanner** | Chat screenshot, image upload, clipboard paste (`Ctrl+V`) | Executes **Tesseract.js** in-browser WebAssembly OCR. No image files leave the client machine. Automatically routes recognized text into the Scam Engine. Includes an instant **1-Click Sample Generator** for live testing. |

---

## ♿ Accessibility & Vision Suite (WCAG AAA)

ScamShield OSS was built from the ground up for maximum accessibility, especially for elderly individuals and visually impaired users who are disproportionately targeted by cyber fraud:

1. **Text Magnifier**: 4-level root font scaling (`100%`, `115% A+`, `130% A++`, `145% Max Zoom`) that dynamically rescales every UI element and label.
2. **High Contrast Dark (AAA)**: Pure pitch-black (`#000000`) canvas with 2px solid white borders and high-visibility `#ffff00` (yellow) typography exceeding 7:1 contrast ratios.
3. **High Contrast Light (AAA)**: Pure white (`#ffffff`) background with stark black (`#000000`) text and solid borders.
4. **Voice Threat Readout (TTS)**: Built-in SpeechSynthesis audio narrator that reads aloud the risk score, detected reasons, psychological trap, and recommended protective actions.
5. **Dyslexia Reading Mode**: Expanded letter-spacing (`0.08em`), word-spacing (`0.16em`), and line-heights (`1.85`).
6. **Reduced Motion**: Disables radar scanline effects and gauge pulses for vestibular disorder safety.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/neerjain2008/ScamShield-oss.git
cd ScamShield-oss
npm install
```

### 2. Local Ollama Setup (100% On-Device Inference)
ScamShield runs 100% locally with zero cloud dependencies or external API keys. Start Ollama and pull any open model:
```bash
# Start Ollama service (runs on http://localhost:11434)
ollama pull gemma4:e2b
# Or a lightweight 2GB model:
# ollama pull llama3.2:3b
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Heuristic Verification CLI Suite
```bash
node test-cli.mjs
```

---

## 🏆 Hackathon Quick Presets (1-Click Test Scenarios)

Judges can test live scam detection in seconds using the top preset bar:
- 🎁 **Amazon ₹50k Prize Bait** (`Score: 82% Critical Threat`)
- 🚨 **Fake SBI Bank KYC SMS** (`Score: 99% Critical Threat`)
- 💼 **Telegram YouTube Like Scam** (`Score: 88% Critical Threat`)
- 🔗 **Phishing URL: netflix-login-verify.top** (`Score: 99% Critical Threat`)
- 🛡️ **Legitimate GitHub Security Alert** (`Score: 4% Safe`)

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information. Built with ❤️ for **Hacktoberfest** and the **MLH Open-Source AI Prize Challenge**.
