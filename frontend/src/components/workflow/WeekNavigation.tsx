import { useMemo, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addWeeks, subWeeks, startOfWeek, endOfWeek, format, isSameWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface WeekNavigationProps {
  weekStart: Date;
  onChange: (newWeekStart: Date) => void;
}

export function WeekNavigation({ weekStart, onChange }: WeekNavigationProps) {
  const isCurrentWeek = useMemo(
    () => isSameWeek(weekStart, new Date(), { weekStartsOn: 1 }),
    [weekStart],
  );

  const monday = startOfWeek(weekStart, { weekStartsOn: 1 });
  const saturday = addWeeks(monday, 0);
  const satDate = new Date(monday);
  satDate.setDate(satDate.getDate() + 5);

  const weekLabel = useMemo(() => {
    const y = format(monday, 'yyyy');
    const m = format(monday, 'M');
    const weekNum = Math.ceil(parseInt(format(monday, 'd', { locale: ko })) / 7) || 1;
    const range = `${format(monday, 'MM/dd')} ~ ${format(satDate, 'MM/dd')}`;
    return `${y}년 ${m}월 (${range})`;
  }, [monday, satDate]);

  const handlePrev = () => onChange(subWeeks(monday, 1));
  const handleNext = () => onChange(addWeeks(monday, 1));
  const handleToday = () => onChange(startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <div style={containerStyle}>
      <button type="button" onClick={handlePrev} style={btnStyle} title="이전 주">
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={handleToday}
        style={{
          ...todayBtnStyle,
          ...(isCurrentWeek ? todayBtnActiveStyle : {}),
        }}
      >
        이번주
      </button>
      <button type="button" onClick={handleNext} style={btnStyle} title="다음 주">
        <ChevronRight size={16} />
      </button>
      <span style={labelStyle}>{weekLabel}</span>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const btnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--panel-2)',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  padding: 0,
  transition: 'background 0.15s',
};

const todayBtnStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  padding: '4px 10px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--panel-2)',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  transition: 'all 0.15s',
  fontFamily: 'inherit',
};

const todayBtnActiveStyle: CSSProperties = {
  borderColor: 'var(--accent)',
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
};

const labelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  marginLeft: 8,
};

export default WeekNavigation;
