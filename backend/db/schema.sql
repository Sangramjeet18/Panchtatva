-- EcoSense Database Schema
-- Incorporates Data Truth Rules and strict data_status tagging (real, modelled, proxy, assumption)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS data_sources (
    id TEXT PRIMARY KEY,
    dataset TEXT NOT NULL,
    publisher TEXT NOT NULL,
    used_for TEXT NOT NULL,
    licence TEXT NOT NULL,
    download_date DATE,
    status_tag TEXT NOT NULL,
    url TEXT
);

CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES regions(id),
    level TEXT NOT NULL CHECK (level IN ('country', 'state', 'district')),
    name TEXT NOT NULL,
    code TEXT,
    data_status TEXT NOT NULL CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption'))
);

CREATE TABLE IF NOT EXISTS national_forest_series (
    year INT PRIMARY KEY,
    forest_area_km2 NUMERIC NOT NULL,
    forest_pct_land NUMERIC,
    source_id TEXT REFERENCES data_sources(id),
    data_status TEXT NOT NULL DEFAULT 'real' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption'))
);

CREATE TABLE IF NOT EXISTS forest_cover_assessments (
    id SERIAL PRIMARY KEY,
    region_id TEXT NOT NULL REFERENCES regions(id),
    assessment_year INT NOT NULL,
    vdf_km2 NUMERIC NOT NULL DEFAULT 0,
    mdf_km2 NUMERIC NOT NULL DEFAULT 0,
    open_km2 NUMERIC NOT NULL DEFAULT 0,
    total_km2 NUMERIC NOT NULL,
    scrub_km2 NUMERIC NOT NULL DEFAULT 0,
    change_vs_previous_km2 NUMERIC DEFAULT 0,
    source_id TEXT REFERENCES data_sources(id),
    data_status TEXT NOT NULL DEFAULT 'real' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption')),
    UNIQUE (region_id, assessment_year)
);

CREATE TABLE IF NOT EXISTS monitoring_areas (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    lat NUMERIC NOT NULL,
    lon NUMERIC NOT NULL,
    elevation_m NUMERIC NOT NULL,
    data_status TEXT NOT NULL DEFAULT 'real' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption'))
);

CREATE TABLE IF NOT EXISTS rainfall_daily (
    id SERIAL PRIMARY KEY,
    area_id INT NOT NULL REFERENCES monitoring_areas(id),
    date DATE NOT NULL,
    rain_mm NUMERIC NOT NULL,
    rain_3day NUMERIC NOT NULL,
    risk_proxy TEXT NOT NULL CHECK (risk_proxy IN ('low', 'medium', 'high')),
    data_status TEXT NOT NULL DEFAULT 'proxy' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption')),
    UNIQUE (area_id, date)
);

CREATE TABLE IF NOT EXISTS emission_factors (
    id SERIAL PRIMARY KEY,
    category TEXT NOT NULL,
    key TEXT NOT NULL,
    kg_co2_per_unit NUMERIC NOT NULL,
    unit TEXT NOT NULL,
    source_id TEXT REFERENCES data_sources(id),
    source TEXT,
    year INT,
    status TEXT NOT NULL DEFAULT 'assumption',
    data_status TEXT NOT NULL DEFAULT 'assumption' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption')),
    UNIQUE (category, key)
);

CREATE TABLE IF NOT EXISTS species (
    id INT PRIMARY KEY,
    common_name TEXT NOT NULL,
    scientific_name TEXT,
    region TEXT,
    rainfall_band TEXT,
    min_rain_mm INT,
    max_rain_mm INT,
    co2_kg_per_year NUMERIC NOT NULL,
    notes TEXT,
    source TEXT,
    year INT,
    status TEXT NOT NULL DEFAULT 'assumption',
    data_status TEXT NOT NULL DEFAULT 'assumption' CHECK (data_status IN ('real', 'modelled', 'proxy', 'assumption'))
);
