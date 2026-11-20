import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'About EcoSense: Environmental Monitoring and Prediction',
  description: 'Mission, methodology, data sources and project background for the EcoSense environmental platform.',
};

export default function AboutPage() {
  return (
    <div>
      <Section>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            About the Project
          </div>
          <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>
            Mission and Context
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '20px' }}>
            EcoSense was conceived as an environmental studies (EVS) viva and research initiative to address a persistent gap in ecological information systems across India. Most critical environmental reports on canopy retreat, emissions growth and urban drainage blockages are published years after data collection, locked inside bulky PDF reports and inaccessible tables.
          </p>

          <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '40px' }}>
            Our mission is to translate open public records and empirical environmental formulas into clear, responsive digital tools. By connecting individual carbon output with targeted tree planting recommendations and municipal drainage planning, EcoSense enables students, educators, local authorities and non-governmental organisations to anticipate trends and take informed conservation action.
          </p>

          <h2 style={{ fontSize: '32px', marginBottom: '16px', borderTop: '1px solid var(--line)', paddingTop: '32px' }}>
            The Four Core Modules
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--clay)', marginBottom: '6px' }}>
                1. Deforestation Tracker (M1)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                Tracks historical tree cover losses across Indian states, provides a 10-year statistical forecast with prediction bounds, and highlights vulnerable districts using normalised loss rates and satellite fire alerts.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--forest)', marginBottom: '6px' }}>
                2. Reforestation Planner (M2)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                Calculates carbon dioxide absorption potential for planting sites, recommends native species tailored to local rainfall bands, and draws high-priority planting zones directly from high-risk deforestation areas.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--smoke)', marginBottom: '6px' }}>
                3. Carbon Footprint Tracker (M3)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                Evaluates household emissions across electricity, transit, aviation and diet, and monitors live emissions readings with threshold warnings. Output connects directly to the tree offset requirements.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: 'var(--river)', marginBottom: '6px' }}>
                4. Waterlogging Predictor (M4)
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--ink)' }}>
                Combines 3-day precipitation forecasts with ward elevation, drainage efficiency scores and past flood frequency to classify ward-level inundation risk for cities starting with Kolkata.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '32px', marginBottom: '16px', borderTop: '1px solid var(--line)', paddingTop: '32px' }}>
            Methodology and Limits
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '16px' }}>
            All prediction models are built for educational interpretability. Regressions run transparent linear and polynomial baselines. Classification rules evaluate standard physical thresholds without opaque machine learning black boxes.
          </p>
          <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '40px' }}>
            Predictions represent statistical likelihoods under current baseline conditions. They do not claim absolute foresight and must not be used as the sole foundation for civil engineering works or emergency evacuation declarations.
          </p>

          <h2 style={{ fontSize: '32px', marginBottom: '16px', borderTop: '1px solid var(--line)', paddingTop: '32px' }}>
            Academic Context and Contact
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--ink)', marginBottom: '16px' }}>
            Developed as an Environmental Studies (EVS) demonstration and engineering viva project. Built using Next.js 14, TypeScript, Python FastAPI and Supabase PostgreSQL.
          </p>
          <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--line)', padding: '20px', borderRadius: '2px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Contact Information</div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', margin: 0 }}>
              Academic inquiry: eco-project-inquiries@ecosense.local
              <br />
              Code repository: github.com/Sangramjeet18/Panchtatva
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
