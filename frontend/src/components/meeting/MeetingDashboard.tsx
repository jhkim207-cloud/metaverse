import { CSSProperties } from 'react';
import { ClipboardList, Package, Ruler, Users, BarChart3, AlertTriangle } from 'lucide-react';
import type { MeetingDashboard as DashboardData } from '../../types/meeting.types';

interface MeetingDashboardProps {
  dashboard: DashboardData;
}

export function MeetingDashboard({ dashboard }: MeetingDashboardProps) {
  const { todayWorkOrders, todayAssignments, yesterdaySummary, unresolvedActions } = dashboard;

  const totalQty = todayWorkOrders.reduce((s, w) => s + (w.quantity ?? 0), 0);
  const totalArea = todayWorkOrders.reduce((s, w) => s + (w.area ?? 0), 0);
  const assignedWrNos = new Set(todayAssignments.map(a => a.workRequestNo).filter(Boolean));
  const assignedCount = todayWorkOrders.filter(w => assignedWrNos.has(w.requestNo)).length;

  const cards: { icon: React.ReactNode; label: string; value: string; color?: string }[] = [
    { icon: <ClipboardList size={16} />, label: '작업지시', value: `${todayWorkOrders.length}건` },
    { icon: <Package size={16} />, label: '총 수량', value: `${totalQty.toLocaleString()} EA` },
    { icon: <Ruler size={16} />, label: '총 면적', value: `${totalArea.toFixed(1)} m²` },
    {
      icon: <Users size={16} />,
      label: '배치현황',
      value: `${assignedCount}/${todayWorkOrders.length}`,
      color: assignedCount < todayWorkOrders.length ? 'var(--warning)' : 'var(--success)',
    },
    {
      icon: <BarChart3 size={16} />,
      label: '전일 완료율',
      value: yesterdaySummary ? `${yesterdaySummary.completionRate}%` : '-',
      color: yesterdaySummary && yesterdaySummary.completionRate >= 80 ? 'var(--success)' : 'var(--warning)',
    },
    {
      icon: <AlertTriangle size={16} />,
      label: '미결 액션',
      value: `${unresolvedActions.length}건`,
      color: unresolvedActions.length > 0 ? 'var(--error)' : 'var(--text-tertiary)',
    },
  ];

  return (
    <div style={containerStyle}>
      {cards.map((c, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ color: c.color || 'var(--accent)', flexShrink: 0 }}>{c.icon}</div>
          <div style={cardContentStyle}>
            <span style={cardLabelStyle}>{c.label}</span>
            <span style={{ ...cardValueStyle, color: c.color || 'var(--text)' }}>{c.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)',
  gap: 8,
  padding: '8px 16px',
};

const cardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 10,
};

const cardContentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
};

const cardLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  fontWeight: 500,
};

const cardValueStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
};

export default MeetingDashboard;
