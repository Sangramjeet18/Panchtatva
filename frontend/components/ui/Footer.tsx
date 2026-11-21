import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        padding: '72px 0 36px 0',
        marginTop: 'auto',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          {/* Column 1: Wordmark & About */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '32px',
                fontWeight: 600,
                color: 'var(--forest)',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
              }}
            >
              EcoSense
            </div>
            <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '34ch' }}>
              Environmental prediction and tracking platform for India. Integrates public records into open analytical tools for conservation and municipal planning.
            </p>
          </div>

          {/* Column 2: Modules */}
          <div>
            <div className="kicker" style={{ color: 'var(--muted)' }}>
              Modules
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <Link href="/deforestation" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                01 Deforestation Tracker
              </Link>
              <Link href="/reforestation" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                02 Reforestation Planner
              </Link>
              <Link href="/carbon" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                03 Carbon Footprint
              </Link>
              <Link href="/waterlogging" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                04 Waterlogging Predictor
              </Link>
            </div>
          </div>

          {/* Column 3: Project */}
          <div>
            <div className="kicker" style={{ color: 'var(--muted)' }}>
              Project
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <Link href="/about" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                About and Method
              </Link>
              <Link href="/data-sources" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                Data Sources
              </Link>
              <a
                href="https://github.com/Sangramjeet18/Panchtatva"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'var(--ink)' }}
              >
                GitHub Repository
              </a>
            </div>
          </div>

          {/* Column 4: Legal */}
          <div>
            <div className="kicker" style={{ color: 'var(--muted)' }}>
              Legal and Ethics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <Link href="/legal/terms" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                Terms of Service
              </Link>
              <Link href="/legal/privacy" style={{ textDecoration: 'none', color: 'var(--ink)' }}>
                Privacy Policy
              </Link>
              <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
                Open Educational Initiative
              </span>
            </div>
          </div>
        </div>

        {/* Base line with data disclaimer */}
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
          <span>All simulation data is explicitly labelled. No personal data collected. Predictions are informational and educational.</span>
          <span>Open environmental data platform for India.</span>
        </div>
      </div>
    </footer>
  );
}
