import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { DeforestationClient } from '@/components/deforestation/DeforestationClient';

export const metadata = {
  title: 'Deforestation Tracker | EcoSense',
  description: 'Historical tree cover loss analysis and 10-year statistical forecast for West Bengal, Assam, Odisha and Kerala.',
};

export default function DeforestationPage() {
  return (
    <div>
      <PhotoBand src="/images/deforestation.jpg" alt="Deforested landscape with felled logs" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#7FB08F', marginBottom: '12px' }}>
            Module 01
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Deforestation Tracker
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Inspect historical tree cover loss, review 10-year projected trends with shaded prediction bounds, and locate vulnerable districts across Indian states.
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
                <td style={{ color: 'var(--ink)' }}>West Bengal, Assam, Odisha, and Kerala (state and district levels)</td>
              </tr>
              <tr>
                <td>Data baseline</td>
                <td style={{ color: 'var(--ink)' }}>Global Forest Watch annual tree cover loss (2001 to 2023) and NASA FIRMS active fire alerts</td>
              </tr>
              <tr>
                <td>Statistical model</td>
                <td style={{ color: 'var(--ink)' }}>Ordinary least-squares linear regression with hold-out validation and 95% forecast interval</td>
              </tr>
              <tr>
                <td>Downstream impact</td>
                <td style={{ color: 'var(--muted)' }}>
                  Upper catchment tree loss directly accelerates soil erosion and increases urban runoff in downstream cities. See the{' '}
                  <Link href="/waterlogging" style={{ color: 'var(--river)', fontWeight: 600 }}>
                    Waterlogging Predictor
                  </Link>{' '}
                  to evaluate municipal drainage impact.
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
