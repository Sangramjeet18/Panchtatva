# EcoSense Technical Requirements Document (TRD)

## 1. Architecture
Single repository folder `frontend/` holds everything: the Next.js website, its API route handlers, the database schema and the offline ML scripts.

```
frontend/
  app/                 pages and route handlers (App Router)
    (site)/page.tsx    Home
    about/ deforestation/ reforestation/ carbon/ waterlogging/
    legal/terms/ legal/privacy/ data-sources/
    api/               route handlers
  components/          UI components (design system)
  lib/                 emission factors, formulas, risk scoring, db client
  data/                seed JSON and CSV
  ml/                  Python training scripts that export JSON
  db/schema.sql        Postgres schema
  public/images/       the five photos
  docs/                PRD, TRD, design brief, backend schema
```

## 2. Stack
- Next.js 14, TypeScript, App Router.
- Styling: plain CSS with design tokens (CSS variables). No component library that forces rounded or shadowed defaults.
- Charts: Plotly.js (react-plotly). Maps: Leaflet with OpenStreetMap tiles.
- Database: Supabase Postgres (free tier). If env vars are missing the app falls back to `data/` seed files.
- ML: Python 3.11 scripts (pandas, scikit-learn, statsmodels or Prophet) run offline. They write forecasts and model coefficients to `data/models/*.json`. The website reads those files, so no Python server is needed in production.
- Deployment: Vercel.

## 3. Module technical notes

### Deforestation
Data: Global Forest Watch yearly tree cover loss by state or district; Forest Survey of India reports. Model: linear or polynomial regression per state, with a prediction interval; optional Prophet. Metric: MAE on last 3 years held out. Risk score per district = normalised loss rate x fire alert count (NASA FIRMS).

### Reforestation
Formula: `co2_per_year_kg = trees x rate_kg`. Default rate 21 kg per mature tree per year (documented, editable in `lib/factors.ts`). Species table keyed by region and rainfall band in `data/species.json`.

### Carbon footprint
Calculator factors live in `lib/factors.ts` with source and year:
- Electricity: 0.80 kg CO2 per kWh (India grid, approximate)
- Car: 0.17 kg per km, bus 0.10, metro 0.04
- Flight: 250 kg per short flight
- Diet per year: vegetarian 1000 kg, mixed 1700 kg, meat heavy 2500 kg
Live panel: `/api/carbon/stream` returns the latest reading; a simulator (`lib/simulator.ts`) generates readings with daily pattern plus noise; an ESP32 can POST to `/api/carbon/readings` with an API key. Forecast: exponential smoothing on the last 24 readings.

### Waterlogging
Features per ward: rainfall_mm_24h (Open-Meteo), elevation_m, drainage_score (0 to 10), past_flood_events, impervious_pct. Model: Random Forest classifier trained offline on a ward table (labelled by historical flood reports, partly synthetic and labelled so). Exported as a rule table or tree JSON evaluated in `lib/risk.ts`. Output: Low, Medium, High plus probability.

## 4. API (route handlers)
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
- Security: validate all inputs with zod, rate limit POST routes, no secrets in the client.
- Legal: Terms and Privacy pages linked in the footer on every page.

## 6. Git workflow
Work only inside `frontend/`. One branch per piece, merged to `main` in order. Conventional commits (`feat:`, `fix:`, `docs:`). Never commit `.env`.

## 7. Testing
Unit tests for formulas (Vitest). One browser test per module that fills the form and checks the result changes. Agents must run `npm run build` and `npm run lint` before committing.
