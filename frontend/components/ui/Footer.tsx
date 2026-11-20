import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        padding: '48px 0',
        marginTop: 'auto',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--forest)',
                marginBottom: '8px',
              }}
            >
              EcoSense
            </div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', maxWidth: '48ch' }}>
              Environmental prediction and tracking platform for India. Educational viva and research demonstration.
            </p>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/about">About</Link>
            <Link href="/data-sources">Data Sources</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <a
              href="https://github.com/Sangramjeet18/Panchtatva"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </a>
          </div>
        </div>
        <div
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: '24px',
            fontSize: '13px',
            color: 'var(--muted)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span>All simulation data is explicitly labelled. No personal data collected.</span>
          <span>Open environmental data initiative.</span>
        </div>
      </div>
    </footer>
  );
}
