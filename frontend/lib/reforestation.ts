import bandsData from '../data/reforestation_bands.json';

export type AreaUnit = 'ha' | 'acres' | 'sqm';
export type PlanningMode = 'trees_area' | 'area_spacing' | 'trees_spacing';
export type TreeAge = 'year_5' | 'year_10' | 'year_20' | 'mature';

export interface SpeciesCandidate {
  species_id: number;
  name: string;
  scientific_name: string;
  broad_zone_hint: string;
  broad_zone_tag?: string;
  min_rain_mm: number | null;
  max_rain_mm: number | null;
  rain_tag?: string | null;
  rain_text?: string;
  absorption_rate: null;
  absorption_rate_text: string;
  note: string;
  data_status?: string;
}

export interface RankedDistrict {
  district_id: string;
  name: string;
  state_id: string;
  forest_cover_km2: number;
  change_vs_2021_km2: number;
  relative_decline_pct: number;
  ranking_rule: string;
  figures_status: 'Real';
  ranking_status: 'Proxy';
}

// 1. Unit conversions
export const SQM_PER_HA = 10000;
export const ACRES_PER_HA = 2.4710538;

export function toHectares(value: number, unit: AreaUnit): number {
  if (value <= 0) return 0;
  switch (unit) {
    case 'ha':
      return value;
    case 'acres':
      return value / ACRES_PER_HA;
    case 'sqm':
      return value / SQM_PER_HA;
    default:
      return value;
  }
}

export function fromHectares(ha: number, unit: AreaUnit): number {
  if (ha <= 0) return 0;
  switch (unit) {
    case 'ha':
      return ha;
    case 'acres':
      return ha * ACRES_PER_HA;
    case 'sqm':
      return ha * SQM_PER_HA;
    default:
      return ha;
  }
}

// 2. Planning mode solver
export function solvePlanningMode(params: {
  mode: PlanningMode;
  trees?: number;
  areaValue?: number;
  areaUnit?: AreaUnit;
  spacingM?: number;
}): {
  trees: number;
  hectares: number;
  density: number;
  spacingM: number;
  densityVerdict: string;
  densityVerdictLabel: string;
  densityVerdictTag: string;
  densityWarning: string | null;
} {
  const mode = params.mode;
  const unit = params.areaUnit || 'ha';
  let ha = 0;
  let trees = 0;
  let spacing = 0;

  if (mode === 'trees_area') {
    trees = Math.max(1, Math.round(params.trees ?? 500));
    ha = Math.max(0.0001, toHectares(params.areaValue ?? 6.5, unit));
    const rawDensity = trees / ha;
    spacing = rawDensity > 0 ? Math.sqrt(SQM_PER_HA / rawDensity) : 0;
  } else if (mode === 'area_spacing') {
    ha = Math.max(0.0001, toHectares(params.areaValue ?? 6.5, unit));
    spacing = Math.max(0.5, params.spacingM ?? 11.4);
    const density = SQM_PER_HA / (spacing * spacing);
    trees = Math.max(1, Math.round(density * ha));
  } else if (mode === 'trees_spacing') {
    trees = Math.max(1, Math.round(params.trees ?? 500));
    spacing = Math.max(0.5, params.spacingM ?? 11.4);
    const density = SQM_PER_HA / (spacing * spacing);
    ha = Math.max(0.0001, trees / density);
  }

  const density = Math.round((trees / ha) * 100) / 100;
  const avgSpacing = Math.round(spacing * 10) / 10;

  // Verdict lookup from reforestation_bands.json
  const verdictObj = getDensityVerdict(density);

  // Density warning (warning only, never a block)
  let densityWarning: string | null = null;
  if (density >= bandsData.unusual_density_thresholds.warning_high) {
    densityWarning = `High planting density notice: ${density.toLocaleString()} trees/ha is at or above dense plantation limits. Standard forestry spacing is typically 400 to 800 trees/ha. Early thinning or intensive canopy management will be required.`;
  } else if (density < bandsData.unusual_density_thresholds.min_standard) {
    densityWarning = `Low planting density notice: ${density.toLocaleString()} trees/ha is below conventional afforestation density. Suitable for pasture enrichment or scattered agroforestry fringes.`;
  }

  return {
    trees,
    hectares: Math.round(ha * 1000) / 1000,
    density,
    spacingM: avgSpacing,
    densityVerdict: verdictObj.key,
    densityVerdictLabel: verdictObj.label,
    densityVerdictTag: verdictObj.tag,
    densityWarning,
  };
}

export function getDensityVerdict(treesPerHa: number) {
  for (const b of bandsData.bands) {
    if (treesPerHa >= b.min_trees_per_ha && treesPerHa < b.max_trees_per_ha) {
      return b;
    }
  }
  return bandsData.bands[bandsData.bands.length - 1];
}

