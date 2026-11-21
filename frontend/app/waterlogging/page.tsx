import React from 'react';
import Link from 'next/link';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { WaterloggingClient } from '@/components/waterlogging/WaterloggingClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waterlogging Predictor | EcoSense',
  description:
    'Ward-level 3-day flood risk predictions for Kolkata based on Open-Meteo rainfall forecasts, elevation, drainage scores and historical flood event data.',
  openGraph: {
    title: 'Waterlogging Predictor | EcoSense',
    description: 'Know which Kolkata wards face high flood risk in the next 3 days.',
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
            Ward-level 3-day flood risk for Kolkata, derived from Open-Meteo rainfall forecasts and a Random Forest classifier trained on drainage, elevation and historical flood records.
          </p>
        </div>
      </PhotoBand>

      <Section>
        {/* Context hairline summary table */}
        <div style={{ marginBottom: '48px', maxWidth: '100%' }}>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td>City</td>
                <td style={{ color: 'var(--ink)' }}>Kolkata Municipal Corporation (16 representative municipal wards)</td>
              </tr>
              <tr>
                <td>Meteorological data</td>
                <td style={{ color: 'var(--ink)' }}>Open-Meteo hourly precipitation aggregated into 3-day forecast totals (30-min cache)</td>
              </tr>
              <tr>
                <td>Classification model</td>
                <td style={{ color: 'var(--ink)' }}>Random Forest classifier (100 estimators, 96.8% test accuracy) evaluated on Runoff Accumulation Potential</td>
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
