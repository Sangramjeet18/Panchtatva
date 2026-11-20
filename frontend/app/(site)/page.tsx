import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { PhotoBand } from '@/components/ui/PhotoBand';
import { ModuleRow } from '@/components/home/ModuleRow';
import { CarbonCalculator } from '@/components/home/CarbonCalculator';

export default function HomePage() {
  return (
    <div>
      {/* 2. Hero Section */}
      <PhotoBand src="/images/deforestation.jpg" alt="Deforested hillside landscape in India" height={520}>
        <div style={{ maxWidth: '780px', color: '#EDE7D9' }}>
          <h1
            style={{
              color: '#EDE7D9',
              fontSize: '56px',
              lineHeight: 1.08,
              marginBottom: '20px',
            }}
          >
            Environmental Prediction and Tracking for India
          </h1>
          <p
            style={{
              fontSize: '19px',
              lineHeight: 1.5,
              color: '#D9DDD9',
              marginBottom: '32px',
            }}
          >
            EcoSense predicts and tracks deforestation trends, reforestation suitability, household carbon footprints and municipal waterlogging using public records and empirical models.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="#carbon-calculator"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 24px',
                borderRadius: '2px',
                border: '1px solid #7FB08F',
                backgroundColor: '#1E4D35',
                color: '#F2EDE2',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Try the carbon calculator
            </a>
            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                padding: '0 24px',
                borderRadius: '2px',
                border: '1px solid #D9DDD9',
                backgroundColor: 'transparent',
                color: '#EDE7D9',
                fontFamily: 'var(--font-sans)',
                fontSize: '15px',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              How it works
            </a>
          </div>
        </div>
      </PhotoBand>

      {/* 3. What EcoSense does */}
      <Section>
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '38px', marginBottom: '16px' }}>What EcoSense Does</h2>
          <p style={{ fontSize: '18px', color: 'var(--muted)', maxWidth: '72ch' }}>
            Forest loss, rising carbon emissions and urban flooding are usually recorded late in disconnected spreadsheets and government filings. EcoSense integrates public environmental records into four analytical tools designed for students, researchers, local authorities and community planners.
          </p>
        </div>

        <div>
          <ModuleRow
            moduleNumber="Module 01"
            title="Deforestation Tracker"
            problem="State-level forest loss trends are published with multi-year delays, making it difficult for local conservationists to evaluate recent losses."
            whatYouCanDo="Select an Indian state such as West Bengal, Assam, Odisha or Kerala to inspect historical tree cover loss and review ten-year forecasts."
            whatYouGet="Interactive loss charts with regression confidence intervals, district risk ratings (Low, Medium, High) and NASA FIRMS active fire indicators."
            imageSrc="/images/deforestation.jpg"
            imageAlt="Cleared land and fallen timber from forest cover loss"
            href="/deforestation"
          />

          <ModuleRow
            moduleNumber="Module 02"
            title="Reforestation Planner"
            problem="Tree planting drives often select non-native species or plant in locations with inadequate rainfall, reducing sapling survival."
            whatYouCanDo="Input available land in hectares or target tree counts, choose a state region, and filter by regional rainfall bands."
            whatYouGet="Annual CO2 absorption estimates, agro-climatically matched native species suggestions, and priority planting districts imported from high-risk deforestation areas."
            imageSrc="/images/reforestation.jpg"
            imageAlt="Native tree saplings in nursery bags ready for planting"
            href="/reforestation"
            reverse
          />

          <ModuleRow
            moduleNumber="Module 03"
            title="Carbon Footprint Tracker"
            problem="Individual citizens find personal carbon calculations abstract and difficult to connect to practical local restoration actions."
            whatYouCanDo="Calculate annual greenhouse gas output across electricity, transit, aviation and diet, and monitor live sensor emissions panels."
            whatYouGet="Specific metric tonnage breakdown, sensor threshold alerts, and direct calculation of the exact number of mature trees required to balance your emissions."
            imageSrc="/images/carbon-1.jpg"
            secondaryImageSrc="/images/carbon-2.jpg"
            imageAlt="Industrial thermal power emission stacks"
            href="/carbon"
          />

          <ModuleRow
            moduleNumber="Module 04"
            title="Waterlogging Predictor"
            problem="Monsoon urban flooding strikes ward by ward, yet open meteorological rainfall numbers are rarely linked to local drainage infrastructure."
            whatYouCanDo="Select a city and municipal ward to evaluate rainfall forecasts against elevation, drainage network scores and historical flood event counts."
            whatYouGet="Three-day ward-level risk classifications (Low, Medium, High) alongside flood probability metrics and targeted ward advisory lists."
            imageSrc="/images/waterlogging.jpg"
            imageAlt="Flooded urban street with motorized vehicle in water"
            href="/waterlogging"
            reverse
          />
        </div>
      </Section>

      {/* 4. Live Demo Section */}
      <Section id="carbon-calculator">
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Live Working Demo
          </div>
          <h2 style={{ fontSize: '38px', marginBottom: '12px' }}>Personal Carbon and Tree Offset Calculator</h2>
          <p style={{ color: 'var(--muted)' }}>
            This live calculator evaluates your annual carbon dioxide output using India-specific emission coefficients and links directly to tree requirements.
          </p>
        </div>
        <CarbonCalculator />
      </Section>

      {/* 5. How it works Section */}
      <Section id="how-it-works">
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Methodology
          </div>
          <h2 style={{ fontSize: '38px', marginBottom: '12px' }}>How EcoSense Works</h2>
          <p style={{ color: 'var(--muted)' }}>
            Each module processes verifiable inputs through transparent statistical techniques to produce actionable numbers.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '32px',
          }}
        >
          <div style={{ borderTop: '2px solid var(--forest)', paddingTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--forest)', marginBottom: '8px' }}>
              01
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Collect</h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Public geospatial, atmospheric and grid datasets are ingested from Global Forest Watch, Forest Survey of India, Open-Meteo and the Central Electricity Authority.
            </p>
          </div>

          <div style={{ borderTop: '2px solid var(--forest)', paddingTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--forest)', marginBottom: '8px' }}>
              02
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Model</h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Linear regression models forecast state forest loss. Random Forest classifiers estimate ward waterlogging risk based on drainage and elevation features.
            </p>
          </div>

          <div style={{ borderTop: '2px solid var(--forest)', paddingTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--forest)', marginBottom: '8px' }}>
              03
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Predict</h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Outputs are scored into discrete risk levels (Low, Medium, High) accompanied by numeric bounds, error intervals and stated assumptions.
            </p>
          </div>

          <div style={{ borderTop: '2px solid var(--forest)', paddingTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: 'var(--forest)', marginBottom: '8px' }}>
              04
            </div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Act</h3>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>
              Modules connect to one another: individual emissions output defines tree offset counts, which then identify priority planting zones in high-risk districts.
            </p>
          </div>
        </div>
      </Section>

      {/* 6. Data and Honesty Note Section */}
      <Section style={{ backgroundColor: 'var(--surface)' }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Transparency and Data Ethics
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Data Sources and Simulation Disclosure</h2>
          <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '16px' }}>
            EcoSense does not fabricate statistics, user testimonials or claims of certainty. Real public records are cited with origin and publication year.
          </p>
          <ul style={{ listStyleType: 'decimal', paddingLeft: '20px', fontSize: '15px', color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Verified Public Data:</strong> State tree cover loss figures originate from Global Forest Watch and the Forest Survey of India. Grid emission factors reflect published Central Electricity Authority statistics. Weather forecasts query the Open-Meteo open weather API.
            </li>
            <li>
              <strong>Simulated Data:</strong> Where local hardware sensors are not deployed, live carbon stream monitors display simulated readings produced by an exponential diurnal generator. Simulated records are clearly labelled as simulated.
            </li>
            <li>
              <strong>Method Limits:</strong> Linear forecasts project past trends into the future and do not anticipate sudden legislative interventions or catastrophic forest fires. Flood models provide indicative risk ratings for planning rather than guaranteed hydrological guarantees.
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
