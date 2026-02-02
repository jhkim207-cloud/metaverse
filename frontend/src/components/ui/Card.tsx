import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'accent';
  as?: 'div' | 'section' | 'article';
  role?: string;
  'aria-labelledby'?: string;
}

export function Card({
  className = '',
  children,
  title,
  variant = 'default',
  as: Component = 'div',
  role,
  'aria-labelledby': ariaLabelledBy,
}: CardProps) {
  const titleId = title ? `card-title-${title.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  const variantStyle: CSSProperties = variant === 'accent'
    ? { borderLeft: '4px solid var(--accent)' }
    : {};

  return (
    <Component
      className={`card ${className}`}
      style={variantStyle}
      role={role}
      aria-labelledby={ariaLabelledBy || (title ? titleId : undefined)}
    >
      {title && (
        <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
          <h3 id={titleId} style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text)' }}>
            {title}
          </h3>
        </div>
      )}
      {children}
    </Component>
  );
}
