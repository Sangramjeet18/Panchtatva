import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Privacy Policy: EcoSense',
  description: 'Privacy policy for the EcoSense environmental platform.',
};

export default function PrivacyPage() {
  return (
    <div>
      <Section>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Legal
          </div>
          <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>
            Privacy Policy
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '24px' }}>
            Effective date: November 2026.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '15px', color: 'var(--ink)' }}>
            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>1. Zero Personal Data Collection</h2>
              <p>
                EcoSense is committed to absolute visitor privacy. We do not require account registration, email submission, names, telephone numbers or home addresses. You can utilize every calculator and exploration tool completely anonymously.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>2. Calculator Inputs Stay Local</h2>
              <p>
                Values entered into the personal carbon footprint calculator (such as electricity consumption, transit kilometres and dietary selection) are processed in real time within your web browser. These entries are never associated with your personal identity or IP address.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>3. Cookies and Tracking Technologies</h2>
              <p>
                EcoSense does not deploy third-party advertising cookies, behavioural profiling trackers, or cross-site fingerprinting scripts. Web storage is utilized strictly for technical preferences such as theme selection.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>4. Server Logs</h2>
              <p>
                Standard hosting platforms (such as Vercel and Render) generate technical request logs containing browser user-agent strings and IP addresses for basic network diagnostic purposes and DDoS mitigation. These technical logs are discarded in accordance with hosting retention policies.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>5. Contact and Inquiries</h2>
              <p>
                For questions regarding this privacy policy or academic data governance, contact eco-project-inquiries@ecosense.local.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
