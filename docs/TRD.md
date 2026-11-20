# EcoSense Technical Requirements Document (TRD)

## 1. Architecture
Two top-level folders plus a root docs folder: `frontend/` (Next.js website), `backend/` (FastAPI API server, ML scripts, database schema, seed data) and `docs/` (documentation).

```
docs/
frontend/  (app/, components/, lib/api.ts, public/images/)
backend/   (app/main.py, app/routers/{deforestation,reforestation,carbon,waterlogging}.py, app/services/{risk,simulator,forecast,openmeteo}.py, app/db.py, ml/, data/ with data/models/, db/schema.sql, requirements.txt)
```

## 2. Stack
- Frontend: Next.js 14, TypeScript, App Router.
- Styling: plain CSS with design tokens (CSS variables). No component library that forces rounded or shadowed defaults.
- Charts: Plotly.js (react-plotly). Maps: Leaflet with OpenStreetMap tiles.
- Backend: Python 3.11 with FastAPI, Uvicorn, Pydantic, pandas, scikit-learn. Models run live inside the API.
- Database: Supabase Postgres (free tier). If env vars are missing the app falls back to `backend/data/` seed files.
- Frontend-backend communication: frontend calls the API only through `lib/api.ts` using `NEXT_PUBLIC_API_URL`. CORS allows only the frontend domain.
- Deployment: frontend on Vercel, backend on Render (free tier). Note: Render free tier sleeps when idle.

## 3. Module technical notes

### Deforestation
Data: Global Forest Watch yearly tree cover loss by state or district; Forest Survey of India reports. Model: linear or polynomial regression per state, with a prediction interval; optional Prophet. Metric: MAE on last 3 years held out. Risk score per district = normalised loss rate x fire alert count (NASA FIRMS).

### Reforestation
Formula: `co2_per_year_kg = trees x rate_kg`. Default rate 21 kg per mature tree per year (documented, editable in `backend/data/species.json` and factors). Species table keyed by region and rainfall band in `backend/data/species.json`.

### Carbon footprint
Calculator factors live in `backend/data/emission_factors.json` with source and year:
- Electricity: 0.80 kg CO2 per kWh (India grid, approximate)
- Car: 0.17 kg per km, bus 0.10, metro 0.04
- Flight: 250 kg per short flight
- Diet per year: vegetarian 1000 kg, mixed 1700 kg, meat heavy 2500 kg
Live panel: `/api/carbon/stream` returns the latest reading; a simulator (`backend/app/services/simulator.py`) generates readings with daily pattern plus noise; an ESP32 can POST to `/api/carbon/readings` with an API key. Forecast: exponential smoothing on the last 24 readings (`backend/app/services/forecast.py`).

### Waterlogging
Features per ward: rainfall_mm_24h (Open-Meteo), elevation_m, drainage_score (0 to 10), past_flood_events, impervious_pct. Model: Random Forest classifier trained offline on a ward table (labelled by historical flood reports, partly synthetic and labelled so). Evaluated live in `backend/app/services/risk.py`. Output: Low, Medium, High plus probability.

## 4. API
The API is served by FastAPI running on the backend server.
| Method | Path | Purpose |
|---|---|---|
| GET | /api/deforestation?state= | history, forecast, district risk |
| GET | /api/reforestation/plan?trees=&region= | CO2 and species |
| POST | /api/carbon/calc | footprint from inputs |
| GET | /api/carbon/stream | latest simulated or real reading |
| POST | /api/carbon/readings | sensor ingestion (API key) |
| GET | /api/waterlogging?city= | ward risk for 3 days |
All responses are JSON with `{ data, meta: { source, simulated, generated_at } }`.

## 5. Non-functional requirements
- Load states: every data region has a skeleton loader that matches its final layout.
- Error states: readable message plus retry.
- Accessibility: WCAG AA contrast, keyboard focus visible, charts have text summaries.
- Responsive from 360 px to 1440 px.
- Performance: images through next/image, charts loaded dynamically.
- Security: validate all inputs with Pydantic on the backend, rate limit POST routes, no secrets in the client.
- Render note: Render free tier sleeps when idle. The first request after sleep may take 30 to 60 seconds.
- Legal: Terms and Privacy pages linked in the footer on every page.

## 6. Git workflow
Work in the cloned repository https://github.com/Sangramjeet18/Panchtatva.git.
1. Make two separate commits, never one combined commit:
   a. Backend commit: `git add backend/` then `git commit -m "feat(backend): <piece name>"` then `git push origin main`.
   b. Frontend commit: `git add frontend/` then `git commit -m "feat(frontend): <piece name>"` then `git push origin main`.
   Commit docs separately with `git add docs/` and "docs: ..." only if docs changed.
2. Push the backend first, then the frontend, so the API exists before the pages that use it.
3. Never run `git add .` or `git add -A`. Never commit .env, node_modules, .next, __pycache__ or model files above 50 MB.
4. After each push, run `git log --oneline -5` and `git status` and report the output.

## 7. Testing
Unit tests for formulas (pytest on backend, Vitest on frontend). One browser test per module that fills the form and checks the result changes. Agents must run builds and linters before committing.
Run locally: backend with `pip install -r requirements.txt` then `uvicorn app.main:app --reload` (port 8000); frontend with `npm install` then `npm run dev` (port 3000).
