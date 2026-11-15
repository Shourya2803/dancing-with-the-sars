# 🛰️ Dancing with the SARs — Frontend

> **NASA Space Apps Challenge**  
> An interactive, immersive geospatial Earth observation journey from deep space to Uttarakhand, India using **NISAR (NASA-ISRO Synthetic Aperture Radar)** observations.

---

## 🌌 The User Journey

```text
SPACE (Deep Space Starfield & Nebula Dust)
  ↓
SOLAR SYSTEM (3D Cinematic Planetary Spheres & Orbital Trails)
  ↓
EARTH (Procedural 3D Globe with Atmosphere Shader & Himalayan Pin)
  ↓
INDIA ➔ UTTARAKHAND (Geospatial Transition to EPSG:32644 Domain)
  ↓
ANALYSIS SECTORS (🏔 Terrain, 🧊 Cryosphere, 🌲 Forest, 🌊 Wetlands)
  ↓
SCIENTIFIC ANALYSIS (CMR Granule Query & Calibrated Δγ⁰ Log-Ratio)
  ↓
RESULTS (Interactive Change Map, Calibrated Decibel Legend, Gemini Summary)
```

---

## 🚫 Absolute Anti-Hallucination & Provenance Principles

1. **No Fake Scientific Data:** The frontend never invents satellite observations, dates, change percentages, affected areas, scientific measurements, NISAR products, or confidence scores.
2. **True Observation Dates vs. Requested Window:** User-selected dates are explicitly treated as search constraints. Actual observations occur along verified 12-day repeat orbit passes (Track 106, Frame 073/074).
3. **Scientifically Honest Insufficient Data Experience:** When suitable repeat observations do not exist (e.g., date range < 12 days), the UI displays `ANALYSIS UNAVAILABLE` with an orbital explanation. It never claims "No change detected".
4. **Constrained AI Language Layer:** Gemini is used solely to provide plain-language interpretations of precalculated statistical moments. It does not inspect raw binary files or declare unverified disasters.
5. **Calibrated Physical Thresholds:** $|\Delta\gamma^0| \ge 3.0\text{ dB}$ ($2\times$ power shift) rigorously separates physical surface changes from baseline sensor speckle.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **3D & WebGL:** Three.js + React Three Fiber + Drei
- **Motion & Cinematic Transitions:** GSAP + Framer Motion
- **Styling:** Tailwind CSS (Dark NASA-inspired spatial theme)
- **Mapping:** High-precision SVG/Canvas Vector Map with MapLibre GL compatibility (EPSG:32644)
- **Audio:** Web Audio API Procedural Synthesizer (subtle 55 Hz cosmic drone & radar telemetry, muted by default)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Key variables:
- `NEXT_PUBLIC_API_BASE_URL`: URL of the FastAPI backend (`http://localhost:8000`)
- `NEXT_PUBLIC_USE_MOCK_DATA`: Set `true` for offline development mode with clearly badged synthetic data, or `false` for live backend.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
