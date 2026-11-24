'use client';

import React, { useState, useMemo } from 'react';
import areasData from '@/data/serve/monitoring_areas.json';
import rainfallData from '@/data/serve/rainfall_daily.json';

interface MonitoringArea {
  id: number;
  name: string;
  lat: number;
  lon: number;
  elevation_m: number;
  data_status: string;
}

interface RainfallRecord {
  area_id: number;
  area_name: string;
  date: string;
  rain_mm: number;
  rain_3day: number;
  elevation_m: number;
  risk_proxy: string;
  data_status: string;
}

const RISK_CONFIG = {
  low: {
    bg: 'rgba(91,123,58,0.12)',
    text: '#5B7B3A',
    border: '#5B7B3A',
    label: 'Low Risk',
  },
  medium: {
    bg: 'rgba(184,138,30,0.12)',
    text: '#B88A1E',
    border: '#B88A1E',
    label: 'Medium Risk',
  },
  high: {
    bg: 'rgba(180,83,42,0.14)',
    text: '#B4532A',
    border: '#B4532A',
    label: 'High Risk',
  },
};

/**
 * Transparent screening rule (Data Truth Standard).
 * Evaluates drainage vulnerability deterministically:
 * - High: 3-day accumulated rainfall >= 70mm and elevation <= 5.0m
 * - Medium: 3-day accumulated rainfall >= 40mm, or >= 25mm with elevation <= 6.0m
 * - Low: all other conditions
 */
function calculateScreeningIndex(rain3DayMm: number, elevationM: number): 'low' | 'medium' | 'high' {
  if (rain3DayMm >= 70.0 && elevationM <= 5.0) {
    return 'high';
  } else if (rain3DayMm >= 40.0 || (rain3DayMm >= 25.0 && elevationM <= 6.0)) {
    return 'medium';
  }
  return 'low';
}

