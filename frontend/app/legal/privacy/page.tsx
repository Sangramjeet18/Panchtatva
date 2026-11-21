import React from 'react';
import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Privacy Policy | EcoSense',
  description: 'Privacy policy and data governance statement for the EcoSense environmental platform.',
};

export default function PrivacyPage() {
  return (
    <div>
      <Section style={{ borderBottom: '1px solid var(--line)', backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '820px' }}>
          <div className="kicker" style={{ color: 'var(--muted)' }}>
            Data Governance
          </div>
          <h1 style={{ fontSize: '52px', lineHeight: 1.08, marginBottom: '20px' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1.6 }}>
            Our commitment to visitor anonymity, zero personal data harvesting, and local-only calculator processing.
          </p>
        </div>
      </Section>

      <Section>
        <div style={{ maxWidth: '820px' }}>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '36px' }}>
            Effective date: November 2026. Academic and student environmental platform.
          </p>

          <table className="hairline-table">
            <tbody>
              <tr>
                <td style={{ color: 'var(--ink)' }}>1. Tracking</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Zero Personal Data Collection</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>EcoSense is committed to absolute visitor privacy. We do not require account registration, email submission, names, telephone numbers or home addresses. You can utilize every calculator and exploration tool completely anonymously.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>2. Calculator</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Local In-Browser Processing</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Values entered into the carbon footprint calculator (such as electricity consumption, transit kilometres and dietary selection) are processed in real time within your web browser. These entries are never associated with your personal identity or IP address.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>3. Cookies</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>No Advertising Cookies or Trackers</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>EcoSense does not deploy third-party advertising cookies, behavioural profiling trackers, or cross-site fingerprinting scripts. Web storage is utilized strictly for technical preferences such as theme selection.</div>
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--ink)' }}>4. Server Logs</td>
                <td>
                  <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--ink)' }}>Diagnostic Hosting Logs Only</div>
                  <div style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Standard hosting platforms (such as Vercel and Render) generate technical request logs containing browser user-agent strings and IP addresses for basic network diagnostic purposes and DDoS mitigation. These technical logs are discarded in accordance with hosting retention policies.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
