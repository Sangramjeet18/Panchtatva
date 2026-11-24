import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { ReforestationClient } from '@/components/reforestation/ReforestationClient';

export const metadata = {
  title: 'Reforestation Planner',
  description: 'Targeted native species selection, CO2 absorption calculation and priority planting zones for Indian states.',
};

export default function ReforestationPage() {
  return (
    <div>
      <PhotoBand src="/images/reforestation.jpg" alt="Saplings in forest nursery bags" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#D98A63', marginBottom: '12px' }}>
            Module 02
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Reforestation Planner
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Plan native tree planting targets, calculate annual CO2 absorption ranges, and identify districts with the largest forest cover decline.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>Planning units</td>
                <td style={{ color: 'var(--ink)' }}>
                  Independent tree count and land area (in hectares, acres, or square metres), density in trees per hectare, and average gap in metres.
                </td>
              </tr>
              <tr>
                <td>Absorption model</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-assumption" style={{ marginRight: '8px' }}>Assumption</span>
                  21 kg CO2 absorbed per mature native tree annually. A common rule of thumb used here as an Assumption. Source to be confirmed.
                </td>
              </tr>
              <tr>
                <td>Species matching</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-assumption" style={{ marginRight: '8px' }}>Assumption</span>
                  19 native candidate species filtered by regional rainfall band (Low under 1000 mm, Moderate 1000 to 2000 mm, High over 2000 mm).
                </td>
              </tr>
              <tr>
                <td>Priority zones</td>
                <td style={{ color: 'var(--muted)' }}>
                  Districts with the largest forest cover decline relative to forest cover, evaluated from Forest Survey of India biennial assessments.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <ReforestationClient />
      </Section>
    </div>
  );
}
