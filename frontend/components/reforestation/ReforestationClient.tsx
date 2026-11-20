'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Input, Select } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';

const REGIONS = [
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Kerala', label: 'Kerala' },
];

const RAINFALL_BANDS = [
  { value: 'all', label: 'All Rainfall Bands' },
  { value: 'low', label: 'Low (<1000 mm)' },
  { value: 'medium', label: 'Medium (1000-2000 mm)' },
  { value: 'high', label: 'High (>2000 mm)' },
];

export function ReforestationClient() {
  const [trees, setTrees] = useState<number>(5000);
  const [hectares, setHectares] = useState<number>(5);
  const [region, setRegion] = useState<string>('West Bengal');
  const [rainfallBand, setRainfallBand] = useState<string>('all');

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({
        trees: trees.toString(),
        hectares: hectares.toString(),
        region,
        rainfall_band: rainfallBand,
      });
      const res = await fetch(`/api/reforestation/plan?${query.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to calculate plan (${res.status})`);
      }
      const json = await res.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Error calculating reforestation plan.');
    } finally {
      setLoading(false);
    }
  }, [trees, hectares, region, rainfallBand]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleTreesChange = (val: number) => {
    const t = Math.max(0, val);
    setTrees(t);
    setHectares(Math.round((t / 1000) * 10) / 10);
  };

  const handleHectaresChange = (val: number) => {
    const h = Math.max(0, val);
    setHectares(h);
    setTrees(Math.round(h * 1000));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      {/* Input controls */}
      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--surface)',
          borderRadius: '2px',
          padding: '28px',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '22px', marginBottom: '6px' }}>Reforestation Parameters</h3>
          <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
            Specify planting target or land coverage, local region and rainfall constraints.
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
            min="0"
            unit="trees"
            value={trees}
            onChange={(e) => handleTreesChange(Number(e.target.value))}
          />
          <Input
            id="rf-hectares"
            label="Planting Land Area"
            type="number"
            min="0"
            step="0.5"
            unit="hectares"
            value={hectares}
            onChange={(e) => handleHectaresChange(Number(e.target.value))}
          />
          <Select
            id="rf-region"
            label="Target State Region"
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

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton height="120px" />
          <Skeleton height="280px" />
          <Skeleton height="180px" />
        </div>
      )}

      {error && !loading && (
        <ErrorState message={error} onRetry={fetchPlan} />
      )}

      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {/* Carbon absorption headline metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                border: '1px solid var(--forest)',
                backgroundColor: 'var(--surface)',
                borderRadius: '2px',
                padding: '24px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--forest)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Total Annual CO2 Sequestration
              </div>
              <div
                className="tabular-nums"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '44px',
                  fontWeight: 600,
                  color: 'var(--forest)',
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {data.co2_tonnes_per_year.toLocaleString()}
                <span style={{ fontSize: '18px', fontWeight: 400, color: 'var(--ink)', marginLeft: '6px' }}>
                  tonnes/yr
                </span>
              </div>
              <div style={{ fontSize: '14px', color: 'var(--muted)' }}>
                {data.co2_kg_per_year.toLocaleString()} kg CO2 annually
              </div>
            </div>

            <div
              style={{
                border: '1px solid var(--line)',
                backgroundColor: 'var(--surface)',
                borderRadius: '2px',
                padding: '24px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Mathematical Formula Note
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
                {data.formula}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>
                Calculated at standard mature absorption constant of 21 kg CO2 per tree per year for mixed subtropical canopy.
              </p>
            </div>
          </div>

          {/* Priority planting zones */}
          <div
            style={{
              border: '1px solid var(--line)',
              backgroundColor: 'var(--surface)',
              borderRadius: '2px',
              padding: '28px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Integrated District Priorities
                </div>
                <h3 style={{ fontSize: '22px', margin: 0 }}>Priority Planting Zones ({region})</h3>
              </div>
              <Link
                href={`/deforestation?state=${encodeURIComponent(region)}`}
                style={{ fontSize: '14px', color: 'var(--clay)', fontWeight: 500 }}
              >
                View Deforestation risk data for {region}
              </Link>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '20px' }}>
              These planting zones are dynamically linked from Module 01 (Deforestation Tracker). Districts with high historical forest loss and fire alert counts are prioritized for immediate replanting.
            </p>

            {data.priority_zones && data.priority_zones.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {data.priority_zones.map((zone: any) => (
                  <div
                    key={zone.district_code}
                    style={{
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--paper)',
                      borderRadius: '2px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '16px' }}>{zone.district}</strong>
                      <span
                        style={{
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '2px',
                          backgroundColor: zone.priority === 1 ? 'rgba(180, 83, 42, 0.15)' : 'rgba(184, 138, 30, 0.15)',
                          color: zone.priority === 1 ? 'var(--clay)' : 'var(--risk-medium)',
                          border: `1px solid ${zone.priority === 1 ? 'var(--clay)' : 'var(--risk-medium)'}`,
                          fontWeight: 600,
                        }}
                      >
                        Priority {zone.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--ink)', margin: 0 }}>
                      {zone.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>No critical priority districts identified for this selection.</p>
            )}
          </div>

          {/* Recommended Species Inventory Table */}
          <div
            style={{
              border: '1px solid var(--line)',
              backgroundColor: 'var(--surface)',
              borderRadius: '2px',
              padding: '28px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Agro-Climatic Match
              </div>
              <h3 style={{ fontSize: '22px', margin: 0 }}>
                Recommended Native Tree Species ({data.recommended_species.length} available)
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--muted)', fontSize: '13px' }}>
                    <th style={{ padding: '10px' }}>Common Name</th>
                    <th style={{ padding: '10px' }}>Scientific Name</th>
                    <th style={{ padding: '10px' }}>Rainfall Band</th>
                    <th style={{ padding: '10px' }}>CO2 Absorption</th>
                    <th style={{ padding: '10px' }}>Ecological Role</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recommended_species.map((sp: any) => (
                    <tr key={sp.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{sp.common_name}</td>
                      <td style={{ padding: '10px', fontStyle: 'italic', color: 'var(--muted)' }}>{sp.scientific_name}</td>
                      <td style={{ padding: '10px' }}>{sp.rainfall_band}</td>
                      <td style={{ padding: '10px', color: 'var(--forest)', fontWeight: 600 }} className="tabular-nums">
                        {sp.co2_kg_per_year} kg/yr
                      </td>
                      <td style={{ padding: '10px', color: 'var(--muted)', fontSize: '13px' }}>{sp.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
