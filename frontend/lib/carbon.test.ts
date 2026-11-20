import { describe, it, expect } from 'vitest';
import { carbonSimulator } from './simulator';
import { computeExponentialForecast } from './forecast';
import { calculateFootprint } from './factors';

describe('Carbon Module QA Tests', () => {
  describe('Footprint Calculations', () => {
    it('accurately computes emissions across all 4 categories', () => {
      const res = calculateFootprint({
        electricityKWhMonthly: 200,
        carKmWeekly: 50,
        busKmWeekly: 20,
        metroKmWeekly: 10,
        flightsYearly: 2,
        dietType: 'mixed',
      });

      // 200 * 12 * 0.80 = 1920 kg
      expect(res.breakdown.electricityKg).toBe(1920);
      // (50 * 0.17 + 20 * 0.10 + 10 * 0.04) * 52 = (8.5 + 2 + 0.4) * 52 = 10.9 * 52 = 566.8 -> 567 kg
      expect(res.breakdown.travelKg).toBe(567);
      // 2 * 250 = 500 kg
      expect(res.breakdown.flightsKg).toBe(500);
      // mixed diet = 1700 kg
      expect(res.breakdown.dietKg).toBe(1700);

      const expectedTotal = 1920 + 567 + 500 + 1700;
      expect(res.totalKgPerYear).toBe(expectedTotal);
      expect(res.totalTonnesPerYear).toBe(Math.round((expectedTotal / 1000) * 100) / 100);
      expect(res.treesNeeded).toBe(Math.ceil(expectedTotal / 21));
    });
  });

  describe('Sensor Simulator', () => {
    it('produces plausible ambient and urban CO2 readings', () => {
      const reading = carbonSimulator.getNextReading();
      expect(reading.co2_ppm).toBeGreaterThanOrEqual(380);
      expect(reading.co2_ppm).toBeLessThanOrEqual(1000);
      expect(reading.estimated_kg_co2).toBeGreaterThan(0);
      expect(reading.is_simulated).toBe(true);
    });

    it('maintains rolling history buffer', () => {
      const history = carbonSimulator.getHistory(24);
      expect(history.length).toBeGreaterThanOrEqual(20);
      expect(history.length).toBeLessThanOrEqual(24);
    });
  });

  describe('Exponential Smoothing Forecast', () => {
    it('produces reasonable next-hour projection from sensor history', () => {
      const history = carbonSimulator.getHistory(24);
      const forecast = computeExponentialForecast(history, 0.35, 60);

      expect(forecast.current_ppm).toBeGreaterThan(350);
      expect(forecast.predicted_ppm).toBeGreaterThan(350);
      expect(['rising', 'falling', 'stable']).toContain(forecast.trend);
      expect(forecast.horizon_minutes).toBe(60);
      expect(forecast.forecast_points.length).toBe(4); // 15, 30, 45, 60 min intervals
    });
  });
});
