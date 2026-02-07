/**
 * StageDetailPanel - 우측 패널 업무 상세
 */

import { CSSProperties } from 'react';
import { X, Building2, Handshake, ArrowRight, Calendar, User, Package } from 'lucide-react';
import type { WorkflowItem } from '../../types/workflow.types';
import { STATUS_CONFIG, PRIORITY_CONFIG, PROJECT_PHASES } from '../../constants/workflow';

interface StageDetailPanelProps {
  item: WorkflowItem;
  onClose: () => void;
}

export function StageDetailPanel({ item, onClose }: StageDetailPanelProps) {
  const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING;
  const priority = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.MEDIUM;

  return (
    <div style={panelStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={titleStyle}>{item.title}</h3>
          <div style={tagRowStyle}>
            <span style={getStatusBadge(status.color)}>{status.label}</span>
            <span style={getPriorityBadge(priority.color)}>{priority.label}</span>
            {item.orderType && (
              <span style={typeBadgeStyle}>
                {item.orderType === 'PROJECT'
                  ? <><Building2 size={10} /> 프로젝트</>
                  : <><Handshake size={10} /> 임가공</>
                }
              </span>
            )}
          </div>
        </div>
        <button type="button" onClick={onClose} style={closeButtonStyle} aria-label="닫기">
          <X size={16} />
        </button>
      </div>

      {/* 프로젝트 미니 스테퍼 */}
      {item.orderType === 'PROJECT' && item.projectName && (
        <div style={projectSectionStyle}>
          <div style={sectionLabelStyle}>
            <Building2 size={14} style={{ color: 'var(--accent)' }} />
            <span>{item.projectName}</span>
          </div>
          <div style={miniStepperStyle}>
            {PROJECT_PHASES.map((phase, idx) => {
              const isCurrent = item.projectPhase === phase.code;
              const isPast = PROJECT_PHASES.findIndex(p => p.code === item.projectPhase) > idx;
              return (
                <div key={phase.code} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {idx > 0 && <ArrowRight size={10} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />}
                  <span style={getMiniStepStyle(isCurrent, isPast)}>
                    {phase.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 기본정보 */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>기본정보</div>
        <div style={fieldGridStyle}>
          {item.customer && (
            <div style={fieldStyle}>
              <User size={12} style={{ color: 'var(--text-tertiary)' }} />
              <div>
                <div style={fieldLabelStyle}>고객사</div>
                <div style={fieldValueStyle}>{item.customer}</div>
              </div>
            </div>
          )}
          {item.product && (
            <div style={fieldStyle}>
              <Package size={12} style={{ color: 'var(--text-tertiary)' }} />
              <div>
                <div style={fieldLabelStyle}>제품</div>
                <div style={fieldValueStyle}>{item.product}</div>
              </div>
            </div>
          )}
          {item.dueDate && (
            <div style={fieldStyle}>
              <Calendar size={12} style={{ color: 'var(--text-tertiary)' }} />
              <div>
                <div style={fieldLabelStyle}>납기일</div>
                <div style={fieldValueStyle}>{item.dueDate}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 액션 */}
      <div style={actionBarStyle}>
        <button type="button" style={actionButtonStyle}>
          <ArrowRight size={14} />
          다음 단계로 이동
        </button>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '16px 20px',
  borderBottom: '1px solid var(--border)',
};

const titleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text)',
  margin: 0,
  lineHeight: 1.3,
};

const tagRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 8,
  flexWrap: 'wrap',
};

const closeButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--panel-2)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  flexShrink: 0,
};

const projectSectionStyle: CSSProperties = {
  padding: '12px 20px',
  background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
  borderBottom: '1px solid var(--border)',
};

const sectionLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: 8,
};

const miniStepperStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  flexWrap: 'wrap',
};

function getMiniStepStyle(isCurrent: boolean, isPast: boolean): CSSProperties {
  if (isCurrent) {
    return {
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 600,
      borderRadius: 100,
      background: 'var(--accent)',
      color: 'var(--on-accent)',
    };
  }
  if (isPast) {
    return {
      padding: '3px 10px',
      fontSize: 11,
      fontWeight: 500,
      borderRadius: 100,
      background: 'color-mix(in srgb, var(--success) 15%, transparent)',
      color: 'var(--success)',
    };
  }
  return {
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 100,
    background: 'var(--panel-2)',
    color: 'var(--text-tertiary)',
  };
}

const sectionStyle: CSSProperties = {
  padding: '16px 20px',
  flex: 1,
  overflowY: 'auto',
};

const sectionHeaderStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: 12,
};

const fieldGridStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  marginBottom: 2,
};

const fieldValueStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--text)',
  fontWeight: 500,
};

const typeBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '2px 8px',
  fontSize: 10,
  fontWeight: 500,
  borderRadius: 100,
  background: 'var(--panel-2)',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
};

const actionBarStyle: CSSProperties = {
  padding: '12px 20px',
  borderTop: '1px solid var(--border)',
  flexShrink: 0,
};

const actionButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 600,
  borderRadius: 10,
  border: 'none',
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

function getStatusBadge(color: string): CSSProperties {
  const map: Record<string, { bg: string; fg: string }> = {
    gray:  { bg: 'var(--muted)',   fg: 'var(--muted)' },
    blue:  { bg: 'var(--info)',    fg: 'var(--info)' },
    green: { bg: 'var(--success)', fg: 'var(--success)' },
    red:   { bg: 'var(--error)',   fg: 'var(--error)' },
  };
  const c = map[color] ?? map.gray;
  return {
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 100,
    background: `color-mix(in srgb, ${c.bg} 15%, transparent)`,
    color: c.fg,
  };
}

function getPriorityBadge(color: string): CSSProperties {
  const map: Record<string, { bg: string; fg: string }> = {
    red:    { bg: 'var(--error)',   fg: 'var(--error)' },
    orange: { bg: 'var(--warning)', fg: 'var(--warning)' },
    gray:   { bg: 'var(--muted)',   fg: 'var(--muted)' },
  };
  const c = map[color] ?? map.gray;
  return {
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 100,
    background: `color-mix(in srgb, ${c.bg} 15%, transparent)`,
    color: c.fg,
  };
}

export default StageDetailPanel;
