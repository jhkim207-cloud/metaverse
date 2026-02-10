import { CSSProperties } from 'react';
import { CheckCircle, CircleDot, Circle, CheckCircle2 } from 'lucide-react';
import type { WorkOrderWithResult } from '../../types/productionResult.types';

interface WorkOrderResultCardProps {
  workOrder: WorkOrderWithResult;
  isSelected: boolean;
  onSelect: (wo: WorkOrderWithResult) => void;
  onFullComplete: (wo: WorkOrderWithResult) => void;
}

export function WorkOrderResultCard({
  workOrder,
  isSelected,
  onSelect,
  onFullComplete,
}: WorkOrderResultCardProps) {
  const total = workOrder.quantity ?? 0;
  const progress = total > 0 ? Math.min(100, (workOrder.goodQtySum / total) * 100) : 0;
  const isCompleted = workOrder.resultStatus === 'COMPLETED';
  const isPartial = workOrder.resultStatus === 'PARTIAL';

  const StatusIcon = isCompleted ? CheckCircle : isPartial ? CircleDot : Circle;
  const statusColor = isCompleted
    ? 'var(--success)'
    : isPartial
      ? 'var(--warning)'
      : 'var(--text-tertiary)';

  const progressColor = isCompleted
    ? 'var(--success)'
    : isPartial
      ? 'var(--accent)'
      : 'var(--text-tertiary)';

  return (
    <div
      style={{
        ...cardStyle,
        borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
        background: isSelected
          ? 'color-mix(in srgb, var(--accent) 4%, var(--panel))'
          : 'var(--panel)',
      }}
      onClick={() => onSelect(workOrder)}
    >
      {/* Top row: request no + status icon */}
      <div style={topRowStyle}>
        <span style={requestNoStyle}>{workOrder.requestNo}</span>
        <StatusIcon size={16} style={{ color: statusColor, flexShrink: 0 }} />
      </div>

      {/* Material info */}
      <div style={materialStyle}>
        {workOrder.materialNm || '-'}
        {workOrder.thickness != null && ` ${workOrder.thickness}mm`}
      </div>

      {/* Quantity info */}
      <div style={qtyRowStyle}>
        <span style={qtyLabelStyle}>지시</span>
        <span style={qtyValueStyle}>{total}EA</span>
        {workOrder.area != null && (
          <span style={areaStyle}>{Number(workOrder.area).toFixed(1)}m²</span>
        )}
        {workOrder.goodQtySum > 0 && (
          <span style={goodQtyStyle}>양품 {workOrder.goodQtySum}EA</span>
        )}
        {workOrder.defectQtySum > 0 && (
          <span style={defectQtyStyle}>불량 {workOrder.defectQtySum}EA</span>
        )}
      </div>

      {/* Progress bar */}
      <div style={progressBarBgStyle}>
        <div
          style={{
            ...progressBarFillStyle,
            width: `${progress}%`,
            background: progressColor,
          }}
        />
      </div>

      {/* Bottom row: progress text + full complete button */}
      <div style={bottomRowStyle}>
        <span style={{ ...progressTextStyle, color: progressColor }}>
          {Math.round(progress)}%
        </span>
        {!isCompleted && total > 0 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onFullComplete(workOrder);
            }}
            style={fullCompleteBtnStyle}
          >
            <CheckCircle2 size={13} />
            전량완료
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const cardStyle: CSSProperties = {
  padding: '10px 14px',
  margin: '0 8px 6px',
  borderRadius: 10,
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  cursor: 'pointer',
  transition: 'border-color 0.15s, background 0.15s',
};

const topRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const requestNoStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--accent)',
};

const materialStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  marginTop: 2,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const qtyRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 6,
  flexWrap: 'wrap',
};

const qtyLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  fontWeight: 500,
};

const qtyValueStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
};

const areaStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const goodQtyStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--success)',
  marginLeft: 'auto',
};

const defectQtyStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--error)',
};

const progressBarBgStyle: CSSProperties = {
  height: 4,
  borderRadius: 2,
  background: 'color-mix(in srgb, var(--text-tertiary) 15%, transparent)',
  marginTop: 8,
  overflow: 'hidden',
};

const progressBarFillStyle: CSSProperties = {
  height: '100%',
  borderRadius: 2,
  transition: 'width 0.3s ease',
};

const bottomRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 6,
};

const progressTextStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
};

const fullCompleteBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  fontSize: 11,
  fontWeight: 600,
  border: '1px solid var(--success)',
  borderRadius: 6,
  background: 'color-mix(in srgb, var(--success) 8%, transparent)',
  color: 'var(--success)',
  cursor: 'pointer',
};

export default WorkOrderResultCard;
