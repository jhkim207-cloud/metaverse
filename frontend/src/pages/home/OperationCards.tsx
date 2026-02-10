import type { ReactNode } from 'react';
import type { PeriodType, OperationCard } from '../../types/dashboard.types';
import { PeriodTabs } from './PeriodTabs';

interface OperationCardsProps {
  title?: string;
  icon?: ReactNode;
  cards: OperationCard[];
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  loading?: boolean;
}

export function OperationCards({ title = '운영 현황', icon, cards, period, onPeriodChange, loading }: OperationCardsProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 10px' }}>
        {icon}
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <PeriodTabs value={period} onChange={onPeriodChange} />
      </div>

      {/* Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="card"
              style={{ height: 90, animation: 'pulse 2s infinite' }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
          {cards.map(card => (
            <div
              key={card.label}
              className="card"
              style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {card.label}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
                  {card.mainValue}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {card.mainUnit}
                </span>
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                {card.subValue}{card.subUnit ? ` ${card.subUnit}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
