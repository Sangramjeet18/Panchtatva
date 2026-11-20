'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

interface SensorReadingItem {
  id: string;
  device_id: string;
  recorded_at: string;
  co2_ppm: number;
  estimated_kg_co2: number;
  is_simulated: boolean;
}

interface StreamPayload {
  latest: SensorReadingItem;
  history: SensorReadingItem[];
  forecast: {
    current_ppm: number;
    predicted_ppm: number;
    predicted_change_ppm: number;
    trend: 'rising' | 'falling' | 'stable';
    horizon_minutes: number;
    forecast_points: { time_offset_min: number; predicted_ppm: number }[];
  };
  thresholds: {
    normal_max_ppm: number;
    moderate_max_ppm: number;
    elevated_threshold_ppm: number;
  };
}

export function CarbonLivePanel() {
  const [streamData, setStreamData] = useState<StreamPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;

  const fetchStream = async () => {
    try {
      const res = await fetch('/api/carbon/stream', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch sensor stream');
      const json = await res.json();
      setStreamData(json.data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      // Keep existing data on transient fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();

    const intervalId = setInterval(() => {
      // Rule: Check if tab is visible and stream is not paused
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !isPausedRef.current) {
        fetchStream();
      }
    }, 5000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPausedRef.current) {
        fetchStream();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Determine alert level
  const latestPpm = streamData?.latest?.co2_ppm || 420;
  let alertStyle = {
    bg: 'rgba(91, 123, 58, 0.12)',
    border: 'var(--risk-low)',
    color: '#5B7B3A',
    label: 'Normal Air Quality',
    desc: 'Ambient carbon levels are within standard safe atmospheric ranges.',
  };

  if (latestPpm > 800) {
    alertStyle = {
      bg: 'rgba(180, 83, 42, 0.15)',
      border: 'var(--clay)',
      color: '#B4532A',
      label: 'Elevated Carbon Threshold Alert',
      desc: 'Local air canopy exceeds 800 ppm threshold. High vehicle exhaust and industrial accumulation detected.',
    };
  } else if (latestPpm > 600) {
    alertStyle = {
      bg: 'rgba(184, 138, 30, 0.15)',
      border: 'var(--risk-medium)',
      color: '#B88A1E',
      label: 'Moderate Carbon Concentration',
      desc: 'Localized buildup between 600 and 800 ppm during peak urban transit cycles.',
    };
  }

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '32px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase' }}>
              Live Telemetry Monitor
            </span>
            {/* Visible simulated data disclosure label */}
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '2px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--paper)',
                color: 'var(--muted)',
                fontWeight: 600,
              }}
            >
              Simulated Data
            </span>
          </div>
          <h2 style={{ fontSize: '28px', margin: 0 }}>Canopy Carbon Stream & Next-Hour Projection</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }} className="tabular-nums">
            {isPaused ? 'Stream paused' : `Refreshed: ${lastRefreshed}`}
          </span>
          <Button variant="secondary" onClick={togglePause} style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}>
            {isPaused ? 'Resume polling' : 'Pause stream'}
          </Button>
        </div>
      </div>

      {loading && !streamData ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Skeleton height="70px" />
          <Skeleton height="320px" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Threshold alert banner with plain text and flat colour */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: alertStyle.bg,
              border: `1px solid ${alertStyle.border}`,
              borderRadius: '2px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <strong style={{ color: alertStyle.color, fontSize: '16px', display: 'block', marginBottom: '2px' }}>
                  {alertStyle.label}
                </strong>
                <p style={{ fontSize: '14px', color: 'var(--ink)', margin: 0 }}>
                  {alertStyle.desc}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-serif)', fontWeight: 600, color: alertStyle.color }} className="tabular-nums">
                  {latestPpm} ppm
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }} className="tabular-nums">
                  ~{streamData?.latest?.estimated_kg_co2} kg CO2 in canopy
                </div>
              </div>
            </div>
          </div>

          {/* SVG Stream Chart with Next-Hour Forecast Marker */}
          {streamData && (
            <div
              style={{
                border: '1px solid var(--line)',
                backgroundColor: 'var(--paper)',
                borderRadius: '2px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontWeight: 600 }}>24-Point Sensor History (5-min intervals)</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--smoke)' }} />
                    <span>Telemetry Readings</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--clay)', borderTop: '1px dashed var(--clay)' }} />
                    <span>Exponential Forecast (Next 60 min)</span>
                  </span>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox="0 0 760 300"
                  style={{ width: '100%', minWidth: '580px', height: 'auto', display: 'block' }}
                  role="img"
                  aria-label="Real-time CO2 ppm stream chart with next-hour forecast"
                >
                  {/* Threshold line at 800 ppm */}
                  <line x1="50" y1="65" x2="730" y2="65" stroke="var(--clay)" strokeDasharray="3 3" opacity="0.6" />
                  <text x="54" y="58" fontSize="11" fill="var(--clay)" fontFamily="var(--font-sans)">
                    Elevated threshold (800 ppm)
                  </text>

                  {/* Threshold line at 600 ppm */}
                  <line x1="50" y1="135" x2="730" y2="135" stroke="var(--risk-medium)" strokeDasharray="3 3" opacity="0.6" />
                  <text x="54" y="128" fontSize="11" fill="var(--risk-medium)" fontFamily="var(--font-sans)">
                    Moderate threshold (600 ppm)
                  </text>

                  {/* Telemetry Line (History) */}
                  {(() => {
                    const history = streamData.history || [];
                    const maxPpm = 950;
                    const minPpm = 380;
                    const getX = (idx: number) => 60 + idx * 22; // 24 points: 60 to ~566
                    const getY = (ppm: number) => 260 - ((ppm - minPpm) / (maxPpm - minPpm)) * 220;

                    const histPath = history.reduce((acc, pt, idx) => {
                      const x = getX(idx);
                      const y = getY(pt.co2_ppm);
                      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                    }, '');

                    const lastIdx = history.length - 1;
                    const lastX = getX(lastIdx);
                    const lastY = getY(history[lastIdx]?.co2_ppm || 420);

                    // Forecast points
                    const forecastPts = streamData.forecast?.forecast_points || [];
                    const forecastPath = forecastPts.reduce((acc, pt, i) => {
                      const fx = lastX + (i + 1) * 35;
                      const fy = getY(pt.predicted_ppm);
                      return i === 0 ? `M ${lastX} ${lastY} L ${fx} ${fy}` : `${acc} L ${fx} ${fy}`;
                    }, '');

                    return (
                      <>
                        <path d={histPath} fill="none" stroke="var(--smoke)" strokeWidth="2.5" />
                        {history.map((pt, i) => (
                          <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(pt.co2_ppm)}
                            r="3"
                            fill="var(--smoke)"
                          />
                        ))}

                        {/* Forecast Projection Path */}
                        <path d={forecastPath} fill="none" stroke="var(--clay)" strokeWidth="2" strokeDasharray="4 3" />
                        {forecastPts.map((pt, i) => {
                          const fx = lastX + (i + 1) * 35;
                          const fy = getY(pt.predicted_ppm);
                          return (
                            <g key={i}>
                              <circle cx={fx} cy={fy} r="4" fill="var(--clay)" />
                              <text x={fx} y={fy - 8} fontSize="11" fill="var(--clay)" textAnchor="middle" className="tabular-nums">
                                {pt.predicted_ppm}
                              </text>
                            </g>
                          );
                        })}

                        {/* Next Hour Forecast Callout Marker */}
                        <g>
                          <rect
                            x={lastX + 45}
                            y="190"
                            width="160"
                            height="50"
                            fill="var(--surface)"
                            stroke="var(--line)"
                            rx="2"
                          />
                          <text x={lastX + 55} y="210" fontSize="12" fontWeight="600" fill="var(--ink)">
                            Next-Hour Forecast:
                          </text>
                          <text x={lastX + 55} y="230" fontSize="14" fill="var(--clay)" className="tabular-nums" fontWeight="600">
                            {streamData.forecast?.predicted_ppm} ppm ({streamData.forecast?.trend})
                          </text>
                        </g>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted)' }}>
                <span>Sensor ID: {streamData.latest?.device_id}</span>
                <span>Smoothing Model: Exponential Smoothing (alpha=0.35)</span>
                <span>Refresh rate: 5s (idle when backgrounded)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
