import React from 'react';
import { Button } from './Button';

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'An error occurred while loading this section.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        padding: '32px',
        border: '1px solid var(--clay)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
      }}
    >
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--clay)', marginBottom: '8px' }}>
        Unable to load data
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: onRetry ? '16px' : 0 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
