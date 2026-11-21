import React from 'react';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About and Method | EcoSense',
  description: 'Mission, methodology, data sources and project background for the EcoSense environmental platform.',
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
                <td style={{ color: 'var(--forest)' }}>01 Deforestation</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Deforestation Tracker</div>
                  <div style={{ color: 'var(--muted)' }}>Tracks historical tree cover losses across Indian states, provides a 10-year statistical forecast with prediction bounds, and highlights vulnerable districts using normalised loss rates and satellite fire alerts.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--clay)' }}>02 Reforestation</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Reforestation Planner</div>
                  <div style={{ color: 'var(--muted)' }}>Calculates carbon dioxide absorption potential for planting sites, recommends native species tailored to local rainfall bands, and draws high-priority planting zones directly from high-risk deforestation areas.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--smoke)' }}>03 Carbon</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Carbon Footprint Tracker</div>
                  <div style={{ color: 'var(--muted)' }}>Evaluates household emissions across electricity, transit, aviation and diet, and monitors live emissions readings with threshold warnings. Output connects directly to the tree offset requirements.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--river)' }}>04 Waterlogging</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Waterlogging Predictor</div>
                  <div style={{ color: 'var(--muted)' }}>Combines 3-day precipitation forecasts with ward elevation, drainage efficiency scores and past flood frequency to classify ward-level inundation risk for cities starting with Kolkata.</div>
                </td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontSize: '32px', marginBottom: '16px', borderTop: '1px solid var(--line)', paddingTop: '36px', marginTop: '48px' }}>
            Methodology and Limits
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.65, marginBottom: '16px' }}>
            All prediction models are built for educational interpretability. Regressions run transparent linear baselines. Classification rules evaluate standard physical thresholds without opaque machine learning black boxes.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '40px' }}>
            Predictions represent statistical likelihoods under current baseline conditions. They do not claim absolute foresight and must not be used as civil defence or municipal emergency certifications.
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
              The complete codebase, documentation and trained model parameters are published openly under MIT license. View the repository on{' '}
              <a
                href="https://github.com/Sangramjeet18/Panchtatva"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600, color: 'var(--forest)' }}
              >
                GitHub
              </a>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
