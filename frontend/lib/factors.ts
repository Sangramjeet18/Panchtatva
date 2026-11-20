// EcoSense emission factors (from TRD section 3)
// All factors cite source and year

export const EMISSION_FACTORS = {
  electricityPerKWh: 0.80, // India grid approximate, Central Electricity Authority, 2023
  carPerKm: 0.17, // Average passenger car, India, 2022
  busPerKm: 0.10, // Public bus transit, India, 2022
  metroPerKm: 0.04, // Urban electric metro rail, India, 2022
  flightPerShortTrip: 250, // Domestic flight under 2 hours, 2023
  dietPerYear: {
    vegetarian: 1000, // Vegetarian diet in India, kg CO2 per year, 2023
    mixed: 1700, // Balanced mixed diet in India, kg CO2 per year, 2023
    meatHeavy: 2500, // High meat consumption diet, kg CO2 per year, 2023
  },
  treeAbsorptionKgPerYear: 21, // Default mature tree absorption rate per year (kg CO2)
};

export interface CarbonCalculatorInput {
  electricityKWhMonthly: number;
  carKmWeekly: number;
  busKmWeekly: number;
  metroKmWeekly: number;
  flightsYearly: number;
  dietType: 'vegetarian' | 'mixed' | 'meatHeavy';
}

export interface CarbonCalculatorResult {
  totalKgPerYear: number;
  totalTonnesPerYear: number;
  breakdown: {
    electricityKg: number;
    travelKg: number;
    flightsKg: number;
    dietKg: number;
  };
  treesNeeded: number;
}

export function calculateFootprint(input: CarbonCalculatorInput): CarbonCalculatorResult {
  const electricityKg = Math.max(0, input.electricityKWhMonthly || 0) * 12 * EMISSION_FACTORS.electricityPerKWh;
  const carKg = Math.max(0, input.carKmWeekly || 0) * 52 * EMISSION_FACTORS.carPerKm;
  const busKg = Math.max(0, input.busKmWeekly || 0) * 52 * EMISSION_FACTORS.busPerKm;
  const metroKg = Math.max(0, input.metroKmWeekly || 0) * 52 * EMISSION_FACTORS.metroPerKm;
  const travelKg = carKg + busKg + metroKg;
  const flightsKg = Math.max(0, input.flightsYearly || 0) * EMISSION_FACTORS.flightPerShortTrip;
  const dietKg = EMISSION_FACTORS.dietPerYear[input.dietType] || EMISSION_FACTORS.dietPerYear.mixed;

  const totalKgPerYear = electricityKg + travelKg + flightsKg + dietKg;
  const totalTonnesPerYear = Math.round((totalKgPerYear / 1000) * 100) / 100;
  const treesNeeded = Math.ceil(totalKgPerYear / EMISSION_FACTORS.treeAbsorptionKgPerYear);

  return {
    totalKgPerYear: Math.round(totalKgPerYear),
    totalTonnesPerYear,
    breakdown: {
      electricityKg: Math.round(electricityKg),
      travelKg: Math.round(travelKg),
      flightsKg: Math.round(flightsKg),
      dietKg: Math.round(dietKg),
    },
    treesNeeded,
  };
}
