import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { WaterloggingClient } from '@/components/waterlogging/WaterloggingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waterlogging Predictor',
  description:
    'Monitoring area 7-day flood risk screening index for Kolkata based on Open-Meteo rainfall forecasts and elevation data.',
  openGraph: {
    title: 'Waterlogging Predictor',
    description: 'Screening index for Kolkata monitoring areas using rainfall and elevation.',
    images: [{ url: '/images/waterlogging.jpg', width: 1200, height: 630, alt: 'Flooded street in Kolkata' }],
  },
};

export default function WaterloggingPage() {
  return (
    <div>
      {/* Header photo band with waterlogging.jpg */}
      <PhotoBand src="/images/waterlogging.jpg" alt="Flooded urban street in Kolkata during monsoon" height={420}>
        <div style={{ maxWidth: '820px', color: '#EDE7D9' }}>
          <div className="kicker" style={{ color: '#7FAFC4', marginBottom: '12px' }}>
            Module 04
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '52px', lineHeight: 1.08, marginBottom: '16px' }}>
            Waterlogging Predictor
          </h1>
          <p style={{ fontSize: '20px', color: '#EDE7D9', lineHeight: 1.6, maxWidth: '58ch' }}>
            Rainfall and elevation screening index for eight Kolkata monitoring areas, evaluated using Open-Meteo precipitation forecasts and ground elevation survey benchmarks.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>Target geography</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-real" style={{ marginRight: '8px' }}>Real</span>
                  Kolkata Topography Survey: 8 representative monitoring areas (not municipal wards)
                </td>
              </tr>
              <tr>
                <td>Meteorological data</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-modelled" style={{ marginRight: '8px' }}>Modelled</span>
                  Open-Meteo precipitation forecasts aggregated into 3-day accumulated totals
                </td>
              </tr>
              <tr>
                <td>Screening index</td>
                <td style={{ color: 'var(--ink)' }}>
                  <span className="tag-badge-proxy" style={{ marginRight: '8px' }}>Proxy</span>
                  Transparent rule-based screening index from rainfall and elevation. No machine learning classifier is trained on this proxy and no accuracy, precision, or recall figures are claimed.
                </td>
              </tr>
              <tr>
                <td>Catchment runoff link</td>
                <td style={{ color: 'var(--muted)' }}>
                  Deforestation in river catchment basins increases surface runoff volume into municipal drainage. Explore historical forest loss in the{' '}
                  <Link href="/deforestation" style={{ color: 'var(--forest)', fontWeight: 600 }}>
                    Deforestation Tracker
                  </Link>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <WaterloggingClient />
      </Section>
    </div>
  );
}
