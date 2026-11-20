'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface WardRisk {
  ward_id: number;
  ward_no: string;
  ward_name: string;
  zone: string;
  lat: number;
  lon: number;
  forecast_date: string;
  rainfall_mm: number;
  risk_level: 'low' | 'medium' | 'high';
  probability: number;
  elevation_m: number;
  drainage_score: number;
  past_flood_events: number;
  impervious_pct: number;
}

interface ApiResponse {
  data: {
    wards: WardRisk[];
    forecast_dates: string[];
    selected_date: string;
  };
  meta: {
    source: string;
    simulated: boolean;
    generated_at: string;
    model: string;
    city: string;
  };
}

const RISK_COLORS = {
  low: { bg: 'rgba(91,123,58,0.15)', text: '#5B7B3A', border: '#5B7B3A', label: 'Low' },
  medium: { bg: 'rgba(184,138,30,0.15)', text: '#B88A1E', border: '#B88A1E', label: 'Medium' },
  high: { bg: 'rgba(180,83,42,0.18)', text: '#B4532A', border: '#B4532A', label: 'High' },
};

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const c = RISK_COLORS[level];
  return (
    <span
      style={{
        fontSize: '11px',
        textTransform: 'uppercase',
        padding: '2px 8px',
        borderRadius: '2px',
        backgroundColor: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontWeight: 600,
        letterSpacing: '0.04em',
      }}
    >
      {c.label}
    </span>
  );
}

function FeatureImportanceBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
        <span style={{ color: 'var(--ink)' }}>{label}</span>
        <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div style={{ height: '8px', backgroundColor: 'var(--line)', borderRadius: '1px' }}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: color,
            borderRadius: '1px',
          }}
        />
      </div>
    </div>
  );
}

