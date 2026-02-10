import { useState, useEffect, CSSProperties } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { productionResultApi } from '../../services/productionResultApi';
import type { WorkOrderWithResult } from '../../types/productionResult.types';

interface DefectModalProps {
  workOrder: WorkOrderWithResult;
  productionDate: string;
  onClose: () => void;
  onRegistered: () => void;
}

interface DefectCode {
  codeId: string;
  codeName: string;
}

const DEFECT_REASONS: DefectCode[] = [
  { codeId: 'SCRATCH', codeName: '스크래치' },
  { codeId: 'CRACK', codeName: '파손/크랙' },
  { codeId: 'SIZE_ERROR', codeName: '치수불량' },
  { codeId: 'BUBBLE', codeName: '기포' },
  { codeId: 'COATING', codeName: '코팅불량' },
  { codeId: 'EDGE', codeName: '가장자리불량' },
  { codeId: 'MATERIAL', codeName: '원자재불량' },
  { codeId: 'OTHER', codeName: '기타' },
];

export function DefectModal({ workOrder, productionDate, onClose, onRegistered }: DefectModalProps) {
  const [defectQty, setDefectQty] = useState<string>('');
  const [reasonCode, setReasonCode] = useState('');
  const [detailReason, setDetailReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    const qty = Number(defectQty);
    if (!qty || qty <= 0) { setError('불량수량을 입력하세요.'); return; }
    if (!reasonCode) { setError('불량사유를 선택하세요.'); return; }

    const reasonLabel = DEFECT_REASONS.find(r => r.codeId === reasonCode)?.codeName ?? reasonCode;
    const fullReason = detailReason ? `${reasonLabel}: ${detailReason}` : reasonLabel;

    setSubmitting(true);
    setError('');
    try {
      const res = await productionResultApi.createResult({
        workRequestId: workOrder.id,
        productionDate,
        goodQty: 0,
        defectQty: qty,
        defectReason: fullReason,
        remarks: remarks || undefined,
      });
      if (res.success) {
        onRegistered();
        onClose();
      } else {
        setError(res.message || '등록 실패');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={headerTitleStyle}>
            <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
            불량 등록
          </div>
          <button type="button" onClick={onClose} style={closeBtnStyle}>
            <X size={18} />
          </button>
        </div>

        {/* Work order info */}
        <div style={infoStyle}>
          <span style={infoLabelStyle}>{workOrder.requestNo}</span>
          <span style={infoValueStyle}>
            {workOrder.materialNm} {workOrder.thickness && `${workOrder.thickness}mm`}
          </span>
        </div>

        {/* Form */}
        <div style={formStyle}>
          <label style={labelStyle}>불량수량 (EA)</label>
          <input
            type="number"
            min="1"
            value={defectQty}
            onChange={e => setDefectQty(e.target.value)}
            placeholder="불량 수량 입력"
            style={inputStyle}
            autoFocus
          />

          <label style={labelStyle}>불량사유</label>
          <select
            value={reasonCode}
            onChange={e => setReasonCode(e.target.value)}
            style={selectStyle}
          >
            <option value="">-- 사유 선택 --</option>
            {DEFECT_REASONS.map(r => (
              <option key={r.codeId} value={r.codeId}>{r.codeName}</option>
            ))}
          </select>

          <label style={labelStyle}>상세 사유</label>
          <input
            type="text"
            value={detailReason}
            onChange={e => setDetailReason(e.target.value)}
            placeholder="상세 내용 입력 (선택)"
            style={inputStyle}
          />

          <label style={labelStyle}>비고</label>
          <input
            type="text"
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder="비고 (선택)"
            style={inputStyle}
          />
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        {/* Actions */}
        <div style={actionsStyle}>
          <button type="button" onClick={onClose} style={cancelBtnStyle}>취소</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ ...submitBtnStyle, ...(submitting ? { opacity: 0.6 } : {}) }}
          >
            {submitting ? '등록 중...' : '불량 등록'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: CSSProperties = {
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  width: 420,
  maxWidth: '90vw',
  boxShadow: 'var(--shadow-lg)',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
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
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-tertiary)',
  padding: 4,
  borderRadius: 6,
};

const infoStyle: CSSProperties = {
  padding: '12px 20px',
  background: 'var(--panel-2)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const infoLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--accent)',
};

const infoValueStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const formStyle: CSSProperties = {
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginTop: 4,
};

const inputStyle: CSSProperties = {
  fontSize: 14,
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--panel-2)',
  color: 'var(--text)',
  fontFamily: 'inherit',
  minHeight: 44,
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

const errorStyle: CSSProperties = {
  padding: '0 20px 8px',
  fontSize: 12,
  color: 'var(--error)',
  fontWeight: 600,
};

const actionsStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  padding: '12px 20px 16px',
  borderTop: '1px solid var(--border)',
};

const cancelBtnStyle: CSSProperties = {
  padding: '10px 20px',
  fontSize: 13,
  fontWeight: 600,
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--panel)',
  color: 'var(--text)',
  cursor: 'pointer',
  minHeight: 44,
};

const submitBtnStyle: CSSProperties = {
  padding: '10px 24px',
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: 'var(--error)',
  color: '#fff',
  cursor: 'pointer',
  minHeight: 44,
};

export default DefectModal;
