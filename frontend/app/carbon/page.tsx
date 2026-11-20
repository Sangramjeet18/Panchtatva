import Image from 'next/image';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { CarbonCalculatorFull } from '@/components/carbon/calculator/CarbonCalculatorFull';
import { CarbonLivePanel } from '@/components/carbon/live/CarbonLivePanel';

export const metadata = {
  title: 'Carbon Footprint Tracker: EcoSense',
  description: 'Evaluate personal greenhouse gas emissions across electricity, transit, flights and diet with real-time canopy telemetry.',
};

export default function CarbonPage() {
  return (
    <div>
      {/* Header photo band using carbon-1.jpg */}
      <PhotoBand src="/images/carbon-1.jpg" alt="Industrial thermal emission cooling stacks" height={360}>
        <div style={{ maxWidth: '780px', color: '#EDE7D9' }}>
          <div style={{ fontSize: '13px', color: '#7FB08F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Module 03
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '44px', lineHeight: 1.1, marginBottom: '12px' }}>
            Carbon Footprint Tracker
          </h1>
          <p style={{ fontSize: '17px', color: '#D9DDD9', margin: 0 }}>
            Calculate individual and household greenhouse emissions, inspect live canopy telemetry readings, and balance output with tree offset targets.
          </p>
        </div>
      </PhotoBand>

      {/* Main content section */}
      <Section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {/* Inset photo band with carbon-2.jpg and context description */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'center',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '36px',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Context and Regional Baseline
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>
                Thermal Power and Transport Dominance in India
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                India&apos;s electric grid operates predominantly on coal-fired thermal generation, yielding a high statutory factor of 0.80 kg CO2 per kilowatt-hour. Ground commuting and short-haul domestic flights multiply personal baselines significantly.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--muted)', margin: 0 }}>
                This module connects personal consumption directly with physical canopy sensors and land-based reforestation offsetting.
              </p>
            </div>

            <div
              style={{
                position: 'relative',
                height: '240px',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: 'var(--surface)',
              }}
            >
              <Image
                src="/images/carbon-2.jpg"
                alt="Industrial emissions in urban electrical substation canopy"
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Calculator UI */}
          <CarbonCalculatorFull />

          {/* Live Panel UI */}
          <CarbonLivePanel />
        </div>
      </Section>
    </div>
  );
}
