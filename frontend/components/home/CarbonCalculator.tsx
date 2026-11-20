'use client';

import React, { useState, useMemo } from 'react';
import { calculateFootprint, CarbonCalculatorInput } from '@/lib/factors';
import { Input, Select } from '@/components/ui/Input';

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

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '32px',
      }}
    >
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>
          Interactive Carbon Footprint Calculator
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
          Enter your monthly and weekly habits to compute your annual CO2 emissions and the number of trees required to absorb them.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            id="calc-electricity"
            label="Electricity consumption"
            type="number"
            min="0"
            unit="kWh/mo"
            value={electricity}
            onChange={(e) => setElectricity(Math.max(0, Number(e.target.value)))}
          />
          <Input
            id="calc-car"
            label="Car travel"
            type="number"
            min="0"
            unit="km/wk"
            value={carKm}
            onChange={(e) => setCarKm(Math.max(0, Number(e.target.value)))}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              id="calc-bus"
              label="Bus travel"
              type="number"
              min="0"
              unit="km/wk"
              value={busKm}
              onChange={(e) => setBusKm(Math.max(0, Number(e.target.value)))}
            />
            <Input
              id="calc-metro"
              label="Metro travel"
              type="number"
              min="0"
              unit="km/wk"
              value={metroKm}
              onChange={(e) => setMetroKm(Math.max(0, Number(e.target.value)))}
            />
          </div>
          <Input
            id="calc-flights"
            label="Short domestic flights"
            type="number"
            min="0"
            unit="trips/yr"
            value={flights}
            onChange={(e) => setFlights(Math.max(0, Number(e.target.value)))}
          />
          <Select
            id="calc-diet"
            label="Diet profile"
            value={diet}
            onChange={(e) => setDiet(e.target.value as 'vegetarian' | 'mixed' | 'meatHeavy')}
            options={[
              { value: 'vegetarian', label: 'Vegetarian (approx 1,000 kg CO2/yr)' },
              { value: 'mixed', label: 'Mixed balanced (approx 1,700 kg CO2/yr)' },
              { value: 'meatHeavy', label: 'Meat heavy (approx 2,500 kg CO2/yr)' },
            ]}
          />
        </div>

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
            <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Estimated Annual Emission
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '48px',
                fontWeight: 600,
                color: 'var(--clay)',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {result.totalTonnesPerYear.toFixed(2)}
              <span style={{ fontSize: '20px', fontWeight: 400, color: 'var(--ink)', marginLeft: '8px' }}>
                tonnes CO2/yr
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              ({result.totalKgPerYear.toLocaleString()} kg CO2 equivalent)
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
                Emissions Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Electricity (grid 0.80 kg/kWh)</span>
                  <span className="tabular-nums">{result.breakdown.electricityKg.toLocaleString()} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Ground Transit</span>
                  <span className="tabular-nums">{result.breakdown.travelKg.toLocaleString()} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Aviation (250 kg/flight)</span>
                  <span className="tabular-nums">{result.breakdown.flightsKg.toLocaleString()} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>Dietary Food Intake</span>
                  <span className="tabular-nums">{result.breakdown.dietKg.toLocaleString()} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '4px' }}>
              Reforestation Offset Requirement
            </div>
            <div
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '28px',
                fontWeight: 600,
                color: 'var(--forest)',
              }}
            >
              {result.treesNeeded.toLocaleString()} mature trees
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              Based on standard absorption of 21 kg CO2 per mature tree annually in Indian agro-climatic zones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
