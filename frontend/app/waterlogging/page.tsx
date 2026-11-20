import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata = {
  title: 'Waterlogging Predictor: EcoSense',
};

export default function WaterloggingPage() {
  return (
    <Section>
      <div style={{ maxWidth: '840px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Module 04
        </div>
        <h1 style={{ fontSize: '42px', marginBottom: '16px' }}>Waterlogging Predictor</h1>
        <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>
          Ward-level rainfall risk evaluation for Kolkata and metropolitan regions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Skeleton height={48} width="300px" />
          <Skeleton height={320} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Skeleton height={140} />
            <Skeleton height={140} />
          </div>
        </div>
      </div>
    </Section>
  );
}
