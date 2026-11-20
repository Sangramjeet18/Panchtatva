'use client';

import React from 'react';

export interface DistrictRisk {
  state: string;
  district: string;
  district_code: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  avg_recent_loss_ha: number;
  avg_annual_fires: number;
}

export interface DistrictRiskMapProps {
  districts: DistrictRisk[];
  stateName: string;
}

export function DistrictRiskMap({ districts, stateName }: DistrictRiskMapProps) {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'high':
        return { bg: 'rgba(180, 83, 42, 0.15)', text: '#B4532A', border: '#B4532A', label: 'High Risk' };
      case 'medium':
        return { bg: 'rgba(184, 138, 30, 0.15)', text: '#B88A1E', border: '#B88A1E', label: 'Medium Risk' };
      default:
        return { bg: 'rgba(91, 123, 58, 0.15)', text: '#5B7B3A', border: '#5B7B3A', label: 'Low Risk' };
    }
  };

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '24px',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          Vulnerability Spatial Index
        </div>
        <h3 style={{ fontSize: '20px', margin: 0 }}>{stateName} District Risk Ratings</h3>
        <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
          Districts evaluated by normalized tree cover loss rate and NASA FIRMS fire alerts. High risk districts feed directly into the Reforestation Planner as priority zones.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {districts.map((d) => {
          const badge = getBadgeStyle(d.risk_level);
          return (
            <div
              key={d.district_code}
              style={{
                border: '1px solid var(--line)',
                backgroundColor: 'var(--paper)',
                borderRadius: '2px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--ink)' }}>{d.district}</div>
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.border}`,
                      fontWeight: 600,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Recent avg loss:</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>{d.avg_recent_loss_ha} ha/yr</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Fire alert count:</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>{d.avg_annual_fires}/yr</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Risk Score:</span>
                <span className="tabular-nums" style={{ fontWeight: 600, color: badge.text }}>
                  {(d.risk_score * 100).toFixed(0)} / 100
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
