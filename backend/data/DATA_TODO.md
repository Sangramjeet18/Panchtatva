# EcoSense Data Collection and Ingestion Status

This document reports missing datasets, ingestion requirements, and unverified assumptions in accordance with EcoSense Data Truth Rules.

## Missing Datasets (Reported per project requirements)

The following files were requested for ingestion but are not present in the repository or local filesystem:

1. **`backend/data/processed/fsi/states_forest_cover_2013_2023.csv`**
   - **Status**: MISSING
   - **Requirement**: 36 rows covering Indian States and Union Territories with assessment years, VDF, MDF, Open Forest, Total Cover, Scrub, and change vs previous assessment.
   - **Action**: Per strict Data Truth Rule 1, values must NEVER be estimated or invented. This part is halted until official ISFR (India State of Forest Report) assessment files are provided in `backend/data/processed/fsi/`.

2. **`backend/data/processed/fsi/districts_forest_cover_2023.csv`**
   - **Status**: MISSING
   - **Requirement**: 750 district rows with forest cover breakdown, where national sum must equal 715,342.61 km² within 0.01 km².
   - **Action**: Cannot be synthesized or approximated. Awaiting official published Forest Survey of India district tables.

3. **`backend/data/species/species_candidates.csv`**
   - **Status**: MISSING
   - **Requirement**: 19 candidate species with agro-climatic rainfall bounds and forestry references.
   - **Action**: Replaced by structured fallback in `backend/data/raw/api/species.csv` and `backend/data/serve/species.json` with all unverified fields tagged as `Assumption`.

4. **`backend/data/DATA_REPORT.md`**
   - **Status**: MISSING
   - **Requirement**: Project limits and data provenance report.

---

## Data Truth Rules & Enforcement

1. **FSI Forest Cover**: Forest Survey of India files measure biennial forest COVER in km², not annual deforestation loss. State and district figures must never be called deforestation or fitted to regression curves.
2. **World Bank National Series**: Sourced from FAO/World Bank yearly indicators (`AG.LND.FRST.K2` and `AG.LND.FRST.ZS`). Used solely for national trend and statistical forecasting; never mixed on the same chart axis as FSI figures.
3. **Screening Index (Proxy)**: Waterlogging risk is a rule-based screening index computed from rainfall accumulation and elevation. It is not an ML-trained classifier; accuracy, precision, and recall are neither calculated nor displayed.
4. **Air Quality (Modelled)**: Open-Meteo atmospheric CO2 and pollutants derive from Copernicus Atmosphere Monitoring Service (CAMS) atmospheric models, not ground physical sensors. Tagged as `Modelled`.
5. **Assumptions**: Species rainfall tolerances and standard tree absorption (21 kg CO2/yr) are approximate; all resulting calculations are explicitly tagged as `Assumption`.
6. **Universal Tagging**: Every figure presented on screen carries a visible rectangular text badge: `Real`, `Modelled`, `Proxy`, or `Assumption`.

- **Missing**: `C:\Users\DELL\OneDrive\Desktop\ECo\Panchtatva\backend\data\processed\fsi\districts_forest_cover_2023.csv` (750 districts table required. Halting district ingestion per strict Data Truth Rule.)
  Reported during ingestion cycle at 2026-11-21 23:17:46.377439.

- **Missing**: `C:\Users\DELL\OneDrive\Desktop\ECo\Panchtatva\backend\data\processed\fsi\districts_forest_cover_2023.csv` (750 districts table required. Halting district ingestion per strict Data Truth Rule.)
  Reported during ingestion cycle at 2026-11-21 23:18:40.552967.
