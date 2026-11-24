'use client';

import React from 'react';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  unit?: string;
  hint?: string;
  warning?: string | null;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  unit,
  hint,
  warning,
  min = 0,
  max,
  disabled = false,
}: NumberFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      if (max !== undefined && parsed > max) {
        onChange(max);
      } else {
        onChange(parsed);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      <label
        htmlFor={id}
        style={{
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--ink)',
        }}
      >
        {label}
      </label>

      {/* Input container with unit inside the box */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--paper)',
          border: warning ? '1px solid var(--clay)' : '1px solid var(--line)',
          borderRadius: '2px',
          padding: '0 12px',
          height: '42px',
          boxSizing: 'border-box',
        }}
      >
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value === 0 ? '' : value}
          placeholder="0"
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={(e) => {
            // Block up/down arrow keys from changing numerical values
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
            }
          }}
          onWheel={(e) => {
            // Block mouse wheel from changing values or scrolling input
            (e.target as HTMLElement).blur();
          }}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            color: 'var(--ink)',
            width: '100%',
          }}
        />

        {unit && (
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--muted)',
              marginLeft: '8px',
              userSelect: 'none',
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {warning && (
        <span style={{ fontSize: '12px', color: 'var(--clay)', lineHeight: 1.4 }}>
          {warning}
        </span>
      )}

      {hint && !warning && (
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
          {hint}
        </span>
      )}
    </div>
  );
}
