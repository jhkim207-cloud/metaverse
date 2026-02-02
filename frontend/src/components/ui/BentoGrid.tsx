import { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12; // Grid columns count
}

export function BentoGrid({ children, className = '', cols = 3 }: BentoGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-1 md:grid-cols-4 lg:grid-cols-12',
  };

  return <div className={`grid gap-4 ${gridCols[cols]} ${className}`}>{children}</div>;
}

interface BentoCardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  header?: ReactNode;
  role?: string;
  colSpan?: 1 | 2 | 3 | 4;
  rowSpan?: 1 | 2 | 3 | 4;
}

export function BentoCard({
  children,
  className = '',
  title,
  description,
  header,
  role,
  colSpan,
  rowSpan,
}: BentoCardProps) {
  const colSpans = colSpan
    ? {
        1: 'col-span-1',
        2: 'col-span-1 md:col-span-2',
        3: 'col-span-1 md:col-span-3',
        4: 'col-span-1 md:col-span-4',
      }[colSpan]
    : '';

  const rowSpans = rowSpan
    ? {
        1: 'row-span-1',
        2: 'row-span-1 md:row-span-2',
        3: 'row-span-1 md:row-span-3',
        4: 'row-span-1 md:row-span-4',
      }[rowSpan]
    : '';

  return (
    <div
      className={`
        card group overflow-hidden
        flex flex-col justify-between
        ${colSpans} ${rowSpans}
        ${className}
      `}
      role={role}
    >
      {header && (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-[var(--border)] mb-4">
          {header}
        </div>
      )}
      <div className="flex flex-col gap-1 transition-all duration-300 group-hover:translate-x-1">
        {title && <h3 className="font-semibold text-[var(--text)] text-lg">{title}</h3>}
        {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
      </div>
      {children}
    </div>
  );
}
