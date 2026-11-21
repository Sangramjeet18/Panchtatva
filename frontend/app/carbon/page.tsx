import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { CarbonCalculatorFull } from '@/components/carbon/calculator/CarbonCalculatorFull';
import { OwidChart } from '@/components/carbon/OwidChart';
import { AirModelledPanel } from '@/components/carbon/AirModelledPanel';
import factorData from '@/data/serve/emission_factors.json';

export const metadata = {
  title: 'Carbon Footprint Tracker | EcoSense',
  description: 'Evaluate individual greenhouse gas emissions, inspect OWID per capita benchmarks, and review modelled CAMS air composition under Data Truth Rules.',
};

export default function CarbonPage() {
  const factors = (factorData as any[]) || [];

  return (
    <div>
      <PhotoBand src="/images/carbon-1.jpg" alt="Industrial thermal emission cooling stacks" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#D98A63', marginBottom: '12px' }}>
            Module 03
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Carbon Footprint Tracker
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Calculate individual emissions, compare national benchmarks against world averages, and review regional modelled air quality.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table with Assumption badges */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>Grid emission factor</td>
                <td>
                  <span style={{ color: 'var(--ink)' }}>0.80 kg CO2 per kWh (Central Electricity Authority National Grid Baseline)</span>
                  <span className="tag-badge-assumption" style={{ marginLeft: '10px' }}>Assumption</span>
                </td>
              </tr>
              <tr>
                <td>Transit factors</td>
                <td>
                  <span style={{ color: 'var(--ink)' }}>Private car: 0.17 kg/km; Bus: 0.08 kg/km; Metro: 0.04 kg/km; Flight: 250 kg/trip</span>
                  <span className="tag-badge-assumption" style={{ marginLeft: '10px' }}>Assumption</span>
                </td>
              </tr>
              <tr>
                <td>Dietary profiles</td>
                <td>
                  <span style={{ color: 'var(--ink)' }}>Vegetarian: 1,000 kg/yr; Mixed: 1,700 kg/yr; Meat heavy: 2,500 kg/yr (IPCC household baseline)</span>
                  <span className="tag-badge-assumption" style={{ marginLeft: '10px' }}>Assumption</span>
                </td>
              </tr>
              <tr>
                <td>Offset loop</td>
                <td style={{ color: 'var(--muted)' }}>
                  Total emissions compute mature tree requirements at 21 kg/tree{' '}
                  <span className="tag-badge-assumption">Assumption</span>, linking directly to the{' '}
                  <Link href="/reforestation" style={{ color: 'var(--forest)', fontWeight: 600 }}>
                    Reforestation Planner
                  </Link>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {/* Factor Reference Table (Agent D requirement) */}
          <div style={{ border: '1px solid var(--line)', backgroundColor: 'var(--surface)', padding: '24px 28px', borderRadius: '2px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div className="kicker" style={{ color: 'var(--clay)' }}>Parameter Accounting</div>
                <h3 style={{ fontSize: '22px', margin: 0 }}>Statutory and Empirical Emission Factors</h3>
              </div>
              <span className="tag-badge-assumption">All Values Tagged Assumption</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="hairline-table" style={{ width: '100%', minWidth: '600px', backgroundColor: 'var(--paper)' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                    <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Category</th>
                    <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Factor Key</th>
                    <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Intensity</th>
                    <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Source & Year</th>
                    <th style={{ padding: '10px 12px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Status Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {factors.map((f: any) => (
                    <tr key={f.key}>
                      <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{f.category}</td>
                      <td style={{ color: 'var(--muted)' }}><code>{f.key}</code></td>
                      <td className="tabular-nums" style={{ fontWeight: 600, color: 'var(--forest)' }}>
                        {f.kg_co2_per_unit} {f.unit}
                      </td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>
                        {f.source} ({f.year})
                      </td>
                      <td>
                        <span className="tag-badge-assumption">{f.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Calculator */}
          <CarbonCalculatorFull />

          {/* OWID Comparative Benchmark Chart */}
          <OwidChart />

          {/* Modelled Atmospheric Telemetry Panel */}
          <AirModelledPanel />
        </div>
      </Section>
    </div>
  );
}
