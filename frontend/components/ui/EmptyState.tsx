import React from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No records found',
  description = 'There is currently no data recorded for this selection.',
}: EmptyStateProps) {
  return (
    <div
      style={{
        padding: '32px',
        border: '1px solid var(--line)',
        backgroundColor: 'var(--surface)',
        borderRadius: '2px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--ink)', marginBottom: '8px' }}>
        {title}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '15px' }}>
        {description}
      </p>
    </div>
  );
}
