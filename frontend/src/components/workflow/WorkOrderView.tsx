import { useState, useEffect, useMemo, useCallback, CSSProperties } from 'react';
import { Calendar, ClipboardList, ChevronRight } from 'lucide-react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';
import type { ProductionPlan } from '../../types/productionPlan.types';
import type { ProductionPlanDetail, WorkOrder } from '../../types/workOrder.types';
import { workOrderApi } from '../../services/workOrderApi';
import { DatePicker } from '../common/DatePicker';
import { PlanDetailSelectGrid } from './PlanDetailSelectGrid';
import { WorkOrderListPanel } from './WorkOrderListPanel';

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

export function WorkOrderView() {
  const [targetDate, setTargetDate] = useState(() => format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [details, setDetails] = useState<ProductionPlanDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [allWorkOrders, setAllWorkOrders] = useState<WorkOrder[]>([]);

  const dateLabel = useMemo(() => {
    const d = new Date(targetDate + 'T00:00:00');
    if (isToday(d)) return '오늘';
    if (isTomorrow(d)) return '내일';
    return '';
  }, [targetDate]);

  // Load all work orders (no date filter) on mount
  useEffect(() => {
    let cancelled = false;
    workOrderApi.findAll().then(res => {
      if (cancelled) return;
      if (res.success && res.data) setAllWorkOrders(res.data);
      else setAllWorkOrders([]);
    }).catch(() => { if (!cancelled) setAllWorkOrders([]); });
    return () => { cancelled = true; };
  }, []);

  // Load plans when date changes
  useEffect(() => {
    let cancelled = false;
    setPlansLoading(true);
    setSelectedPlanId(null);
    setDetails([]);
    setWorkOrders([]);

    workOrderApi.findUncompletedPlans(targetDate).then(res => {
      if (cancelled) return;
      setPlans(res.success && res.data ? res.data : []);
      setPlansLoading(false);
    }).catch(() => {
      if (!cancelled) { setPlans([]); setPlansLoading(false); }
    });
    return () => { cancelled = true; };
  }, [targetDate]);

  // Load details and plan-specific work orders when plan selected
  useEffect(() => {
    if (!selectedPlanId) { setDetails([]); setWorkOrders([]); return; }
    let cancelled = false;
    setDetailsLoading(true);
    Promise.all([
      workOrderApi.findPlanDetails(selectedPlanId),
      workOrderApi.findByPlanId(selectedPlanId),
    ]).then(([detailsRes, woRes]) => {
      if (cancelled) return;
      setDetails(detailsRes.success && detailsRes.data ? detailsRes.data : []);
      setWorkOrders(woRes.success && woRes.data ? woRes.data : []);
      setDetailsLoading(false);
    }).catch(() => {
      if (!cancelled) { setDetails([]); setWorkOrders([]); setDetailsLoading(false); }
    });
    return () => { cancelled = true; };
  }, [selectedPlanId]);

  const handleRegistered = useCallback(() => {
    if (selectedPlanId) {
      workOrderApi.findPlanDetails(selectedPlanId).then(res => {
        if (res.success && res.data) setDetails(res.data);
      });
      workOrderApi.findByPlanId(selectedPlanId).then(res => {
        if (res.success && res.data) setWorkOrders(res.data);
      });
    }
    // Refresh plans + all work orders
    workOrderApi.findUncompletedPlans(targetDate).then(res => {
      if (res.success && res.data) setPlans(res.data);
    });
    workOrderApi.findAll().then(res => {
      if (res.success && res.data) setAllWorkOrders(res.data);
    });
  }, [targetDate, selectedPlanId]);

  const selectedPlan = useMemo(
    () => plans.find(p => p.id === selectedPlanId) ?? null,
    [plans, selectedPlanId],
  );

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    const parts = d.split('-');
    return `${parts[1]}.${parts[2]}`;
  };

  return (
    <div style={viewStyle}>
      {/* Left Panel: 미완료 생산계획 목록 */}
      <div style={leftPanelStyle}>
        {/* Date selector */}
        <div style={dateBarStyle}>
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span style={dateLabelTextStyle}>작업지시 날짜</span>
          <DatePicker
            selected={parseDate(targetDate)}
            onChange={d => setTargetDate(d ? format(d, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'))}
            placeholder="작업지시 날짜"
            isClearable={false}
          />
          {dateLabel && <span style={relativeLabelStyle}>{dateLabel}</span>}
        </div>

        {/* Plans header */}
        <div style={plansHeaderStyle}>
          <ClipboardList size={13} style={{ color: 'var(--accent)' }} />
          미완료 생산계획
          <span style={planCountStyle}>
            {plansLoading ? '...' : `${plans.length}건`}
          </span>
        </div>

        {/* Plan cards */}
        <div style={planListStyle}>
          {plansLoading ? (
            <div style={emptyMsgStyle}>로딩 중...</div>
          ) : plans.length === 0 ? (
            <div style={emptyMsgStyle}>
              {targetDate} 기간에 미완료 생산계획이 없습니다.
            </div>
          ) : plans.map(p => (
            <div
              key={p.id}
              style={{
                ...planCardStyle,
                ...(selectedPlanId === p.id ? planCardActiveStyle : {}),
              }}
              onClick={() => setSelectedPlanId(p.id)}
            >
              <div style={planCardTopStyle}>
                <span style={planCardNoStyle}>{p.planNo}</span>
                <span style={planCardDateStyle}>
                  {formatDate(p.startDate)}~{formatDate(p.endDate)}
                </span>
              </div>
              <div style={planCardBottomStyle}>
                <span style={planCardSiteStyle}>
                  {p.siteNm || '-'} / {p.customerNm || '-'}
                </span>
                <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              </div>
              <div style={planCardInfoStyle}>
                {p.machineNo && <span style={infoTagStyle}>{p.machineNo}</span>}
                <span style={infoTagStyle}>{p.quantity ?? 0}EA</span>
                {p.area != null && <span style={infoTagStyle}>{Number(p.area).toFixed(1)}m²</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: 좌(상하분할) + 우(전체높이 타임라인) */}
      <div style={rightPanelStyle}>
        {!selectedPlan ? (
          /* 계획 미선택: 좌측은 empty, 우측은 전체 타임라인 */
          <div style={contentRowStyle}>
            <div style={leftColStyle}>
              <div style={rightEmptyStyle}>
                <ClipboardList size={32} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
                <div style={{ fontSize: 14, color: 'var(--text-tertiary)', marginTop: 8 }}>
                  좌측에서 생산계획을 선택하세요
                </div>
              </div>
            </div>
            <div style={verticalDividerStyle} />
            <div style={rightColStyle}>
              <WorkOrderListPanel workOrders={allWorkOrders} />
            </div>
          </div>
        ) : detailsLoading ? (
          <div style={contentRowStyle}>
            <div style={leftColStyle}>
              <div style={rightEmptyStyle}>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>상세 로딩 중...</div>
              </div>
            </div>
            <div style={verticalDividerStyle} />
            <div style={rightColStyle}>
              <WorkOrderListPanel workOrders={allWorkOrders} />
            </div>
          </div>
        ) : (
          <div style={contentRowStyle}>
            {/* 좌측 컬럼: 상하 분할 */}
            <div style={leftColStyle}>
              {/* 상: 생산계획 상세 선택 */}
              <div style={topHalfStyle}>
                <PlanDetailSelectGrid
                  plan={selectedPlan}
                  details={details}
                  requestDate={targetDate}
                  onRegistered={handleRegistered}
                />
              </div>
              {/* 가로 구분선 */}
              <div style={horizontalDividerStyle} />
              {/* 하: 해당 계획의 작업지시 목록 */}
              <div style={bottomHalfStyle}>
                <PlanWorkOrderList workOrders={workOrders} />
              </div>
            </div>

            {/* 세로 구분선 */}
            <div style={verticalDividerStyle} />

            {/* 우측 컬럼: 전체 작업지시 타임라인 (전체 높이) */}
            <div style={rightColStyle}>
              <WorkOrderListPanel workOrders={allWorkOrders} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Plan-specific Work Order List (bottom-left) ─── */

function PlanWorkOrderList({ workOrders }: { workOrders: WorkOrder[] }) {
  const grouped = useMemo(() => {
    const map = new Map<number, WorkOrder[]>();
    for (const wo of workOrders) {
      const t = wo.thickness ?? 0;
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(wo);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [workOrders]);

  const totalQty = useMemo(
    () => workOrders.reduce((s, wo) => s + (wo.quantity || 0), 0),
    [workOrders],
  );
  const totalArea = useMemo(
    () => workOrders.reduce((s, wo) => s + (wo.area || 0), 0),
    [workOrders],
  );

  return (
    <div style={planWoContainerStyle}>
      <div style={planWoHeaderStyle}>
        <ClipboardList size={13} style={{ color: 'var(--accent)' }} />
        <span style={planWoTitleStyle}>해당 계획 작업지시</span>
        <span style={planWoBadgeStyle}>{workOrders.length}건</span>
      </div>

      {workOrders.length > 0 && (
        <div style={planWoSummaryStyle}>
          <strong>{totalQty}</strong>EA
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <strong>{totalArea.toFixed(1)}</strong>m²
        </div>
      )}

      <div style={planWoListStyle}>
        {workOrders.length === 0 ? (
          <div style={planWoEmptyStyle}>
            <ClipboardList size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
              등록된 작업지시가 없습니다
            </div>
          </div>
        ) : (
          grouped.map(([thickness, items]) => (
            <div key={thickness}>
              <div style={planWoGroupStyle}>
                {thickness}mm
                <span style={planWoGroupCountStyle}>{items.length}건</span>
              </div>
              {items.map(wo => (
                <div key={wo.id} style={planWoRowStyle}>
                  <span style={planWoReqNoStyle}>{wo.requestNo}</span>
                  {wo.requestDate && (
                    <span style={planWoDateBadgeStyle}>
                      <Calendar size={9} />
                      <span style={planWoDateLabelStyle}>작업일자</span>
                      {wo.requestDate.split('-').slice(1).join('.')}
                    </span>
                  )}
                  <span style={planWoSpecStyle}>
                    {wo.width?.toFixed(0)}×{wo.height?.toFixed(0)}
                  </span>
                  <span style={planWoQtyStyle}>{wo.quantity}EA</span>
                  {wo.area != null && (
                    <span style={planWoAreaStyle}>{wo.area.toFixed(1)}m²</span>
                  )}
                  {wo.materialNm && (
                    <span style={planWoMaterialStyle}>{wo.materialNm}</span>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ─── View Layout Styles ─── */
/* ═══════════════════════════════════════════ */

const viewStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  gap: 0,
};

const leftPanelStyle: CSSProperties = {
  width: 380,
  minWidth: 340,
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel)',
  borderRadius: '12px 0 0 12px',
  border: '1px solid var(--border)',
};

const dateBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
};

const dateLabelTextStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  whiteSpace: 'nowrap',
};

const dateInputStyle: CSSProperties = {
  fontSize: 13,
  padding: '4px 8px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--panel-2)',
  color: 'var(--text)',
  fontFamily: 'inherit',
  flex: 1,
  minWidth: 0,
};

const relativeLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  padding: '2px 8px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
};

const plansHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
};

const planCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
  marginLeft: 'auto',
};

const planListStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '4px 0',
};

const emptyMsgStyle: CSSProperties = {
  padding: '32px 16px',
  fontSize: 13,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
};

const planCardStyle: CSSProperties = {
  padding: '10px 16px 10px 13px',
  cursor: 'pointer',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
  transition: 'background 0.1s',
  borderLeft: '3px solid transparent',
};

const planCardActiveStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  borderLeft: '3px solid var(--accent)',
};

const planCardTopStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 2,
};

const planCardNoStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--accent)',
};

const planCardDateStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  background: 'var(--panel-2)',
  padding: '1px 6px',
  borderRadius: 4,
};

const planCardBottomStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const planCardSiteStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const planCardInfoStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
  marginTop: 4,
};

const infoTagStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  padding: '1px 6px',
  borderRadius: 4,
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  color: 'var(--accent)',
};

/* ─── Right Panel ─── */

const rightPanelStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel)',
  borderRadius: '0 12px 12px 0',
  border: '1px solid var(--border)',
  borderLeft: 'none',
  minHeight: 0,
};

const rightEmptyStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

/* ─── Content Row: 좌(상하분할) + 우(전체높이) ─── */

const contentRowStyle: CSSProperties = {
  display: 'flex',
  flex: 1,
  minHeight: 0,
};

const leftColStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const verticalDividerStyle: CSSProperties = {
  width: 1,
  background: 'var(--border)',
  flexShrink: 0,
};

const rightColStyle: CSSProperties = {
  width: 640,
  minWidth: 520,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--panel)',
};

/* ─── Left Column: Top/Bottom split ─── */

const topHalfStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--panel-2)',
};

const horizontalDividerStyle: CSSProperties = {
  height: 1,
  background: 'var(--border)',
  flexShrink: 0,
};

const bottomHalfStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--panel)',
};

/* ═══════════════════════════════════════════ */
/* ─── PlanWorkOrderList Styles ─── */
/* ═══════════════════════════════════════════ */

const planWoContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const planWoHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
};

const planWoTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const planWoBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 7px',
  borderRadius: 10,
  marginLeft: 'auto',
};

const planWoSummaryStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 14px',
  borderBottom: '1px solid var(--border)',
  fontSize: 11,
  color: 'var(--text-secondary)',
  flexShrink: 0,
};

const planWoListStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const planWoEmptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 14px',
};

const planWoGroupStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 14px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 5%, var(--panel))',
  borderTop: '1px solid var(--border)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const planWoGroupCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const planWoRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '6px 14px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 30%, transparent)',
  fontSize: 11,
};

const planWoReqNoStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--accent)',
  minWidth: 70,
};

const planWoDateBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  padding: '1px 7px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
};

const planWoDateLabelStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 800,
  opacity: 0.75,
};

const planWoSpecStyle: CSSProperties = {
  color: 'var(--text-secondary)',
};

const planWoQtyStyle: CSSProperties = {
  fontWeight: 600,
  color: 'var(--text)',
};

const planWoAreaStyle: CSSProperties = {
  color: 'var(--text-tertiary)',
};

const planWoMaterialStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};

export default WorkOrderView;
