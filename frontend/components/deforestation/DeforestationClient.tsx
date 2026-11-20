'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Select } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { DeforestationChart } from './DeforestationChart';
import { DistrictRiskMap } from './DistrictRiskMap';

const STATES = [
  { value: 'West Bengal', label: 'West Bengal' },
  { value: 'Assam', label: 'Assam' },
  { value: 'Odisha', label: 'Odisha' },
  { value: 'Kerala', label: 'Kerala' },
];

export function DeforestationClient() {
  const [selectedState, setSelectedState] = useState<string>('West Bengal');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (stateName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/deforestation?state=${encodeURIComponent(stateName)}`);
      if (!res.ok) {
        throw new Error(`Failed to load data (${res.status})`);
      }
      const json = await res.json();
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Error loading deforestation records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedState);
  }, [selectedState]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Control panel */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--line)',
          paddingBottom: '24px',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%' }}>
          <Select
            id="state-selector"
            label="Select Indian State"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            options={STATES}
          />
        </div>

        {data && !loading && (
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: 'var(--muted)' }}>Model Type: </span>
              <strong>{data.model_type}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>MAE on 3-yr holdout: </span>
              <strong className="tabular-nums">{data.mae_held_out} ha</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>Annual Slope: </span>
              <strong className="tabular-nums">+{data.slope} ha/yr</strong>
            </div>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Skeleton height="380px" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Skeleton height="140px" />
            <Skeleton height="140px" />
            <Skeleton height="140px" />
            <Skeleton height="140px" />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <ErrorState message={error} onRetry={() => loadData(selectedState)} />
      )}

      {/* Main visualization & results */}
      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <DeforestationChart
            history={data.history}
            forecast={data.forecast}
            stateName={data.state}
          />

          <DistrictRiskMap
            districts={data.district_risks || []}
            stateName={data.state}
          />

          {/* Transparent Method Note */}
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              padding: '24px',
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Method Note and Modeling Assumptions
            </div>
            <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>
              Linear Regression with Prediction Interval
            </h4>
            <p style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '8px' }}>
              Data source: Global Forest Watch tree cover loss (2001 to 2023). A linear model is fitted across historical annual observations. Model validation holds out the most recent three years (2021 to 2023), resulting in a test Mean Absolute Error of {data.mae_held_out} ha.
            </p>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
              District risk scores evaluate the normalized average annual loss against historical fire alert frequencies derived from satellite telemetry. The shaded range marks the 95% forecast confidence band.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
