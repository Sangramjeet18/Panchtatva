import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { DeforestationClient } from '@/components/deforestation/DeforestationClient';

export const metadata = {
  title: 'Forest Cover and National Trends | EcoSense',
  description: 'National forest area trends (World Bank/FAO) and biennial state-level canopy assessments (Forest Survey of India) under Data Truth Rules.',
};

export default function DeforestationPage() {
  return (
    <div>
      <PhotoBand src="/images/deforestation.jpg" alt="Forest canopy and mountain landscape in India" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#7FB08F', marginBottom: '12px' }}>
            Module 01
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Forest Cover and National Trends
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Inspect long-term national forest area trends and evaluate registered biennial canopy distributions across 36 Indian States and Union Territories.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>Coverage</td>
                <td style={{ color: 'var(--ink)' }}>36 States and Union Territories (FSI) & National All-India Series (World Bank / FAO)</td>
              </tr>
              <tr>
                <td>Data baseline</td>
                <td style={{ color: 'var(--ink)' }}>World Bank FAO Indicator AG.LND.FRST.K2 & Forest Survey of India (ISFR Biennial Assessments)</td>
              </tr>
              <tr>
                <td>Statistical model</td>
                <td style={{ color: 'var(--ink)' }}>National linear regression with 3-year holdout MAE validation, clamped at zero. No state or district regressions (Rule 1).</td>
              </tr>
              <tr>
                <td>Downstream impact</td>
                <td style={{ color: 'var(--muted)' }}>
                  Catchment forest cover directly influences hydrological infiltration and urban storm runoff in downstream river basins. See the{' '}
                  <Link href="/waterlogging" style={{ color: 'var(--river)', fontWeight: 600 }}>
                    Waterlogging Predictor
                  </Link>{' '}
                  to inspect municipal screening indices.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DeforestationClient />
      </Section>
    </div>
  );
}
