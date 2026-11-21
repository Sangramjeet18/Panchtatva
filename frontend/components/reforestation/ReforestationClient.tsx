'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input, Select } from '@/components/ui/Input';
import speciesCatalog from '@/data/serve/species.json';

const REGIONS = [
  { value: 'all', label: 'All Regions (India)' },
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Kerala', label: 'Kerala' },
];

const RAINFALL_BANDS = [
  { value: 'all', label: 'All Rainfall Bands' },
  { value: 'Low', label: 'Low (<1000 mm)' },
  { value: 'Moderate', label: 'Moderate (1000–2000 mm)' },
  { value: 'High', label: 'High (>2000 mm)' },
];

export function ReforestationClient() {
  const [trees, setTrees] = useState<number>(5000);
  const [hectares, setHectares] = useState<number>(5);
  const [region, setRegion] = useState<string>('all');
  const [rainfallBand, setRainfallBand] = useState<string>('all');

  const handleTreesChange = (val: number) => {
    const t = Math.max(1, val);
    setTrees(t);
    setHectares(Math.round((t / 1000) * 10) / 10);
  };

  const handleHectaresChange = (val: number) => {
    const h = Math.max(0.1, val);
    setHectares(h);
    setTrees(Math.round(h * 1000));
  };

  // Standard absorption rate (Data Truth Rule 5: Assumption)
  const absorptionRate = 21.0;
  const annualKg = Math.round(trees * absorptionRate);
  const annualTonnes = (annualKg / 1000.0).toFixed(1);

  // Filter 19 species candidates
  const filteredSpecies = useMemo(() => {
    let list = [...speciesCatalog];
    if (rainfallBand !== 'all') {
      list = list.filter((s: any) => s.rainfall_band === rainfallBand);
    }
    if (region !== 'all') {
      list = list.filter((s: any) => s.region.includes(region) || s.region === 'All Regions');
    }
    return list;
  }, [region, rainfallBand]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      {/* Parameter Inputs */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--surface)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <div className="kicker" style={{ color: 'var(--clay)' }}>
            Planning Inputs
          </div>
          <h3 style={{ fontSize: '24px', margin: 0 }}>Reforestation Target Parameters</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>
            Adjust planned sapling quantities and filter candidates against regional agro-climatic zones.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <Input
            id="rf-trees"
            label="Target Tree Count"
            type="number"
            min="10"
            unit="trees"
            value={trees}
            onChange={(e) => handleTreesChange(Number(e.target.value))}
          />
          <Input
            id="rf-hectares"
            label="Planting Land Area"
            type="number"
            min="0.1"
            step="0.5"
            unit="ha"
            value={hectares}
            onChange={(e) => handleHectaresChange(Number(e.target.value))}
          />
          <Select
            id="rf-region"
            label="Target Agro-Climatic Zone"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            options={REGIONS}
          />
          <Select
            id="rf-rainfall"
            label="Regional Rainfall Band"
            value={rainfallBand}
            onChange={(e) => setRainfallBand(e.target.value)}
            options={RAINFALL_BANDS}
          />
        </div>
      </div>

      {/* Calculated Absorption Outputs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        <div
          style={{
            border: '1px solid var(--forest)',
            backgroundColor: 'var(--paper)',
            borderRadius: '2px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
              Projected Annual CO2 Absorption
            </span>
            <span className="tag-badge-assumption">Assumption</span>
          </div>
          <div
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '48px',
              fontWeight: 600,
              color: 'var(--forest)',
              lineHeight: 1,
              marginBottom: '8px',
            }}
          >
            {annualTonnes}
            <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--ink)', marginLeft: '8px' }}>
              tonnes CO2/yr
            </span>
          </div>
          <div style={{ fontSize: '14px', color: 'var(--muted)' }} className="tabular-nums">
            ({annualKg.toLocaleString()} kilograms annual CO2e)
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--line)',
            backgroundColor: 'var(--surface)',
            borderRadius: '2px',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em' }}>
              Rule 5 Scientific Disclosure
            </span>
            <span className="tag-badge-assumption">Assumption</span>
          </div>
          <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>21 kg CO2/Tree Baseline Assumption</h4>
          <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
            Individual tree absorption is missing measured biometric instrumentation. The planner relies on the standard forestry baseline of <strong>21 kg CO2 per mature tree annually</strong>. This figure is an unverified model assumption and must never be presented as measured physical reality.
          </p>
        </div>
      </div>

      {/* 19 Species Candidates Inventory Table */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--paper)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div className="kicker" style={{ color: 'var(--forest)' }}>
              Native Inventory
            </div>
            <h3 style={{ fontSize: '24px', margin: 0 }}>
              Agro-Climatic Species Candidates ({filteredSpecies.length} of 19 Matched)
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="tag-badge-assumption">Assumption References</span>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Indian Forestry Database</span>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', maxWidth: '72ch' }}>
          Filtered by rainfall tolerance bands. All species absorption benchmarks represent approximate published forestry guidelines tagged Assumption.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="hairline-table" style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Common Name</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Scientific Name</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Rainfall Band</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Absorption Rate</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Ecological Role</th>
                <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSpecies.map((sp: any) => (
                <tr key={sp.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{sp.common_name}</td>
                  <td style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: '13px' }}>{sp.scientific_name}</td>
                  <td style={{ fontSize: '13px' }}>
                    {sp.rainfall_band} ({sp.min_rain_mm}–{sp.max_rain_mm} mm)
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 600, color: 'var(--forest)' }}>
                    {sp.co2_kg_per_year} kg/yr
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '280px' }}>{sp.notes}</td>
                  <td>
                    <span className="tag-badge-assumption">{sp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
