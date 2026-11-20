import Image from 'next/image';
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
      {/* Header photo band */}
      <div
        style={{
          position: 'relative',
          height: '340px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/images/waterlogging.jpg"
          alt="Flooded urban street with a cycle-rickshaw driver navigating knee-deep water during monsoon"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 55%' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.42)',
          }}
        />
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: '40px',
            color: '#EDE7D9',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#7FAFC4',
              marginBottom: '8px',
            }}
          >
            Module 04
          </div>
          <h1
            style={{
              fontSize: '44px',
              lineHeight: 1.08,
              marginBottom: '12px',
              color: '#EDE7D9',
            }}
          >
            Waterlogging Predictor
          </h1>
          <p style={{ fontSize: '17px', color: '#D3DADE', maxWidth: '620px', lineHeight: 1.5 }}>
            Ward-level 3-day flood risk for Kolkata, derived from Open-Meteo rainfall forecasts and
            a Random Forest classifier trained on drainage, elevation and historical flood records.
          </p>
        </div>
      </div>

      <Section>
        <div style={{ maxWidth: '1100px' }}>
          {/* Context strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1px',
              backgroundColor: 'var(--line)',
              marginBottom: '40px',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            {[
              { label: 'City', value: 'Kolkata, West Bengal' },
              { label: 'Wards assessed', value: '16 representative wards' },
              { label: 'Forecast horizon', value: '3 days (Open-Meteo)' },
              { label: 'Model', value: 'Random Forest, 96.8% accuracy' },
            ].map(item => (
              <div
                key={item.label}
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Note about runoff and deforestation */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(91,123,58,0.08)',
              border: '1px solid #5B7B3A',
              borderRadius: '2px',
              fontSize: '14px',
              color: 'var(--ink)',
              marginBottom: '32px',
            }}
          >
            <strong>Runoff note:</strong> Urban flood risk worsens as forest and green cover reduces. Deforested
            hillsides and cleared urban tree cover increase the volume of surface runoff entering drainage systems
            during monsoon. See the{' '}
            <a href="/deforestation" style={{ color: '#1E4D35', textDecoration: 'underline' }}>
              Deforestation Tracker
            </a>{' '}
            for regional forest loss data.
          </div>

          <WaterloggingClient />

          {/* Method and data note */}
          <div
            style={{
              marginTop: '40px',
              padding: '20px 24px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '2px',
              fontSize: '14px',
              color: 'var(--muted)',
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: 'var(--ink)' }}>Method and data statement:</strong> Ward boundary coordinates
            and drainage scores are derived from Kolkata Municipal Corporation published reports and are partly
            estimated where official records are unavailable; those values are labelled as simulated. The model
            was trained on synthetic rainfall scenarios generated from ward topology parameters. It is a student
            demonstration tool and must not be used for emergency response without validation against official
            hydrological data. Rainfall forecasts are sourced from{' '}
            <a
              href="https://open-meteo.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2F5D73' }}
            >
              Open-Meteo
            </a>{' '}
            (open-source, free of charge).
          </div>
        </div>
      </Section>
    </div>
  );
}
