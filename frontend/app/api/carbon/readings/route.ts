import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { carbonSimulator } from '@/lib/simulator';

const ReadingSchema = z.object({
  device_id: z.string().min(1),
  co2_ppm: z.number().min(200).max(5000),
  estimated_kg_co2: z.number().optional(),
});

// Simple in-memory rate limiting map: device_id -> last_request_time
const rateLimitMap = new Map<string, number>();
const VALID_API_KEY = process.env.CARBON_SENSOR_API_KEY || 'eco_sensor_live_key_9942';

export async function POST(request: NextRequest) {
  try {
    // 1. API key authorization check
    const apiKeyHeader = request.headers.get('X-API-Key') || request.headers.get('Authorization');
    const token = apiKeyHeader?.replace(/^Bearer\s+/i, '');

    if (!token || token !== VALID_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing API key header (X-API-Key)' },
        { status: 401 }
      );
    }

    // 2. Body parsing and validation
    const json = await request.json().catch(() => null);
    const parsed = ReadingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid telemetry payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { device_id, co2_ppm, estimated_kg_co2 } = parsed.data;

    // 3. Rate limiting: limit to 1 request per 2 seconds per device
    const now = Date.now();
    const lastRequest = rateLimitMap.get(device_id) || 0;
    if (now - lastRequest < 2000) {
      return NextResponse.json(
        { error: 'Too Many Requests: Rate limit exceeded (minimum 2s interval between transmissions)' },
        { status: 429 }
      );
    }
    rateLimitMap.set(device_id, now);

    // 4. Ingest reading into store
    const record = carbonSimulator.addRealReading({
      device_id,
      co2_ppm,
      estimated_kg_co2,
    });

    const payload = {
      data: {
        status: 'accepted',
        id: record.id,
        device_id: record.device_id,
        recorded_at: record.recorded_at,
        co2_ppm: record.co2_ppm,
        estimated_kg_co2: record.estimated_kg_co2,
      },
      meta: {
        source: 'Live ESP32 MH-Z19 Ingest Telemetry',
        simulated: false,
        generated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal ingestion error', message: err.message },
      { status: 500 }
    );
  }
}
