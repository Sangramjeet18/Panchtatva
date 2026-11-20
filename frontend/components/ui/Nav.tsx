import Link from 'next/link';

export function Nav() {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--forest)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
          }}
        >
          EcoSense
        </Link>
        <nav
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            fontSize: '15px',
          }}
        >
          <Link href="/deforestation" style={{ color: 'var(--ink)' }}>
            Deforestation
          </Link>
          <Link href="/reforestation" style={{ color: 'var(--ink)' }}>
            Reforestation
          </Link>
          <Link href="/carbon" style={{ color: 'var(--ink)' }}>
            Carbon
          </Link>
          <Link href="/waterlogging" style={{ color: 'var(--ink)' }}>
            Waterlogging
          </Link>
          <Link href="/about" style={{ color: 'var(--muted)' }}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
