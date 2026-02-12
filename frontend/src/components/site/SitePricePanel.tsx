/**
 * SitePricePanel - 현장 단가 탭 콘텐츠
 *
 * AG Grid(목록) + 하단 폼(상세) 구조
 * 신규/수정/삭제 CRUD 지원
 */

import { useState, useEffect, useCallback, useRef, useMemo, CSSProperties } from 'react';
import {
  Receipt, Plus, Pencil, Trash2, Save, X, AlertTriangle,
} from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { sitePriceApi } from '../../services/siteApi';
import type { SiteMaster, SitePrice, SitePriceCreateRequest } from '../../types/site.types';

type FormMode = 'view' | 'edit' | 'create';

interface SitePricePanelProps {
  selectedSite: SiteMaster | null;
  onPriceCountChange?: (count: number) => void;
}

const EMPTY_FORM: SitePriceCreateRequest = {
  siteCd: '', siteNm: '', customerNm: '', customerCd: '',
  materialCd: '', materialNm: '', spec: '', remark: '',
  bidPrice: null, procPrice: null, processingCost: null,
  argonCost: null, insulCost: null, structCost: null, edgeCost: null,
  etchingCost: null, stepCost: null, deformCost: null,
  temper1Cost: null, temper2Cost: null, temper3Cost: null,
  totalProcessingCost: null,
};

const COST_FIELDS = [
  { key: 'bidPrice', label: '입찰가' },
  { key: 'procPrice', label: '가공가' },
  { key: 'processingCost', label: '가공비' },
  { key: 'argonCost', label: '아르곤' },
  { key: 'insulCost', label: '단열' },
  { key: 'structCost', label: '접합' },
  { key: 'edgeCost', label: '면취' },
  { key: 'etchingCost', label: '식각' },
  { key: 'stepCost', label: '단차' },
  { key: 'deformCost', label: '이형' },
  { key: 'temper1Cost', label: '강화1' },
  { key: 'temper2Cost', label: '강화2' },
  { key: 'temper3Cost', label: '강화3' },
] as const;

