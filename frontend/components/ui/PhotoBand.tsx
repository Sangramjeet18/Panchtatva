import React from 'react';
import Image from 'next/image';

export interface PhotoBandProps {
  src: string;
  alt: string;
  height?: number;
  children?: React.ReactNode;
}

export function PhotoBand({ src, alt, height = 400, children }: PhotoBandProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        overflow: 'hidden',
        backgroundColor: 'var(--surface)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        style={{ objectFit: 'cover' }}
        priority
      />
      <div className="photo-overlay" />
      {children && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div className="container">{children}</div>
        </div>
      )}
    </div>
  );
}
