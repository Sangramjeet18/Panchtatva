import { NextRequest, NextResponse } from 'next/server';
import { carbonSimulator } from '@/lib/simulator';
import { computeExponentialForecast } from '@/lib/forecast';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const latest = carbonSimulator.getNextReading();
    const history = carbonSimulator.getHistory(24);
    const forecast = computeExponentialForecast(history, 0.35, 60);

    const isSimulated = history.some((h) => h.is_simulated);

    const payload = {
      data: {
        latest,
        history,
        forecast,
        thresholds: {
          normal_max_ppm: 600,
          moderate_max_ppm: 800,
          elevated_threshold_ppm: 800,
        },
      },
      meta: {
        source: isSimulated ? 'EcoSense Synthetic Sensor Diurnal Stream' : 'Live Physical Telemetry',
        simulated: isSimulated,
        generated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Stream generation error', message: err.message },
      { status: 500 }
    );
  }
}
