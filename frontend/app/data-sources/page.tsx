import { Section } from '@/components/ui/Section';

export const metadata = {
  title: 'Data Sources: EcoSense',
  description: 'Verified public environmental datasets and simulation parameters used in EcoSense.',
};

export default function DataSourcesPage() {
  const sources = [
    {
      name: 'Global Forest Watch (GFW)',
      provider: 'World Resources Institute',
      coverage: 'State and district annual tree cover loss in hectares (2001 to 2023)',
      nature: 'Verified open empirical data',
      url: 'https://www.globalforestwatch.org',
    },
    {
      name: 'India State of Forest Report (ISFR)',
      provider: 'Forest Survey of India (FSI), MoEFCC',
      coverage: 'Biennial forest canopy density, district forest classifications and recorded forest areas',
      nature: 'Official government publications',
      url: 'https://fsi.nic.in',
    },
    {
      name: 'NASA FIRMS',
      provider: 'NASA Earth Science Data and Information System (ESDIS)',
      coverage: 'MODIS and VIIRS satellite active fire alerts and thermal anomaly detections',
      nature: 'Near real-time satellite telemetry',
      url: 'https://firms.modaps.eosdis.nasa.gov',
    },
    {
      name: 'Central Electricity Authority (CEA) CO2 Baseline Database',
      provider: 'Ministry of Power, Government of India',
      coverage: 'Indian national grid emission factor (approx 0.80 kg CO2 per kWh, Version 19)',
      nature: 'Official annual statutory emission baseline',
      url: 'https://cea.nic.in',
    },
    {
      name: 'Open-Meteo Weather API',
      provider: 'Open-Meteo Group',
      coverage: '72-hour forecast precipitation, convective rain totals and hourly temperature',
      nature: 'Open-source numerical weather prediction models (ECMWF / DWD)',
      url: 'https://open-meteo.com',
    },
    {
      name: 'Kolkata Ward Drainage & Elevation Records',
      provider: 'Kolkata Municipal Corporation / OpenStreetMap',
      coverage: 'Digital elevation model (DEM) and drainage network ratings across 144 municipal wards',
      nature: 'Synthesised baseline combining public elevation with documented flood history',
      url: 'https://www.kmcgov.in',
    },
  ];

  return (
    <div>
      <Section>
        <div style={{ maxWidth: '840px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Transparency
          </div>
          <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>
            Data Sources and Attributions
          </h1>

          <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--muted)', marginBottom: '40px' }}>
            EcoSense relies upon published public records and recognised empirical emission constants. Below is the complete inventory of datasets and statutory references incorporated into our prediction models.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {sources.map((src, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid var(--line)',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '2px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '20px', color: 'var(--ink)' }}>{src.name}</h2>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '2px',
                      border: '1px solid var(--line)',
                      backgroundColor: 'var(--paper)',
                      color: 'var(--forest)',
                      fontWeight: 500,
                    }}
                  >
                    {src.nature}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--forest)', marginBottom: '8px' }}>
                  Provider: {src.provider}
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink)', marginBottom: '12px' }}>
                  Scope: {src.coverage}
                </p>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '13px', color: 'var(--muted)' }}
                >
                  Visit data portal: {src.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