export function SitePricePanel({ selectedSite, onPriceCountChange }: SitePricePanelProps) {
  const [prices, setPrices] = useState<SitePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<SitePrice | null>(null);
  const [mode, setMode] = useState<FormMode>('view');
  const [form, setForm] = useState<SitePriceCreateRequest>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const gridRef = useRef<AgGridReact>(null);

  // 데이터 조회
  const fetchPrices = useCallback(async () => {
    if (!selectedSite?.siteCd) { setPrices([]); return; }
    setLoading(true);
    try {
      const res = await sitePriceApi.findBySiteCd(selectedSite.siteCd);
      if (res.success && res.data) setPrices(res.data);
    } catch { /* 무시 */ } finally { setLoading(false); }
  }, [selectedSite?.siteCd]);

  useEffect(() => {
    fetchPrices();
    setSelectedPrice(null);
    setMode('view');
    setForm(EMPTY_FORM);
    setSaveMessage(null);
  }, [fetchPrices]);

  // 건수 콜백
  useEffect(() => {
    onPriceCountChange?.(prices.length);
  }, [prices.length, onPriceCountChange]);

  // 메시지 자동 숨김
  useEffect(() => {
    if (saveMessage) {
      timerRef.current = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [saveMessage]);

  // 그리드 행 선택
  const handleRowSelected = useCallback((event: { data?: SitePrice }) => {
    if (mode !== 'view' || !event.data) return;
    const row = event.data;
    setSelectedPrice(row);
    setForm({
      siteCd: row.siteCd, siteNm: row.siteNm ?? '', customerNm: row.customerNm ?? '',
      customerCd: row.customerCd ?? '', materialCd: row.materialCd ?? '',
      materialNm: row.materialNm ?? '', spec: row.spec, remark: row.remark ?? '',
      bidPrice: row.bidPrice, procPrice: row.procPrice, processingCost: row.processingCost,
      argonCost: row.argonCost, insulCost: row.insulCost, structCost: row.structCost,
      edgeCost: row.edgeCost, etchingCost: row.etchingCost, stepCost: row.stepCost,
      deformCost: row.deformCost, temper1Cost: row.temper1Cost, temper2Cost: row.temper2Cost,
      temper3Cost: row.temper3Cost, totalProcessingCost: row.totalProcessingCost,
    });
  }, [mode]);

  const handleChange = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleNumChange = useCallback((field: string, value: string) => {
    const num = value === '' ? null : Number(value);
    setForm(prev => ({ ...prev, [field]: num }));
  }, []);

  const handleCreate = useCallback(() => {
    if (!selectedSite) return;
    setSelectedPrice(null);
    setForm({ ...EMPTY_FORM, siteCd: selectedSite.siteCd, siteNm: selectedSite.siteNm });
    setSaveMessage(null);
    setMode('create');
  }, [selectedSite]);

  const handleEdit = useCallback(() => {
    if (!selectedPrice) return;
    setSaveMessage(null);
    setMode('edit');
  }, [selectedPrice]);

  const handleCancel = useCallback(() => {
    if (selectedPrice) {
      handleRowSelected({ data: selectedPrice });
    } else {
      setForm(EMPTY_FORM);
    }
    setSaveMessage(null);
    setMode('view');
  }, [selectedPrice, handleRowSelected]);

  // 합계 자동 계산
  const calcTotal = useCallback((f: SitePriceCreateRequest): number | null => {
    const costs = [
      f.processingCost, f.argonCost, f.insulCost, f.structCost, f.edgeCost,
      f.etchingCost, f.stepCost, f.deformCost, f.temper1Cost, f.temper2Cost, f.temper3Cost,
    ];
    const sum = costs.reduce((acc: number, v) => acc + (v ?? 0), 0);
    return sum === 0 ? null : sum;
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.materialNm.trim()) {
      setSaveMessage({ type: 'error', text: '품목명은 필수입니다.' });
      return;
    }
    setSaving(true);
    setSaveMessage(null);
    const data = { ...form, totalProcessingCost: calcTotal(form) };

    try {
      if (mode === 'create') {
        const res = await sitePriceApi.create(data);
        if (res.success) {
          setSaveMessage({ type: 'success', text: '단가가 등록되었습니다.' });
          setMode('view');
          fetchPrices();
        } else {
          setSaveMessage({ type: 'error', text: res.message ?? '등록 실패' });
        }
      } else if (mode === 'edit' && selectedPrice) {
        const res = await sitePriceApi.update(selectedPrice.id, data);
        if (res.success) {
          setSaveMessage({ type: 'success', text: '단가가 수정되었습니다.' });
          setMode('view');
          fetchPrices();
        } else {
          setSaveMessage({ type: 'error', text: res.message ?? '수정 실패' });
        }
      }
    } catch {
      setSaveMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }
  }, [mode, form, selectedPrice, calcTotal, fetchPrices]);

  const handleDelete = useCallback(async () => {
    if (!selectedPrice) return;
    setDeleting(true);
    try {
      const res = await sitePriceApi.delete(selectedPrice.id);
      if (res.success) {
        setDeleteConfirmOpen(false);
        setSelectedPrice(null);
        setForm(EMPTY_FORM);
        setMode('view');
        fetchPrices();
      } else {
        setSaveMessage({ type: 'error', text: res.message ?? '삭제 실패' });
        setDeleteConfirmOpen(false);
      }
    } catch {
      setSaveMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }, [selectedPrice, fetchPrices]);

  const isEditing = mode === 'edit' || mode === 'create';

  // AG Grid 컬럼 정의
  const columnDefs = useMemo<ColDef<SitePrice>[]>(() => [
    { headerName: '품목', field: 'materialNm', flex: 2, minWidth: 180 },
    { headerName: '비고', field: 'remark', width: 90 },
    { headerName: '입찰가', field: 'bidPrice', width: 90, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '가공가', field: 'procPrice', width: 90, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '가공비', field: 'processingCost', width: 80, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '아르곤', field: 'argonCost', width: 75, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단열', field: 'insulCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '접합', field: 'structCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '면취', field: 'edgeCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '식각', field: 'etchingCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단차', field: 'stepCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '이형', field: 'deformCost', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화1', field: 'temper1Cost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화2', field: 'temper2Cost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화3', field: 'temper3Cost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '합계', field: 'totalProcessingCost', width: 90, type: 'rightAligned', valueFormatter: numFmt },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  if (!selectedSite) {
    return <div style={emptyStyle}>현장을 선택하면 현장 단가가 표시됩니다.</div>;
  }

  return (
    <div style={containerStyle}>
      {/* 툴바 */}
      <div style={toolbarStyle}>
        <div style={toolbarLeftStyle}>
          <Receipt size={14} style={{ color: 'var(--accent)' }} />
          <span style={toolbarTitleStyle}>
            {mode === 'create' ? '단가 신규 등록' : '현장 단가'}
          </span>
          <span style={badgeStyle}>{prices.length}건</span>
        </div>
        <div style={toolbarRightStyle}>
          {saveMessage && (
            <span style={{
              fontSize: 12, fontWeight: 500, marginRight: 8,
              color: saveMessage.type === 'success' ? 'var(--success, #34c759)' : 'var(--error, #ff453a)',
            }}>{saveMessage.text}</span>
          )}
          {isEditing ? (
            <>
              <button type="button" style={cancelBtnStyle} onClick={handleCancel} disabled={saving}>
                <X size={13} /> 취소
              </button>
              <button type="button" style={saveBtnStyle} onClick={handleSave} disabled={saving}>
                <Save size={13} /> {saving ? '저장 중...' : '저장'}
              </button>
            </>
          ) : (
            <>
              <button type="button" style={toolBtnStyle} onClick={handleCreate}>
                <Plus size={13} /> 신규
              </button>
              <button type="button" style={toolBtnStyle} onClick={handleEdit} disabled={!selectedPrice}>
                <Pencil size={13} /> 수정
              </button>
              <button type="button" style={deleteBtnStyle}
                onClick={() => setDeleteConfirmOpen(true)} disabled={!selectedPrice}>
                <Trash2 size={13} /> 삭제
              </button>
            </>
          )}
        </div>
      </div>

      {/* AG Grid */}
      <div className="ag-theme-quartz" style={{ width: '100%', flex: 1, minHeight: 150 }}>
        {loading ? (
          <div style={{ padding: 20, color: 'var(--text-tertiary)', fontSize: 13 }}>로딩 중...</div>
        ) : (
          <AgGridReact<SitePrice>
            ref={gridRef}
            rowData={prices}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="single"
            domLayout="autoHeight"
            suppressCellFocus
            getRowId={(params) => String(params.data.id)}
            onRowClicked={handleRowSelected}
          />
        )}
      </div>

      {/* 상세 폼 */}
      {(selectedPrice || isEditing) && (
        <div style={formSectionStyle}>
          <div style={formGridStyle}>
            {/* 1행: 품목 정보 */}
            <FormField label="품목코드" value={form.materialCd}
              editing={isEditing} onChange={(v) => handleChange('materialCd', v)} />
            <FormField label="품목명" value={form.materialNm} required
              editing={isEditing} wide onChange={(v) => handleChange('materialNm', v)} />
            <FormField label="비고" value={form.remark}
              editing={isEditing} onChange={(v) => handleChange('remark', v)} />

            {/* 2행: 단가 */}
            {COST_FIELDS.map(({ key, label }) => (
              <NumField key={key} label={label}
                value={form[key as keyof SitePriceCreateRequest] as number | null}
                editing={isEditing} onChange={(v) => handleNumChange(key, v)} />
            ))}

            {/* 합계 (자동 계산) */}
            <NumField label="합계" value={calcTotal(form)} editing={false} />
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {deleteConfirmOpen && (
        <div style={overlayStyle} onClick={() => !deleting && setDeleteConfirmOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={24} style={{ color: 'var(--error, #ff453a)' }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '12px 0 8px' }}>단가 삭제</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              선택한 단가를 삭제하시겠습니까?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button type="button" style={modalCancelBtnStyle}
                onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>취소</button>
              <button type="button" style={modalDeleteBtnStyle}
                onClick={handleDelete} disabled={deleting}>
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── 내부 컴포넌트 ─── */

function FormField({ label, value, required, editing, wide, onChange }: {
  label: string; value: string; required?: boolean; editing?: boolean;
  wide?: boolean; onChange?: (v: string) => void;
}) {
  return (
    <div style={{ ...fieldStyle, gridColumn: wide ? 'span 2' : 'span 1' }}>
      <label style={fieldLabelStyle}>
        {label}
        {required && <span style={{ color: 'var(--error, #ff453a)', marginLeft: 2 }}>*</span>}
      </label>
      {editing ? (
        <input type="text" style={inputStyle} value={value}
          onChange={(e) => onChange?.(e.target.value)} />
      ) : (
        <div style={readonlyStyle}>{value || '-'}</div>
      )}
    </div>
  );
}

function NumField({ label, value, editing, onChange }: {
  label: string; value: number | null; editing?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div style={fieldStyle}>
      <label style={fieldLabelStyle}>{label}</label>
      {editing ? (
        <input type="number" style={{ ...inputStyle, textAlign: 'right' }}
          value={value ?? ''} onChange={(e) => onChange?.(e.target.value)} />
      ) : (
        <div style={{ ...readonlyStyle, textAlign: 'right' }}>
          {value != null && value !== 0 ? value.toLocaleString() : '-'}
        </div>
      )}
    </div>
  );
}

function numFmt(params: { value: number | null }) {
  if (params.value == null || params.value === 0) return '-';
  return params.value.toLocaleString();
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = { display: 'flex', flexDirection: 'column', height: '100%' };

const emptyStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  height: '100%', fontSize: 13, color: 'var(--text-tertiary)', padding: 20,
};

const toolbarStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '8px 16px', borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)', flexShrink: 0,
};

const toolbarLeftStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 };
const toolbarTitleStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text)' };
const badgeStyle: CSSProperties = {
  fontSize: 11, fontWeight: 500, padding: '1px 8px', borderRadius: 10,
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)',
};
const toolbarRightStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 };

const toolBtnStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '4px 12px', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', background: 'var(--panel)',
  border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer',
};

const deleteBtnStyle: CSSProperties = {
  ...toolBtnStyle,
  color: 'var(--error, #ff453a)',
  borderColor: 'color-mix(in srgb, var(--error, #ff453a) 30%, transparent)',
};

const saveBtnStyle: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '4px 14px', fontSize: 12, fontWeight: 600,
  color: 'var(--on-accent)', background: 'var(--accent)',
  border: 'none', borderRadius: 6, cursor: 'pointer',
};

const cancelBtnStyle: CSSProperties = { ...toolBtnStyle };

const formSectionStyle: CSSProperties = {
  borderTop: '1px solid var(--border)', padding: '10px 16px',
  background: 'var(--panel)', flexShrink: 0,
};

const formGridStyle: CSSProperties = {
  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px 10px',
};

const fieldStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 2, padding: '2px 0',
};

const fieldLabelStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 4,
  fontSize: 10, fontWeight: 500, color: 'var(--text-tertiary)',
};