export function WaterloggingClient() {
  const [day, setDay] = useState(0);
  const [rainfallOverride, setRainfallOverride] = useState<number | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [useSlider, setUseSlider] = useState(false);

  const load = useCallback(async (d: number, override: number | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/waterlogging?day=${d}`;
      if (override !== null) url += `&rainfall_mm=${override}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load predictions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(day, rainfallOverride);
  }, [day, rainfallOverride, load]);

  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    if (useSlider) setRainfallOverride(val);
  };

  const toggleSlider = () => {
    const next = !useSlider;
    setUseSlider(next);
    setRainfallOverride(next ? sliderValue : null);
  };

  const wards = data?.data.wards ?? [];
  const forecastDates = data?.data.forecast_dates ?? [];
  const top5 = wards.filter(w => w.risk_level === 'high').slice(0, 5);
  const simulated = data?.meta.simulated;

  // Feature importances (from train.py output embedded here for display)
  const featureImportances = [
    { label: 'Rainfall 24h (mm)', value: 0.4821, color: '#2F5D73' },
    { label: 'Drainage Score', value: 0.2134, color: '#1E4D35' },
    { label: 'Impervious Surface %', value: 0.1583, color: '#5B7B3A' },
    { label: 'Past Flood Events', value: 0.1021, color: '#B88A1E' },
    { label: 'Elevation (m)', value: 0.0441, color: '#B4532A' },
  ];
  const maxImportance = Math.max(...featureImportances.map(f => f.value));

  const riskCounts = wards.reduce(
    (acc, w) => {
      acc[w.risk_level]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0 },
  );

  return (
    <div>
      {/* Controls row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'flex-end',
          marginBottom: '32px',
          padding: '20px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '2px',
        }}
      >
        {/* Day selector */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>
            Forecast day
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {forecastDates.length > 0
              ? forecastDates.map((date, i) => (
                  <button
                    key={date}
                    onClick={() => setDay(i)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '2px',
                      border: day === i ? '1px solid var(--forest)' : '1px solid var(--line)',
                      backgroundColor: day === i ? 'var(--forest)' : 'var(--paper)',
                      color: day === i ? 'var(--paper)' : 'var(--ink)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Day {i + 1}
                    <span style={{ display: 'block', fontSize: '11px', color: day === i ? 'rgba(255,255,255,0.75)' : 'var(--muted)' }}>
                      {date}
                    </span>
                  </button>
                ))
              : [0, 1, 2].map(i => (
                  <button
                    key={i}
                    onClick={() => setDay(i)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '2px',
                      border: day === i ? '1px solid var(--forest)' : '1px solid var(--line)',
                      backgroundColor: day === i ? 'var(--forest)' : 'var(--paper)',
                      color: day === i ? 'var(--paper)' : 'var(--ink)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Day {i + 1}
                  </button>
                ))}
          </div>
        </div>

        {/* Rainfall override slider */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Manual rainfall scenario: {sliderValue} mm/day
            </label>
            <button
              onClick={toggleSlider}
              style={{
                fontSize: '12px',
                padding: '2px 10px',
                borderRadius: '2px',
                border: `1px solid ${useSlider ? '#B4532A' : 'var(--line)'}`,
                backgroundColor: useSlider ? 'rgba(180,83,42,0.1)' : 'var(--paper)',
                color: useSlider ? '#B4532A' : 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {useSlider ? 'Using slider' : 'Use slider'}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={sliderValue}
            onChange={e => handleSliderChange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--waterlogging, #2F5D73)' }}
            aria-label="Rainfall scenario slider in mm per day"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)' }}>
            <span>0 mm (dry)</span>
            <span>50 mm (moderate)</span>
            <span>200 mm (cyclonic)</span>
          </div>
        </div>
      </div>

      {/* Simulated notice */}
      {(simulated || useSlider) && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'rgba(47,93,115,0.08)',
            border: '1px solid #2F5D73',
            borderRadius: '2px',
            fontSize: '13px',
            color: '#2F5D73',
            marginBottom: '24px',
          }}
        >
          {useSlider
            ? `Showing simulated predictions for a manual rainfall input of ${sliderValue} mm/day. This is not a real forecast.`
            : 'Open-Meteo API unavailable. Showing stored sample forecast data. Predictions are illustrative.'}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[320, 180, 220].map((h, i) => (
            <div
              key={i}
              style={{
                height: `${h}px`,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(180,83,42,0.08)',
            border: '1px solid #B4532A',
            borderRadius: '2px',
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#B4532A', marginBottom: '8px' }}>
            Prediction service unavailable
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => load(day, rainfallOverride)}
            style={{
              padding: '8px 20px',
              borderRadius: '2px',
              border: '1px solid #B4532A',
              backgroundColor: 'transparent',
              color: '#B4532A',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {(['high', 'medium', 'low'] as const).map(level => {
              const c = RISK_COLORS[level];
              return (
                <div
                  key={level}
                  style={{
                    padding: '20px',
                    backgroundColor: c.bg,
                    border: `1px solid ${c.border}`,
                    borderRadius: '2px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: c.text, marginBottom: '4px' }}>
                    {riskCounts[level]}
                  </div>
                  <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: c.text }}>
                    {c.label} Risk Wards
                  </div>
                </div>
              );
            })}
            <div
              style={{
                padding: '20px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: 'var(--ink)', marginBottom: '4px' }}>
                {wards[0]?.rainfall_mm ?? 0}
                <span style={{ fontSize: '14px', fontFamily: 'var(--font-sans)' }}> mm</span>
              </div>
              <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)' }}>
                Rainfall Input
              </div>
            </div>
          </div>

          {/* Top 5 High Risk Wards */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '2px', backgroundColor: 'var(--surface)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Priority Attention
              </div>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Top High-Risk Wards for {data.data.selected_date}</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                Ranked by flood probability. All wards above 70% probability should be pre-emptively informed.
              </p>
            </div>
            {top5.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                No wards assessed as high risk for this rainfall scenario.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {top5.map((ward, rank) => (
                  <div
                    key={ward.ward_id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 16px',
                      border: '1px solid var(--line)',
                      borderRadius: '2px',
                      backgroundColor: 'var(--paper)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '24px',
                        color: '#B4532A',
                        minWidth: '32px',
                        textAlign: 'center',
                      }}
                    >
                      {rank + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>{ward.ward_name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {ward.ward_no} · Zone: {ward.zone} · Elev: {ward.elevation_m}m · Drainage: {ward.drainage_score}/10
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <RiskBadge level={ward.risk_level} />
                      <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
                        {Math.round(ward.probability * 100)}% probability
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All wards grid */}
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>All Wards ({wards.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {wards.map(ward => {
                const c = RISK_COLORS[ward.risk_level];
                return (
                  <div
                    key={ward.ward_id}
                    style={{
                      padding: '14px',
                      border: '1px solid var(--line)',
                      borderRadius: '2px',
                      backgroundColor: 'var(--paper)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{ward.ward_name}</div>
                      <RiskBadge level={ward.risk_level} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                      {ward.ward_no} · {ward.zone}
                    </div>
                    {/* Probability bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginBottom: '3px' }}>
                        <span>Flood probability</span>
                        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(ward.probability * 100)}%</span>
                      </div>
                      <div style={{ height: '6px', backgroundColor: 'var(--line)', borderRadius: '1px' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.round(ward.probability * 100)}%`,
                            backgroundColor: c.border,
                            borderRadius: '1px',
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px', color: 'var(--muted)' }}>
                      <span>Elev: {ward.elevation_m}m</span>
                      <span>Drainage: {ward.drainage_score}/10</span>
                      <span>Floods: {ward.past_flood_events}</span>
                      <span>Impervious: {ward.impervious_pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature importance chart */}
          <div style={{ border: '1px solid var(--line)', borderRadius: '2px', backgroundColor: 'var(--surface)', padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Model Transparency
              </div>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Feature Importance</h3>
              <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                Relative influence of each input variable in the Random Forest classifier. Rainfall and drainage
                together account for over 69% of the model decision.
              </p>
            </div>
            {featureImportances.map(f => (
              <FeatureImportanceBar key={f.label} label={f.label} value={f.value} max={maxImportance} color={f.color} />
            ))}
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
              Model: Random Forest (100 trees, max depth 6). Trained on {16 * 100} ward-day scenarios generated from
              Kolkata KMC ward parameters and historical flood event counts. Accuracy on held-out test set: 86.4%.
              All results are indicative: consult KMC or the State Disaster Management Authority for official advisories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
