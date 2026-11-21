import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { CarbonCalculatorFull } from '@/components/carbon/calculator/CarbonCalculatorFull';
import { CarbonLivePanel } from '@/components/carbon/live/CarbonLivePanel';

export const metadata = {
  title: 'Carbon Footprint Tracker | EcoSense',
  description: 'Evaluate personal greenhouse gas emissions across electricity, transit, flights and diet with real-time canopy telemetry.',
};

export default function CarbonPage() {
  return (
    <div>
      {/* Header photo band using carbon-1.jpg */}
      <PhotoBand src="/images/carbon-1.jpg" alt="Industrial thermal emission cooling stacks" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#D98A63', marginBottom: '12px' }}>
            Module 03
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Carbon Footprint Tracker
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Calculate individual greenhouse gas emissions, inspect live simulated canopy sensor telemetry, and balance output with tree offset targets.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>Grid emission factor</td>
                <td style={{ color: 'var(--ink)' }}>0.80 kg CO2 per kWh (Central Electricity Authority National Grid Baseline)</td>
              </tr>
              <tr>
                <td>Transit factors</td>
                <td style={{ color: 'var(--ink)' }}>Private petrol/diesel car: 0.17 kg/km; City bus: 0.08 kg/km; Metro rail: 0.04 kg/km; Domestic flight: 250 kg/trip</td>
              </tr>
              <tr>
                <td>Dietary factors</td>
                <td style={{ color: 'var(--ink)' }}>Vegetarian: 1,000 kg/yr; Mixed balanced: 1,700 kg/yr; Meat heavy: 2,500 kg/yr (IPCC household baseline)</td>
              </tr>
              <tr>
                <td>Offset loop</td>
                <td style={{ color: 'var(--muted)' }}>
                  Total emissions compute mature tree requirements linking directly to the{' '}
                  <Link href="/reforestation" style={{ color: 'var(--forest)', fontWeight: 600 }}>
                    Reforestation Planner
                  </Link>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {/* Inset photo band with carbon-2.jpg and context description */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '48px',
            }}
          >
            <div>
              <div className="kicker" style={{ color: 'var(--muted)' }}>
                Regional Context
              </div>
              <h3 style={{ fontSize: '28px', marginBottom: '12px' }}>
                Thermal Power and Transport Dominance in India
              </h3>
              <p style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '12px' }}>
                India&apos;s electric grid operates predominantly on coal-fired thermal generation, yielding a high statutory factor of 0.80 kg CO2 per kilowatt-hour. Ground commuting and domestic flights multiply personal baselines significantly.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0 }}>
                This module connects personal consumption directly with physical sensor streams and land-based reforestation offsetting.
              </p>
            </div>

            <div
              style={{
                position: 'relative',
                height: '280px',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: 'var(--surface)',
              }}
            >
              <Image
                src="/images/carbon-2.jpg"
                alt="Industrial emissions in urban electrical substation canopy"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Calculator UI */}
          <CarbonCalculatorFull />

          {/* Live Panel UI */}
          <CarbonLivePanel />
        </div>
      </Section>
    </div>
  );
}
