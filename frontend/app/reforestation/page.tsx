import { PhotoBand } from '@/components/ui/PhotoBand';
import { Section } from '@/components/ui/Section';
import { ReforestationClient } from '@/components/reforestation/ReforestationClient';

export const metadata = {
  title: 'Reforestation Planner: EcoSense',
  description: 'Targeted native species selection, CO2 absorption calculation and priority planting zones for Indian states.',
};

export default function ReforestationPage() {
  return (
    <div>
      <PhotoBand src="/images/reforestation.jpg" alt="Saplings in forest nursery bags" height={340}>
        <div style={{ maxWidth: '780px', color: '#EDE7D9' }}>
          <div style={{ fontSize: '13px', color: '#7FB08F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Module 02
          </div>
          <h1 style={{ color: '#EDE7D9', fontSize: '44px', lineHeight: 1.1, marginBottom: '12px' }}>
            Reforestation Planner
          </h1>
          <p style={{ fontSize: '17px', color: '#D9DDD9', margin: 0 }}>
            Plan native tree planting targets, calculate total annual CO2 absorption, and deploy saplings to high-risk deforestation corridors.
          </p>
        </div>
      </PhotoBand>

      <Section>
        <ReforestationClient />
      </Section>
    </div>
  );
}
