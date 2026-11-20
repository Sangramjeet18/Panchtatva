import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Terms of Service: EcoSense',
  description: 'Terms of service and informational disclaimer for the EcoSense environmental platform.',
};

export default function TermsPage() {
  return (
    <div>
      <Section>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Legal
          </div>
          <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>
            Terms of Service
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '24px' }}>
            Effective date: November 2026. Last revised for the EcoSense academic demonstration.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontSize: '15px', color: 'var(--ink)' }}>
            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>1. Educational and Informational Purpose</h2>
              <p>
                EcoSense is an open educational demonstration website created for research, academic evaluation and student demonstration. All charts, predictive formulas, risk ratings and spatial projections are provided solely for educational and informational purposes.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>2. No Warranty and No Emergency Reliance</h2>
              <p>
                Waterlogging forecasts and deforestation indicators represent approximate statistical models. They are not official government flood advisories, municipal emergency announcements or meteorological certifications. You must not rely upon EcoSense outputs for life-safety choices, navigation during monsoon events or commercial land purchasing decisions.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>3. User Accounts and Payments</h2>
              <p>
                EcoSense requires no user registration, no login credentials, and no financial transactions. The service is free of charge. There are no paid tiers, subscriptions or stored personal accounts.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>4. Disclosure of Simulated Records</h2>
              <p>
                Where real physical sensors are absent, live panels utilize mathematically simulated data labelled as simulated. By using the website, you acknowledge that such values represent algorithmic simulations rather than calibrated physical meter readings.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>5. Intellectual Property and Open Public Sources</h2>
              <p>
                Underlying environmental records belong to their respective governmental and research sources, including Global Forest Watch, Forest Survey of India, Open-Meteo and Central Electricity Authority. Platform code is provided under open academic licensing.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
