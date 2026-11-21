'use client';

import React, { useEffect, useState } from 'react';
import { subscribeServerWaking } from '@/lib/api';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  waking?: boolean;
}

export function Skeleton({ width = '100%', height = '24px', style, waking }: SkeletonProps) {
  const [isWaking, setIsWaking] = useState(Boolean(waking));

  useEffect(() => {
    if (waking !== undefined) {
      setIsWaking(waking);
      return;
    }
    const unsubscribe = subscribeServerWaking((status) => {
      setIsWaking(status);
    });
    return unsubscribe;
  }, [waking]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: typeof width === 'number' ? `${width}px` : width }}>
      <span
        className="skeleton"
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        aria-hidden="true"
      />
      {isWaking && (
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
          Waking the server, this can take up to 30 seconds
        </div>
      )}
    </div>
  );
}
