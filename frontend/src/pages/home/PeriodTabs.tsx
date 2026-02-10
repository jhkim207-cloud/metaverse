import type { PeriodType } from '../../types/dashboard.types';

interface PeriodTabsProps {
  value: PeriodType;
  onChange: (period: PeriodType) => void;
}

const TABS: { key: PeriodType; label: string }[] = [
  { key: 'daily', label: '일별' },
  { key: 'weekly', label: '주간' },
  { key: 'monthly', label: '월간' },
];

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--panel-2)', borderRadius: 8, padding: 3 }}>
      {TABS.map(tab => {
        const active = tab.key === value;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              padding: '4px 12px',
              fontSize: '0.7rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--text)' : 'var(--text-secondary)',
              background: active ? 'var(--panel)' : 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
