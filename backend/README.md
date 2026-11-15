# 🛰️ Dancing with the SARs

> **NASA Space Apps Challenge**  
> An interactive, scientifically honest Earth observation and change-analysis platform powered by **NISAR (NASA-ISRO Synthetic Aperture Radar)**, initially focused on **Uttarakhand, India**.

---

## 📑 Table of Contents
1. [Project Purpose & Core Philosophy](#1-project-purpose--core-philosophy)
2. [Verified Scientific Facts vs. Future Features](#2-verified-scientific-facts-vs-future-features)
3. [Verified NISAR Products & Data Source](#3-verified-nisar-products--data-source)
4. [Uttarakhand Geographic Scope & Orbital Dynamics](#4-uttarakhand-geographic-scope--orbital-dynamics)
5. [Scientific Processing Methodology](#5-scientific-processing-methodology)
6. [Architecture & Pipeline](#6-architecture--pipeline)
7. [Date Range & Observation Logic (Cases A, B, C, D)](#7-date-range--observation-logic)
8. [Role of Gemini (Strictly Constrained Language Layer)](#8-role-of-gemini)
9. [Database Schema (Supabase PostGIS) & R2 Storage](#9-database-schema--r2-storage)
10. [API Reference](#10-api-reference)
11. [Local Development Setup](#11-local-development-setup)
12. [Docker Deployment](#12-docker-deployment)
13. [Running Tests](#13-running-tests)
14. [Scientific Limitations & Honest Disclaimers](#14-scientific-limitations--honest-disclaimers)

---

## 1. Project Purpose & Core Philosophy

**Dancing with the SARs** is an open-science platform for analyzing radar-derived surface changes across the rugged Himalayan terrain of Uttarakhand, India.

### 🚫 The Absolute Anti-Hallucination Principle:
- **This system is NOT an unverified "AI disaster detector."**
- It does not claim a landslide, flood, or deforestation event occurred unless ground truth or auxiliary scientific models corroborate it.
- **Data flow:**
  $$\text{User Request} \longrightarrow \text{CMR Observation Discovery} \longrightarrow \text{Suitability Check} \longrightarrow \text{Scientific Processing} \longrightarrow \text{Quantified Change} \longrightarrow \text{Map/Stats} \longrightarrow \text{Plain-Language Summary}$$
- **Scientifically Honest Language:**
  > *"The analysis indicates measurable radar backscatter decrease of $\Delta\gamma^0 \le -3.0\text{ dB}$ across $12.4\text{ km}^2$ ($6.2\%$ of the analyzed AOI) between Nov 17 and Nov 29, 2025, consistent with surface roughness or moisture alterations."*

---

## 2. Verified Scientific Facts vs. Future Features

| Aspect | 🟢 Verified Facts (Implemented in Backend) | 🔮 Future / Possible Extensions |
| :--- | :--- | :--- |
| **Data Source** | NASA Earthdata CMR API & ASF DAAC | Direct on-orbit urgent tasking APIs |
| **Product Level** | Level-2 GCOV (RTC Backscatter) & Level-2 GUNW (InSAR) | Level-3 Soil Moisture (SME2) & Biomass |
| **HDF5 Layout** | `/science/LSAR/GCOV/grids/frequencyA/{HHHH, HVHV, xCoordinates, yCoordinates, projection}` | S-band channels (when available from ISRO) |
| **Orbit Cycle** | Exact 12-day repeat orbit (e.g. Track 106, Frame 073/074) | Multi-orbit cross-track fusion |
| **Processing** | Radiometrically Terrain Corrected Log-ratio ($\Delta\gamma^0_{\text{dB}}$) & Line-of-sight displacement ($d_{\text{LOS}}$) | Atmospheric phase screen removal with GACOS |
| **AI Role** | Strictly factual summarization of precomputed stats via Gemini | Multi-modal optical-SAR semantic classification |

---

## 3. Verified NISAR Products & Data Source

All satellite observation discovery is handled via **NASA's Common Metadata Repository (CMR)** and the **Alaska Satellite Facility (ASF) DAAC**:

### 1. NISAR Level-2 GCOV (Geocoded Polarimetric Covariance) — Primary Product
- **Collection Concept ID:** `C2854338529-ASF` (`NISAR_L2_GCOV_PROVISIONAL_V1`)
- **Format:** Cloud-optimized CF-compliant HDF5 (`.h5`)
- **Spatial Reference:** UTM map coordinates (EPSG:32644 for Uttarakhand, Zone 44N)
- **Why GCOV for Uttarakhand?**  
  Uttarakhand has extreme Himalayan relief (300 m to 7,816 m at Nanda Devi). Non-terrain-corrected SAR has severe geometric foreshortening and radiometric distortion. GCOV provides **Radiometrically Terrain Corrected (RTC) $\gamma^0$ power**, normalizing mountain slopes.

### 2. NISAR Level-2 GUNW (Geocoded Unwrapped Interferogram) — InSAR Product
- **Collection Concept ID:** `C2854335566-ASF` (`NISAR_L2_GUNW_PROVISIONAL_V1`)
- **Contents:** `unwrappedPhase` (radians), `coherenceMagnitude` ($0$ to $1$), `losDeformation` (meters).
- **Primary Use:** Ground subsidence, seismic displacement, and interferometric coherence decorrelation.

---

## 4. Uttarakhand Geographic Scope & Orbital Dynamics

The system pre-indexes Uttarakhand's 13 administrative districts and accepts arbitrary GeoJSON polygons up to $25,000\text{ km}^2$:

- **13 Districts:** Chamoli, Rudraprayag, Uttarkashi, Tehri Garhwal, Dehradun, Pauri Garhwal, Pithoragarh, Bageshwar, Almora, Champawat, Nainital, Udham Singh Nagar, Haridwar.
- **Dominant Track 106 (Descending):**
  - **Frame 073:** Covers Northern & Central Uttarakhand (Chamoli, Rudraprayag, Uttarkashi, Tehri Garhwal, Dehradun).
  - **Frame 074:** Covers Southern Uttarakhand (Haridwar, Nainital, Udham Singh Nagar, Almora).
  - **Verified Repeat Passes (every 12 days):**  
    `2025-11-17` $\to$ `2025-11-29` $\to$ `2025-12-11` $\to$ `2025-12-23` $\to$ `2026-01-04` $\to$ `2026-01-16` $\to$ `2026-01-28` $\to$ `2026-02-09` $\to$ `2026-02-21` $\to$ `2026-03-05`.
- **Track 156 (Ascending):** Covers Eastern Uttarakhand (Pithoragarh, Champawat, Bageshwar).

---

## 5. Scientific Processing Methodology

### Linear Power to Decibels:
$$\gamma^0_{\text{dB}} = 10 \cdot \log_{10}(\gamma^0_{\text{linear}})$$

### Backscatter Difference / Log-Ratio:
$$\Delta\gamma^0_{\text{dB}} = \gamma^0_{t_2, \text{dB}} - \gamma^0_{t_1, \text{dB}} = 10 \cdot \log_{10}\left(\frac{\gamma^0_{t_2, \text{linear}}}{\gamma^0_{t_1, \text{linear}}}\right)$$

### Calibrated Threshold Justification:
The radiometric calibration stability of NISAR L-band SAR is $\approx \pm 0.5\text{ to }1.0\text{ dB}$.  
A threshold of **$|\Delta\gamma^0| \ge 3.0\text{ dB}$** represents a **$2\times$ doubling or $0.5\times$ halving of radar power**, rigorously separating real physical surface changes from baseline sensor speckle:
- **Negative Backscatter Change ($\Delta\gamma^0 \le -3.0\text{ dB}$):** Surface smoothing, standing water accumulation / flood inundation, wet snow, or forest canopy loss.
- **Positive Backscatter Change ($\Delta\gamma^0 \ge +3.0\text{ dB}$):** Surface roughening, debris deposition, soil moisture increase, or refrozen crust.
- **Stable Radar Surface ($|\Delta\gamma^0| < 3.0\text{ dB}$):** Within nominal radar variability.

---

## 6. Architecture & Pipeline

```text
POST /api/v1/analyses
        │
        ▼
Validate AOI & Constraints (Shapely)
        │
        ▼
Query NASA CMR Search API (Live NISAR Granules)
        │
        ▼
Evaluate Observation Suitability (Cases A, B, C, D)
        │
        ▼
Windowed Spatial Slicing (Read only required AOI slice from HDF5)
        │
        ▼
Scientific Differential Engine (GCOV RTC log-ratio / GUNW InSAR)
        │
        ├──▶ Georeferenced GeoTIFF (Cloud-Optimized)
        ├──▶ Vectorized GeoJSON Polygons (Threshold Contours)
        └──▶ Quantitative Statistical Moments (mean, std, percentiles)
        │
        ▼
Store Artifacts in Cloudflare R2 / Local Storage
        │
        ▼
Persist Metadata & Stats to Supabase PostGIS
        │
        ▼
Constrained Gemini Summary (Language Layer only)
        │
        ▼
Structured JSON Response to Frontend
```

---

## 7. Date Range & Observation Logic

The user's date range is treated as a **search constraint**, not a promise that satellite passes occurred on those exact dates:

* **Case A — Sufficient Observations:** At least 2 observations exist on a matching orbital track, frame, and flight direction. The backend selects scientifically valid temporal pairs and executes processing.
* **Case B — Only One Observation:** Cannot compare temporally. Returns:
  > *"Only one suitable NISAR observation was found. A minimum of two matching repeat-pass observations is required for temporal change analysis."*
* **Case C — Zero Observations:** Returns:
  > *"No suitable NISAR observations were found for the selected area and date range."*
* **Case D — Conflicting Observations:** Observations exist but possess conflicting orbital tracks or directions. Returns clear geometry mismatch report without claiming "no change detected."

---

## 8. Role of Gemini

Google Gemini (via `google-genai` SDK) is strictly restricted to acting as a **plain-language translation layer**:
- ❌ **Cannot** compute numbers or thresholds.
- ❌ **Cannot** inspect raw HDF5 binary files.
- ❌ **Cannot** declare a landslide or disaster without verified inputs.
- ✅ **Fallback Safety:** If the Gemini API key is missing or the external API call fails, the backend automatically uses a deterministic, scientifically safe fallback template.

---

## 9. Database Schema & R2 Storage

### Supabase PostgreSQL + PostGIS (`backend/scripts/setup_supabase_schema.sql`):
1. `analyses`: Request metadata, district, AOI polygon, dates, status (`pending`, `searching`, `processing`, `completed`, `insufficient_data`).
2. `observations`: Discovered satellite granules, tracks, frames, directions, suitability flags.
3. `analysis_results`: Quantified statistics, changed area ($km^2$), percentage, R2 object keys, public URLs, Gemini explanation.

### Cloudflare R2 Object Storage:
- Stores **only processed scientific outputs** (GeoTIFFs and GeoJSON vectors).
- Raw satellite archives (multi-gigabyte HDF5s) are never uploaded to R2.

---

## 10. API Reference

### Diagnostics & Regions
- `GET /health` — Diagnostics, storage mode, database status, and CMR connectivity.
- `GET /api/v1/regions` — Supported state regions.
- `GET /api/v1/regions/uttarakhand/districts` — All 13 Uttarakhand districts with bounding boxes and centroids.
- `GET /api/v1/regions/uttarakhand/districts/{district_id}` — Detailed geometry of a specific district.

### Satellite Observations
- `POST /api/v1/observations/search` — Query NASA CMR for granules intersecting a district or bounding box.

### Change Analysis
- `POST /api/v1/analyses` — Create and run analysis (`async_exec=false` for synchronous response, `async_exec=true` for background task).
- `GET /api/v1/analyses/{analysis_id}` — Poll analysis progress and status.
- `GET /api/v1/analyses/{analysis_id}/result` — Get completed scientific metrics and map URLs.

---

## 11. Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/dancing-with-the-sars.git
cd dancing-with-the-sars

# 2. Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # On Windows (or source venv/bin/activate on Linux/macOS)

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env

# 5. Generate verified local test data
python backend/scripts/generate_sample_nisar_h5.py

# 6. Start the server
uvicorn backend.app.main:app --reload --port 8000
```
Open **http://localhost:8000/docs** in your browser to interact with the Swagger API UI!

---

## 12. Docker Deployment

```bash
# Build the Docker image
docker build -t dancing-with-the-sars-backend .

# Run container
docker run -p 8000:8000 --env-file .env dancing-with-the-sars-backend
```

---

## 13. Running Tests

Run the full automated test suite (15 unit and integration tests):

```bash
pytest backend/tests/ -v
```

---

## 14. Scientific Limitations & Honest Disclaimers

1. **Physical Scattering Mechanism:** Radar backscatter measures geometry, physical roughness, and dielectric permittivity (water/moisture). It does not directly observe chemical composition or land titles.
2. **Terrain Distortion:** While Radiometric Terrain Correction (RTC) corrects slope geometric illumination, extreme Himalayan peaks may still experience radar shadow or layover where no valid radar pulse returns.
3. **Event Causation:** A measurable decrease or increase in backscatter is an indicator of physical surface change; it requires ground observation or optical confirmation before asserting specific event attribution.
