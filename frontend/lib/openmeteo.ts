// lib/openmeteo.ts
// Fetches 3-day rainfall forecast from Open-Meteo for Kolkata using hourly precipitation,
// aggregated to daily totals. Falls back to a stored sample if the API is unreachable.

export interface DailyForecast {
  date: string;        // ISO date YYYY-MM-DD
  rainfall_mm: number; // daily total precipitation in mm
  source: 'openmeteo' | 'fallback';
  simulated: boolean;
}

// Kolkata lat/lon
const KOLKATA_LAT = 22.5726;
const KOLKATA_LON = 88.3639;

const OPEN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${KOLKATA_LAT}&longitude=${KOLKATA_LON}&hourly=precipitation&forecast_days=3&timezone=Asia%2FKolkata`;

/** Sample 3-day fallback if Open-Meteo is unavailable */
const SAMPLE_FORECAST: DailyForecast[] = (() => {
  const today = new Date();
  return [
    { date: today.toISOString().slice(0, 10), rainfall_mm: 28.4, source: 'fallback', simulated: true },
    { date: new Date(today.getTime() + 86400000).toISOString().slice(0, 10), rainfall_mm: 54.1, source: 'fallback', simulated: true },
    { date: new Date(today.getTime() + 2 * 86400000).toISOString().slice(0, 10), rainfall_mm: 12.7, source: 'fallback', simulated: true },
  ];
})();

export async function fetch3DayRainfall(): Promise<DailyForecast[]> {
  try {
    const res = await fetch(OPEN_METEO_URL, { next: { revalidate: 1800 } }); // 30 min cache
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);
    const json: { hourly: { time: string[]; precipitation: number[] } } = await res.json();

    const { time, precipitation } = json.hourly;
    // Aggregate hourly to daily
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < time.length; i++) {
      const day = time[i].slice(0, 10);
      dailyMap[day] = (dailyMap[day] ?? 0) + (precipitation[i] ?? 0);
    }

    const days = Object.entries(dailyMap).slice(0, 3);
    return days.map(([date, mm]) => ({
      date,
      rainfall_mm: Math.round(mm * 10) / 10,
      source: 'openmeteo',
      simulated: false,
    }));
  } catch {
    // Return stored sample on network failure
    return SAMPLE_FORECAST;
  }
}
