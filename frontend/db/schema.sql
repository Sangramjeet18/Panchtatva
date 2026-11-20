-- EcoSense PostgreSQL Schema
-- Tables for Deforestation, Reforestation, Carbon and Waterlogging

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

-- Row Level Security
alter table regions enable row level security;
alter table forest_loss_yearly enable row level security;
alter table forecasts enable row level security;
alter table district_risk enable row level security;
alter table species enable row level security;
alter table species_region enable row level security;
alter table reforestation_zones enable row level security;

create policy "Public read on regions" on regions for select using (true);
create policy "Public read on forest_loss_yearly" on forest_loss_yearly for select using (true);
create policy "Public read on forecasts" on forecasts for select using (true);
create policy "Public read on district_risk" on district_risk for select using (true);
create policy "Public read on species" on species for select using (true);
create policy "Public read on species_region" on species_region for select using (true);
create policy "Public read on reforestation_zones" on reforestation_zones for select using (true);
