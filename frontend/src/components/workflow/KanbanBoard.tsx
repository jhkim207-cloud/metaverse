/**
 * KanbanBoard - 4-컬럼 칸반 보드
 *
 * 컬럼: 대기(PENDING) | 진행중(IN_PROGRESS) | 완료(COMPLETED) | 차단(BLOCKED)
 */

import { CSSProperties, useMemo } from 'react';
import type { WorkflowItem } from '../../types/workflow.types';
import { KanbanCard } from './KanbanCard';

const COLUMNS: Array<{ status: string; label: string; color: string }> = [
  { status: 'PENDING',     label: '대기',   color: 'gray' },
  { status: 'IN_PROGRESS', label: '진행중', color: 'blue' },
  { status: 'COMPLETED',   label: '완료',   color: 'green' },
  { status: 'BLOCKED',     label: '차단',   color: 'red' },
];

interface KanbanBoardProps {
  items: WorkflowItem[];
  onItemClick: (item: WorkflowItem) => void;
}

export function KanbanBoard({ items, onItemClick }: KanbanBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<string, WorkflowItem[]> = {};
    COLUMNS.forEach(c => { map[c.status] = []; });
    items.forEach(item => {
      if (map[item.status]) {
        map[item.status].push(item);
      }
    });
    return map;
  }, [items]);

  return (
    <div style={boardStyle}>
      {COLUMNS.map(col => {
        const colItems = grouped[col.status] || [];
        return (
          <div key={col.status} style={columnStyle}>
            {/* 컬럼 헤더 */}
            <div style={columnHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={getDotStyle(col.color)} />
                <span style={columnTitleStyle}>{col.label}</span>
              </div>
              <span style={countBadgeStyle}>{colItems.length}</span>
            </div>

            {/* 카드 목록 */}
            <div style={cardListStyle}>
              {colItems.length === 0 ? (
                <div style={emptyStyle}>항목 없음</div>
              ) : (
                colItems.map(item => (
                  <KanbanCard key={item.id} item={item} onClick={onItemClick} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Styles ─── */
const boardStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 12,
  minHeight: 300,
};

const columnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel-2)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  borderRadius: 14,
  border: '1px solid var(--border)',
  overflow: 'hidden',
};

const columnHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
};

const columnTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const countBadgeStyle: CSSProperties = {
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 100,
  background: 'rgba(120, 120, 128, 0.12)',
  color: 'var(--text-secondary)',
};

const cardListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: 10,
  flex: 1,
  overflowY: 'auto',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px 0',
  fontSize: 12,
  color: 'var(--text-tertiary)',
};

function getDotStyle(color: string): CSSProperties {
  const colorMap: Record<string, string> = {
    gray: 'var(--muted)',
    blue: 'var(--info)',
    green: 'var(--success)',
    red: 'var(--error)',
  };
  return {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: colorMap[color] || 'var(--muted)',
    flexShrink: 0,
  };
}

export default KanbanBoard;
