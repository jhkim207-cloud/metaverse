import { CSSProperties, useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import type { MeetingActionItem } from '../../types/meeting.types';

interface CarryForwardSectionProps {
  items: MeetingActionItem[];
}

export function CarryForwardSection({ items }: CarryForwardSectionProps) {
  const [expanded, setExpanded] = useState(items.length > 0);

  if (items.length === 0) return null;

  const getDaysOverdue = (dueDate: string | null) => {
    if (!dueDate) return null;
    const diff = Math.floor((Date.now() - new Date(dueDate).getTime()) / 86400000);
    return diff > 0 ? diff : null;
  };

  const priorityColor: Record<string, string> = {
    HIGH: 'var(--error)',
    MEDIUM: 'var(--warning)',
    LOW: 'var(--text-tertiary)',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle} onClick={() => setExpanded(!expanded)}>
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <AlertCircle size={14} style={{ color: 'var(--warning)' }} />
        <span style={headerTextStyle}>이월 사항 ({items.length}건)</span>
      </div>
      {expanded && (
        <div style={listStyle}>
          {items.map(item => {
            const overdue = getDaysOverdue(item.dueDate);
            return (
              <div key={item.id} style={itemStyle}>
                <span style={{ ...dotStyle, background: priorityColor[item.priority] || 'var(--text-tertiary)' }} />
                <span style={itemTitleStyle}>{item.title}</span>
                <span style={assigneeStyle}>{item.assignee}</span>
                {item.meetingDate && (
                  <span style={dateStyle}>{item.meetingDate}</span>
                )}
                {overdue != null && (
                  <span style={overdueStyle}>{overdue}일 초과</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const containerStyle: CSSProperties = {
  borderTop: '1px solid var(--border)',
  marginTop: 8,
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
};

const headerTextStyle: CSSProperties = { fontSize: 12, fontWeight: 600 };

const listStyle: CSSProperties = {
  padding: '0 12px 8px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 8px',
  background: 'color-mix(in srgb, var(--warning) 5%, transparent)',
  borderRadius: 6,
  fontSize: 12,
};

const dotStyle: CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
};

const itemTitleStyle: CSSProperties = {
  fontWeight: 500,
  color: 'var(--text)',
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const assigneeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--accent)',
  padding: '1px 6px',
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  borderRadius: 8,
};

const dateStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const overdueStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: '#fff',
  background: 'var(--error)',
  padding: '1px 5px',
  borderRadius: 4,
};

export default CarryForwardSection;
