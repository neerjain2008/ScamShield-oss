# 🔒 ScamShield OSS — Privacy Policy & Data Architecture

**Effective Date:** October 2026  
**License:** MIT Open Source  
**Repository:** ScamShield OSS  

---

## 🛡️ Core Commitment: Zero-Log Privacy Architecture

ScamShield OSS was intentionally engineered from the ground up to **protect vulnerable users from digital fraud without compromising their confidential correspondence**. 

Traditional scam scanners store uploaded messages and images in cloud databases, creating significant surveillance and data leak risks. **ScamShield OSS operates on a strict Zero-Log, Client-First model.**

---

## 1. What Data We DO NOT Collect

| Category | Policy |
| :--- | :--- |
| **User Accounts & Identity** | **ZERO.** No registration, no login, no email capture, no phone numbers, no session tokens. |
| **Databases** | **ZERO.** ScamShield has no database (no SQL, no MongoDB, no Firebase, no Redis). Nothing is saved or persisted on any server. |
| **Tracking & Telemetry** | **ZERO.** No Google Analytics, no Meta Pixel, no Mixpanel, no fingerprinting, no cookies. |
| **Scan History** | **ZERO.** Your scanned messages, URLs, and OCR outputs vanish the moment you refresh or close your browser tab. |
| **Image Uploads** | **ZERO.** Screenshots are **never uploaded to any server**. |

---

## 2. How Scanning Operates Locally (Client-Side Privacy)

### A. Message & SMS Scanner
* The deterministic heuristic engine runs **directly inside your web browser**.
* Text evaluation against 130+ scam patterns and mathematical risk probability calculation happen entirely in local memory (RAM) within milliseconds.

### B. Screenshot Scanner (In-Browser WebAssembly OCR)
* Optical Character Recognition (OCR) is powered by **Tesseract.js running via WebAssembly (Wasm)**.
* Your image file is processed within your browser's sandboxed environment.
* **The image never leaves your device.**

### C. URL Scanner
* URL structural checks (hyphen counting, numeric pattern analysis, high-risk TLD checks, and brand impersonation matching) execute purely in client-side TypeScript.

---

## 3. AI Threat Synthesis (Google Gemma 4 & DigitalOcean Hermes)

* **Offline / Zero-Setup Mode (Default)**: If no API key is provided, 100% of the threat analysis and safety action items are produced entirely by the local offline deterministic engine. **Zero external network requests are made.**
* **Dynamic AI Mode (Optional)**: If you provide an API key (Google AI Studio for Gemma 4 or DigitalOcean GenAI), ScamShield queries the endpoint (`/api/explain`) strictly to synthesize the psychological breakdown and 3 safety steps:
  * Only the text snippet, calculated risk score (e.g., 75%), and identified threat indicators are sent in the prompt.
  * Your API key is stored exclusively in your browser’s `localStorage` (`scamshield_gemma_api_key`).
  * The key is never logged, never stored on a server, and never shared.

---

## 4. Local Storage Usage

ScamShield stores only two preference items in your browser's private `localStorage`:
1. `scamshield_gemma_api_key`: Your optional Google AI Studio API key (encrypted in browser memory, removable with 1-click in Settings).
2. `scamshield_sound_enabled`: Sound effects toggle state (`true` / `false`).

You can clear all stored preferences anytime by clicking **Remove Key** in the AI Settings modal or via your browser's "Clear Site Data".

---

## 5. Security & Open-Source Verification

* **Fully Auditable**: All source code is public under the [MIT License](LICENSE). Anyone can inspect network activity via browser DevTools (Network tab) to verify zero unauthorized outgoing traffic.
* **Hermetic Self-Hosting**: You can build and run ScamShield completely offline inside a Docker container:
  ```bash
  docker build -t scamshield-oss .
  docker run -p 3000:3000 scamshield-oss
  ```

---

## 6. Contact & Bug Bounty

For security reports or privacy questions, please open an issue or security advisory on the GitHub repository.
