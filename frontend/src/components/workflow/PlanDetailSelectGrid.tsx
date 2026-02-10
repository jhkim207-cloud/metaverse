import { useState, useMemo, CSSProperties } from 'react';
import { Check, Send } from 'lucide-react';
import type { ProductionPlan } from '../../types/productionPlan.types';
import type { ProductionPlanDetail, WorkOrderCreateRequest } from '../../types/workOrder.types';
import { workOrderApi } from '../../services/workOrderApi';

interface PlanDetailSelectGridProps {
  plan: ProductionPlan;
  details: ProductionPlanDetail[];
  requestDate: string;
  onRegistered: () => void;
}

export function PlanDetailSelectGrid({
  plan, details, requestDate, onRegistered,
}: PlanDetailSelectGridProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const pendingDetails = useMemo(
    () => details.filter(d => d.processStatus === 'PENDING'),
    [details],
  );

  const grouped = useMemo(() => {
    const map = new Map<number, ProductionPlanDetail[]>();
    for (const d of details) {
      const t = d.thickness ?? 0;
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(d);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [details]);

  const summary = useMemo(() => {
    let qty = 0;
    let area = 0;
    for (const d of details) {
      if (selectedIds.has(d.id)) {
        qty += d.quantity || 0;
        area += d.area || 0;
      }
    }
    return { count: selectedIds.size, qty, area: area.toFixed(1) };
  }, [details, selectedIds]);

  const toggleId = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === pendingDetails.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingDetails.map(d => d.id)));
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.size === 0 || submitting) return;
    setSubmitting(true);
    try {
      const req: WorkOrderCreateRequest = {
        requestDate,
        planDetailIds: Array.from(selectedIds),
      };
      const res = await workOrderApi.createWorkOrders(req);
      if (res.success) {
        setSelectedIds(new Set());
        onRegistered();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '-';
    const parts = d.split('-');
    return `${parts[1]}.${parts[2]}`;
  };

  return (
    <div style={containerStyle}>
      {/* Plan header */}
      <div style={planHeaderStyle}>
        <div style={planNoStyle}>{plan.planNo}</div>
        <div style={planMetaStyle}>
          {plan.siteNm || '-'} / {plan.customerNm || '-'}
          <span style={planDateStyle}>
            {formatDate(plan.startDate)}~{formatDate(plan.endDate)}
          </span>
        </div>
      </div>

      {/* Select all */}
      <div style={selectAllBarStyle}>
        <label style={selectAllLabelStyle} onClick={toggleAll}>
          <span style={{
            ...checkboxStyle,
            ...(selectedIds.size === pendingDetails.length && pendingDetails.length > 0
              ? checkboxCheckedStyle : {}),
          }}>
            {selectedIds.size === pendingDetails.length && pendingDetails.length > 0 && (
              <Check size={12} strokeWidth={3} />
            )}
          </span>
          전체 선택 ({pendingDetails.length}건)
        </label>
      </div>

      {/* Grouped detail rows */}
      <div style={detailListStyle}>
        {grouped.map(([thickness, items]) => (
          <div key={thickness}>
            <div style={groupHeaderStyle}>
              {thickness}mm
              <span style={groupCountStyle}>{items.length}건</span>
            </div>
            {items.map(d => {
              const isPending = d.processStatus === 'PENDING';
              const isChecked = selectedIds.has(d.id);
              return (
                <div
                  key={d.id}
                  style={{
                    ...detailRowStyle,
                    ...(!isPending ? { opacity: 0.35, pointerEvents: 'none' as const } : {}),
                    ...(isChecked ? detailRowSelectedStyle : {}),
                  }}
                  onClick={() => isPending && toggleId(d.id)}
                >
                  <span style={{
                    ...checkboxStyle,
                    ...(isChecked ? checkboxCheckedStyle : {}),
                  }}>
                    {isChecked && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span style={materialStyle}>
                    {d.windowType || d.productCategory || '-'}
                  </span>
                  <span style={specStyle}>
                    {d.width?.toFixed(0)}×{d.height?.toFixed(0)}
                  </span>
                  {d.materialNm && (
                    <span style={materialNmStyle}>{d.materialNm}</span>
                  )}
                  <span style={qtyStyle}>{d.quantity}EA</span>
                  <span style={areaStyle}>{d.area?.toFixed(1)}m²</span>
                  {d.remarks && (
                    <span style={remarkStyle}>{d.remarks}</span>
                  )}
                  {!isPending && (
                    <span style={statusBadgeStyle}>{d.processStatus}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Summary + submit */}
      {selectedIds.size > 0 && (
        <div style={summaryBarStyle}>
          <div style={summaryTextStyle}>
            선택: {summary.count}건 {summary.qty}EA {summary.area}m²
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              ...submitBtnStyle,
              ...(submitting ? { opacity: 0.6 } : {}),
            }}
          >
            <Send size={14} />
            {submitting ? '등록 중...' : '작업지시 등록'}
          </button>
        </div>
      )}

    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const planHeaderStyle: CSSProperties = {
  padding: '14px 16px 10px',
  borderBottom: '1px solid var(--border)',
};

const planNoStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--accent)',
};

const planMetaStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  marginTop: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const planDateStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  background: 'var(--panel-2)',
  padding: '1px 8px',
  borderRadius: 4,
};

const selectAllBarStyle: CSSProperties = {
  padding: '8px 16px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
};

const selectAllLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  userSelect: 'none',
};

const detailListStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '4px 0',
};

const groupHeaderStyle: CSSProperties = {
  padding: '6px 16px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 5%, var(--panel))',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const groupCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const detailRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '7px 16px',
  cursor: 'pointer',
  transition: 'background 0.1s',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 40%, transparent)',
};

const detailRowSelectedStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
};

const checkboxStyle: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 4,
  border: '1.5px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  transition: 'all 0.1s',
};

const checkboxCheckedStyle: CSSProperties = {
  background: 'var(--accent)',
  borderColor: 'var(--accent)',
  color: 'var(--on-accent)',
};

const materialStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  minWidth: 60,
};

const specStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const materialNmStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};

const remarkStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
  background: 'color-mix(in srgb, var(--text-tertiary) 8%, transparent)',
  padding: '1px 6px',
  borderRadius: 3,
  maxWidth: 120,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const qtyStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text)',
  minWidth: 45,
  textAlign: 'right',
};

const areaStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-tertiary)',
  minWidth: 55,
  textAlign: 'right',
};

const statusBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 4,
  background: 'color-mix(in srgb, var(--text-tertiary) 10%, transparent)',
  color: 'var(--text-tertiary)',
};

const summaryBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 16px',
  borderTop: '1px solid var(--border)',
  background: 'color-mix(in srgb, var(--accent) 4%, var(--panel))',
};

const summaryTextStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const submitBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '7px 18px',
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

export default PlanDetailSelectGrid;
