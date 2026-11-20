import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ModuleRowProps {
  moduleNumber: string;
  title: string;
  problem: string;
  whatYouCanDo: string;
  whatYouGet: string;
  imageSrc: string;
  secondaryImageSrc?: string;
  imageAlt: string;
  href: string;
  reverse?: boolean;
}

export function ModuleRow({
  moduleNumber,
  title,
  problem,
  whatYouCanDo,
  whatYouGet,
  imageSrc,
  secondaryImageSrc,
  imageAlt,
  href,
  reverse = false,
}: ModuleRowProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '48px',
        alignItems: 'center',
        padding: '48px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div style={{ order: reverse ? 2 : 1 }}>
        <div
          style={{
            fontSize: '13px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}
        >
          {moduleNumber}
        </div>
        <h3
          style={{
            fontSize: '32px',
            lineHeight: 1.15,
            marginBottom: '20px',
            color: 'var(--ink)',
          }}
        >
          {title}
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Problem
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)' }}>{problem}</p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            What you can do
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)' }}>{whatYouCanDo}</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            What you get
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)' }}>{whatYouGet}</p>
        </div>

        <Link
          href={href}
          style={{
            fontSize: '15px',
            fontWeight: 500,
            color: 'var(--forest)',
          }}
        >
          Open {title}
        </Link>
      </div>

      <div style={{ order: reverse ? 1 : 2 }}>
        {secondaryImageSrc ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                height: '320px',
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
                height: '320px',
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
        ) : (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '360px',
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
        )}
      </div>
    </div>
  );
}
