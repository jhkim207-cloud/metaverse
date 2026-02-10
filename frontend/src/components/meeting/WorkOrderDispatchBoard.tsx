import { CSSProperties, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, CircleDot, Circle, ShieldCheck } from 'lucide-react';
import type { WorkOrder } from '../../types/workOrder.types';
import type { WorkerDailyAssignment } from '../../types/workerAssignment.types';
import type { MeetingActionItem } from '../../types/meeting.types';
import { CarryForwardSection } from './CarryForwardSection';
import { meetingApi } from '../../services/meetingApi';

interface WorkOrderDispatchBoardProps {
  workOrders: WorkOrder[];
  assignments: WorkerDailyAssignment[];
  unresolvedActions: MeetingActionItem[];
  isReadOnly: boolean;
  onRefresh: () => void;
}

interface SiteGroup {
  siteNm: string;
  orders: WorkOrder[];
  totalQty: number;
  totalArea: number;
}

export function WorkOrderDispatchBoard({
  workOrders,
  assignments,
  unresolvedActions,
  isReadOnly,
  onRefresh,
}: WorkOrderDispatchBoardProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [confirming, setConfirming] = useState(false);

  const assignmentMap = useMemo(() => {
    const map = new Map<string, WorkerDailyAssignment[]>();
    for (const a of assignments) {
      if (!a.workRequestNo) continue;
      const list = map.get(a.workRequestNo) || [];
      list.push(a);
      map.set(a.workRequestNo, list);
    }
    return map;
  }, [assignments]);

  const groups = useMemo<SiteGroup[]>(() => {
    const map = new Map<string, WorkOrder[]>();
    for (const wo of workOrders) {
      const key = wo.siteNm || '(미지정)';
      const list = map.get(key) || [];
      list.push(wo);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([siteNm, orders]) => ({
      siteNm,
      orders,
      totalQty: orders.reduce((s, o) => s + (o.quantity ?? 0), 0),
      totalArea: orders.reduce((s, o) => s + (o.area ?? 0), 0),
    }));
  }, [workOrders]);

  const selectableOrders = useMemo(
    () => workOrders.filter(wo => wo.approvalStatus !== 'CONFIRMED'),
    [workOrders],
  );

  const allSelected = selectableOrders.length > 0
    && selectableOrders.every(wo => selectedIds.has(wo.id));

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableOrders.map(wo => wo.id)));
    }
  };

  const handleConfirm = async () => {
    if (selectedIds.size === 0) return;
    setConfirming(true);
    try {
      const res = await meetingApi.confirmWorkOrders(Array.from(selectedIds));
      if (res.success) {
        setSelectedIds(new Set());
        onRefresh();
      } else {
        alert('확정 실패: ' + (res.message || '알 수 없는 오류'));
      }
    } catch {
      alert('확정 중 오류가 발생했습니다.');
    } finally {
      setConfirming(false);
    }
  };

  const StatusIcon = ({ status }: { status: string | null }) => {
    if (status === 'CONFIRMED') return <ShieldCheck size={14} style={{ color: 'var(--success)' }} />;
    if (status === 'COMPLETED') return <CheckCircle size={14} style={{ color: 'var(--success)' }} />;
    if (status === 'IN_PROGRESS') return <CircleDot size={14} style={{ color: 'var(--accent)' }} />;
    return <Circle size={14} style={{ color: 'var(--text-tertiary)' }} />;
  };

  const canSelect = !isReadOnly && selectableOrders.length > 0;

  return (
    <div style={containerStyle}>
      <div style={titleBarStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {canSelect && (
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              title="전체 선택"
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
          )}
          <span style={titleStyle}>작업지시 현황</span>
          <span style={countStyle}>{workOrders.length}건</span>
        </div>

        {!isReadOnly && selectedIds.size > 0 && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={confirming}
            style={{ ...confirmBtnStyle, opacity: confirming ? 0.6 : 1 }}
          >
            <ShieldCheck size={14} />
            확정 ({selectedIds.size}건)
          </button>
        )}
      </div>

      <div style={scrollAreaStyle}>
        {groups.map(group => (
          <div key={group.siteNm}>
            <div style={groupHeaderStyle}>
              <span style={groupNameStyle}>{group.siteNm}</span>
              <span style={groupMetaStyle}>
                {group.orders.length}건 · {group.totalQty.toLocaleString()}EA · {group.totalArea.toFixed(1)}m²
              </span>
            </div>

            {group.orders.map(wo => {
              const assigned = assignmentMap.get(wo.requestNo);
              const isAssigned = !!assigned && assigned.length > 0;
              const isConfirmed = wo.approvalStatus === 'CONFIRMED';
              const isSelected = selectedIds.has(wo.id);

              return (
                <div
                  key={wo.id}
                  style={{
                    ...rowStyle,
                    background: isConfirmed
                      ? 'color-mix(in srgb, var(--success) 5%, transparent)'
                      : isSelected
                        ? 'color-mix(in srgb, var(--accent) 8%, transparent)'
                        : undefined,
                  }}
                >
                  {!isReadOnly && !isConfirmed && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(wo.id)}
                      title={`${wo.requestNo} 선택`}
                      style={{ accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
                    />
                  )}
                  {isConfirmed && <span style={{ width: 13, flexShrink: 0 }} />}
                  {!isAssigned && (
                    <AlertCircle size={12} style={{ color: 'var(--warning)', flexShrink: 0 }} />
                  )}
                  <StatusIcon status={wo.approvalStatus} />
                  <span style={requestNoStyle}>{wo.requestNo}</span>
                  <span style={materialStyle}>
                    {wo.materialNm || '-'}
                    {wo.thickness != null && ` ${wo.thickness}mm`}
                  </span>
                  <span style={qtyStyle}>{wo.quantity ?? 0}EA</span>
                  {wo.area != null && <span style={areaStyle}>{Number(wo.area).toFixed(1)}m²</span>}

                  <div style={assignmentAreaStyle}>
                    {isAssigned ? (
                      assigned.map((a, i) => (
                        <span key={i} style={assignedChipStyle}>
                          {a.workerNm}{a.workArea ? ` · ${a.workArea}` : ''}
                        </span>
                      ))
                    ) : (
                      <span style={unassignedStyle}>미배치</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {workOrders.length === 0 && (
          <div style={emptyStyle}>당일 작업지시가 없습니다.</div>
        )}

        <CarryForwardSection items={unresolvedActions} />
      </div>
    </div>
  );
}

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  overflow: 'hidden',
};

const titleBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
};

const titleStyle: CSSProperties = { fontSize: 14, fontWeight: 700, color: 'var(--text)' };
const countStyle: CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--accent)' };

const confirmBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '5px 12px',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  borderRadius: 6,
  background: 'var(--success)',
  color: '#fff',
  cursor: 'pointer',
};

const scrollAreaStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '4px 0',
};

const groupHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 14px 4px',
  position: 'sticky',
  top: 0,
  background: 'var(--panel-2)',
  zIndex: 1,
};

const groupNameStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const groupMetaStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 14px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
  fontSize: 12,
};

const requestNoStyle: CSSProperties = {
  fontWeight: 600,
  color: 'var(--accent)',
  minWidth: 100,
  flexShrink: 0,
};

const materialStyle: CSSProperties = {
  color: 'var(--text-secondary)',
  flex: 1,
  minWidth: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const qtyStyle: CSSProperties = {
  fontWeight: 600,
  color: 'var(--text)',
  minWidth: 50,
  textAlign: 'right',
};

const areaStyle: CSSProperties = {
  color: 'var(--text-tertiary)',
  minWidth: 55,
  textAlign: 'right',
};

const assignmentAreaStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
  minWidth: 100,
  justifyContent: 'flex-end',
};

const assignedChipStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  padding: '1px 6px',
  background: 'color-mix(in srgb, var(--success) 10%, transparent)',
  color: 'var(--success)',
  borderRadius: 8,
};

const unassignedStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  padding: '1px 6px',
  background: 'color-mix(in srgb, var(--warning) 10%, transparent)',
  color: 'var(--warning)',
  borderRadius: 8,
};

const emptyStyle: CSSProperties = {
  padding: 32,
  textAlign: 'center',
  color: 'var(--text-tertiary)',
  fontSize: 13,
};

export default WorkOrderDispatchBoard;
