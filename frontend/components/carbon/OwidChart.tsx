'use client';

import React from 'react';
import owidData from '@/data/serve/co2_countries.json';

export function OwidChart() {
  const indiaData = (owidData as any[]).filter((d) => d.entity === 'India');
  const worldData = (owidData as any[]).filter((d) => d.entity === 'World');

  const maxVal = 6.0;
  const minYear = 1990;
  const maxYear = 2022;

  const getX = (yr: number) => 50 + ((yr - minYear) / (maxYear - minYear)) * 680;
  const getY = (val: number) => 180 - (val / maxVal) * 150;

  const indiaPoints = indiaData.map((d) => `${getX(d.year)},${getY(d.co2_per_capita)}`).join(' ');
  const worldPoints = worldData.map((d) => `${getX(d.year)},${getY(d.co2_per_capita)}`).join(' ');

  const latestIndia = indiaData[indiaData.length - 1];
  const latestWorld = worldData[worldData.length - 1];

  return (
    <div style={{ border: '1px solid var(--line)', backgroundColor: 'var(--paper)', padding: '28px', borderRadius: '2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div className="kicker" style={{ color: 'var(--forest)' }}>Global Benchmark</div>
          <h3 style={{ fontSize: '24px', margin: 0 }}>Per Capita CO2 Emissions (India vs World Average)</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="tag-badge-real">Real OWID</span>
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Tonnes per person / year</span>
        </div>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', maxWidth: '68ch' }}>
        Sourced from Our World in Data and the Global Carbon Project. Highlights India&apos;s low per capita footprint relative to global industrial averages while emissions track economic expansion.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '14px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>India (2022)</div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--forest)' }} className="tabular-nums">
            {latestIndia?.co2_per_capita} t
          </div>
          <span className="tag-badge-real">Real</span>
        </div>
        <div style={{ padding: '14px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
          <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase' }}>World Average (2022)</div>
          <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--smoke)' }} className="tabular-nums">
            {latestWorld?.co2_per_capita} t
          </div>
          <span className="tag-badge-real">Real</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <svg viewBox="0 0 760 220" style={{ width: '100%', height: 'auto', minWidth: '550px' }}>
          <line x1="50" y1="30" x2="730" y2="30" stroke="var(--line)" strokeWidth="0.8" />
          <line x1="50" y1="80" x2="730" y2="80" stroke="var(--line)" strokeWidth="0.8" />
          <line x1="50" y1="130" x2="730" y2="130" stroke="var(--line)" strokeWidth="0.8" />
          <line x1="50" y1="180" x2="730" y2="180" stroke="var(--line)" strokeWidth="0.8" />

          <text x="42" y="34" fontSize="11" fill="var(--muted)" textAnchor="end">6.0 t</text>
          <text x="42" y="84" fontSize="11" fill="var(--muted)" textAnchor="end">4.0 t</text>
          <text x="42" y="134" fontSize="11" fill="var(--muted)" textAnchor="end">2.0 t</text>
          <text x="42" y="184" fontSize="11" fill="var(--muted)" textAnchor="end">0.0 t</text>

          <polyline fill="none" stroke="var(--smoke)" strokeWidth="2.5" points={worldPoints} />
          <polyline fill="none" stroke="var(--forest)" strokeWidth="2.5" points={indiaPoints} />

          {indiaData.map((d) => (
            <g key={`in-${d.year}`}>
              <circle cx={getX(d.year)} cy={getY(d.co2_per_capita)} r="3" fill="var(--forest)" />
              <text x={getX(d.year)} y="202" fontSize="10" fill="var(--muted)" textAnchor="middle">{d.year}</text>
            </g>
          ))}
          {worldData.map((d) => (
            <circle key={`w-${d.year}`} cx={getX(d.year)} cy={getY(d.co2_per_capita)} r="3" fill="var(--smoke)" />
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: '20px', fontSize: '13px', marginTop: '14px', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--forest)' }} />
          <strong>India per person</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--smoke)' }} />
          <strong>World Average</strong>
        </div>
      </div>
    </div>
  );
}
