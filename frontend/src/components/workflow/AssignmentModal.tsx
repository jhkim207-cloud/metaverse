import { useState, useEffect, useMemo, CSSProperties } from 'react';
import { X, Calendar, Settings } from 'lucide-react';
import type { SalesOrderHeader, SalesOrderDetail } from '../../types/site.types';
import type { Machine } from '../../types/productionPlan.types';
import { productionPlanApi } from '../../services/productionPlanApi';
import { DatePicker } from '../common/DatePicker';
import { format } from 'date-fns';

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function formatDateStr(d: Date | null): string {
  if (!d) return '';
  return format(d, 'yyyy-MM-dd');
}

interface AssignmentModalProps {
  isOpen: boolean;
  order: SalesOrderHeader;
  selectedDetails: SalesOrderDetail[];
  machines: Machine[];
  defaultMachineNo: string;
  defaultDate: Date;
  onClose: () => void;
  onSuccess: () => void;
}

export function AssignmentModal({
  isOpen, order, selectedDetails, machines, defaultMachineNo, defaultDate, onClose, onSuccess,
}: AssignmentModalProps) {
  const [machineNo, setMachineNo] = useState(defaultMachineNo);
  const [startDate, setStartDate] = useState(format(defaultDate, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(defaultDate, 'yyyy-MM-dd'));
  const [category, setCategory] = useState('공사');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMachineNo(defaultMachineNo);
      setStartDate(format(defaultDate, 'yyyy-MM-dd'));
      setEndDate(format(defaultDate, 'yyyy-MM-dd'));
      setCategory('공사');
      setRemarks('');
    }
  }, [isOpen, defaultMachineNo, defaultDate]);

  // Compute selection summary
  const summary = useMemo(() => {
    let totalQty = 0;
    let totalArea = 0;
    const thicknessMap = new Map<number, { count: number; qty: number }>();

    for (const d of selectedDetails) {
      totalQty += d.quantity || 0;
      totalArea += d.area || 0;
      const t = d.thickness ?? 0;
      const prev = thicknessMap.get(t) || { count: 0, qty: 0 };
      thicknessMap.set(t, { count: prev.count + 1, qty: prev.qty + (d.quantity || 0) });
    }

    const groups = Array.from(thicknessMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([t, v]) => `${t}mm: ${v.count}건 ${v.qty}EA`);

    return { totalQty, totalArea: totalArea.toFixed(1), groups };
  }, [selectedDetails]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!machineNo || !startDate || !endDate) return;
    if (startDate > endDate) return;
    if (selectedDetails.length === 0) return;

    setSubmitting(true);
    try {
      const res = await productionPlanApi.createWithDetails({
        startDate,
        endDate,
        machineNo,
        category,
        customerNm: order.customerNm || '',
        siteNm: order.siteNm || '',
        siteCd: order.siteCd || '',
        remarks: remarks || null,
        workRequestNo: order.orderNo,
        details: selectedDetails.map(d => ({
          detailId: d.id,
          assignedQuantity: d.quantity || 0,
        })),
      });
      if (res.success) {
        onSuccess();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerTitleStyle}>
            <Calendar size={16} style={{ color: 'var(--accent)' }} />
            생산계획 등록
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={16} />
          </button>
        </div>

        {/* Order Info */}
        <div style={infoSectionStyle}>
          <InfoRow label="주문번호" value={order.orderNo} />
          <InfoRow label="현장명" value={order.siteNm || '-'} />
          <InfoRow label="거래처" value={order.customerNm || '-'} />
        </div>

        {/* Selected Details Summary */}
        <div style={detailSummarySectionStyle}>
          <div style={detailSummaryHeaderStyle}>
            선택 상세 요약
          </div>
          <div style={detailSummaryRowStyle}>
            <span style={summaryLabel}>선택 건수</span>
            <span style={summaryValue}>{selectedDetails.length}건</span>
          </div>
          <div style={detailSummaryRowStyle}>
            <span style={summaryLabel}>총 수량</span>
            <span style={summaryValue}>{summary.totalQty}EA</span>
          </div>
          <div style={detailSummaryRowStyle}>
            <span style={summaryLabel}>총 면적</span>
            <span style={summaryValue}>{summary.totalArea}M²</span>
          </div>
          {summary.groups.length > 0 && (
            <div style={thicknessGroupStyle}>
              {summary.groups.map(g => (
                <span key={g} style={thicknessTagStyle}>{g}</span>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>
              <Settings size={12} />
              호기
            </label>
            <select
              value={machineNo}
              onChange={(e) => setMachineNo(e.target.value)}
              style={inputStyle}
            >
              {machines.map(m => (
                <option key={m.codeId} value={m.codeName}>{m.codeName}</option>
              ))}
            </select>
          </div>

          <div style={rowStyle}>
            <div style={fieldStyle}>
              <label style={labelStyle}>시작일</label>
              <DatePicker
                selected={parseDate(startDate)}
                onChange={d => setStartDate(formatDateStr(d))}
                placeholder="시작일"
                isClearable={false}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>종료일</label>
              <DatePicker
                selected={parseDate(endDate)}
                onChange={d => setEndDate(formatDateStr(d))}
                placeholder="종료일"
                isClearable={false}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>구분</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={inputStyle}
            >
              <option value="공사">공사</option>
              <option value="소매">소매</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>비고</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="비고를 입력하세요"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Validation */}
        {startDate > endDate && (
          <div style={errorStyle}>종료일은 시작일 이후여야 합니다.</div>
        )}

        {/* Actions */}
        <div style={actionsStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !machineNo || !startDate || !endDate || startDate > endDate || selectedDetails.length === 0}
            style={{
              ...submitBtnStyle,
              ...(submitting ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
            }}
          >
            {submitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRowStyle}>
      <span style={infoLabelStyle}>{label}</span>
      <span style={infoValueStyle}>{value}</span>
    </div>
  );
}

/* ─── Styles ─── */

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: CSSProperties = {
  background: 'var(--panel-solid)',
  borderRadius: 14,
  border: '1px solid var(--border)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  width: 520,
  maxHeight: '90vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px 12px',
  borderBottom: '1px solid var(--border)',
};

const headerTitleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text)',
};

const closeBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  border: 'none',
  borderRadius: 6,
  background: 'transparent',
  cursor: 'pointer',
  color: 'var(--text-tertiary)',
};

const infoSectionStyle: CSSProperties = {
  padding: '12px 20px',
  background: 'var(--panel-2)',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const infoRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const infoLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
  minWidth: 60,
};

const infoValueStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const detailSummarySectionStyle: CSSProperties = {
  padding: '10px 20px',
  background: 'color-mix(in srgb, var(--accent) 4%, var(--panel))',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const detailSummaryHeaderStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: 2,
};

const detailSummaryRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const summaryLabel: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const summaryValue: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const thicknessGroupStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 4,
  marginTop: 4,
};

const thicknessTagStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  padding: '2px 8px',
  borderRadius: 6,
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  color: 'var(--accent)',
};

const formStyle: CSSProperties = {
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
};

const rowStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
};

const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const inputStyle: CSSProperties = {
  fontSize: 13,
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--panel-2)',
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'inherit',
};

const errorStyle: CSSProperties = {
  padding: '0 20px 8px',
  fontSize: 12,
  color: '#ef4444',
  fontWeight: 500,
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '12px 20px 16px',
  borderTop: '1px solid var(--border)',
};

const cancelBtnStyle: CSSProperties = {
  padding: '8px 20px',
  fontSize: 13,
  fontWeight: 600,
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--panel-2)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const submitBtnStyle: CSSProperties = {
  padding: '8px 24px',
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: 'var(--accent)',
  color: 'var(--on-accent)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'opacity 0.15s',
};

export default AssignmentModal;
