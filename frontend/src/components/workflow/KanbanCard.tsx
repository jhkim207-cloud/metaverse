/**
 * KanbanCard - 칸반 보드 업무 카드
 */

import { CSSProperties } from 'react';
import { Calendar, Building2, Handshake } from 'lucide-react';
import type { WorkflowItem } from '../../types/workflow.types';
import { PRIORITY_CONFIG } from '../../constants/workflow';

interface KanbanCardProps {
  item: WorkflowItem;
  onClick: (item: WorkflowItem) => void;
}

export function KanbanCard({ item, onClick }: KanbanCardProps) {
  const priority = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.MEDIUM;

  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      style={cardStyle}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* 상단: 제목 + 우선순위 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={titleStyle}>{item.title}</span>
        <span style={getPriorityStyle(priority.color)}>
          {priority.label}
        </span>
      </div>

      {/* 중간: 고객/제품 */}
      {(item.customer || item.product) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
          {item.customer && (
            <span style={metaStyle}>{item.customer}</span>
          )}
          {item.product && (
            <span style={{ ...metaStyle, color: 'var(--text-tertiary)' }}>{item.product}</span>
          )}
        </div>
      )}

      {/* 하단: 태그들 */}
      <div style={footerStyle}>
        {item.orderType && (
          <span style={tagStyle}>
            {item.orderType === 'PROJECT'
              ? <><Building2 size={10} /> 프로젝트</>
              : <><Handshake size={10} /> 임가공</>
            }
          </span>
        )}
        {item.dueDate && (
          <span style={dateStyle}>
            <Calendar size={10} />
            {item.dueDate}
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── Styles ─── */
const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '12px 14px',
  background: 'var(--panel)',
  backdropFilter: 'blur(12px) saturate(160%)',
  WebkitBackdropFilter: 'blur(12px) saturate(160%)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

const titleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  lineHeight: 1.4,
  flex: 1,
};

const metaStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  lineHeight: 1.3,
};

const footerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 10,
  flexWrap: 'wrap',
};

const tagStyle: CSSProperties = {
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

const dateStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

function getPriorityStyle(color: string): CSSProperties {
  const colorMap: Record<string, { bg: string; fg: string }> = {
    red:    { bg: 'var(--error)',   fg: 'var(--error)' },
    orange: { bg: 'var(--warning)', fg: 'var(--warning)' },
    gray:   { bg: 'var(--muted)',   fg: 'var(--muted)' },
  };
  const c = colorMap[color] ?? colorMap.gray;
  return {
    padding: '2px 8px',
    fontSize: 10,
    fontWeight: 600,
    borderRadius: 100,
    background: `color-mix(in srgb, ${c.bg} 15%, transparent)`,
    color: c.fg,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };
}

export default KanbanCard;