// 3. Tree Age, Survival & Absorption Range
export const AGE_FACTORS: Record<TreeAge, { min: number; max: number; label: string }> = {
  year_5: { min: 0.15, max: 0.25, label: 'Year 5 (Juvenile)' },
  year_10: { min: 0.45, max: 0.60, label: 'Year 10 (Establishing)' },
  year_20: { min: 0.75, max: 0.90, label: 'Year 20 (Canopy Formation)' },
  mature: { min: 0.85, max: 1.00, label: 'Mature (Full Canopy)' },
};

export const BASELINE_ABSORPTION_RATE = 21.0; // kg CO2/tree/yr rule of thumb

export function calculateAbsorptionRange(
  trees: number,
  survivalPercent: number = 85,
  age: TreeAge = 'mature'
) {
  const survivalRate = Math.max(0.1, Math.min(1.0, survivalPercent / 100.0));
  const survivingTrees = Math.round(trees * survivalRate);
  const factor = AGE_FACTORS[age] || AGE_FACTORS.mature;

  const annualKgMin = Math.round(survivingTrees * factor.min * BASELINE_ABSORPTION_RATE * 10) / 10;
  const annualKgMax = Math.round(survivingTrees * factor.max * BASELINE_ABSORPTION_RATE * 10) / 10;

  const annualTonnesMin = Math.round((annualKgMin / 1000.0) * 10) / 10;
  const annualTonnesMax = Math.round((annualKgMax / 1000.0) * 10) / 10;

  const rangeText = `${annualTonnesMin} to ${annualTonnesMax} tonnes CO2/year`;
  const formulaText = `CO2 absorption = ${survivingTrees.toLocaleString()} surviving trees × ${factor.min}–${factor.max} age factor × 21 kg/tree/yr baseline rule of thumb`;

  return {
    survivingTrees,
    survivalPercent,
    age,
    annualKgMin,
    annualKgMax,
    annualTonnesMin,
    annualTonnesMax,
    rangeText,
    formulaText,
    provenance: bandsData.baseline_rate_provenance,
  };
}

// 4. Rainfall Band Matching (Shared definitions)
export const RAINFALL_BANDS = bandsData.rainfall_bands;

export function matchesRainfallBand(species: SpeciesCandidate, bandKey: string): boolean {
  if (bandKey === 'all') return true;
  if (species.min_rain_mm === null || species.max_rain_mm === null) return false;

  const band = RAINFALL_BANDS.find((b) => b.key === bandKey);
  if (!band) return false;

  // Overlap condition: species min < band max AND species max > band min
  return species.min_rain_mm < band.max_mm && species.max_rain_mm > band.min_mm;
}

export function categorizeSpeciesByRainfall(
  speciesList: SpeciesCandidate[],
  selectedBand: string
): {
  matched: SpeciesCandidate[];
  unsourced: SpeciesCandidate[];
} {
  const sourced: SpeciesCandidate[] = [];
  const unsourced: SpeciesCandidate[] = [];

  for (const sp of speciesList) {
    if (sp.min_rain_mm === null || sp.max_rain_mm === null) {
      unsourced.push(sp);
    } else if (matchesRainfallBand(sp, selectedBand)) {
      sourced.push(sp);
    }
  }

  return {
    matched: sourced,
    unsourced,
  };
}

// 5. Priority Zones Ranking (Forest cover decline)
export function rankDistrictsByDecline(districts: any[]): RankedDistrict[] {
  const ranked: RankedDistrict[] = [];

  for (const d of districts) {
    const chg = typeof d.change_vs_2021_km2 === 'number'
      ? d.change_vs_2021_km2
      : (d.change_vs_previous_km2 ?? 0);
    const cover = typeof d.forest_cover_km2 === 'number'
      ? d.forest_cover_km2
      : (d.total_km2 ?? 0);

    // Only actual declines
    if (chg < 0 && cover > 0) {
      const relDecline = Math.abs(chg) / cover;
      ranked.push({
        district_id: d.district_id || d.region_id || '',
        name: d.name || d.region_name || '',
        state_id: d.state_id || d.parent_id || '',
        forest_cover_km2: Math.round(cover * 100) / 100,
        change_vs_2021_km2: Math.round(chg * 100) / 100,
        relative_decline_pct: Math.round(relDecline * 10000) / 100,
        ranking_rule: 'Highest relative forest cover decline: abs(change_vs_2021_km2) / forest_cover_km2',
        figures_status: 'Real',
        ranking_status: 'Proxy',
      });
    }
  }

  ranked.sort((a, b) => b.relative_decline_pct - a.relative_decline_pct);
  return ranked;
}