const inputStyle: CSSProperties = {
  fontSize: 12, fontWeight: 500, color: 'var(--text)',
  padding: '4px 8px', borderRadius: 4,
  border: '1px solid var(--border-input, var(--border))',
  background: 'var(--input-bg, var(--panel))',
  minHeight: 26, outline: 'none', fontFamily: 'inherit',
};

const readonlyStyle: CSSProperties = {
  fontSize: 12, fontWeight: 500, color: 'var(--text)',
  padding: '4px 8px', borderRadius: 4, background: 'var(--panel-2)',
  minHeight: 26, display: 'flex', alignItems: 'center',
};

const overlayStyle: CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(4px)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};

const modalStyle: CSSProperties = {
  background: 'var(--panel-solid, #fff)', borderRadius: 16,
  padding: '28px 32px 24px', maxWidth: 340, width: '90%',
  textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

const modalCancelBtnStyle: CSSProperties = {
  flex: 1, padding: '8px 16px', fontSize: 13, fontWeight: 500,
  color: 'var(--text-secondary)', background: 'var(--panel-2)',
  border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer',
};

const modalDeleteBtnStyle: CSSProperties = {
  flex: 1, padding: '8px 16px', fontSize: 13, fontWeight: 600,
  color: '#fff', background: 'var(--error, #ff453a)',
  border: 'none', borderRadius: 10, cursor: 'pointer',
};

export default SitePricePanel;
