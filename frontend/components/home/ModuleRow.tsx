import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ModuleRowProps {
  moduleNumber: string;
  title: string;
  description: string;
  youGive: string;
  youGet: string;
  method: string;
  accentColor: string;
  imageSrc: string;
  secondaryImageSrc?: string;
  imageAlt: string;
  imageCaption: string;
  href: string;
  reverse?: boolean;
}

export function ModuleRow({
  moduleNumber,
  title,
  description,
  youGive,
  youGet,
  method,
  accentColor,
  imageSrc,
  secondaryImageSrc,
  imageAlt,
  imageCaption,
  href,
  reverse = false,
}: ModuleRowProps) {
  return (
    <div
      className="module-row"
      style={{
        display: 'grid',
        gridTemplateColumns: reverse ? '5fr 7fr' : '7fr 5fr',
        gap: '64px',
        alignItems: 'center',
        padding: '80px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      {/* Content Column */}
      <div style={{ order: reverse ? 2 : 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '96px',
            lineHeight: 1,
            color: accentColor,
            marginBottom: '8px',
            letterSpacing: '-0.03em',
          }}
        >
          {moduleNumber}
        </div>
        <h3
          style={{
            fontSize: '34px',
            lineHeight: 1.12,
            marginBottom: '16px',
            color: 'var(--ink)',
          }}
        >
          {title}
        </h3>

        <p style={{ fontSize: '18px', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '24px', maxWidth: '58ch' }}>
          {description}
        </p>

        {/* Hairline table with 'You give', 'You get', 'Method' */}
        <table className="hairline-table">
          <tbody>
            <tr>
              <td>You give</td>
              <td style={{ color: 'var(--ink)' }}>{youGive}</td>
            </tr>
            <tr>
              <td>You get</td>
              <td style={{ color: 'var(--ink)' }}>{youGet}</td>
            </tr>
            <tr>
              <td>Method</td>
              <td style={{ color: 'var(--muted)' }}>{method}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '24px' }}>
          <Link
            href={href}
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--ink)',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            Explore {title}
          </Link>
        </div>
      </div>

      {/* Image Column */}
      <div style={{ order: reverse ? 1 : 2 }}>
        {secondaryImageSrc ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                style={{
                  position: 'relative',
                  height: '480px',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  position: 'relative',
                  height: '480px',
                  border: '1px solid var(--line)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <Image
                  src={secondaryImageSrc}
                  alt={`${imageAlt} supplementary view`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
              {imageCaption}
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '480px',
                border: '1px solid var(--line)',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: 'var(--surface)',
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
              {imageCaption}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
