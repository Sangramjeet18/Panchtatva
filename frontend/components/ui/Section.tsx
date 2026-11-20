import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className = '', style, ...props }: SectionProps) {
  return (
    <section className={`section ${className}`} style={style} {...props}>
      <div className="container">{children}</div>
    </section>
  );
}
