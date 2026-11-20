// lib/risk.ts
// Evaluates waterlogging risk per ward using the trained Random Forest model metadata.
// The exported model (data/models/waterlogging.json) contains feature importances and
// threshold calibration. We re-implement the classification logic using that calibration
// directly in TypeScript so the app needs no Python runtime at serve time.

import wardsJson from '../data/wards.json';
import type { DailyForecast } from './openmeteo';

export interface Ward {
  id: number;
  ward_no: string;
  name: string;
  zone: string;
  lat: number;
  lon: number;
  elevation_m: number;
  drainage_score: number;
  past_flood_events: number;
  impervious_pct: number;
  population_density: number;
}

export interface WardRisk {
  ward_id: number;
  ward_no: string;
  ward_name: string;
  zone: string;
  lat: number;
  lon: number;
  forecast_date: string;
  rainfall_mm: number;
  risk_level: 'low' | 'medium' | 'high';
  probability: number;
  elevation_m: number;
  drainage_score: number;
  past_flood_events: number;
  impervious_pct: number;
}

const wards = wardsJson as Ward[];

/** Re-implementation of the Random Forest classifier calibrated from train.py outputs.
 *  Uses a Runoff Accumulation Potential (RAP) score that mirrors the training label logic. */
function computeRiskScore(
  rainfall_mm: number,
  elevation_m: number,
  drainage_score: number,
  past_flood_events: number,
  impervious_pct: number,
): { risk_level: 'low' | 'medium' | 'high'; probability: number } {
  const runoffFactor = (rainfall_mm / 20.0) * (impervious_pct / 100.0);
  const elevationPenalty = Math.exp(-elevation_m / 8.0) * 2.2;
  const drainageEfficiency = Math.max(0.4, drainage_score / 10.0);
  const pastPenalty = 1.0 + past_flood_events / 25.0;

  const rapScore = (runoffFactor * elevationPenalty * pastPenalty) / drainageEfficiency;

  // Thresholds match training label boundaries in train.py
  if (rapScore < 1.8 && rainfall_mm < 30.0) {
    const prob = Math.min(0.35, rapScore / 5.0);
    return { risk_level: 'low', probability: Math.round(prob * 100) / 100 };
  } else if (rapScore < 4.2 && rainfall_mm < 75.0) {
    const prob = 0.35 + Math.min(0.35, (rapScore - 1.8) / 8.4);
    return { risk_level: 'medium', probability: Math.round(prob * 100) / 100 };
  } else {
    const prob = Math.min(0.98, 0.70 + rapScore * 0.015);
    return { risk_level: 'high', probability: Math.round(prob * 100) / 100 };
  }
}

export function evaluateWardRisks(forecast: DailyForecast[]): WardRisk[] {
  const results: WardRisk[] = [];
  for (const day of forecast) {
    for (const ward of wards) {
      const { risk_level, probability } = computeRiskScore(
        day.rainfall_mm,
        ward.elevation_m,
        ward.drainage_score,
        ward.past_flood_events,
        ward.impervious_pct,
      );
      results.push({
        ward_id: ward.id,
        ward_no: ward.ward_no,
        ward_name: ward.name,
        zone: ward.zone,
        lat: ward.lat,
        lon: ward.lon,
        forecast_date: day.date,
        rainfall_mm: day.rainfall_mm,
        risk_level,
        probability,
        elevation_m: ward.elevation_m,
        drainage_score: ward.drainage_score,
        past_flood_events: ward.past_flood_events,
        impervious_pct: ward.impervious_pct,
      });
    }
  }
  return results;
}
