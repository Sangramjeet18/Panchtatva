import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';

const ReforestationPlanSchema = z.object({
  trees: z.coerce.number().min(0).default(0),
  hectares: z.coerce.number().min(0).default(0),
  region: z.string().default('West Bengal'),
  rainfall_band: z.string().default('all'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = ReforestationPlanSchema.safeParse({
      trees: searchParams.get('trees') || 0,
      hectares: searchParams.get('hectares') || 0,
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
    let trees = parsed.data.trees;
    const hectares = parsed.data.hectares;

    // If hectares is supplied and trees is 0, estimate 1000 trees per hectare
    if (hectares > 0 && trees === 0) {
      trees = Math.round(hectares * 1000);
    }

    const absorptionRatePerTree = 21; // 21 kg CO2 per mature tree annually
    const co2KgPerYear = trees * absorptionRatePerTree;
    const co2TonnesPerYear = Math.round((co2KgPerYear / 1000) * 100) / 100;

    const db = getDb();
    const species = await db.getSpecies(region, rainfall_band);
    const districtRisks = await db.getDistrictRisks(region);

    // Filter high and medium risk districts as priority planting zones
    const priorityZones = districtRisks
      .filter((d: any) => d.risk_level === 'high' || d.risk_level === 'medium')
      .map((d: any) => ({
        district: d.district,
        district_code: d.district_code,
        priority: d.risk_level === 'high' ? 1 : 2,
        risk_level: d.risk_level,
        avg_recent_loss_ha: d.avg_recent_loss_ha,
        reason: `District has high recent forest loss (${d.avg_recent_loss_ha} ha/yr) and active fire alerts.`,
      }))
      .sort((a, b) => a.priority - b.priority);

    const payload = {
      data: {
        inputs: {
          trees,
          hectares,
          region,
          rainfall_band,
        },
        formula: 'co2_per_year_kg = trees * rate_kg (21 kg/tree/yr)',
        co2_kg_per_year: co2KgPerYear,
        co2_tonnes_per_year: co2TonnesPerYear,
        species_count: species.length,
        recommended_species: species,
        priority_zones: priorityZones,
      },
      meta: {
        source: 'EcoSense Agro-Climatic Species Inventory and GFW District Risk',
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
