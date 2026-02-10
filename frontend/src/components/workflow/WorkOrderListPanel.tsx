/**
 * WorkOrderListPanel - 타임라인 형태의 등록된 작업지시 목록 (DESC)
 */

import { useMemo, CSSProperties } from 'react';
import { Clock, Calendar, ClipboardList, CircleDot, CheckCircle2, Loader } from 'lucide-react';
import type { WorkOrder } from '../../types/workOrder.types';

type StatusKey = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';

const statusConfig: Record<StatusKey, { icon: typeof CheckCircle2; label: string; color: string; dotColor: string }> = {
  COMPLETED:   { icon: CheckCircle2, label: '완료', color: '#34c759', dotColor: '#34c759' },
  IN_PROGRESS: { icon: Loader,       label: '진행중', color: '#ff9f0a', dotColor: '#ff9f0a' },
  PENDING:     { icon: CircleDot,    label: '대기', color: 'var(--text-tertiary)', dotColor: 'var(--accent)' },
};

function getStatus(wo: WorkOrder): StatusKey {
  const s = (wo.approvalStatus || '').toUpperCase();
  if (s === 'COMPLETED' || s === 'DONE') return 'COMPLETED';
  if (s === 'IN_PROGRESS' || s === 'APPROVED' || s === 'PROCESSING') return 'IN_PROGRESS';
  return 'PENDING';
}

interface WorkOrderListPanelProps {
  workOrders: WorkOrder[];
}

export function WorkOrderListPanel({ workOrders }: WorkOrderListPanelProps) {
  // DESC 정렬 (최신 먼저)
  const sorted = useMemo(
    () => [...workOrders].sort((a, b) => b.id - a.id),
    [workOrders],
  );

  // 날짜별 그룹핑
  const grouped = useMemo(() => {
    const map = new Map<string, WorkOrder[]>();
    for (const wo of sorted) {
      const date = wo.requestDate || 'unknown';
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(wo);
    }
    return Array.from(map.entries());
  }, [sorted]);

  const totalQty = useMemo(
    () => workOrders.reduce((sum, wo) => sum + (wo.quantity || 0), 0),
    [workOrders],
  );

  const totalArea = useMemo(
    () => workOrders.reduce((sum, wo) => sum + (wo.area || 0), 0),
    [workOrders],
  );

  const formatDateLabel = (d: string) => {
    const parts = d.split('-');
    return `${parts[0]}.${parts[1]}.${parts[2]}`;
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <Clock size={14} style={{ color: 'var(--accent)' }} />
        <span style={titleStyle}>전체 작업지시</span>
        <span style={countBadgeStyle}>{workOrders.length}건</span>
      </div>

      {/* Summary */}
      {workOrders.length > 0 && (
        <div style={summaryBarStyle}>
          <strong>{totalQty}</strong>EA
          <span style={summaryDivStyle}>·</span>
          <strong>{totalArea.toFixed(1)}</strong>m²
        </div>
      )}

      {/* Timeline */}
      <div style={listStyle}>
        {workOrders.length === 0 ? (
          <div style={emptyStyle}>
            <ClipboardList size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
              등록된 작업지시가 없습니다
            </div>
          </div>
        ) : (
          grouped.map(([date, items]) => (
            <div key={date}>
              {/* 날짜 헤더 */}
              <div style={dateHeaderStyle}>
                <Calendar size={11} />
                <span style={dateHeaderLabelStyle}>작업일자</span>
                {formatDateLabel(date)}
                <span style={dateHeaderCountStyle}>{items.length}건</span>
              </div>

              {/* 타임라인 아이템 */}
              {items.map((wo, idx) => {
                const status = getStatus(wo);
                const cfg = statusConfig[status];
                const StatusIcon = cfg.icon;
                return (
                <div key={wo.id} style={tlItemStyle}>
                  {/* 세로선 + 도트 */}
                  <div style={tlTrackStyle}>
                    <div style={{ ...tlDotStyle, background: cfg.dotColor }} />
                    {idx < items.length - 1 && <div style={tlLineStyle} />}
                  </div>

                  {/* 카드 */}
                  <div style={tlCardStyle}>
                    <div style={tlCardHeaderStyle}>
                      <span style={requestNoStyle}>{wo.requestNo}</span>
                      <span style={{ ...statusBadgeStyle, color: cfg.color, background: `color-mix(in srgb, ${cfg.color} 12%, transparent)` }}>
                        <StatusIcon size={10} />
                        {cfg.label}
                      </span>
                    </div>
                    <div style={tlCardSpecStyle}>
                      <span style={thicknessStyle}>{wo.thickness ?? 0}mm</span>
                      <span style={specStyle}>
                        {wo.width?.toFixed(0)}×{wo.height?.toFixed(0)}
                      </span>
                      <span style={qtyStyle}>{wo.quantity}EA</span>
                      {wo.area != null && (
                        <span style={areaStyle}>{wo.area.toFixed(1)}m²</span>
                      )}
                    </div>
                    {wo.materialNm && (
                      <div style={materialNmStyle}>{wo.materialNm}</div>
                    )}
                    {wo.remarks && (
                      <div style={remarkStyle}>{wo.remarks}</div>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '12px 14px',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const countBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 7px',
  borderRadius: 10,
  marginLeft: 'auto',
};

const summaryBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 14px',
  borderBottom: '1px solid var(--border)',
  fontSize: 11,
  color: 'var(--text-secondary)',
  flexShrink: 0,
};

const summaryDivStyle: CSSProperties = { color: 'var(--text-tertiary)' };

const listStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 14px',
};

const dateHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  padding: '7px 14px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const dateHeaderLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  opacity: 0.75,
};

const dateHeaderCountStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  opacity: 0.7,
  marginLeft: 'auto',
};

/* ─── Timeline track ─── */

const tlItemStyle: CSSProperties = {
  display: 'flex',
  padding: '0 14px 0 10px',
};

const tlTrackStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 16,
  flexShrink: 0,
  paddingTop: 14,
};

const tlDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: 'var(--accent)',
  flexShrink: 0,
};

const tlLineStyle: CSSProperties = {
  width: 2,
  flex: 1,
  background: 'color-mix(in srgb, var(--accent) 20%, transparent)',
};

/* ─── Timeline card ─── */

const tlCardStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '8px 0 10px 8px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 30%, transparent)',
};

const tlCardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 3,
};

const statusBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 9,
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
};

const requestNoStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--accent)',
};

const tlCardSpecStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
};

const thicknessStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--text)',
};

const specStyle: CSSProperties = {
  color: 'var(--text-secondary)',
};

const qtyStyle: CSSProperties = {
  fontWeight: 600,
  color: 'var(--text)',
};

const areaStyle: CSSProperties = {
  color: 'var(--text-tertiary)',
};

const materialNmStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
  marginTop: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const remarkStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
  background: 'color-mix(in srgb, var(--text-tertiary) 8%, transparent)',
  padding: '1px 6px',
  borderRadius: 3,
  marginTop: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  maxWidth: '100%',
};

export default WorkOrderListPanel;
