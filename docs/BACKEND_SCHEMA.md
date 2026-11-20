# EcoSense Backend Schema

Database: PostgreSQL (Supabase) served by the FastAPI backend. File to create: `backend/db/schema.sql`. When no database is configured, the same shapes are served from `backend/data/*.json`.

## Entity overview
regions (states and districts) -> forest_loss_yearly, forecasts, district_risk
regions -> reforestation_zones; species -> species_region
cities -> wards -> ward_features, waterlog_predictions
emission_factors; footprint_calculations; sensor_devices -> sensor_readings; carbon_forecasts
data_sources (referenced by all data tables)

## SQL
```sql
create extension if not exists "pgcrypto";

create table data_sources (
  id serial primary key,
  name text not null,
  url text,
  license text,
  is_simulated boolean not null default false,
  retrieved_at date
);

-- Deforestation
create table regions (
  id serial primary key,
  parent_id int references regions(id),
  level text not null check (level in ('state','district')),
  name text not null,
  code text unique,
  geojson jsonb
);

create table forest_loss_yearly (
  id serial primary key,
  region_id int not null references regions(id),
  year int not null,
  tree_cover_loss_ha numeric not null,
  forest_cover_ha numeric,
  fire_alerts int default 0,
  source_id int references data_sources(id),
  unique (region_id, year)
);

create table forecasts (
  id serial primary key,
  region_id int not null references regions(id),
  target_year int not null,
  predicted_loss_ha numeric not null,
  lower_ha numeric,
  upper_ha numeric,
  model text not null,
  mae numeric,
  generated_at timestamptz not null default now(),
  unique (region_id, target_year, model)
);

create table district_risk (
  region_id int primary key references regions(id),
  risk_score numeric not null check (risk_score between 0 and 1),
  risk_level text not null check (risk_level in ('low','medium','high')),
  updated_at timestamptz not null default now()
);

-- Reforestation
create table species (
  id serial primary key,
  common_name text not null,
  scientific_name text,
  co2_kg_per_year numeric not null,
  notes text
);

create table species_region (
  species_id int references species(id),
  region_id int references regions(id),
  min_rain_mm int,
  max_rain_mm int,
  primary key (species_id, region_id)
);

create table reforestation_zones (
  id serial primary key,
  region_id int not null references regions(id),
  priority int not null,
  hectares_available numeric,
  reason text
);

-- Carbon
create table emission_factors (
  id serial primary key,
  category text not null,
  key text not null,
  kg_co2_per_unit numeric not null,
  unit text not null,
  source_id int references data_sources(id),
  year int,
  unique (category, key)
);

create table footprint_calculations (
  id uuid primary key default gen_random_uuid(),
  inputs jsonb not null,
  total_kg_per_year numeric not null,
  breakdown jsonb not null,
  trees_needed int not null,
  created_at timestamptz not null default now()
);

create table sensor_devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  is_simulated boolean not null default true,
  api_key_hash text
);

create table sensor_readings (
  id bigserial primary key,
  device_id uuid not null references sensor_devices(id),
  recorded_at timestamptz not null default now(),
  co2_ppm numeric not null,
  estimated_kg_co2 numeric
);
create index on sensor_readings (device_id, recorded_at desc);

create table carbon_forecasts (
  id bigserial primary key,
  device_id uuid not null references sensor_devices(id),
  horizon_hours int not null,
  predicted_ppm numeric not null,
  generated_at timestamptz not null default now()
);

-- Waterlogging
create table cities (
  id serial primary key,
  name text not null,
  state text,
  lat numeric not null,
  lon numeric not null
);

create table wards (
  id serial primary key,
  city_id int not null references cities(id),
  name text not null,
  ward_no text,
  geojson jsonb
);

create table ward_features (
  ward_id int primary key references wards(id),
  elevation_m numeric,
  drainage_score numeric check (drainage_score between 0 and 10),
  past_flood_events int default 0,
  impervious_pct numeric,
  source_id int references data_sources(id)
);

create table waterlog_predictions (
  id bigserial primary key,
  ward_id int not null references wards(id),
  forecast_date date not null,
  rainfall_mm numeric not null,
  risk_level text not null check (risk_level in ('low','medium','high')),
  probability numeric not null check (probability between 0 and 1),
  generated_at timestamptz not null default now(),
  unique (ward_id, forecast_date)
);
```

## Row level security
Enable RLS on all tables. Public read on every table except `sensor_devices.api_key_hash` (never selected by the client). Writes only through backend API route handlers with the service key. `footprint_calculations` stores no personal data and no IP address.

## Seed files (backend/data)
`regions.json`, `forest_loss.csv`, `forecasts.json`, `district_risk.json`, `species.json`, `emission_factors.json`, `wards.json`, `ward_features.csv`. Every file has a `source` and `simulated` field.

## Response envelope
```json
{ "data": {}, "meta": { "source": "Global Forest Watch", "simulated": false, "generated_at": "2026-11-20T00:00:00Z" } }
```
