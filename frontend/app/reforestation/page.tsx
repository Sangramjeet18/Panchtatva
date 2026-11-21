import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { ReforestationClient } from '@/components/reforestation/ReforestationClient';

export const metadata = {
  title: 'Reforestation Planner | EcoSense',
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
            Plan native tree planting targets, calculate total annual CO2 absorption, and deploy saplings to high-risk deforestation corridors.
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
                <td style={{ color: 'var(--ink)' }}>Target tree count (10 to 500,000 saplings) or land area in hectares (0.1 to 1,000 ha at 1,000 trees/ha)</td>
              </tr>
              <tr>
                <td>Absorption model</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-assumption" style={{ marginRight: '8px' }}>Assumption</span>
                  21 kg CO2 absorbed per mature native tree annually (Forest Survey of India agro-climatic baseline)
                </td>
              </tr>
              <tr>
                <td>Species matching</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-assumption" style={{ marginRight: '8px' }}>Assumption</span>
                  Native Indian forestry database filtered by regional rainfall band (Low &lt;800mm, Moderate 800-1500mm, High &gt;1500mm)
                </td>
              </tr>
              <tr>
                <td>Priority corridors</td>
                <td style={{ color: 'var(--muted)' }}>
                  Target planting zones are imported directly from high-risk districts identified in the{' '}
                  <Link href="/deforestation" style={{ color: 'var(--forest)', fontWeight: 600 }}>
                    Deforestation Tracker
                  </Link>.
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
