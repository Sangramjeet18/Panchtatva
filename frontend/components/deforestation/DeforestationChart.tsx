'use client';

import React, { useState } from 'react';

export interface HistoryPoint {
  year: number;
  tree_cover_loss_ha: number;
}

export interface ForecastPoint {
  year: number;
  predicted_loss_ha: number;
  lower_ha: number;
  upper_ha: number;
}

export interface DeforestationChartProps {
  history: HistoryPoint[];
  forecast: ForecastPoint[];
  stateName: string;
}

export function DeforestationChart({ history, forecast, stateName }: DeforestationChartProps) {
  const [hovered, setHovered] = useState<any | null>(null);

  if (!history || history.length === 0) {
    return <div style={{ padding: '24px', color: 'var(--muted)' }}>No historical data available.</div>;
  }

  const allYears = [...history.map((h) => h.year), ...forecast.map((f) => f.year)];
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);

  const allValues = [
    ...history.map((h) => h.tree_cover_loss_ha),
    ...forecast.map((f) => f.upper_ha),
    ...forecast.map((f) => f.lower_ha),
  ];
  const maxVal = Math.max(...allValues) * 1.15;
  const minVal = 0;

  const width = 800;
  const height = 400;
  const padding = { top: 40, right: 40, bottom: 50, left: 70 };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const getX = (year: number) => padding.left + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / (maxVal - minVal)) * plotHeight;

  // Historical path
  const historyPath = history.reduce((acc, pt, idx) => {
    const x = getX(pt.year);
    const y = getY(pt.tree_cover_loss_ha);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Forecast path
  const lastHistory = history[history.length - 1];
  const forecastPoints = [
    { year: lastHistory.year, val: lastHistory.tree_cover_loss_ha },
    ...forecast.map((f) => ({ year: f.year, val: f.predicted_loss_ha })),
  ];
  const forecastPath = forecastPoints.reduce((acc, pt, idx) => {
    const x = getX(pt.year);
    const y = getY(pt.val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Shaded area (lower to upper polygon)
  const upperPoints = [
    { year: lastHistory.year, val: lastHistory.tree_cover_loss_ha },
    ...forecast.map((f) => ({ year: f.year, val: f.upper_ha })),
  ];
  const lowerPoints = [
    { year: lastHistory.year, val: lastHistory.tree_cover_loss_ha },
    ...forecast.map((f) => ({ year: f.year, val: f.lower_ha })),
  ].reverse();

  const areaPolygon = [
    ...upperPoints.map((p) => `${getX(p.year)},${getY(p.val)}`),
    ...lowerPoints.map((p) => `${getX(p.year)},${getY(p.val)}`),
  ].join(' ');

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((pct) => Math.round(minVal + pct * (maxVal - minVal)));

  return (
    <div
      style={{
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        padding: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Historical Loss & 10-Year Trend
          </div>
          <h3 style={{ fontSize: '20px', margin: 0 }}>{stateName} Tree Cover Loss (ha)</h3>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--clay)' }} />
            <span>Observed (2001-2023)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', backgroundColor: 'var(--forest)', borderTop: '1px dashed var(--forest)' }} />
            <span>Forecast (2024-2033)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '10px', backgroundColor: 'rgba(30, 77, 53, 0.2)', border: '1px solid var(--forest)' }} />
            <span>95% Prediction Range</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '600px', height: 'auto', display: 'block' }}
          role="img"
          aria-label={`Yearly tree cover loss chart for ${stateName}`}
        >
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={getY(tick)}
                x2={width - padding.right}
                y2={getY(tick)}
                stroke="var(--line)"
                strokeDasharray="2 2"
              />
              <text
                x={padding.left - 10}
                y={getY(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--muted)"
                fontFamily="var(--font-sans)"
                className="tabular-nums"
              >
                {tick.toLocaleString()} ha
              </text>
            </g>
          ))}

          {/* X-axis tick years */}
          {[2001, 2005, 2010, 2015, 2020, 2025, 2030, 2033].map((yr) => (
            <g key={yr}>
              <line
                x1={getX(yr)}
                y1={padding.top + plotHeight}
                x2={getX(yr)}
                y2={padding.top + plotHeight + 6}
                stroke="var(--line)"
              />
              <text
                x={getX(yr)}
                y={padding.top + plotHeight + 20}
                textAnchor="middle"
                fontSize="12"
                fill="var(--muted)"
                fontFamily="var(--font-sans)"
                className="tabular-nums"
              >
                {yr}
              </text>
            </g>
          ))}

          {/* Shaded Prediction Interval */}
          <polygon
            points={areaPolygon}
            fill="rgba(30, 77, 53, 0.18)"
            stroke="none"
          />

          {/* Observed Historical Line */}
          <path
            d={historyPath}
            fill="none"
            stroke="var(--clay)"
            strokeWidth="2.5"
          />

          {/* Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="var(--forest)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />

          {/* Data Points */}
          {history.map((pt) => (
            <circle
              key={pt.year}
              cx={getX(pt.year)}
              cy={getY(pt.tree_cover_loss_ha)}
              r={hovered?.year === pt.year ? 5 : 3}
              fill="var(--clay)"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered({ year: pt.year, val: pt.tree_cover_loss_ha, type: 'Observed' })}
              onMouseLeave={() => setHovered(null)}
            />
          ))}

          {forecast.map((pt) => (
            <circle
              key={pt.year}
              cx={getX(pt.year)}
              cy={getY(pt.predicted_loss_ha)}
              r={hovered?.year === pt.year ? 5 : 3}
              fill="var(--forest)"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() =>
                setHovered({
                  year: pt.year,
                  val: pt.predicted_loss_ha,
                  lower: pt.lower_ha,
                  upper: pt.upper_ha,
                  type: 'Forecast',
                })
              }
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>

        {/* Hover summary popup */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '24px',
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--line)',
              padding: '8px 12px',
              borderRadius: '2px',
              fontSize: '13px',
              pointerEvents: 'none',
            }}
          >
            <div>
              <strong>Year {hovered.year}</strong> ({hovered.type})
            </div>
            <div>Loss: {hovered.val.toLocaleString()} ha</div>
            {hovered.lower !== undefined && (
              <div style={{ color: 'var(--muted)', fontSize: '11px' }}>
                Range: {hovered.lower.toLocaleString()} to {hovered.upper.toLocaleString()} ha
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: '16px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '13px', color: 'var(--muted)' }}>
            Show data table alternative
          </summary>
          <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '12px' }}>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '6px' }}>Year</th>
                  <th style={{ padding: '6px' }}>Observed Loss (ha)</th>
                  <th style={{ padding: '6px' }}>Forecast (ha)</th>
                  <th style={{ padding: '6px' }}>Lower / Upper Range</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.year} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '6px' }} className="tabular-nums">{h.year}</td>
                    <td style={{ padding: '6px' }} className="tabular-nums">{h.tree_cover_loss_ha.toLocaleString()}</td>
                    <td style={{ padding: '6px', color: 'var(--muted)' }}>None</td>
                    <td style={{ padding: '6px', color: 'var(--muted)' }}>None</td>
                  </tr>
                ))}
                {forecast.map((f) => (
                  <tr key={f.year} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '6px' }} className="tabular-nums">{f.year}</td>
                    <td style={{ padding: '6px', color: 'var(--muted)' }}>None</td>
                    <td style={{ padding: '6px' }} className="tabular-nums">{f.predicted_loss_ha.toLocaleString()}</td>
                    <td style={{ padding: '6px' }} className="tabular-nums">
                      {f.lower_ha.toLocaleString()} to {f.upper_ha.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
