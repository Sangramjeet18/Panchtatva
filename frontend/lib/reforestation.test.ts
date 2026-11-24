import { describe, it, expect } from 'vitest';
import {
  toHectares,
  fromHectares,
  solvePlanningMode,
  calculateAbsorptionRange,
  matchesRainfallBand,
  categorizeSpeciesByRainfall,
  rankDistrictsByDecline,
  SpeciesCandidate,
} from './reforestation';

describe('Reforestation Calculations & Pure Functions', () => {
  it('converts units correctly to and from hectares', () => {
    // Hectares
    expect(toHectares(10, 'ha')).toBe(10);
    expect(fromHectares(10, 'ha')).toBe(10);

    // Acres
    const haFromAcres = toHectares(10, 'acres');
    expect(haFromAcres).toBeCloseTo(4.0468, 2);
    expect(fromHectares(haFromAcres, 'acres')).toBeCloseTo(10, 2);

    // Square metres
    expect(toHectares(10000, 'sqm')).toBe(1);
    expect(fromHectares(1, 'sqm')).toBe(10000);
  });

  it('accepts 500 trees and 6.5 hectares with correct density and spacing', () => {
    const res = solvePlanningMode({
      mode: 'trees_area',
      trees: 500,
      areaValue: 6.5,
      areaUnit: 'ha',
    });

    expect(res.trees).toBe(500);
    expect(res.hectares).toBe(6.5);
    expect(res.density).toBeCloseTo(76.92, 2);
    expect(res.spacingM).toBeCloseTo(11.4, 1);
    expect(res.densityVerdict).toBe('sparse');
    expect(res.densityVerdictTag).toBe('Assumption');
    expect(res.densityWarning).toBeNull(); // 76.92 trees/ha is >= 50, so no low warning
  });

  it('shows a density warning (not an error) for 6000 trees on 6 hectares', () => {
    const res = solvePlanningMode({
      mode: 'trees_area',
      trees: 6000,
      areaValue: 6.0,
      areaUnit: 'ha',
    });

    expect(res.trees).toBe(6000);
    expect(res.hectares).toBe(6.0);
    expect(res.density).toBe(1000.0);
    expect(res.densityVerdict).toBe('dense');
    // Must be a warning, calculation succeeded
    expect(res.densityWarning).not.toBeNull();
    expect(res.densityWarning).toContain('High planting density notice');
  });

  it('solves area and spacing mode correctly', () => {
    // 5 ha with 5m spacing => density = 10000 / 25 = 400 trees/ha => 2000 trees
    const res = solvePlanningMode({
      mode: 'area_spacing',
      areaValue: 5,
      areaUnit: 'ha',
      spacingM: 5,
    });

    expect(res.hectares).toBe(5);
    expect(res.density).toBe(400);
    expect(res.trees).toBe(2000);
    expect(res.densityVerdict).toBe('agroforestry');
  });

  it('solves trees and spacing mode correctly', () => {
    // 1000 trees with 10m spacing => density = 10000 / 100 = 100 trees/ha => 10 ha
    const res = solvePlanningMode({
      mode: 'trees_spacing',
      trees: 1000,
      spacingM: 10,
    });

    expect(res.trees).toBe(1000);
    expect(res.density).toBe(100);
    expect(res.hectares).toBe(10);
    expect(res.densityVerdict).toBe('sparse');
  });

  it('calculates absorption range with selectable survival and age without em dashes', () => {
    const res = calculateAbsorptionRange(500, 85, 'mature');
    expect(res.survivingTrees).toBe(425);
    expect(res.annualKgMin).toBeGreaterThan(0);
    expect(res.annualKgMax).toBeGreaterThanOrEqual(res.annualKgMin);
    expect(res.rangeText).not.toContain('—'); // No em dash
    expect(res.rangeText).toContain('to');
    expect(res.formulaText).toContain('21 kg/tree/yr');
    expect(res.provenance).toContain('Assumption');
  });

  it('evaluates rainfall band overlap correctly', () => {
    const mockSourced: SpeciesCandidate = {
      species_id: 1,
      name: 'Sal',
      scientific_name: 'Shorea robusta',
      broad_zone_hint: 'West Bengal',
      min_rain_mm: 1000,
      max_rain_mm: 2000,
      absorption_rate: null,
      absorption_rate_text: 'Not yet sourced',
      note: 'Deciduous',
    };

    // Moderate is 1000 to 2000 mm => overlap
    expect(matchesRainfallBand(mockSourced, 'Moderate')).toBe(true);
    // Low is under 1000 mm => no overlap
    expect(matchesRainfallBand(mockSourced, 'Low')).toBe(false);
  });

  it('groups species with missing rainfall ranges into unsourced', () => {
    const sampleList: SpeciesCandidate[] = [
      {
        species_id: 1,
        name: 'Sal',
        scientific_name: 'Shorea robusta',
        broad_zone_hint: 'West Bengal',
        min_rain_mm: 1000,
        max_rain_mm: 2000,
        absorption_rate: null,
        absorption_rate_text: 'Not yet sourced',
        note: '',
      },
      {
        species_id: 4,
        name: 'Banyan',
        scientific_name: 'Ficus benghalensis',
        broad_zone_hint: 'All Regions',
        min_rain_mm: null,
        max_rain_mm: null,
        absorption_rate: null,
        absorption_rate_text: 'Not yet sourced',
        note: '',
      },
    ];

    const result = categorizeSpeciesByRainfall(sampleList, 'Moderate');
    expect(result.matched.map((s) => s.name)).toContain('Sal');
    expect(result.unsourced.map((s) => s.name)).toContain('Banyan');
    expect(result.matched.length + result.unsourced.length).toBe(2);
  });

  it('ranks priority zones by highest relative forest cover decline and handles empty state', () => {
    const sampleDistricts = [
      { district_id: 'D1', name: 'District 1', state_id: 'S1', forest_cover_km2: 1000, change_vs_2021_km2: -50 }, // 5% decline
      { district_id: 'D2', name: 'District 2', state_id: 'S1', forest_cover_km2: 500, change_vs_2021_km2: -50 },  // 10% decline
      { district_id: 'D3', name: 'District 3', state_id: 'S1', forest_cover_km2: 800, change_vs_2021_km2: 10 },   // increase
    ];

    const ranked = rankDistrictsByDecline(sampleDistricts);
    expect(ranked.length).toBe(2); // D3 excluded because it has increase
    expect(ranked[0].district_id).toBe('D2'); // 10% > 5%
    expect(ranked[0].relative_decline_pct).toBe(10);
    expect(ranked[1].district_id).toBe('D1');
    expect(ranked[1].relative_decline_pct).toBe(5);

    // Empty state for state with no decline
    const noDeclineDistricts = [
      { district_id: 'D4', name: 'District 4', state_id: 'S2', forest_cover_km2: 100, change_vs_2021_km2: 5 },
    ];
    expect(rankDistrictsByDecline(noDeclineDistricts)).toEqual([]);
  });
});
