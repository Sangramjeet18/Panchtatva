import { describe, it, expect } from 'vitest';
import { calculateFootprint, EMISSION_FACTORS } from './factors';

describe('CO2 and Tree Offset Calculations', () => {
  it('correctly calculates baseline personal carbon footprint', () => {
    const result = calculateFootprint({
      electricityKWhMonthly: 180,
      carKmWeekly: 40,
      busKmWeekly: 30,
      metroKmWeekly: 20,
      flightsYearly: 1,
      dietType: 'vegetarian',
    });

    expect(result.totalKgPerYear).toBeGreaterThan(0);
    expect(result.totalTonnesPerYear).toBeGreaterThan(0);
    expect(result.treesNeeded).toBe(Math.ceil(result.totalKgPerYear / 21));
  });

  it('increases offset requirements when emissions increase', () => {
    const low = calculateFootprint({
      electricityKWhMonthly: 100,
      carKmWeekly: 0,
      busKmWeekly: 0,
      metroKmWeekly: 0,
      flightsYearly: 0,
      dietType: 'vegetarian',
    });

    const high = calculateFootprint({
      electricityKWhMonthly: 500,
      carKmWeekly: 200,
      busKmWeekly: 50,
      metroKmWeekly: 50,
      flightsYearly: 4,
      dietType: 'meatHeavy',
    });

    expect(high.totalKgPerYear).toBeGreaterThan(low.totalKgPerYear);
    expect(high.treesNeeded).toBeGreaterThan(low.treesNeeded);
  });

  it('verifies reforestation formula co2_per_year_kg = trees * 21', () => {
    const trees = 5000;
    const rate = EMISSION_FACTORS.treeAbsorptionKgPerYear;
    expect(rate).toBe(21);
    const co2Kg = trees * rate;
    expect(co2Kg).toBe(105000);
    expect(co2Kg / 1000).toBe(105);
  });
});
