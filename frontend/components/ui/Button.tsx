import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  asLink?: boolean;
  href?: string;
}

export function Button({
  children,
  variant = 'primary',
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary';
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    padding: '0 24px',
    borderRadius: '2px',
    border: isPrimary ? '1px solid var(--forest)' : '1px solid var(--ink)',
    backgroundColor: isPrimary ? 'var(--forest)' : 'transparent',
    color: isPrimary ? 'var(--paper)' : 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: 'none',
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
