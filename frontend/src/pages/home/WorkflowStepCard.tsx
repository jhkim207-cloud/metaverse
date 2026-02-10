import type { WorkflowStep } from '../../types/dashboard.types';

interface WorkflowStepCardProps {
  step: WorkflowStep;
  showArrow?: boolean;
}

export function WorkflowStepCard({ step, showArrow = true }: WorkflowStepCardProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 0, flex: 1 }}>
      <div
        className="card"
        style={{
          padding: '14px 12px',
          minWidth: 110,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {step.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>
            {step.mainValue}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            {step.mainUnit}
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
          {step.subValue}{step.subUnit ? ` ${step.subUnit}` : ''}
        </span>
      </div>
      {showArrow && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            opacity: 0.4,
            padding: '0 2px',
            flexShrink: 0,
          }}
        >
          →
        </span>
      )}
    </div>
  );
}
