<div align="center">

  <h1>EcoSense (Panchtatva)</h1>
  <p><strong>Environmental Prediction and Analytical Intelligence for India</strong></p>

  <p>
    An open, rigorous environmental monitoring platform tracking forest canopy change, targeted reforestation, household carbon accounting, and urban waterlogging risks across India.
  </p>

  <p>
    <a href="https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app"><img src="https://img.shields.io/badge/Vercel-Live_Frontend-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Deployment" /></a>
    <a href="https://ecosense-backend-42t8.onrender.com/health"><img src="https://img.shields.io/badge/Render-FastAPI_Backend-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render Backend" /></a>
    <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.11" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
  </p>

  <p>
    <a href="https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app"><strong>Explore Web Platform</strong></a> •
    <a href="https://ecosense-backend-42t8.onrender.com/docs"><strong>Interactive API Docs</strong></a> •
    <a href="DEPLOY.md"><strong>Deployment Guide</strong></a>
  </p>

</div>

<hr />

## Table of Contents

- [Overview](#overview)
- [The Four Core Modules](#the-four-core-modules)
- [Data Truth Rules](#data-truth-rules)
- [System Architecture](#system-architecture)
- [Live Deployments](#live-deployments)
- [Local Development Setup](#local-development-setup)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Institutional Data Attributions](#institutional-data-attributions)
- [License](#license)

<hr />

## Overview

EcoSense is built on the philosophy of radical scientific transparency and field-report design. Rather than inventing predictive metrics or training machine learning models on synthetic approximations, EcoSense applies transparent physical rules, strict data classification labels, and official governmental and multilateral datasets.

Every quantitative value rendered across the user interface carries an explicit rectangular status badge: **Real**, **Modelled**, **Proxy**, or **Assumption**.

<hr />

## The Four Core Modules

<table>
  <thead>
    <tr>
      <th width="22%">Module</th>
      <th width="38%">Scientific Methodology</th>
      <th width="25%">Primary Data Source</th>
      <th width="15%">Data Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>01. Forest Cover Tracker</strong></td>
      <td>Biennial canopy assessment categorized by density (Very Dense, Moderately Dense, Open). Evaluates 36 states and 750 districts. OLS regression applied strictly to national FAO series.</td>
      <td>Forest Survey of India (ISFR) & World Bank / FAO</td>
      <td><code>REAL</code></td>
    </tr>
    <tr>
      <td><strong>02. Reforestation Planner</strong></td>
      <td>Regional rainfall band filtering (&lt;800mm, 800-1500mm, &gt;1500mm) matched against 19 native species. Estimates annual CO2 sequestration baseline (21 kg/tree/yr).</td>
      <td>Indian Council of Forestry Research & Education (ICFRE)</td>
      <td><code>ASSUMPTION</code></td>
    </tr>
    <tr>
      <td><strong>03. Carbon Accounting</strong></td>
      <td>Statutory electrical grid emission factors (0.80 kg CO2/kWh), transit mode intensities, and IPCC household nutritional footprints.</td>
      <td>Central Electricity Authority (CEA) & IPCC Baselines</td>
      <td><code>ASSUMPTION</code></td>
    </tr>
    <tr>
      <td><strong>04. Waterlogging Predictor</strong></td>
      <td>Deterministic physical screening index derived from 3-day accumulated rainfall forecasts and ground elevation survey benchmarks across 8 Kolkata monitoring stations.</td>
      <td>Open-Meteo & Kolkata Topography Survey</td>
      <td><code>PROXY</code></td>
    </tr>
  </tbody>
</table>

<hr />

## Data Truth Rules

All data consumption adheres to six binding scientific rules:

1. **Forest Cover Truth**: Forest Survey of India files measure biennial forest canopy cover in square kilometers at two assessment points. They are not annual tree cover loss. Figures are never labelled as deforestation and never fitted to state-level regression curves.
2. **National Series Isolation**: World Bank national forest series (FAO definition) is used solely for national trends and 10-year projections. It is never plotted on the same chart axis as FSI figures.
3. **Transparent Proxy Index**: Waterlogging risk is evaluated using a deterministic physical screening rule combining 3-day rainfall and elevation. No machine learning classifier is trained on this proxy, and no false accuracy or recall statistics are claimed. The 8 locations are designated topographical monitoring areas, not administrative wards.
4. **Modelled Atmosphere**: Criteria air pollutants and atmospheric CO2 from Open-Meteo derive from Copernicus Atmosphere Monitoring Service (CAMS) regional numerical models rather than ground sensors. They are explicitly tagged <code>Modelled</code>.
5. **Visible Assumptions**: Species rainfall thresholds and standard tree absorption (21 kg CO2/tree/yr) represent unverified approximations and are visibly labelled <code>Assumption</code>.
6. **Universal Tagging**: Every number on screen carries an explicit status badge: Real, Modelled, Proxy, or Assumption.

<hr />

## System Architecture

```text
+-------------------------------------------------------------------------+
|                          ECOSENSE ARCHITECTURE                          |
+-------------------------------------------------------------------------+
                                     |
               Client Browser (Desktop, Tablet, Mobile)
                                     |
                                     v
+-------------------------------------------------------------------------+
| FRONTEND: Next.js 14 App Router (Deployed on Vercel Global Edge)        |
| - Fraunces (Headings) & Instrument Sans (Body Typography)               |
| - Editorial field-report design tokens (Paper, Surface, Forest, Clay)   |
| - Zero icon libraries, zero box-shadows, zero transitions               |
| - lib/api.ts with 20s timeout and Render cold-start retry handling      |
+-------------------------------------------------------------------------+
                                     |
                                     | HTTPS REST (JSON Envelope)
                                     v
+-------------------------------------------------------------------------+
| BACKEND: FastAPI Service (Deployed on Render Free Web Service)          |
| - REST API Endpoints with standard { data, meta } envelopes             |
| - In-memory sliding window rate limiter on all POST endpoints           |
| - 30-minute in-memory cache for live weather and CAMS air quality       |
| - High-performance local JSON fallback repository                      |
| - Memory footprint: 59 MB peak (under 512 MB free tier allocation)      |
+-------------------------------------------------------------------------+
```

<hr />

## Live Deployments

- **Web Application**: [https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app](https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app)
- **API Base URL**: [https://ecosense-backend-42t8.onrender.com](https://ecosense-backend-42t8.onrender.com)
- **API Health Check**: [https://ecosense-backend-42t8.onrender.com/health](https://ecosense-backend-42t8.onrender.com/health)
- **Swagger Documentation**: [https://ecosense-backend-42t8.onrender.com/docs](https://ecosense-backend-42t8.onrender.com/docs)

<hr />

## Local Development Setup

### Prerequisites

- Node.js 18.17+ or 20+
- Python 3.11+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/Sangramjeet18/Panchtatva.git
cd Panchtatva
```

### 2. Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (Port 8000)
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend will be accessible at: `http://127.0.0.1:8000`

### 3. Frontend Setup (Next.js)

Open a second terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000 in .env.local

# Start Next.js development server (Port 3000)
npm run dev
```

Frontend will be accessible at: `http://localhost:3000`

<hr />

## Testing & Quality Assurance

### Backend Unit Tests

Run the full backend test suite covering collectors, routers, and analytical services:

```bash
cd backend
python -m unittest discover tests
```

### Production Smoke Test

Run the comprehensive 9-point production verification script:

```bash
cd backend
python -m scripts.smoke_test --base-url http://127.0.0.1:8000 --origin http://localhost:3000
```

### Frontend Tests & Design Rule Audit

```bash
cd frontend
npm test
npm run build

# Run root design system audit (validating 30 binding rules)
cd ..
python audit.py
```

<hr />

## Institutional Data Attributions

- **Forest Survey of India (FSI)**: India State of Forest Reports (ISFR biennial assessments).
- **World Bank / FAO**: Indicator AG.LND.FRST.K2 (Forest area in sq. km).
- **Central Electricity Authority (CEA)**: Ministry of Power, Government of India CO2 baseline database.
- **Open-Meteo & Copernicus (CAMS)**: Numerical weather predictions and regional atmospheric simulations.
- **Our World in Data (OWID)**: Global Carbon Project per capita carbon emissions.
- **Indian Council of Forestry Research & Education (ICFRE)**: Native forestry and agro-climatic species profiles.

<hr />

## License

This project is licensed under the MIT License. See [legal/terms](https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app/legal/terms) and [legal/privacy](https://panchtatva-6ug9hl2wu-sangramjeet18s-projects.vercel.app/legal/privacy) for detailed terms of service and privacy disclosures.
