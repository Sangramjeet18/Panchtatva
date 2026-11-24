import React from 'react';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of service and informational disclaimer for the EcoSense environmental platform.',
};

export default function TermsPage() {
  return (
    <div>
      <Section style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '820px' }}>
          <div className="kicker" style={{ color: 'var(--muted)' }}>
            Legal and Governance
          </div>
          <h1 style={{ fontSize: '52px', lineHeight: 1.08, marginBottom: '20px' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Educational and research usage guidelines for the EcoSense environmental prediction platform.
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ maxWidth: '820px' }}>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '36px' }}>
            Last updated: November 2026. Academic and non-commercial educational deployment.
          </p>

          <table className="hairline-table">
            <tbody>
              <tr>
                <td style={{ color: 'var(--ink)' }}>1. Scope</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Academic and Educational Intent</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>EcoSense is developed as a student environmental research platform for coursework demonstration and open-access data exploration. All analytical calculations, regression models and classification projections are provided strictly for educational purposes.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>2. Emergency Use</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Informational Guidance Only</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Waterlogging forecasts and deforestation indicators represent approximate statistical models. They are not official government flood advisories, municipal emergency announcements or meteorological certifications. Users must not rely upon EcoSense outputs for life-safety choices or navigation during flood events.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>3. Accounts</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Zero Accounts and Payments</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>EcoSense requires no user registration, no login credentials, and no financial transactions. The service is completely free of charge. There are no paid tiers, subscriptions or stored personal accounts.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>4. Simulation</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Simulated Data Disclosure</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Where physical sensors are absent, live panels utilize mathematically simulated data labelled as simulated. By using the website, you acknowledge that such values represent algorithmic simulations rather than physical meter readings.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>5. Licensing</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Open Source and Data Rights</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Underlying public records belong to their respective governmental and research sources, including Global Forest Watch, Forest Survey of India, Open-Meteo and Central Electricity Authority. Platform code is published under open MIT licensing.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
