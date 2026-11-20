import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateFootprint } from '@/lib/factors';

const CalcSchema = z.object({
  electricity: z.coerce.number().min(0).default(0),
  car_km: z.coerce.number().min(0).default(0),
  bus_km: z.coerce.number().min(0).default(0),
  metro_km: z.coerce.number().min(0).default(0),
  flights: z.coerce.number().min(0).default(0),
  diet: z.enum(['vegetarian', 'mixed', 'meatHeavy']).default('vegetarian'),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => ({}));
    const parseResult = CalcSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid calculator inputs', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { electricity, car_km, bus_km, metro_km, flights, diet } = parseResult.data;

    const result = calculateFootprint({
      electricityKWhMonthly: electricity,
      carKmWeekly: car_km,
      busKmWeekly: bus_km,
      metroKmWeekly: metro_km,
      flightsYearly: flights,
      dietType: diet,
    });

    const payload = {
      data: {
        inputs: parseResult.data,
        ...result,
      },
      meta: {
        source: 'Central Electricity Authority and India Transport Emission Factors',
        simulated: false,
        generated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal calculation error', message: err.message },
      { status: 500 }
    );
  }
}
