import { CSSProperties } from 'react';
import { useDailyMeeting } from '../../hooks/useDailyMeeting';
import { MeetingListSidebar } from '../../components/meeting/MeetingListSidebar';
import { MeetingHeader } from '../../components/meeting/MeetingHeader';
import { MeetingDashboard } from '../../components/meeting/MeetingDashboard';
import { WorkOrderDispatchBoard } from '../../components/meeting/WorkOrderDispatchBoard';
import { MeetingNotesEditor } from '../../components/meeting/MeetingNotesEditor';
import { ActionItemList } from '../../components/meeting/ActionItemList';

export function DailyMeetingPage() {
  const {
    dashboard,
    meeting,
    recentMeetings,
    loading,
    error,
    loadToday,
    loadByDate,
  } = useDailyMeeting();

  const selectedDate = meeting?.meetingDate ?? '';
  const isReadOnly = meeting?.status === 'COMPLETED';

  return (
    <div style={outerStyle}>
      <MeetingListSidebar
        recentMeetings={recentMeetings}
        selectedDate={selectedDate}
        onSelect={loadByDate}
        onTodayClick={loadToday}
      />

      <div style={contentStyle}>
        {loading ? (
          <div style={centerStyle}>
            <span style={spinnerStyle} />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>회의 데이터를 불러오는 중...</span>
          </div>
        ) : error && !meeting ? (
          <div style={centerStyle}>
            <span style={{ fontSize: 14, color: 'var(--error)' }}>{error}</span>
            <button type="button" onClick={loadToday} style={retryBtnStyle}>다시 시도</button>
          </div>
        ) : !meeting || !dashboard ? (
          <div style={centerStyle}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>회의 정보가 없습니다.</span>
          </div>
        ) : (
          <div style={pageStyle}>
            <MeetingHeader
              meeting={meeting}
              onRefresh={loadToday}
              isReadOnly={isReadOnly}
            />

            <MeetingDashboard dashboard={dashboard} />

            <div style={splitPanelStyle}>
              <div style={leftPanelStyle}>
                <WorkOrderDispatchBoard
                  workOrders={dashboard.todayWorkOrders}
                  assignments={dashboard.todayAssignments}
                  unresolvedActions={dashboard.unresolvedActions}
                  isReadOnly={isReadOnly}
                  onRefresh={() => loadToday()}
                />
              </div>

              <div style={rightPanelStyle}>
                <MeetingNotesEditor
                  meetingId={meeting.id}
                  isReadOnly={isReadOnly}
                />
                <ActionItemList
                  meetingId={meeting.id}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const outerStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
};

const contentStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  height: '100%',
  overflow: 'hidden',
};

const splitPanelStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
};

const leftPanelStyle: CSSProperties = {
  flex: '0 0 58%',
  minWidth: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const rightPanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const centerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  gap: 12,
};

const spinnerStyle: CSSProperties = {
  width: 28,
  height: 28,
  border: '3px solid var(--border)',
  borderTopColor: 'var(--accent)',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const retryBtnStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 600,
  border: '1px solid var(--accent)',
  borderRadius: 8,
  background: 'transparent',
  color: 'var(--accent)',
  cursor: 'pointer',
};

export default DailyMeetingPage;
