import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';

const QuerySchema = z.object({
  state: z.string().min(1).default('West Bengal'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parseResult = QuerySchema.safeParse({
      state: searchParams.get('state') || 'West Bengal',
    });

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid state parameter', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const state = parseResult.data.state;
    const db = getDb();
    const modelData = await db.getDeforestationData(state);
    const districtRisks = await db.getDistrictRisks(state);

    if (!modelData) {
      return NextResponse.json(
        { error: `Data for state "${state}" not found. Supported states: West Bengal, Assam, Odisha, Kerala.` },
        { status: 404 }
      );
    }

    const payload = {
      data: {
        ...modelData,
        district_risks: districtRisks,
      },
      meta: {
        source: 'Global Forest Watch and Forest Survey of India',
        simulated: true,
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
