import type { ReactNode } from 'react';
import type { PeriodType, WorkflowStep } from '../../types/dashboard.types';
import { PeriodTabs } from './PeriodTabs';
import { WorkflowStepCard } from './WorkflowStepCard';

interface WorkflowSectionProps {
  title: string;
  icon?: ReactNode;
  steps: WorkflowStep[];
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  loading?: boolean;
}

export function WorkflowSection({ title, icon, steps, period, onPeriodChange, loading }: WorkflowSectionProps) {
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

      {/* Steps */}
      {loading ? (
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="card"
              style={{ flex: 1, height: 90, animation: 'pulse 2s infinite' }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {steps.map((step, i) => (
            <WorkflowStepCard
              key={step.label}
              step={step}
              showArrow={i < steps.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
