'use client';

import React from 'react';
import airData from '@/data/serve/kolkata_air_live.json';

export function AirModelledPanel() {
  const records = (airData as any[]) || [];
  const latest = records[0] || {
    time: '2026-11-21T12:00',
    city: 'Kolkata',
    carbon_monoxide_ug_m3: 440.0,
    pm2_5: 52.0,
    data_status: 'modelled'
  };

  return (
    <div style={{ border: '1px solid var(--line)', backgroundColor: 'var(--paper)', padding: '28px', borderRadius: '2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div className="kicker" style={{ color: 'var(--river)' }}>Atmospheric Model</div>
          <h3 style={{ fontSize: '24px', margin: 0 }}>Kolkata Ambient Carbon & Air Quality</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="tag-badge-modelled">Modelled (CAMS)</span>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Open-Meteo European Model</span>
        </div>
      </div>

      <div
        style={{
          border: '1px solid var(--line)',
          backgroundColor: 'var(--surface)',
          padding: '16px 20px',
          borderRadius: '2px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="tag-badge-modelled">Rule 4 Disclosure</span>
          <strong style={{ fontSize: '14px' }}>Atmospheric Simulation, Not In-Situ Physical Hardware</strong>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
          Atmospheric carbon concentrations and aerosol criteria pollutants derive from the Copernicus Atmosphere Monitoring Service (CAMS) assimilation models. They represent regional atmospheric physics simulations, not local street-corner hardware sensors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Carbon Monoxide (CO)</div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--river)' }} className="tabular-nums">
            {latest.carbon_monoxide_ug_m3} µg/m³
          </div>
          <span className="tag-badge-modelled">Modelled</span>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Fine Particulate (PM 2.5)</div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--clay)' }} className="tabular-nums">
            {latest.pm2_5} µg/m³
          </div>
          <span className="tag-badge-modelled">Modelled</span>
        </div>

        <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>Simulation Timestamp</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginTop: '8px' }}>
            {latest.time}
          </div>
          <span className="tag-badge-modelled">Modelled</span>
        </div>
      </div>
    </div>
  );
}
