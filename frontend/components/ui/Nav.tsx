'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/deforestation', label: 'Deforestation' },
    { href: '/reforestation', label: 'Reforestation' },
    { href: '/carbon', label: 'Carbon' },
    { href: '/waterlogging', label: 'Waterlogging' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--line)',
        backgroundColor: 'var(--paper)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '68px',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '26px',
            fontWeight: 600,
            color: 'var(--forest)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          EcoSense
        </Link>
        <nav
          style={{
            display: 'flex',
            gap: '28px',
            alignItems: 'center',
            height: '100%',
            fontSize: '15px',
          }}
        >
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '100%',
                  color: isActive ? 'var(--ink)' : 'var(--muted)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--clay)' : '2px solid transparent',
                  paddingTop: '2px',
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
