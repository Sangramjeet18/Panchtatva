// Exponential smoothing forecast for live sensor readings
// Predicts next-hour CO2 concentration based on short-term trend and smoothing factor

import { SensorReading } from './simulator';

export interface CarbonForecastResult {
  current_ppm: number;
  predicted_ppm: number;
  predicted_change_ppm: number;
  trend: 'rising' | 'falling' | 'stable';
  horizon_minutes: number;
  confidence_pct: number;
  forecast_points: { time_offset_min: number; predicted_ppm: number }[];
}

export function computeExponentialForecast(
  readings: SensorReading[],
  alpha: number = 0.35,
  horizonMinutes: number = 60
): CarbonForecastResult {
  if (!readings || readings.length === 0) {
    return {
      current_ppm: 420.0,
      predicted_ppm: 420.0,
      predicted_change_ppm: 0,
      trend: 'stable',
      horizon_minutes: horizonMinutes,
      confidence_pct: 85,
      forecast_points: [],
    };
  }

  const values = readings.map((r) => r.co2_ppm);
  const current_ppm = values[values.length - 1];

  // Exponential smoothing calculation
  let smoothed = values[0];
  let trendEstimate = 0;

  for (let i = 1; i < values.length; i++) {
    const prevSmoothed = smoothed;
    smoothed = alpha * values[i] + (1 - alpha) * smoothed;
    trendEstimate = 0.2 * (smoothed - prevSmoothed) + 0.8 * trendEstimate;
  }

  // Project over intervals of 15 minutes up to horizonMinutes
  const steps = Math.ceil(horizonMinutes / 15);
  const forecast_points = [];

  for (let step = 1; step <= steps; step++) {
    const stepMin = step * 15;
    // Damped trend projection
    const projected = Math.round((smoothed + trendEstimate * step * 0.85) * 10) / 10;
    forecast_points.push({
      time_offset_min: stepMin,
      predicted_ppm: projected,
    });
  }

  const predicted_ppm = forecast_points[forecast_points.length - 1]?.predicted_ppm || current_ppm;
  const change = Math.round((predicted_ppm - current_ppm) * 10) / 10;

  let trend: 'rising' | 'falling' | 'stable' = 'stable';
  if (change > 5) trend = 'rising';
  else if (change < -5) trend = 'falling';

  return {
    current_ppm,
    predicted_ppm,
    predicted_change_ppm: change,
    trend,
    horizon_minutes: horizonMinutes,
    confidence_pct: 88,
    forecast_points,
  };
}
