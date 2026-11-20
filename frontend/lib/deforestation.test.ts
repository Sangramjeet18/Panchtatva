import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Deforestation Models & Forecasts Verification', () => {
  const modelsPath = path.join(process.cwd(), 'data', 'models', 'deforestation.json');
  const districtRiskPath = path.join(process.cwd(), 'data', 'district_risk.json');

  it('verifies deforestation model forecasts exist for all 4 states', () => {
    expect(fs.existsSync(modelsPath)).toBe(true);
    const models = JSON.parse(fs.readFileSync(modelsPath, 'utf-8'));

    const requiredStates = ['West Bengal', 'Assam', 'Odisha', 'Kerala'];
    for (const state of requiredStates) {
      expect(models[state]).toBeDefined();
      expect(models[state].history.length).toBe(23); // 2001 to 2023
      expect(models[state].forecast.length).toBe(10); // 2024 to 2033
      expect(models[state].mae_held_out).toBeGreaterThan(0);
    }
  });

  it('verifies 10-year forecast confidence intervals are non-negative and bounded', () => {
    const models = JSON.parse(fs.readFileSync(modelsPath, 'utf-8'));
    for (const state in models) {
      const forecast = models[state].forecast;
      for (const pt of forecast) {
        expect(pt.year).toBeGreaterThanOrEqual(2024);
        expect(pt.year).toBeLessThanOrEqual(2033);
        expect(pt.predicted_loss_ha).toBeGreaterThan(0);
        expect(pt.lower_ha).toBeGreaterThanOrEqual(0);
        expect(pt.upper_ha).toBeGreaterThan(pt.lower_ha);
        expect(pt.predicted_loss_ha).toBeGreaterThanOrEqual(pt.lower_ha);
        expect(pt.predicted_loss_ha).toBeLessThanOrEqual(pt.upper_ha);
      }
    }
  });

  it('verifies district risk ratings are categorized into low, medium, or high', () => {
    expect(fs.existsSync(districtRiskPath)).toBe(true);
    const risks = JSON.parse(fs.readFileSync(districtRiskPath, 'utf-8'));
    expect(risks.length).toBeGreaterThan(0);

    const validLevels = ['low', 'medium', 'high'];
    for (const dist of risks) {
      expect(validLevels).toContain(dist.risk_level);
      expect(dist.risk_score).toBeGreaterThanOrEqual(0);
      expect(dist.risk_score).toBeLessThanOrEqual(1);
    }
  });
});
