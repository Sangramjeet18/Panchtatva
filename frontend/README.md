# EcoSense Frontend

Environmental prediction platform for India. Tracks deforestation trends, plans reforestation, calculates carbon footprints and predicts ward-level waterlogging risk in Kolkata.

## Project structure

```
frontend/                 # This Next.js application
├── app/                  # Next.js App Router pages and API routes
│   ├── (site)/page.tsx   # Home page
│   ├── deforestation/    # M1: Deforestation Tracker
│   ├── reforestation/    # M2: Reforestation Planner
│   ├── carbon/           # M3: Carbon Footprint Tracker
│   ├── waterlogging/     # M4: Waterlogging Predictor
│   ├── about/            # About page
│   ├── data-sources/     # Data sources page
│   ├── legal/            # Privacy and Terms pages
│   └── api/              # Next.js API routes (deforestation, reforestation, carbon, waterlogging)
├── components/           # React components per module and UI system
├── lib/                  # Shared utilities (api.ts, factors.ts, risk.ts, openmeteo.ts, simulator.ts, forecast.ts)
├── data/                 # Seed data files (JSON and CSV)
│   └── models/           # ML model metadata (JSON)
├── ml/                   # Offline ML training scripts
│   ├── deforestation/    # train.py for linear regression model
│   ├── carbon/           # esp32_example.ino for real sensor integration
│   └── waterlogging/     # train.py for Random Forest classifier
├── public/images/        # Photos (deforestation.jpg, reforestation.jpg, carbon-1.jpg, carbon-2.jpg, waterlogging.jpg)
└── docs/ -> ../docs/     # Shared documentation (see root docs/ folder)
```

## Quick start

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the FastAPI backend (e.g. `https://your-app.onrender.com`) | No (defaults to `http://localhost:8000`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this Next.js deployment (e.g. `https://ecosense.vercel.app`) | No (used for sitemap and OG metadata) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | No (falls back to seed file data) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | No (falls back to seed file data) |

When Supabase variables are absent, all API routes use the local seed data in `data/`.
When `NEXT_PUBLIC_API_URL` is absent, the frontend calls `localhost:8000`; without a local backend running,
calls fail silently and the UI shows seed data.

## Run ML training scripts

Both scripts require Python 3.10+ with pandas, scikit-learn and numpy.

```bash
pip install pandas scikit-learn numpy

# Deforestation regression model
python ml/deforestation/train.py

# Waterlogging Random Forest classifier
python ml/waterlogging/train.py
```

Both scripts write their output to `data/models/`.

## Build for production

```bash
npm run build      # Next.js production build
npm run lint       # ESLint
npm test           # Vitest unit tests
```

## Deploy to Vercel

1. Push the `frontend/` folder to your GitHub repository.
2. Create a new Vercel project, set the **Root Directory** to `frontend`.
3. Add environment variables in the Vercel dashboard.
4. Vercel builds with `npm run build` automatically.

## Backend (FastAPI)

The Python FastAPI backend is in the sibling `backend/` directory.
See `backend/README.md` for setup instructions.
To run locally:

```bash
cd ../backend
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

The backend is deployed to Render (free tier). The first request after idle may take 30 seconds
while Render spins up the container. All EcoSense API routes also work without the backend by
using Next.js API routes with local seed data as fallback.

## Acknowledgements

Data sources: Global Forest Watch, Forest Survey of India, Open-Meteo, Central Electricity Authority,
Kolkata Municipal Corporation published drainage reports.
Rainfall forecasts: Open-Meteo open-source weather API (free of charge, no API key required).
