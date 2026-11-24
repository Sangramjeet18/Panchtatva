'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateFootprint, CarbonCalculatorInput } from '@/lib/factors';

export function CarbonCalculatorFull() {
  const [electricity, setElectricity] = useState<number>(220);
  const [carKm, setCarKm] = useState<number>(60);
  const [busKm, setBusKm] = useState<number>(40);
  const [metroKm, setMetroKm] = useState<number>(30);
  const [flights, setFlights] = useState<number>(2);
  const [diet, setDiet] = useState<'vegetarian' | 'mixed' | 'meatHeavy'>('mixed');

  const input: CarbonCalculatorInput = useMemo(
    () => ({
      electricityKWhMonthly: Number(electricity) || 0,
      carKmWeekly: Number(carKm) || 0,
      busKmWeekly: Number(busKm) || 0,
      metroKmWeekly: Number(metroKm) || 0,
      flightsYearly: Number(flights) || 0,
      dietType: diet,
    }),
    [electricity, carKm, busKm, metroKm, flights, diet]
  );

  const result = useMemo(() => calculateFootprint(input), [input]);

  // Proportions for flat horizontal bar breakdown
  const total = Math.max(1, result.totalKgPerYear);
  const elecPct = Math.round((result.breakdown.electricityKg / total) * 100);
  const travelPct = Math.round((result.breakdown.travelKg / total) * 100);
  const flightsPct = Math.round((result.breakdown.flightsKg / total) * 100);
  const dietPct = Math.max(0, 100 - elecPct - travelPct - flightsPct);

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '32px',
      }}
    >
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Personal Assessment
        </div>
        <h2 style={{ fontSize: '28px', margin: 0 }}>Household Footprint Accounting</h2>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>
          Input monthly electrical consumption, ground commuting habits, annual domestic flights and diet profile.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
        }}
      >
        {/* Controls: sliders in hairline separated fields */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Field 1: Electricity */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="carb-elec" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Grid electricity consumption
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--forest)' }}>
                {electricity} kWh/mo
              </span>
            </div>
            <input
              id="carb-elec"
              type="range"
              min="0"
              max="800"
              step="10"
              value={electricity}
              onChange={(e) => setElectricity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--forest)' }}
              aria-label="Grid electricity consumption in kilowatt-hours per month"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0 kWh (off-grid)</span>
              <span>220 kWh (urban avg)</span>
              <span>800 kWh (high)</span>
            </div>
          </div>

          {/* Field 2: Car Travel */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="carb-car" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Personal car travel
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--river)' }}>
                {carKm} km/wk
              </span>
            </div>
            <input
              id="carb-car"
              type="range"
              min="0"
              max="300"
              step="5"
              value={carKm}
              onChange={(e) => setCarKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--river)' }}
              aria-label="Personal car travel in kilometers per week"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0 km</span>
              <span>60 km</span>
              <span>300 km</span>
            </div>
          </div>

          {/* Field 3: Public Transit */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="carb-bus" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Bus & Metro public transit
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>
                {busKm + metroKm} km/wk
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Bus ({busKm} km)</span>
                <input
                  id="carb-bus"
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={busKm}
                  onChange={(e) => setBusKm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--smoke)' }}
                  aria-label="Bus travel in kilometers per week"
                />
              </div>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>Metro ({metroKm} km)</span>
                <input
                  id="carb-metro"
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={metroKm}
                  onChange={(e) => setMetroKm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--smoke)' }}
                  aria-label="Metro travel in kilometers per week"
                />
              </div>
            </div>
          </div>

          {/* Field 4: Flights */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="carb-flights" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Short domestic flights
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--smoke)' }}>
                {flights} {flights === 1 ? 'flight' : 'flights'}/yr
              </span>
            </div>
            <input
              id="carb-flights"
              type="range"
              min="0"
              max="15"
              step="1"
              value={flights}
              onChange={(e) => setFlights(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--smoke)' }}
              aria-label="Short domestic flights per year"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0</span>
              <span>2</span>
              <span>15 flights</span>
            </div>
          </div>

          {/* Field 5: Diet Profile */}
          <div style={{ paddingBottom: '8px' }}>
            <label htmlFor="carb-diet" style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              Dietary consumption profile
            </label>
            <select
              id="carb-diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value as 'vegetarian' | 'mixed' | 'meatHeavy')}
              style={{
                width: '100%',
                height: '48px',
                padding: '0 14px',
                borderRadius: '2px',
                border: '1px solid var(--line)',
                backgroundColor: 'var(--paper)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
              }}
            >
              <option value="vegetarian">Vegetarian (1,000 kg CO2/yr baseline)</option>
              <option value="mixed">Mixed balanced (1,700 kg CO2/yr baseline)</option>
              <option value="meatHeavy">Meat heavy (2,500 kg CO2/yr baseline)</option>
            </select>
          </div>
        </div>

        {/* Results and flat horizontal bar breakdown */}
        <div
          style={{
            border: '1px solid var(--ink)',
            backgroundColor: 'var(--paper)',
            borderRadius: '2px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div className="kicker" style={{ color: 'var(--muted)' }}>
              Computed Annual Carbon Output
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(56px, 7vw, 104px)',
                fontWeight: 600,
                color: 'var(--clay)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: '6px',
              }}
            >
              {result.totalTonnesPerYear.toFixed(2)}
              <span style={{ fontSize: '20px', fontWeight: 400, color: 'var(--ink)', marginLeft: '8px' }}>
                tonnes CO2/yr
              </span>
            </div>
            <div style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '28px' }}>
              ({result.totalKgPerYear.toLocaleString()} kilograms of carbon dioxide equivalent)
            </div>

            {/* Flat horizontal bar breakdown (flat solid color fills) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                Proportional Breakdown Bar
              </div>
              <div
                style={{
                  height: '24px',
                  width: '100%',
                  display: 'flex',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface)',
                }}
              >
                {elecPct > 0 && (
                  <div
                    style={{
                      width: `${elecPct}%`,
                      backgroundColor: 'var(--forest)',
                      height: '100%',
                    }}
                    title={`Electricity: ${elecPct}%`}
                  />
                )}
                {travelPct > 0 && (
                  <div
                    style={{
                      width: `${travelPct}%`,
                      backgroundColor: 'var(--river)',
                      height: '100%',
                    }}
                    title={`Travel: ${travelPct}%`}
                  />
                )}
                {flightsPct > 0 && (
                  <div
                    style={{
                      width: `${flightsPct}%`,
                      backgroundColor: 'var(--smoke)',
                      height: '100%',
                    }}
                    title={`Aviation: ${flightsPct}%`}
                  />
                )}
                {dietPct > 0 && (
                  <div
                    style={{
                      width: `${dietPct}%`,
                      backgroundColor: 'var(--clay)',
                      height: '100%',
                    }}
                    title={`Diet: ${dietPct}%`}
                  />
                )}
              </div>

              {/* Bar Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--forest)', borderRadius: '1px' }} />
                  <span style={{ color: 'var(--muted)' }}>Power:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>{result.breakdown.electricityKg} kg</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--river)', borderRadius: '1px' }} />
                  <span style={{ color: 'var(--muted)' }}>Transit:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>{result.breakdown.travelKg} kg</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--smoke)', borderRadius: '1px' }} />
                  <span style={{ color: 'var(--muted)' }}>Flights:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>{result.breakdown.flightsKg} kg</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: 'var(--clay)', borderRadius: '1px' }} />
                  <span style={{ color: 'var(--muted)' }}>Diet:</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--ink)' }}>{result.breakdown.dietKg} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trees equivalent below */}
          <div
            style={{
              borderTop: '1px solid var(--line)',
              paddingTop: '20px',
            }}
          >
            <div className="kicker" style={{ color: 'var(--forest)' }}>
              Offset Requirement
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '36px',
                fontWeight: 600,
                color: 'var(--forest)',
                lineHeight: 1.1,
                marginBottom: '4px',
              }}
            >
              {result.treesNeeded.toLocaleString()} mature trees
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
              At standard Indian agro-climatic absorption of 21 kg CO2 per mature tree annually, planting this quantity neutralizes your annual greenhouse emissions.
            </p>
            <Link
              href={`/reforestation?trees=${result.treesNeeded}`}
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--forest)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Plan species and zones in Reforestation Planner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
