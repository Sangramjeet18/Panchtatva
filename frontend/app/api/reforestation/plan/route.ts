import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import assessmentsData from '@/data/serve/forest_cover_assessments.json';
import { rankDistrictsByDecline } from '@/lib/reforestation';

const ReforestationPlanSchema = z.object({
  trees: z.coerce.number().min(0).default(500),
  hectares: z.coerce.number().min(0).default(6.5),
  region: z.string().default('West Bengal'),
  rainfall_band: z.string().default('all'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = ReforestationPlanSchema.safeParse({
      trees: searchParams.get('trees') || 500,
      hectares: searchParams.get('hectares') || 6.5,
      region: searchParams.get('region') || 'West Bengal',
      rainfall_band: searchParams.get('rainfall_band') || 'all',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input parameters', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { region, rainfall_band } = parsed.data;
    const trees = parsed.data.trees > 0 ? parsed.data.trees : 500;
    const hectares = parsed.data.hectares > 0 ? parsed.data.hectares : 6.5;

    const density = Math.round((trees / hectares) * 100) / 100;
    const absorptionRatePerTree = 21; // 21 kg CO2 per mature tree rule of thumb
    const co2KgPerYear = Math.round(trees * absorptionRatePerTree);
    const co2TonnesPerYear = Math.round((co2KgPerYear / 1000) * 100) / 100;

    const db = getDb();
    const species = await db.getSpecies(region, rainfall_band);

    // Rank state districts by forest cover decline from FSI assessments
    const stateDistricts = (assessmentsData as any[]).filter(
      (d) =>
        (d.region_name?.toLowerCase().includes(region.toLowerCase()) ||
          d.state_id?.toLowerCase() === region.toLowerCase()) &&
        d.level === 'district'
    );
    const priorityZones = rankDistrictsByDecline(stateDistricts);

    const payload = {
      data: {
        inputs: {
          trees,
          hectares,
          region,
          rainfall_band,
        },
        density_trees_per_ha: density,
        formula: 'CO2 absorption = surviving trees × age factor × baseline absorption rate (21 kg/tree/yr)',
        baseline_provenance: 'A common rule of thumb used here as an Assumption. Source to be confirmed.',
        co2_kg_per_year: co2KgPerYear,
        co2_tonnes_per_year: co2TonnesPerYear,
        species_count: species.length,
        recommended_species: species,
        priority_zones: priorityZones.slice(0, 5),
      },
      meta: {
        source: 'Forest Survey of India / ICFRE Species Candidates',
        data_status: 'assumption',
        simulated: false,
        generated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
