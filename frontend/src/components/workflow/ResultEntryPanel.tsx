import { useState, useEffect, useMemo, CSSProperties } from 'react';
import { CheckCircle, Send, AlertTriangle, RotateCcw, ClipboardList } from 'lucide-react';
import { productionResultApi } from '../../services/productionResultApi';
import { DefectModal } from './DefectModal';
import type { WorkOrderWithResult, ProductionResult } from '../../types/productionResult.types';

interface ResultEntryPanelProps {
  workOrder: WorkOrderWithResult;
  productionDate: string;
  onChanged: () => void;
}

export function ResultEntryPanel({ workOrder, productionDate, onChanged }: ResultEntryPanelProps) {
  const [results, setResults] = useState<ProductionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [goodQty, setGoodQty] = useState<string>('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [undoConfirmId, setUndoConfirmId] = useState<number | null>(null);

  const remaining = useMemo(() => {
    const total = workOrder.quantity ?? 0;
    return Math.max(0, total - workOrder.goodQtySum);
  }, [workOrder]);

  const canFullComplete = workOrder.goodQtySum === 0 && remaining > 0;

  useEffect(() => {
    setGoodQty(String(remaining));
    setRemarks('');
    setUndoConfirmId(null);
  }, [workOrder.id, remaining]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productionResultApi.findResults(workOrder.id).then(res => {
      if (cancelled) return;
      if (res.success && res.data) setResults(res.data);
      else setResults([]);
      setLoading(false);
    }).catch(() => { if (!cancelled) { setResults([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [workOrder.id]);

  const refreshResults = () => {
    productionResultApi.findResults(workOrder.id).then(res => {
      if (res.success && res.data) setResults(res.data);
    });
    onChanged();
  };

  const handleFullComplete = async () => {
    setSubmitting(true);
    try {
      const res = await productionResultApi.fullComplete({
        workRequestId: workOrder.id,
        productionDate,
      });
      if (res.success) refreshResults();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const qty = Number(goodQty);
    if (!qty || qty <= 0) return;
    setSubmitting(true);
    try {
      const res = await productionResultApi.createResult({
        workRequestId: workOrder.id,
        productionDate,
        goodQty: qty,
        remarks: remarks || undefined,
      });
      if (res.success) {
        setGoodQty('');
        setRemarks('');
        refreshResults();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const res = await productionResultApi.deleteResult(id);
    if (res.success) {
      setUndoConfirmId(null);
      refreshResults();
    }
  };

  const formatQty = (n: number | null) => n != null ? `${n}EA` : '-';
  const formatArea = (n: number | null) => n != null ? `${Number(n).toFixed(1)}m²` : '-';

  const goodResults = results.filter(r => r.goodQty > 0);
  const defectResults = results.filter(r => r.defectQty > 0);

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerTopStyle}>
          <span style={requestNoStyle}>{workOrder.requestNo}</span>
          <span style={statusBadgeStyle(workOrder.resultStatus)}>
            {workOrder.resultStatus === 'COMPLETED' ? '완료' :
             workOrder.resultStatus === 'PARTIAL' ? '진행중' : '미등록'}
          </span>
        </div>
        <div style={headerMetaStyle}>
          {workOrder.siteNm || '-'} / {workOrder.customerNm || '-'}
        </div>
        <div style={headerSpecStyle}>
          {workOrder.materialNm} {workOrder.thickness && `${workOrder.thickness}mm`}
          <span style={headerQtyStyle}>
            지시: {formatQty(workOrder.quantity)} {formatArea(workOrder.area)}
          </span>
        </div>
        {workOrder.goodQtySum > 0 && (
          <div style={progressInfoStyle}>
            양품: {workOrder.goodQtySum}EA
            {workOrder.defectQtySum > 0 && (
              <span style={{ color: 'var(--error)', marginLeft: 12 }}>
                불량: {workOrder.defectQtySum}EA
              </span>
            )}
            <span style={{ color: 'var(--text-tertiary)', marginLeft: 12 }}>
              잔여: {remaining}EA
            </span>
          </div>
        )}
      </div>

      {/* Entry form */}
      {remaining > 0 && (
        <div style={formStyle}>
          <div style={formTitleStyle}>실적 등록</div>
          <div style={formRowStyle}>
            <label style={formLabelStyle}>양품수량</label>
            <input
              type="number"
              min="0"
              max={remaining}
              value={goodQty}
              onChange={e => setGoodQty(e.target.value)}
              style={formInputStyle}
            />
            <span style={unitLabelStyle}>EA (잔여: {remaining})</span>
          </div>
          <div style={formRowStyle}>
            <label style={formLabelStyle}>비고</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="비고 (선택)"
              style={{ ...formInputStyle, flex: 1 }}
            />
          </div>
          <div style={actionBarStyle}>
            {canFullComplete && (
              <button
                type="button"
                onClick={handleFullComplete}
                disabled={submitting}
                style={{ ...fullCompleteBtnStyle, ...(submitting ? { opacity: 0.6 } : {}) }}
              >
                <CheckCircle size={16} />
                전량완료
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || Number(goodQty) <= 0}
              style={{
                ...submitBtnStyle,
                ...(submitting || Number(goodQty) <= 0 ? { opacity: 0.5 } : {}),
              }}
            >
              <Send size={14} />
              등록
            </button>
            <button
              type="button"
              onClick={() => setShowDefectModal(true)}
              style={defectBtnStyle}
            >
              <AlertTriangle size={14} />
              불량등록
            </button>
          </div>
        </div>
      )}

      {remaining === 0 && workOrder.resultStatus === 'COMPLETED' && (
        <div style={completedBannerStyle}>
          <CheckCircle size={20} />
          전량 완료되었습니다
          <button
            type="button"
            onClick={() => setShowDefectModal(true)}
            style={defectBtnSmallStyle}
          >
            <AlertTriangle size={12} />
            불량등록
          </button>
        </div>
      )}

      {/* Results history */}
      <div style={historyStyle}>
        {loading ? (
          <div style={emptyStyle}>로딩 중...</div>
        ) : results.length === 0 ? (
          <div style={emptyStyle}>
            <ClipboardList size={24} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
            <div style={{ marginTop: 4 }}>등록된 실적이 없습니다</div>
          </div>
        ) : (
          <>
            {goodResults.length > 0 && (
              <>
                <div style={sectionHeaderStyle}>양품 실적 ({goodResults.length}건)</div>
                {goodResults.map(r => (
                  <div key={r.id} style={resultCardStyle}>
                    <div style={resultTopStyle}>
                      <span style={resultNoStyle}>{r.productionNo}</span>
                      <span style={resultQtyStyle}>{r.goodQty}EA</span>
                      <span style={resultAreaStyle}>{Number(r.goodArea).toFixed(1)}m²</span>
                    </div>
                    <div style={resultActionsStyle}>
                      {undoConfirmId === r.id ? (
                        <>
                          <span style={{ fontSize: 11, color: 'var(--error)' }}>삭제?</span>
                          <button type="button" onClick={() => handleDelete(r.id)} style={confirmYesStyle}>확인</button>
                          <button type="button" onClick={() => setUndoConfirmId(null)} style={confirmNoStyle}>취소</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setUndoConfirmId(r.id)} style={undoBtnStyle}>
                          <RotateCcw size={12} /> 되돌리기
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
            {defectResults.length > 0 && (
              <>
                <div style={{ ...sectionHeaderStyle, color: 'var(--error)' }}>
                  불량 이력 ({defectResults.length}건)
                </div>
                {defectResults.map(r => (
                  <div key={r.id} style={{ ...resultCardStyle, borderLeft: '3px solid var(--error)' }}>
                    <div style={resultTopStyle}>
                      <span style={resultNoStyle}>{r.productionNo}</span>
                      <span style={{ ...resultQtyStyle, color: 'var(--error)' }}>{r.defectQty}EA</span>
                      <span style={resultAreaStyle}>{Number(r.defectArea).toFixed(1)}m²</span>
                    </div>
                    {r.defectReason && (
                      <div style={defectReasonStyle}>{r.defectReason}</div>
                    )}
                    <div style={resultActionsStyle}>
                      {undoConfirmId === r.id ? (
                        <>
                          <span style={{ fontSize: 11, color: 'var(--error)' }}>삭제?</span>
                          <button type="button" onClick={() => handleDelete(r.id)} style={confirmYesStyle}>확인</button>
                          <button type="button" onClick={() => setUndoConfirmId(null)} style={confirmNoStyle}>취소</button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setUndoConfirmId(r.id)} style={undoBtnStyle}>
                          <RotateCcw size={12} /> 되돌리기
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      {showDefectModal && (
        <DefectModal
          workOrder={workOrder}
          productionDate={productionDate}
          onClose={() => setShowDefectModal(false)}
          onRegistered={refreshResults}
        />
      )}
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%' };

const headerStyle: CSSProperties = {
  padding: '16px 20px 12px',
  borderBottom: '1px solid var(--border)',
};

const headerTopStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

const requestNoStyle: CSSProperties = {
  fontSize: 15, fontWeight: 700, color: 'var(--accent)',
};

const statusBadgeStyle = (status: string): CSSProperties => ({
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 10px',
  borderRadius: 6,
  background: status === 'COMPLETED' ? 'color-mix(in srgb, var(--success) 12%, transparent)'
    : status === 'PARTIAL' ? 'color-mix(in srgb, var(--warning) 12%, transparent)'
    : 'color-mix(in srgb, var(--text-tertiary) 10%, transparent)',
  color: status === 'COMPLETED' ? 'var(--success)'
    : status === 'PARTIAL' ? 'var(--warning)'
    : 'var(--text-tertiary)',
});

const headerMetaStyle: CSSProperties = {
  fontSize: 12, color: 'var(--text-secondary)', marginTop: 4,
};

const headerSpecStyle: CSSProperties = {
  fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2,
  display: 'flex', alignItems: 'center', gap: 8,
};

const headerQtyStyle: CSSProperties = {
  marginLeft: 'auto', fontWeight: 600, color: 'var(--text)',
};

const progressInfoStyle: CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--success)', marginTop: 6,
};

const formStyle: CSSProperties = {
  padding: '14px 20px',
  borderBottom: '1px solid var(--border)',
  background: 'color-mix(in srgb, var(--accent) 2%, var(--panel))',
};

const formTitleStyle: CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10,
};

const formRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
};

const formLabelStyle: CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 60,
};

const formInputStyle: CSSProperties = {
  fontSize: 14, padding: '8px 12px', border: '1px solid var(--border)',
  borderRadius: 8, background: 'var(--panel-2)', color: 'var(--text)',
  fontFamily: 'inherit', minHeight: 44, width: 120,
};

const unitLabelStyle: CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)',
};

const actionBarStyle: CSSProperties = {
  display: 'flex', gap: 8, marginTop: 4,
};

const fullCompleteBtnStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '10px 20px', fontSize: 14, fontWeight: 700,
  border: 'none', borderRadius: 10,
  background: 'var(--success)', color: '#fff',
  cursor: 'pointer', minHeight: 48,
};

const submitBtnStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '10px 20px', fontSize: 13, fontWeight: 600,
  border: 'none', borderRadius: 8,
  background: 'var(--accent)', color: 'var(--on-accent)',
  cursor: 'pointer', minHeight: 44,
};

const defectBtnStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '10px 16px', fontSize: 13, fontWeight: 600,
  border: '1.5px solid var(--error)', borderRadius: 8,
  background: 'transparent', color: 'var(--error)',
  cursor: 'pointer', minHeight: 44, marginLeft: 'auto',
};

const completedBannerStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '14px 20px', fontSize: 14, fontWeight: 700,
  color: 'var(--success)', background: 'color-mix(in srgb, var(--success) 6%, var(--panel))',
  borderBottom: '1px solid var(--border)',
};

const defectBtnSmallStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 4,
  padding: '4px 10px', fontSize: 11, fontWeight: 600,
  border: '1px solid var(--error)', borderRadius: 6,
  background: 'transparent', color: 'var(--error)',
  cursor: 'pointer', marginLeft: 'auto',
};

const historyStyle: CSSProperties = {
  flex: 1, overflowY: 'auto', padding: '8px 0',
};

const emptyStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', padding: '40px 20px',
  fontSize: 13, color: 'var(--text-tertiary)',
};

const sectionHeaderStyle: CSSProperties = {
  padding: '8px 20px 4px', fontSize: 12, fontWeight: 700, color: 'var(--success)',
};

const resultCardStyle: CSSProperties = {
  margin: '0 16px 6px', padding: '8px 12px',
  borderRadius: 8, background: 'var(--panel-2)',
  border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
};

const resultTopStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 10,
};

const resultNoStyle: CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'monospace',
};

const resultQtyStyle: CSSProperties = {
  fontSize: 13, fontWeight: 700, color: 'var(--text)',
};

const resultAreaStyle: CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)',
};

const defectReasonStyle: CSSProperties = {
  fontSize: 11, color: 'var(--error)', marginTop: 2, fontWeight: 500,
};

const resultActionsStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
};

const undoBtnStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 4,
  padding: '2px 8px', fontSize: 11, fontWeight: 500,
  border: '1px solid var(--border)', borderRadius: 4,
  background: 'transparent', color: 'var(--text-tertiary)',
  cursor: 'pointer',
};

const confirmYesStyle: CSSProperties = {
  padding: '2px 8px', fontSize: 11, fontWeight: 600,
  border: 'none', borderRadius: 4,
  background: 'var(--error)', color: '#fff', cursor: 'pointer',
};

const confirmNoStyle: CSSProperties = {
  padding: '2px 8px', fontSize: 11, fontWeight: 500,
  border: '1px solid var(--border)', borderRadius: 4,
  background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer',
};

export default ResultEntryPanel;
