import React from 'react';
import { Section } from '@/components/ui/Section';
import dataSources from '@/data/data_sources.json';

export const metadata = {
  title: 'Data Sources and Truth Rules | EcoSense',
  description: 'Public records, government surveys, API attributions and six data truth rules governing the EcoSense platform.',
};

export default function DataSourcesPage() {
  return (
    <div>
      <Section style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '880px' }}>
          <div className="kicker" style={{ color: 'var(--muted)' }}>
            Provenance and Verification
          </div>
          <h1 style={{ fontSize: '52px', lineHeight: 1.08, marginBottom: '20px' }}>
            Data Sources and Truth Rules
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
            EcoSense operates under strict data honesty constraints. All figures derive directly from published government archives, multilateral agencies, or transparent empirical rules without fabricated statistics.
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ maxWidth: '1040px' }}>
          <div style={{ marginBottom: '36px' }}>
            <div className="kicker" style={{ color: 'var(--forest)' }}>
              Catalog
            </div>
            <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>Registered Datasets</h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', lineHeight: 1.6 }}>
              Loaded dynamically from the project data catalog. Every entry indicates legal licensing, publisher attribution and analytical purpose.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '64px' }}>
            <table className="hairline-table" style={{ width: '100%', minWidth: '720px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--line)' }}>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Dataset</th>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Publisher</th>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Used For</th>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Licence</th>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Downloaded</th>
                  <th style={{ padding: '12px 14px', fontSize: '13px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((ds) => {
                  let badgeBg = 'var(--surface)';
                  let badgeColor = 'var(--ink)';
                  if (ds.status_tag === 'Real') {
                    badgeBg = 'var(--forest)';
                    badgeColor = 'var(--paper)';
                  } else if (ds.status_tag === 'Modelled') {
                    badgeBg = 'var(--river)';
                    badgeColor = 'var(--paper)';
                  } else if (ds.status_tag === 'Proxy') {
                    badgeBg = 'var(--smoke)';
                    badgeColor = 'var(--paper)';
                  } else if (ds.status_tag === 'Assumption') {
                    badgeBg = 'var(--clay)';
                    badgeColor = 'var(--paper)';
                  }

                  return (
                    <tr key={ds.id}>
                      <td style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '15px' }}>
                        <a href={ds.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline' }}>
                          {ds.dataset}
                        </a>
                      </td>
                      <td style={{ fontSize: '14px', color: 'var(--ink)' }}>{ds.publisher}</td>
                      <td style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '280px' }}>{ds.used_for}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{ds.licence}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }} className="tabular-nums">
                        {ds.download_date}
                      </td>
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            backgroundColor: badgeBg,
                            color: badgeColor,
                            borderRadius: '2px',
                          }}
                        >
                          {ds.status_tag}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Attribution Lines */}
          <div style={{ marginBottom: '64px', borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
            <div className="kicker" style={{ color: 'var(--muted)' }}>
              Attribution Lines
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '20px' }}>Institutional Attributions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '15px', color: 'var(--ink)' }}>
              <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <strong>Forest Survey of India (FSI):</strong> Forest cover assessments, canopy density classifications (Very Dense, Moderately Dense, Open Forest) and recorded forest areas derive from biennial India State of Forest Reports published by the Ministry of Environment, Forest and Climate Change, Government of India.
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <strong>Open-Meteo:</strong> Meteorological precipitation sums and atmospheric CAMS composition telemetry are provided by Open-Meteo GmbH under Creative Commons Attribution 4.0 International, integrating ECMWF and Copernicus Atmosphere Monitoring Service models.
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <strong>Our World in Data (OWID):</strong> National and global per capita greenhouse gas emission benchmarks originate from Our World in Data and the Global Carbon Project under CC BY 4.0 licensing.
              </div>
              <div style={{ padding: '16px', border: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
                <strong>The World Bank:</strong> National forest surface area indicators (AG.LND.FRST.K2 and AG.LND.FRST.ZS) are sourced from the World Bank Open Data catalog and the Food and Agriculture Organization (FAO) Global Forest Resources Assessment.
              </div>
            </div>
          </div>

          {/* Limits section listing the six data truth rules */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '40px' }}>
            <div className="kicker" style={{ color: 'var(--clay)' }}>
              Integrity Framework
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>The Six Data Truth Rules</h2>
            <p style={{ fontSize: '16px', color: 'var(--muted)', marginBottom: '28px', maxWidth: '72ch' }}>
              To prevent scientific misrepresentation, every calculation, chart and visualization in EcoSense is bound by six non-negotiable data truth rules.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--forest)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 1: Forest Cover vs Loss
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>No Deforestation Regression on FSI</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  FSI assessments record biennial forest canopy cover in square kilometers at two assessment points. They are not annual tree cover loss. We never fit regression forecasts to state or district rows and use the terms &quot;forest cover&quot; and &quot;change in forest cover&quot;.
                </p>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--forest)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 2: World Bank Independence
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Isolated National FAO Baseline</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  The World Bank national forest series uses the FAO definition and yearly reporting. It is used strictly for national statistical trends and holdout validation, and is never plotted on the same axis as FSI figures.
                </p>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--smoke)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 3: Deterministic Proxy
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Screening Index, Not Trained ML</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Waterlogging vulnerability is a deterministic rule-based screening index combining rainfall and ground elevation. We do not train machine learning classifiers on risk_proxy and do not claim false accuracy, precision or recall metrics. The eight locations are designated monitoring areas, not wards.
                </p>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--river)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 4: Modelled Atmosphere
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>CAMS Atmospheric Simulation</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Atmospheric CO2 and criteria pollutant data from Open-Meteo derive from Copernicus Atmosphere Monitoring Service (CAMS) regional numerical models rather than physical in-situ sensors. They are explicitly tagged Modelled.
                </p>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--clay)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 5: Transparent Assumptions
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Explicit Assumption Badges</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Grid emission factors and species agro-climatic rainfall bands are approximate unverified references. All calculations derived from them, including the standard 21 kg CO2/tree annual absorption rate, carry an Assumption tag.
                </p>
              </div>

              <div style={{ padding: '24px', border: '1px solid var(--line)', backgroundColor: 'var(--paper)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Rule 6: Universal Tagging
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Visible Text Badges on Every Metric</h3>
                <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.6 }}>
                  Every quantitative metric across the entire application interface displays an accompanying rectangular text tag: Real, Modelled, Proxy, or Assumption, ensuring immediate visual transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
