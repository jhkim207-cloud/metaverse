import { CSSProperties, useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import type { MeetingActionItem } from '../../types/meeting.types';
import { meetingApi } from '../../services/meetingApi';

interface ActionItemListProps {
  meetingId: number;
  isReadOnly: boolean;
}

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'var(--error)',
  MEDIUM: 'var(--warning)',
  LOW: 'var(--text-tertiary)',
};

const STATUS_NEXT: Record<string, string> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'OPEN',
};

const STATUS_LABEL: Record<string, string> = {
  OPEN: '미착수',
  IN_PROGRESS: '진행중',
  DONE: '완료',
  CANCELLED: '취소',
};

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'var(--text-secondary)',
  IN_PROGRESS: 'var(--accent)',
  DONE: 'var(--success)',
  CANCELLED: 'var(--text-tertiary)',
};

export function ActionItemList({ meetingId, isReadOnly }: ActionItemListProps) {
  const [items, setItems] = useState<MeetingActionItem[]>([]);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [errors, setErrors] = useState<{ title?: boolean; assignee?: boolean }>({});

  const loadItems = useCallback(async () => {
    const res = await meetingApi.getActions(meetingId);
    if (res.success && res.data) {
      setItems(res.data);
    }
  }, [meetingId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleAdd = async () => {
    const newErrors: { title?: boolean; assignee?: boolean } = {};
    if (!title.trim()) newErrors.title = true;
    if (!assignee.trim()) newErrors.assignee = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      const res = await meetingApi.createAction(meetingId, {
        title: title.trim(),
        assignee: assignee.trim(),
        dueDate: dueDate || undefined,
        priority,
      });
      if (!res.success) {
        alert('액션아이템 등록 실패: ' + (res.message || '알 수 없는 오류'));
        return;
      }
      setTitle('');
      setAssignee('');
      setDueDate('');
      setPriority('MEDIUM');
      await loadItems();
    } catch {
      alert('액션아이템 등록 중 오류가 발생했습니다.');
    }
  };

  const handleToggleStatus = async (item: MeetingActionItem) => {
    if (isReadOnly) return;
    const nextStatus = STATUS_NEXT[item.status] || 'OPEN';
    await meetingApi.updateAction(item.id, { status: nextStatus });
    await loadItems();
  };

  const handleDelete = async (id: number) => {
    if (isReadOnly) return;
    await meetingApi.deleteAction(id);
    await loadItems();
  };

  const getDday = (dueDate: string | null) => {
    if (!dueDate) return null;
    const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86400000);
    if (diff < 0) return `D+${Math.abs(diff)}`;
    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={titleTextStyle}>액션아이템</span>
        <span style={countTextStyle}>{items.length}건</span>
      </div>

      {!isReadOnly && (
        <div style={formStyle}>
          <input
            value={title}
            onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => ({ ...prev, title: false })); }}
            placeholder="할 일 입력 *"
            style={{ ...inputStyle, flex: 1, ...(errors.title ? errorBorderStyle : {}) }}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <input
            value={assignee}
            onChange={e => { setAssignee(e.target.value); if (errors.assignee) setErrors(prev => ({ ...prev, assignee: false })); }}
            placeholder="담당자 *"
            style={{ ...inputStyle, width: 70, ...(errors.assignee ? errorBorderStyle : {}) }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            style={{ ...inputStyle, width: 110 }}
          />
          <select value={priority} onChange={e => setPriority(e.target.value)} style={selectStyle}>
            <option value="HIGH">긴급</option>
            <option value="MEDIUM">보통</option>
            <option value="LOW">낮음</option>
          </select>
          <button onClick={handleAdd} style={addBtnStyle}>
            <Plus size={14} />
          </button>
        </div>
      )}

      {(errors.title || errors.assignee) && (
        <div style={errorMsgStyle}>
          {errors.title && errors.assignee
            ? '할 일과 담당자를 입력해주세요.'
            : errors.title
              ? '할 일을 입력해주세요.'
              : '담당자를 입력해주세요.'}
        </div>
      )}

      <div style={listStyle}>
        {items.map(item => {
          const dday = getDday(item.dueDate);
          const isOverdue = dday && dday.startsWith('D+');
          return (
            <div key={item.id} style={itemRowStyle}>
              <button
                onClick={() => handleToggleStatus(item)}
                style={{ ...statusBtnStyle, color: STATUS_COLOR[item.status] || 'var(--text-secondary)' }}
                disabled={isReadOnly}
              >
                <ChevronRight size={12} />
                {STATUS_LABEL[item.status]}
              </button>
              <span style={{ ...priorityDotStyle, background: PRIORITY_COLOR[item.priority] || 'var(--text-tertiary)' }} />
              <span style={{
                ...itemTitleStyle,
                textDecoration: item.status === 'DONE' ? 'line-through' : 'none',
                opacity: item.status === 'DONE' ? 0.6 : 1,
              }}>
                {item.title}
              </span>
              <span style={assigneeChipStyle}>{item.assignee}</span>
              {dday && (
                <span style={{ ...ddayStyle, color: isOverdue ? 'var(--error)' : 'var(--text-tertiary)' }}>
                  {dday}
                </span>
              )}
              {item.meetingDate && item.meetingDate !== new Date().toISOString().slice(0, 10) && (
                <span style={prevMeetingBadge}>이전 {item.meetingDate.slice(5)}</span>
              )}
              {!isReadOnly && (
                <button onClick={() => handleDelete(item.id)} style={delBtnStyle}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div style={emptyStyle}>등록된 액션아이템이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
};

const titleTextStyle: CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--text)' };
const countTextStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--accent)' };

const formStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  alignItems: 'center',
};

const inputStyle: CSSProperties = {
  padding: '5px 8px',
  fontSize: 12,
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--input-bg)',
  color: 'var(--text)',
  outline: 'none',
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  width: 60,
  cursor: 'pointer',
};

const addBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  borderRadius: 6,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  cursor: 'pointer',
  flexShrink: 0,
};

const listStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '4px 0',
};

const itemRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
  fontSize: 12,
};

const statusBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  fontSize: 10,
  fontWeight: 600,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: '2px 4px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
};

const priorityDotStyle: CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  flexShrink: 0,
};

const itemTitleStyle: CSSProperties = {
  flex: 1,
  fontWeight: 500,
  color: 'var(--text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const assigneeChipStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  padding: '1px 6px',
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  color: 'var(--accent)',
  borderRadius: 8,
  flexShrink: 0,
};

const ddayStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  flexShrink: 0,
};

const prevMeetingBadge: CSSProperties = {
  fontSize: 9,
  fontWeight: 500,
  padding: '1px 5px',
  background: 'color-mix(in srgb, var(--warning) 10%, transparent)',
  color: 'var(--warning)',
  borderRadius: 4,
  flexShrink: 0,
};

const delBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: 2,
  border: 'none',
  background: 'transparent',
  color: 'var(--text-tertiary)',
  cursor: 'pointer',
  flexShrink: 0,
};

const errorBorderStyle: CSSProperties = {
  borderColor: 'var(--error)',
};

const errorMsgStyle: CSSProperties = {
  padding: '4px 14px 6px',
  fontSize: 11,
  color: 'var(--error)',
  fontWeight: 500,
};

const emptyStyle: CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: 'var(--text-tertiary)',
  fontSize: 12,
};

export default ActionItemList;