export function WaterloggingClient() {
  const areas: MonitoringArea[] = areasData as MonitoringArea[];
  const records: RainfallRecord[] = rainfallData as RainfallRecord[];

  // Unique forecast dates sorted
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(records.map((r) => r.date)));
    return dates.sort();
  }, [records]);

  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0] || '2026-11-21');
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [useSlider, setUseSlider] = useState<boolean>(false);

  // Compute screening status for each monitoring area
  const evaluatedAreas = useMemo(() => {
    return areas.map((area) => {
      let rainVal = 0;
      let rain3Day = 0;

      if (useSlider) {
        rainVal = sliderValue;
        rain3Day = Number((sliderValue * 2.2).toFixed(1));
      } else {
        const match = records.find((r) => r.area_id === area.id && r.date === selectedDate);
        if (match) {
          rainVal = match.rain_mm;
          rain3Day = match.rain_3day;
        } else {
          rainVal = 0;
          rain3Day = 0;
        }
      }

      const risk = calculateScreeningIndex(rain3Day, area.elevation_m);

      return {
        ...area,
        rain_mm: rainVal,
        rain_3day_mm: rain3Day,
        risk_proxy: risk,
      };
    });
  }, [areas, records, selectedDate, useSlider, sliderValue]);

  const riskCounts = useMemo(() => {
    return evaluatedAreas.reduce(
      (acc, a) => {
        acc[a.risk_proxy]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 } as Record<'low' | 'medium' | 'high', number>
    );
  }, [evaluatedAreas]);

  return (
    <div>
      {/* Data Truth Banner */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '2px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="tag-badge-proxy">Proxy</span>
          <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>
            Deterministic Screening Index Specification
          </span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          The waterlogging risk label is a transparent screening index calculated deterministically from Open-Meteo rainfall forecasts and elevation survey data. It is not an ML-trained classifier, and no accuracy, precision, or recall figures are claimed. The 8 Kolkata locations represent monitored topographical stations, not municipal wards.
        </p>
      </div>

      {/* Scenario and Date Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          padding: '24px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '2px',
          marginBottom: '32px',
        }}
      >
        {/* Date Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>
            Open-Meteo Forecast Date (7-day window)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {availableDates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setSelectedDate(d);
                  setUseSlider(false);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '2px',
                  border: !useSlider && selectedDate === d ? '1px solid var(--forest)' : '1px solid var(--line)',
                  backgroundColor: !useSlider && selectedDate === d ? 'var(--forest)' : 'var(--paper)',
                  color: !useSlider && selectedDate === d ? '#EDE7D9' : 'var(--ink)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                }}
              >
                {d.slice(5)}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Rainfall Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Simulation scenario: {sliderValue} mm/day
            </label>
            <button
              type="button"
              onClick={() => setUseSlider(!useSlider)}
              style={{
                fontSize: '12px',
                padding: '2px 10px',
                borderRadius: '2px',
                border: `1px solid ${useSlider ? 'var(--clay)' : 'var(--line)'}`,
                backgroundColor: useSlider ? 'rgba(180,83,42,0.1)' : 'var(--paper)',
                color: useSlider ? 'var(--clay)' : 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {useSlider ? 'Using slider' : 'Use simulation'}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={sliderValue}
            onChange={(e) => {
              setSliderValue(Number(e.target.value));
              setUseSlider(true);
            }}
            style={{ width: '100%', accentColor: 'var(--river)' }}
            aria-label="Manual rainfall scenario in mm"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            <span>0 mm (Dry)</span>
            <span>40 mm (Screening trigger)</span>
            <span>200 mm (Cyclonic surge)</span>
          </div>
        </div>
      </div>

      {/* Summary Stat Counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            padding: '20px',
            backgroundColor: RISK_CONFIG.high.bg,
            border: `1px solid ${RISK_CONFIG.high.border}`,
            borderRadius: '2px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: RISK_CONFIG.high.text, marginBottom: '4px' }}>
            {riskCounts.high}
          </div>
          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_CONFIG.high.text, fontWeight: 600 }}>
            High Risk Stations
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: RISK_CONFIG.medium.bg,
            border: `1px solid ${RISK_CONFIG.medium.border}`,
            borderRadius: '2px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: RISK_CONFIG.medium.text, marginBottom: '4px' }}>
            {riskCounts.medium}
          </div>
          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_CONFIG.medium.text, fontWeight: 600 }}>
            Medium Risk Stations
          </div>
        </div>

        <div
          style={{
            padding: '20px',
            backgroundColor: RISK_CONFIG.low.bg,
            border: `1px solid ${RISK_CONFIG.low.border}`,
            borderRadius: '2px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '36px', fontFamily: 'var(--font-serif)', color: RISK_CONFIG.low.text, marginBottom: '4px' }}>
            {riskCounts.low}
          </div>
          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: RISK_CONFIG.low.text, fontWeight: 600 }}>
            Low Risk Stations
          </div>
        </div>

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
            8
          </div>
          <div style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', fontWeight: 600 }}>
            Total Monitored Areas
          </div>
        </div>
      </div>

      {/* Deterministic Screening Rule Definition Box */}
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: '2px',
          backgroundColor: 'var(--surface)',
          padding: '24px',
          marginBottom: '32px',
        }}
      >
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>
          Screening Rule Definition
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
          The classification evaluates water accumulation risk through a transparent two-tier physical threshold based on 3-day accumulated rainfall and ground elevation:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '2px', backgroundColor: 'var(--paper)' }}>
            <div style={{ fontWeight: 600, color: RISK_CONFIG.high.text, fontSize: '14px', marginBottom: '4px' }}>
              High Risk Rule
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              3-day accumulated rainfall &ge; 70.0 mm AND ground elevation &le; 5.0 m
            </div>
          </div>
          <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '2px', backgroundColor: 'var(--paper)' }}>
            <div style={{ fontWeight: 600, color: RISK_CONFIG.medium.text, fontSize: '14px', marginBottom: '4px' }}>
              Medium Risk Rule
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              3-day rainfall &ge; 40.0 mm OR (rainfall &ge; 25.0 mm AND elevation &le; 6.0 m)
            </div>
          </div>
          <div style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '2px', backgroundColor: 'var(--paper)' }}>
            <div style={{ fontWeight: 600, color: RISK_CONFIG.low.text, fontSize: '14px', marginBottom: '4px' }}>
              Low Risk Rule
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink)' }}>
              All other conditions where precipitation remains below screening triggers
            </div>
          </div>
        </div>
      </div>

      {/* Table of 8 Monitoring Areas */}
      <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
        <table className="hairline-table" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Station / Monitoring Area</th>
              <th>Elevation (m)</th>
              <th>24h Rain (mm)</th>
              <th>3-Day Rain (mm)</th>
              <th>Screening Index</th>
              <th>Data Status</th>
            </tr>
          </thead>
          <tbody>
            {evaluatedAreas.map((area) => {
              const conf = RISK_CONFIG[area.risk_proxy];
              return (
                <tr key={area.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>
                    <div>{area.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>
                      Lat: {area.lat.toFixed(4)}, Lon: {area.lon.toFixed(4)}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontVariantNumeric: 'tabular-nums', marginRight: '8px' }}>
                      {area.elevation_m.toFixed(1)} m
                    </span>
                    <span className="tag-badge-real">Real</span>
                  </td>
                  <td>
                    <span style={{ fontVariantNumeric: 'tabular-nums', marginRight: '8px' }}>
                      {area.rain_mm.toFixed(1)} mm
                    </span>
                    <span className="tag-badge-modelled">Modelled</span>
                  </td>
                  <td>
                    <span style={{ fontVariantNumeric: 'tabular-nums', marginRight: '8px' }}>
                      {area.rain_3day_mm.toFixed(1)} mm
                    </span>
                    <span className="tag-badge-modelled">Modelled</span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '2px',
                        backgroundColor: conf.bg,
                        color: conf.text,
                        border: `1px solid ${conf.border}`,
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {conf.label}
                    </span>
                  </td>
                  <td>
                    <span className="tag-badge-proxy">Proxy</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
