import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About and Method | EcoSense',
  description: 'Mission, methodology, data truth rules and project background for the EcoSense environmental platform.',
};

export default function AboutPage() {
  return (
    <div>
      <Section style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '820px' }}>
          <div className="kicker" style={{ color: 'var(--muted)' }}>
            Project Background
          </div>
          <h1 style={{ fontSize: '52px', lineHeight: 1.08, marginBottom: '20px' }}>
            Mission and Context
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
            EcoSense was conceived as an environmental studies viva and research initiative to address a persistent gap in ecological information systems across India.
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ maxWidth: '820px' }}>
          <p style={{ fontSize: '18px', lineHeight: 1.65, marginBottom: '24px' }}>
            Most critical environmental reports on canopy retreat, emissions growth and urban drainage blockages are published years after data collection, locked inside bulky PDF reports and inaccessible tables.
          </p>
          <p style={{ fontSize: '18px', lineHeight: 1.65, marginBottom: '48px' }}>
            Our mission is to translate open public records and empirical environmental formulas into clear, responsive digital tools. By connecting individual carbon output with targeted tree planting recommendations and municipal drainage planning, EcoSense enables students, educators, local authorities and non-governmental organisations to anticipate trends and take informed conservation action.
          </p>

          <h2 style={{ fontSize: '32px', marginBottom: '24px', borderTop: '1px solid var(--line)', paddingTop: '36px' }}>
            The Four Core Modules
          </h2>
          <table className="hairline-table">
            <tbody>
              <tr>
                <td style={{ color: 'var(--forest)' }}>01 Forest Cover</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Forest Cover and National Trends</div>
                  <div style={{ color: 'var(--muted)' }}>
                    Examines long-term national forest area trends using the World Bank FAO series alongside biennial Forest Survey of India state canopy assessments (Very Dense, Moderately Dense, and Open Forest).
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--clay)' }}>02 Reforestation</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Reforestation Planner</div>
                  <div style={{ color: 'var(--muted)' }}>
                    Calculates carbon dioxide absorption potential for planting sites, recommends native species tailored to local rainfall bands, and draws high-priority planting zones directly from high-risk deforestation areas.
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--smoke)' }}>03 Carbon</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Carbon Footprint Tracker</div>
                  <div style={{ color: 'var(--muted)' }}>
                    Evaluates household emissions across electricity, transit, aviation and diet, and monitors live emissions readings with threshold warnings. Output connects directly to the tree offset requirements.
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--river)' }}>04 Waterlogging</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Waterlogging Predictor</div>
                  <div style={{ color: 'var(--muted)' }}>
                    Evaluates 3-day precipitation forecasts against ground elevation and drainage features across eight Kolkata monitoring areas using a transparent screening index rule.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontSize: '32px', marginBottom: '16px', borderTop: '1px solid var(--line)', paddingTop: '36px', marginTop: '48px' }}>
            Methodology and Data Truth Rules
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.65, marginBottom: '16px' }}>
            All calculations are governed by the Six Data Truth Rules:
          </p>
          <ul style={{ listStyleType: 'decimal', paddingLeft: '20px', fontSize: '15px', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            <li><strong>Forest Cover vs Loss:</strong> Biennial FSI canopy surveys are never described as annual deforestation, and no linear regressions are fit to biennial state figures.</li>
            <li><strong>World Bank Isolation:</strong> The national FAO forest series is evaluated independently and never plotted on the same axis as FSI figures.</li>
            <li><strong>Screening Index (Proxy):</strong> The waterlogging risk rating is a transparent deterministic rule, not a trained machine learning model, and claims no false accuracy scores.</li>
            <li><strong>Modelled Atmosphere:</strong> Atmospheric CO2 and pollutants derive from regional Copernicus numerical models (CAMS) rather than ground hardware sensors.</li>
            <li><strong>Explicit Assumptions:</strong> Species rainfall bounds and the standard 21 kg CO2/tree annual absorption baseline are tagged Assumption.</li>
            <li><strong>Universal Metric Tagging:</strong> Every quantity displayed across the platform carries a visible text badge indicating its provenance: Real, Modelled, Proxy, or Assumption.</li>
          </ul>

          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '40px' }}>
            Detailed dataset attributions, licensing, and access links are documented on the{' '}
            <Link href="/data-sources" style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'underline' }}>
              Data Sources and Truth Rules page
            </Link>.
          </p>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
            }}
          >
            <div className="kicker" style={{ color: 'var(--forest)' }}>
              Open Source and Academic Inquiries
            </div>
            <p style={{ fontSize: '15px', color: 'var(--ink)', margin: 0 }}>
              The complete codebase, documentation and analytical scripts are published openly under MIT license. View the repository on{' '}
              <a
                href="https://github.com/Sangramjeet18/Panchtatva"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600, color: 'var(--forest)' }}
              >
                GitHub (Sangramjeet18/Panchtatva)
              </a>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
