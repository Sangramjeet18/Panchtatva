import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'secondary-light';
}

export function Button({
  children,
  variant = 'primary',
  style,
  ...props
}: ButtonProps) {
  let className = 'btn-primary';
  if (variant === 'secondary') className = 'btn-secondary';
  if (variant === 'secondary-light') className = 'btn-secondary-light';

  return (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  );
}
