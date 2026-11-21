import React from 'react';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Data Sources and Verification | EcoSense',
  description: 'Public records, government datasets and atmospheric APIs used in the EcoSense environmental platform.',
};

export default function DataSourcesPage() {
  const sources = [
    {
      title: 'Global Forest Watch (GFW)',
      provider: 'World Resources Institute / University of Maryland',
      coverage: 'West Bengal, Assam, Odisha, Kerala (2001 to 2023)',
      metric: 'Annual tree cover loss in hectares, canopy density thresholds (>30%)',
      status: 'Real public satellite data',
      url: 'https://www.globalforestwatch.org',
    },
    {
      title: 'Forest Survey of India (FSI)',
      provider: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
      coverage: 'Biennial India State of Forest Reports (ISFR)',
      metric: 'State-wise recorded forest area, canopy classification (VDF, MDF, OF)',
      status: 'Official governmental baseline',
      url: 'https://fsi.nic.in',
    },
    {
      title: 'Central Electricity Authority (CEA)',
      provider: 'Ministry of Power, Government of India',
      coverage: 'CO2 Baseline Database for the Indian Power Sector (Version 19)',
      metric: 'Weighted average emission factor: 0.80 kg CO2 / kWh for Indian national grid',
      status: 'Statutory grid intensity factor',
      url: 'https://cea.nic.in',
    },
    {
      title: 'Open-Meteo Weather API',
      provider: 'Open-Meteo GmbH',
      coverage: 'Kolkata coordinates (22.5726° N, 88.3639° E)',
      metric: 'Hourly and 3-day aggregated precipitation sums, rainfall probability',
      status: 'Live meteorological API query',
      url: 'https://open-meteo.com',
    },
    {
      title: 'Kolkata Municipal Corporation (KMC)',
      provider: 'Drainage and Sewerage Department / KEIP Reports',
      coverage: '16 representative wards across North, Central, South and East Kolkata',
      metric: 'Ward elevation (m), drainage infrastructure efficiency score (0-10)',
      status: 'Published municipal engineering reports',
      url: 'https://www.kmcgov.in',
    },
  ];

  return (
    <div>
      <Section style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '820px' }}>
          <div className="kicker" style={{ color: 'var(--muted)' }}>
            Provenance and Citations
          </div>
          <h1 style={{ fontSize: '52px', lineHeight: 1.08, marginBottom: '20px' }}>
            Data Sources and Methodology
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
            EcoSense relies upon published public records, statutory emission databases, open meteorological APIs and empirical forestry research.
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Public Environmental Records</h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.65 }}>
              All public datasets are credited with origin and metric definitions. No statistics are invented.
            </p>
          </div>

          <table className="hairline-table">
            <tbody>
              {sources.map((src) => (
                <tr key={src.title}>
                  <td style={{ color: 'var(--ink)', width: '220px' }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>{src.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{src.provider}</div>
                  </td>
                  <td>
                    <div style={{ color: 'var(--ink)', marginBottom: '4px' }}>{src.metric}</div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>Coverage: {src.coverage}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--forest)', fontWeight: 600 }}>
                        {src.status}
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '13px', color: 'var(--muted)' }}
                      >
                        Official Source
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              marginTop: '48px',
            }}
          >
            <div className="kicker" style={{ color: 'var(--clay)' }}>
              Explicit Simulation Disclosure
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Hardware Sensor Simulation</h3>
            <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
              Physical MH-Z19 NDIR sensors and ESP32 telemetry hardware are supported via <code>/api/carbon/readings</code>. Where physical devices are not online, simulated data points are generated mathematically and marked with <code>simulated: true</code> in the API response envelope.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
