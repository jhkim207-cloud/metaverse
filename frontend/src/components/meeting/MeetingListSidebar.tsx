import { CSSProperties, useMemo } from 'react';
import { CalendarCheck, Circle, Play, CheckCircle2 } from 'lucide-react';
import type { DailyMeeting } from '../../types/meeting.types';

interface MeetingListSidebarProps {
  recentMeetings: DailyMeeting[];
  selectedDate: string;
  onSelect: (date: string) => void;
  onTodayClick: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: typeof Circle }> = {
  DRAFT: { label: '작성', color: 'var(--text-tertiary)', Icon: Circle },
  IN_PROGRESS: { label: '진행', color: 'var(--accent)', Icon: Play },
  COMPLETED: { label: '완료', color: 'var(--success)', Icon: CheckCircle2 },
};

function formatDate(dateStr: string): { month: string; day: string; weekday: string } {
  const d = new Date(dateStr + 'T00:00:00');
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return {
    month: `${d.getMonth() + 1}월`,
    day: String(d.getDate()),
    weekday: weekdays[d.getDay()],
  };
}

export function MeetingListSidebar({
  recentMeetings,
  selectedDate,
  onSelect,
  onTodayClick,
}: MeetingListSidebarProps) {
  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const isToday = selectedDate === today;

  return (
    <div style={sidebarStyle}>
      <div style={sidebarHeaderStyle}>
        <span style={sidebarTitleStyle}>회의 목록</span>
        <span style={countBadgeStyle}>{recentMeetings.length}</span>
      </div>

      <button
        type="button"
        onClick={onTodayClick}
        style={{
          ...todayBtnStyle,
          background: isToday ? 'var(--accent)' : 'transparent',
          color: isToday ? 'var(--on-accent)' : 'var(--accent)',
          borderColor: 'var(--accent)',
        }}
      >
        <CalendarCheck size={14} />
        오늘 회의
      </button>

      <div style={listStyle}>
        {recentMeetings.map(m => {
          const isActive = m.meetingDate === selectedDate;
          const { day, weekday } = formatDate(m.meetingDate);
          const cfg = STATUS_CONFIG[m.status] || STATUS_CONFIG.DRAFT;
          const isItemToday = m.meetingDate === today;

          return (
            <button
              type="button"
              key={m.id}
              onClick={() => onSelect(m.meetingDate)}
              style={{
                ...itemStyle,
                background: isActive
                  ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                  : 'transparent',
                borderLeft: isActive
                  ? '3px solid var(--accent)'
                  : '3px solid transparent',
              }}
            >
              <div style={dateColStyle}>
                <span style={{ fontSize: 18, fontWeight: 700, color: isActive ? 'var(--accent)' : 'var(--text)', lineHeight: 1 }}>
                  {day}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{weekday}</span>
              </div>

              <div style={infoColStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <cfg.Icon size={10} style={{ color: cfg.color }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                  {isItemToday && (
                    <span style={todayTagStyle}>TODAY</span>
                  )}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.totalWorkOrders}건 · {m.totalQuantity.toLocaleString()}EA
                </span>
              </div>
            </button>
          );
        })}

        {recentMeetings.length === 0 && (
          <div style={emptyStyle}>최근 회의가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

const sidebarStyle: CSSProperties = {
  width: 180,
  minWidth: 180,
  maxWidth: 180,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel)',
  borderRight: '1px solid var(--border)',
  height: '100%',
  overflow: 'hidden',
};

const sidebarHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 12px 8px',
};

const sidebarTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const countBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 8,
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  color: 'var(--accent)',
};

const todayBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  margin: '0 10px 8px',
  padding: '6px 0',
  fontSize: 12,
  fontWeight: 600,
  border: '1px solid',
  borderRadius: 6,
  cursor: 'pointer',
};

const listStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 10px',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s',
};

const dateColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 30,
};

const infoColStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  flex: 1,
  minWidth: 0,
};

const todayTagStyle: CSSProperties = {
  fontSize: 8,
  fontWeight: 700,
  padding: '0 4px',
  borderRadius: 3,
  background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
  color: 'var(--accent)',
  letterSpacing: 0.5,
};

const emptyStyle: CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: 'var(--text-tertiary)',
  fontSize: 12,
};

export default MeetingListSidebar;
