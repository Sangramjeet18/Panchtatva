'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateFootprint, CarbonCalculatorInput } from '@/lib/factors';

export function CarbonCalculator() {
  const [electricity, setElectricity] = useState<number>(180);
  const [carKm, setCarKm] = useState<number>(40);
  const [busKm, setBusKm] = useState<number>(30);
  const [metroKm, setMetroKm] = useState<number>(20);
  const [flights, setFlights] = useState<number>(1);
  const [diet, setDiet] = useState<'vegetarian' | 'mixed' | 'meatHeavy'>('vegetarian');

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

  const totalKg = Math.max(1, result.totalKgPerYear);
  const elecPct = Math.round((result.breakdown.electricityKg / totalKg) * 100);
  const travelPct = Math.round((result.breakdown.travelKg / totalKg) * 100);
  const flightsPct = Math.round((result.breakdown.flightsKg / totalKg) * 100);
  const dietPct = Math.max(0, 100 - elecPct - travelPct - flightsPct);

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '40px',
      }}
    >
      <div style={{ marginBottom: '32px' }}>
        <div className="kicker" style={{ color: 'var(--clay)' }}>
          Module 03 Model Demo
        </div>
        <h3 style={{ fontSize: '32px', marginBottom: '8px' }}>
          Interactive Carbon Footprint Calculator
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '64ch' }}>
          Adjust your consumption parameters below using empirical emission factors from the Central Electricity Authority and IPCC guidelines.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Sliders in hairline separated fields */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Field 1: Electricity */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="calc-electricity" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Electricity consumption
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--forest)' }}>
                {electricity} kWh/mo
              </span>
            </div>
            <input
              id="calc-electricity"
              type="range"
              min="0"
              max="800"
              step="10"
              value={electricity}
              onChange={(e) => setElectricity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--forest)' }}
              aria-label="Electricity consumption in kilowatt-hours per month"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0 kWh (off-grid)</span>
              <span>180 kWh (urban avg)</span>
              <span>800 kWh (high)</span>
            </div>
          </div>

          {/* Field 2: Car Travel */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="calc-car" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Private car travel
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--river)' }}>
                {carKm} km/wk
              </span>
            </div>
            <input
              id="calc-car"
              type="range"
              min="0"
              max="300"
              step="5"
              value={carKm}
              onChange={(e) => setCarKm(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--river)' }}
              aria-label="Private car travel in kilometers per week"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0 km</span>
              <span>40 km</span>
              <span>300 km</span>
            </div>
          </div>

          {/* Field 3: Public Transit (Bus & Metro) */}
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="calc-bus" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
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
                  id="calc-bus"
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
                  id="calc-metro"
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
              <label htmlFor="calc-flights" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>
                Domestic flights
              </label>
              <span className="tabular-nums" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--smoke)' }}>
                {flights} {flights === 1 ? 'flight' : 'flights'}/yr
              </span>
            </div>
            <input
              id="calc-flights"
              type="range"
              min="0"
              max="15"
              step="1"
              value={flights}
              onChange={(e) => setFlights(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--smoke)' }}
              aria-label="Domestic flights per year"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
              <span>0</span>
              <span>5</span>
              <span>15 flights</span>
            </div>
          </div>

          {/* Field 5: Diet Profile */}
          <div style={{ paddingBottom: '8px' }}>
            <label htmlFor="calc-diet" style={{ display: 'block', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
              Diet profile
            </label>
            <select
              id="calc-diet"
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
              <option value="vegetarian">Vegetarian (approx 1,000 kg CO2/yr)</option>
              <option value="mixed">Mixed balanced (approx 1,700 kg CO2/yr)</option>
              <option value="meatHeavy">Meat heavy (approx 2,500 kg CO2/yr)</option>
            </select>
          </div>
        </div>

        {/* Result panel with 1px ink border */}
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
              Annual Total Footprint
            </div>
            
            {/* Large tabular number at 104px */}
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(56px, 7vw, 104px)',
                fontWeight: 600,
                color: 'var(--clay)',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}
            >
              {result.totalTonnesPerYear.toFixed(2)}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 500, color: 'var(--ink)', marginBottom: '8px' }}>
              tonnes CO2 equivalent per year
            </div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '28px' }}>
              ({result.totalKgPerYear.toLocaleString()} kilograms annual CO2e)
            </div>

            {/* Flat horizontal bars in module colours */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: '8px' }}>
                Proportional Breakdown
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
                    title={`Electricity: ${elecPct}%`}
                    style={{ width: `${elecPct}%`, backgroundColor: 'var(--forest)' }}
                  />
                )}
                {travelPct > 0 && (
                  <div
                    title={`Travel: ${travelPct}%`}
                    style={{ width: `${travelPct}%`, backgroundColor: 'var(--river)' }}
                  />
                )}
                {flightsPct > 0 && (
                  <div
                    title={`Aviation: ${flightsPct}%`}
                    style={{ width: `${flightsPct}%`, backgroundColor: 'var(--smoke)' }}
                  />
                )}
                {dietPct > 0 && (
                  <div
                    title={`Diet: ${dietPct}%`}
                    style={{ width: `${dietPct}%`, backgroundColor: 'var(--clay)' }}
                  />
                )}
              </div>

              {/* Breakdown numbers */}
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
              At standard Indian agro-climatic absorption of 21 kg CO2 per mature tree annually.
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
