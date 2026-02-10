import { CSSProperties, useState } from 'react';
import { Play, Square, Clock, X } from 'lucide-react';
import type { DailyMeeting } from '../../types/meeting.types';
import { meetingApi } from '../../services/meetingApi';

interface MeetingHeaderProps {
  meeting: DailyMeeting;
  onRefresh: () => void;
  isReadOnly: boolean;
}

export function MeetingHeader({ meeting, onRefresh, isReadOnly }: MeetingHeaderProps) {
  const [attendeeInput, setAttendeeInput] = useState('');
  const attendees: string[] = meeting.attendees ? JSON.parse(meeting.attendees) : [];

  const statusLabel: Record<string, string> = {
    DRAFT: '작성중',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
  };
  const statusColor: Record<string, string> = {
    DRAFT: 'var(--text-tertiary)',
    IN_PROGRESS: 'var(--accent)',
    COMPLETED: 'var(--success)',
  };

  const handleStart = async () => {
    try {
      const res = await meetingApi.startMeeting(meeting.id);
      if (!res.success) {
        console.error('회의 시작 실패:', res.message);
        alert('회의 시작 실패: ' + (res.message || '알 수 없는 오류'));
        return;
      }
      onRefresh();
    } catch (err) {
      console.error('회의 시작 오류:', err);
      alert('회의 시작 중 오류가 발생했습니다.');
    }
  };

  const handleComplete = async () => {
    try {
      const res = await meetingApi.completeMeeting(meeting.id);
      if (!res.success) {
        console.error('회의 종료 실패:', res.message);
        alert('회의 종료 실패: ' + (res.message || '알 수 없는 오류'));
        return;
      }
      onRefresh();
    } catch (err) {
      console.error('회의 종료 오류:', err);
      alert('회의 종료 중 오류가 발생했습니다.');
    }
  };

  const handleAddAttendee = async () => {
    const name = attendeeInput.trim();
    if (!name) return;
    const updated = [...attendees, name];
    await meetingApi.updateMeeting(meeting.id, { attendees: JSON.stringify(updated) } as Partial<DailyMeeting>);
    setAttendeeInput('');
    onRefresh();
  };

  const handleRemoveAttendee = async (idx: number) => {
    const updated = attendees.filter((_, i) => i !== idx);
    await meetingApi.updateMeeting(meeting.id, { attendees: JSON.stringify(updated) } as Partial<DailyMeeting>);
    onRefresh();
  };

  return (
    <div style={headerStyle}>
      <div style={topRowStyle}>
        <div style={leftStyle}>
          <span style={{ ...badgeStyle, background: statusColor[meeting.status], color: '#fff' }}>
            {statusLabel[meeting.status] || meeting.status}
          </span>
          <span style={meetingNoStyle}>{meeting.meetingNo}</span>
          {meeting.startTime && (
            <span style={timeStyle}>
              <Clock size={12} /> {meeting.startTime}
              {meeting.endTime ? ` ~ ${meeting.endTime}` : ' ~'}
            </span>
          )}
        </div>
        <div style={rightStyle}>
          {!isReadOnly && meeting.status === 'DRAFT' && (
            <button onClick={handleStart} style={{ ...btnStyle, background: 'var(--accent)', color: 'var(--on-accent)' }}>
              <Play size={14} /> 회의 시작
            </button>
          )}
          {!isReadOnly && meeting.status === 'IN_PROGRESS' && (
            <button onClick={handleComplete} style={{ ...btnStyle, background: 'var(--success)', color: '#fff' }}>
              <Square size={14} /> 회의 종료
            </button>
          )}
        </div>
      </div>

      <div style={attendeeRowStyle}>
        <span style={attendeeLabelStyle}>참석자</span>
        {attendees.map((name, i) => (
          <span key={i} style={chipStyle}>
            {name}
            {!isReadOnly && (
              <X size={12} style={{ cursor: 'pointer', marginLeft: 2 }} onClick={() => handleRemoveAttendee(i)} />
            )}
          </span>
        ))}
        {!isReadOnly && (
          <input
            value={attendeeInput}
            onChange={e => setAttendeeInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddAttendee()}
            placeholder="이름 입력 + Enter"
            style={attendeeInputStyle}
          />
        )}
      </div>
    </div>
  );
}

const headerStyle: CSSProperties = {
  padding: '12px 16px',
  background: 'var(--panel)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const topRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const leftStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };
const rightStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 8 };

const meetingNoStyle: CSSProperties = { fontSize: 15, fontWeight: 700, color: 'var(--text)' };

const badgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 4,
};

const timeStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};

const btnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '6px 14px',
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const attendeeRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  flexWrap: 'wrap',
};

const attendeeLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const chipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  padding: '2px 8px',
  fontSize: 12,
  fontWeight: 500,
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  color: 'var(--accent)',
  borderRadius: 12,
};

const attendeeInputStyle: CSSProperties = {
  padding: '2px 8px',
  fontSize: 12,
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--text)',
  width: 120,
  outline: 'none',
};

export default MeetingHeader;
