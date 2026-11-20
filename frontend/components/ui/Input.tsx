import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  unit?: string;
}

export function Input({ label, unit, id, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '14px', color: 'var(--muted)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          style={{
            height: '44px',
            width: '100%',
            padding: unit ? '0 48px 0 12px' : '0 12px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '2px',
            color: 'var(--ink)',
            fontFamily: 'var(--font-sans)',
            fontSize: '15px',
            boxShadow: 'none',
            ...style,
          }}
          {...props}
        />
        {unit && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              fontSize: '13px',
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, id, style, ...props }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '14px', color: 'var(--muted)' }}>
          {label}
        </label>
      )}
      <select
        id={id}
        style={{
          height: '44px',
          width: '100%',
          padding: '0 12px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '2px',
          color: 'var(--ink)',
          fontFamily: 'var(--font-sans)',
          fontSize: '15px',
          boxShadow: 'none',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
