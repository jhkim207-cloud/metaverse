import { CSSProperties, useState, useEffect, useCallback, useRef } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { MeetingNote, NoteSectionType } from '../../types/meeting.types';
import { NOTE_SECTIONS } from '../../types/meeting.types';
import { meetingApi } from '../../services/meetingApi';

interface MeetingNotesEditorProps {
  meetingId: number;
  isReadOnly: boolean;
}

export function MeetingNotesEditor({ meetingId, isReadOnly }: MeetingNotesEditorProps) {
  const [notes, setNotes] = useState<MeetingNote[]>([]);
  const [activeTab, setActiveTab] = useState<NoteSectionType>('AGENDA');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadNotes = useCallback(async () => {
    const res = await meetingApi.getNotes(meetingId);
    if (res.success && res.data) {
      setNotes(res.data);
    }
  }, [meetingId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const currentNotes = notes.filter(n => n.sectionType === activeTab);
  const currentNote = currentNotes.length > 0 ? currentNotes[0] : null;

  useEffect(() => {
    setEditContent(currentNote?.content || '');
  }, [currentNote?.id, currentNote?.content, activeTab]);

  const handleSave = async () => {
    if (isReadOnly) return;
    setSaving(true);
    try {
      if (currentNote) {
        await meetingApi.updateNote(currentNote.id, { content: editContent });
      } else if (editContent.trim()) {
        await meetingApi.createNote(meetingId, {
          sectionType: activeTab,
          content: editContent,
        });
      }
      await loadNotes();
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (value: string) => {
    setEditContent(value);
    if (isReadOnly) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Auto-save on debounce
      if (currentNote) {
        meetingApi.updateNote(currentNote.id, { content: value }).then(loadNotes);
      }
    }, 1500);
  };

  const handleDelete = async () => {
    if (!currentNote || isReadOnly) return;
    await meetingApi.deleteNote(currentNote.id);
    setEditContent('');
    await loadNotes();
  };

  const handleAddNote = async () => {
    if (isReadOnly || !editContent.trim()) return;
    await meetingApi.createNote(meetingId, {
      sectionType: activeTab,
      content: editContent,
    });
    setEditContent('');
    await loadNotes();
  };

  const sectionNoteCount = (type: NoteSectionType) =>
    notes.filter(n => n.sectionType === type).length;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={sectionTitleStyle}>회의 노트</span>
      </div>

      <div style={tabBarStyle}>
        {NOTE_SECTIONS.map(s => {
          const count = sectionNoteCount(s.type);
          return (
            <button
              key={s.type}
              onClick={() => setActiveTab(s.type)}
              style={{
                ...tabStyle,
                ...(activeTab === s.type ? activeTabStyle : {}),
              }}
            >
              {s.label}
              {count > 0 && <span style={tabCountStyle}>{count}</span>}
            </button>
          );
        })}
      </div>

      <div style={editorAreaStyle}>
        <textarea
          value={editContent}
          onChange={e => handleContentChange(e.target.value)}
          placeholder={`${NOTE_SECTIONS.find(s => s.type === activeTab)?.label || ''} 내용을 입력하세요...`}
          readOnly={isReadOnly}
          style={textareaStyle}
        />

        {!isReadOnly && (
          <div style={actionBarStyle}>
            {currentNote ? (
              <>
                <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>
                  <Save size={13} /> {saving ? '저장중...' : '저장'}
                </button>
                <button onClick={handleDelete} style={deleteBtnStyle}>
                  <Trash2 size={13} />
                </button>
              </>
            ) : (
              <button onClick={handleAddNote} style={saveBtnStyle}>
                <Plus size={13} /> 등록
              </button>
            )}
          </div>
        )}

        {currentNotes.length > 1 && (
          <div style={moreNotesStyle}>
            {currentNotes.slice(1).map(n => (
              <div key={n.id} style={extraNoteStyle}>
                {n.content}
              </div>
            ))}
          </div>
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
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
};

const sectionTitleStyle: CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--text)' };

const tabBarStyle: CSSProperties = {
  display: 'flex',
  gap: 2,
  padding: '6px 10px',
  overflowX: 'auto',
  borderBottom: '1px solid var(--border)',
};

const tabStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 500,
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const activeTabStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  color: 'var(--accent)',
  fontWeight: 600,
};

const tabCountStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  padding: '0 5px',
  borderRadius: 8,
  lineHeight: '16px',
};

const editorAreaStyle: CSSProperties = {
  flex: 1,
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const textareaStyle: CSSProperties = {
  width: '100%',
  minHeight: 120,
  padding: 10,
  fontSize: 13,
  lineHeight: 1.6,
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--input-bg)',
  color: 'var(--text)',
  resize: 'vertical',
  outline: 'none',
  fontFamily: 'inherit',
};

const actionBarStyle: CSSProperties = {
  display: 'flex',
  gap: 6,
  justifyContent: 'flex-end',
};

const saveBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '5px 12px',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  borderRadius: 6,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  cursor: 'pointer',
};

const deleteBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '5px 8px',
  fontSize: 12,
  border: '1px solid var(--error)',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--error)',
  cursor: 'pointer',
};

const moreNotesStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const extraNoteStyle: CSSProperties = {
  padding: 8,
  fontSize: 12,
  background: 'var(--panel-2)',
  borderRadius: 6,
  color: 'var(--text-secondary)',
  whiteSpace: 'pre-wrap',
};

export default MeetingNotesEditor;
