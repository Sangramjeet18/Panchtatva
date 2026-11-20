import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { DeforestationClient } from '@/components/deforestation/DeforestationClient';

export const metadata = {
  title: 'Deforestation Tracker: EcoSense',
  description: 'Historical tree cover loss analysis and 10-year statistical forecast for West Bengal, Assam, Odisha and Kerala.',
};

export default function DeforestationPage() {
  return (
    <div>
      <PhotoBand src="/images/deforestation.jpg" alt="Deforested landscape with felled logs" height={340}>
        <div style={{ maxWidth: '780px', color: '#EDE7D9' }}>
          <div style={{ fontSize: '13px', color: '#7FB08F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Module 01
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '44px', lineHeight: 1.1, marginBottom: '12px' }}>
            Deforestation Tracker
          </h1>
          <p style={{ fontSize: '17px', color: '#D9DDD9', margin: 0 }}>
            Inspect historical tree cover loss, review 10-year projected trends with shaded prediction bounds, and locate vulnerable districts.
          </p>
        </div>
      </PhotoBand>

      <Section>
        <DeforestationClient />
      </Section>
    </div>
  );
}
