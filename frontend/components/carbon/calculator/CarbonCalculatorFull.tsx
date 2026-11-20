'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateFootprint, CarbonCalculatorInput } from '@/lib/factors';
import { Input, Select } from '@/components/ui/Input';

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
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <Input
            id="carb-elec"
            label="Grid electricity consumption"
            type="number"
            min="0"
            unit="kWh/mo"
            value={electricity}
            onChange={(e) => setElectricity(Math.max(0, Number(e.target.value)))}
          />
          <Input
            id="carb-car"
            label="Personal car travel"
            type="number"
            min="0"
            unit="km/wk"
            value={carKm}
            onChange={(e) => setCarKm(Math.max(0, Number(e.target.value)))}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              id="carb-bus"
              label="Bus commute"
              type="number"
              min="0"
              unit="km/wk"
              value={busKm}
              onChange={(e) => setBusKm(Math.max(0, Number(e.target.value)))}
            />
            <Input
              id="carb-metro"
              label="Metro commute"
              type="number"
              min="0"
              unit="km/wk"
              value={metroKm}
              onChange={(e) => setMetroKm(Math.max(0, Number(e.target.value)))}
            />
          </div>
          <Input
            id="carb-flights"
            label="Short domestic flights (under 2 hours)"
            type="number"
            min="0"
            unit="trips/yr"
            value={flights}
            onChange={(e) => setFlights(Math.max(0, Number(e.target.value)))}
          />
          <Select
            id="carb-diet"
            label="Dietary consumption pattern"
            value={diet}
            onChange={(e) => setDiet(e.target.value as 'vegetarian' | 'mixed' | 'meatHeavy')}
            options={[
              { value: 'vegetarian', label: 'Vegetarian (1,000 kg CO2/yr baseline)' },
              { value: 'mixed', label: 'Mixed balanced (1,700 kg CO2/yr baseline)' },
              { value: 'meatHeavy', label: 'Meat heavy (2,500 kg CO2/yr baseline)' },
            ]}
          />
        </div>

        {/* Results and flat horizontal bar breakdown */}
        <div
          style={{
            borderLeft: '1px solid var(--line)',
            paddingLeft: '32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Computed Annual Carbon Output
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '52px',
                fontWeight: 600,
                color: 'var(--clay)',
                lineHeight: 1,
                marginBottom: '6px',
              }}
            >
              {result.totalTonnesPerYear.toFixed(2)}
              <span style={{ fontSize: '20px', fontWeight: 400, color: 'var(--ink)', marginLeft: '8px' }}>
                tonnes CO2/yr
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              ({result.totalKgPerYear.toLocaleString()} kilograms of carbon dioxide equivalent)
            </div>

            {/* Flat horizontal bar breakdown (Rule 1: flat solid color fills) */}
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
                  backgroundColor: 'var(--paper)',
                }}
              >
                {elecPct > 0 && (
                  <div
                    style={{
                      width: `${elecPct}%`,
                      backgroundColor: 'var(--smoke)',
                      height: '100%',
                    }}
                    title={`Electricity: ${elecPct}%`}
                  />
                )}
                {travelPct > 0 && (
                  <div
                    style={{
                      width: `${travelPct}%`,
                      backgroundColor: 'var(--clay)',
                      height: '100%',
                    }}
                    title={`Travel: ${travelPct}%`}
                  />
                )}
                {flightsPct > 0 && (
                  <div
                    style={{
                      width: `${flightsPct}%`,
                      backgroundColor: 'var(--river)',
                      height: '100%',
                    }}
                    title={`Aviation: ${flightsPct}%`}
                  />
                )}
                {dietPct > 0 && (
                  <div
                    style={{
                      width: `${dietPct}%`,
                      backgroundColor: 'var(--forest)',
                      height: '100%',
                    }}
                    title={`Diet: ${dietPct}%`}
                  />
                )}
              </div>

              {/* Bar Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--smoke)', borderRadius: '1px' }} />
                  <span>Electricity: {result.breakdown.electricityKg.toLocaleString()} kg ({elecPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--clay)', borderRadius: '1px' }} />
                  <span>Transit: {result.breakdown.travelKg.toLocaleString()} kg ({travelPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--river)', borderRadius: '1px' }} />
                  <span>Aviation: {result.breakdown.flightsKg.toLocaleString()} kg ({flightsPct}%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', backgroundColor: 'var(--forest)', borderRadius: '1px' }} />
                  <span>Diet: {result.breakdown.dietKg.toLocaleString()} kg ({dietPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reforestation link card */}
          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--forest)',
              borderRadius: '2px',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--forest)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Cross-Module Action
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--forest)',
                marginBottom: '6px',
              }}
            >
              {result.treesNeeded.toLocaleString()} mature trees needed
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '14px' }}>
              At standard Indian agro-climatic absorption of 21 kg CO2 per mature tree annually, planting this quantity neutralizes your annual greenhouse emissions.
            </p>
            <Link
              href={`/reforestation?trees=${result.treesNeeded}`}
              style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--forest)',
              }}
            >
              Prefill in Reforestation Planner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
