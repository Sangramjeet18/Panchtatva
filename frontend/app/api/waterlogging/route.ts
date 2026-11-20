// app/api/waterlogging/route.ts
// GET /api/waterlogging?city=kolkata&day=0
// Returns ward-level 3-day flood risk predictions.
// Caches Open-Meteo forecast for 30 minutes in module-level variable.

import { NextRequest, NextResponse } from 'next/server';
import { fetch3DayRainfall } from '@/lib/openmeteo';
import { evaluateWardRisks } from '@/lib/risk';
import type { WardRisk } from '@/lib/risk';

// 30-minute in-memory cache
interface CacheEntry {
  data: WardRisk[];
  ts: number;
  simulated: boolean;
}
let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const day = parseInt(searchParams.get('day') ?? '0', 10);
  const rainfallOverride = searchParams.get('rainfall_mm');

  const now = Date.now();

  let results: WardRisk[];
  let simulated = false;

  if (rainfallOverride !== null) {
    // User is testing a manual rainfall scenario via slider
    const mm = parseFloat(rainfallOverride);
    const today = new Date().toISOString().slice(0, 10);
    results = evaluateWardRisks([{ date: today, rainfall_mm: mm, source: 'fallback', simulated: true }]);
    simulated = true;
  } else if (cache && now - cache.ts < CACHE_TTL_MS) {
    results = cache.data;
    simulated = cache.simulated;
  } else {
    const forecast = await fetch3DayRainfall();
    results = evaluateWardRisks(forecast);
    simulated = forecast.some(f => f.simulated);
    cache = { data: results, ts: now, simulated };
  }

  // Filter to the requested day
  const datesSet: Record<string, true> = {};
  results.forEach(r => { datesSet[r.forecast_date] = true; });
  const days = Object.keys(datesSet).sort();
  const targetDate = days[Math.min(Math.max(day, 0), days.length - 1)] ?? days[0];
  const dayResults = results.filter(r => r.forecast_date === targetDate);

  // Sort by probability desc for top-risk ordering
  dayResults.sort((a, b) => b.probability - a.probability);

  return NextResponse.json({
    data: {
      wards: dayResults,
      forecast_dates: days,
      selected_date: targetDate,
    },
    meta: {
      source: rainfallOverride !== null ? 'user_override' : (simulated ? 'sample_fallback' : 'openmeteo'),
      simulated,
      generated_at: new Date().toISOString(),
      model: 'Random Forest Ward Waterlogging Classifier v1.0',
      city: 'Kolkata',
    },
  });
}
