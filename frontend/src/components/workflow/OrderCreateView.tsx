/**
 * OrderCreateView - 주문 등록/수정 화면
 *
 * 상단: 접이식 헤더 폼 (주문일자, 납기일, 거래처, 현장 등)
 * 하단: AG Grid 인라인 편집 디테일 그리드
 * 하단 바: 합계 + 저장/취소 버튼
 */

import { useState, useMemo, useCallback, useEffect, useRef, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, CellValueChangedEvent } from 'ag-grid-community';
import {
  ChevronDown, ChevronUp, Save, X, Plus, Trash2, AlertTriangle,
} from 'lucide-react';
import { DatePicker } from '../common/DatePicker';
import { salesOrderApi } from '../../services/siteApi';
import type {
  SalesOrderHeader, SalesOrderDetail, SalesOrderCreateRequest,
  SalesOrderDetailItem, SiteMaster,
} from '../../types/site.types';

/** 편집 가능한 디테일 행 (id는 임시) */
interface EditableDetail extends SalesOrderDetailItem {
  _tempId: number;
}

let _tempIdSeq = 1;
function newRow(): EditableDetail {
  return {
    _tempId: _tempIdSeq++,
    materialCd: '',
    materialNm: '',
    productCategory: '',
    width: undefined,
    height: undefined,
    thickness: undefined,
    unitType: '',
    quantity: 1,
    area: undefined,
    unit: 'M2',
    unitPrice: undefined,
    amount: undefined,
    dong: '',
    ho: '',
    floor: '',
    windowType: '',
    locationDetail: '',
    deliveryDate: '',
    remarks: '',
  };
}

interface OrderCreateViewProps {
  /** 수정 대상 (null이면 신규 등록) */
  editOrder?: SalesOrderHeader | null;
  /** 현장 선택 정보 */
  site?: SiteMaster | null;
  /** 저장 완료 후 콜백 */
  onSaved: (order: SalesOrderHeader) => void;
  /** 취소 콜백 */
  onCancel: () => void;
}

export function OrderCreateView({ editOrder, site, onSaved, onCancel }: OrderCreateViewProps) {
  const isEditMode = !!editOrder;
  const gridRef = useRef<AgGridReact>(null);

  // 헤더 폼 접기/펴기
  const [headerOpen, setHeaderOpen] = useState(true);

  // 헤더 필드들
  const [orderNo, setOrderNo] = useState('');
  const [orderDate, setOrderDate] = useState(todayStr());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customerCd, setCustomerCd] = useState('');
  const [orderType, setOrderType] = useState('PROJECT');
  const [siteNm, setSiteNm] = useState('');
  const [siteCd, setSiteCd] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [taxSeparate, setTaxSeparate] = useState(false);
  const [duoLight, setDuoLight] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // 디테일 행
  const [rows, setRows] = useState<EditableDetail[]>([newRow()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기화: 신규 주문번호 or 수정 데이터
  useEffect(() => {
    if (isEditMode && editOrder) {
      setOrderNo(editOrder.orderNo);
      setOrderDate(editOrder.orderDate || todayStr());
      setDeliveryDate(editOrder.deliveryDate || '');
      setCustomerCd(editOrder.customerCd || '');
      setOrderType(editOrder.orderType || 'PROJECT');
      setSiteNm(editOrder.siteNm || '');
      setSiteCd(editOrder.siteCd || '');
      setSiteAddress(editOrder.siteAddress || '');
      setTaxSeparate(editOrder.taxSeparate || false);
      setDuoLight(editOrder.duoLight || '');
      setRemarks(editOrder.remarks || '');
      setIsUrgent(editOrder.isUrgent || false);

      // 기존 디테일 로드
      salesOrderApi.findDetailsByHeaderId(editOrder.id).then(res => {
        if (res.success && res.data && res.data.length > 0) {
          setRows(res.data.map(d => detailToEditable(d)));
        } else {
          setRows([newRow()]);
        }
      });
    } else {
      // 신규: 주문번호 생성
      salesOrderApi.nextOrderNo().then(res => {
        if (res.success && res.data) setOrderNo(res.data);
      });
      // 현장 정보 반영
      if (site) {
        setSiteNm(site.siteNm || '');
        setSiteCd(site.siteCd || '');
        setSiteAddress(site.address || '');
        setCustomerCd(site.bpCd || '');
      }
    }
  }, [isEditMode, editOrder, site]);

  // 합계 계산
  const totalAmount = useMemo(() => {
    return rows.reduce((sum, r) => sum + (r.amount || 0), 0);
  }, [rows]);

  const totalQty = useMemo(() => {
    return rows.reduce((sum, r) => sum + (r.quantity || 0), 0);
  }, [rows]);

  // 행 추가
  const addRow = useCallback(() => {
    setRows(prev => [...prev, newRow()]);
  }, []);

  // 행 삭제
  const deleteSelectedRows = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;
    const selectedNodes = api.getSelectedNodes();
    if (selectedNodes.length === 0) return;
    const selectedIds = new Set(selectedNodes.map(n => (n.data as EditableDetail)._tempId));
    setRows(prev => {
      const filtered = prev.filter(r => !selectedIds.has(r._tempId));
      return filtered.length > 0 ? filtered : [newRow()];
    });
  }, []);

  // 셀 값 변경 시 자동 계산
  const onCellValueChanged = useCallback((event: CellValueChangedEvent<EditableDetail>) => {
    const { data, colDef } = event;
    if (!data) return;
    const field = colDef.field as string;

    // 면적 자동 계산: width * height / 1000000
    if (field === 'width' || field === 'height' || field === 'quantity') {
      const w = data.width || 0;
      const h = data.height || 0;
      const qty = data.quantity || 0;
      const area = (w * h) / 1000000;
      data.area = Math.round(area * 10000) / 10000;

      // 금액 = 면적 * 단가 * 수량
      if (data.unitPrice) {
        data.amount = Math.round(data.area * data.unitPrice * qty);
      }
    }

    // 단가 변경 시 금액 재계산
    if (field === 'unitPrice') {
      const area = data.area || 0;
      const qty = data.quantity || 0;
      data.amount = Math.round(area * (data.unitPrice || 0) * qty);
    }

    // 금액 직접 변경은 그대로 유지

    setRows(prev => prev.map(r => r._tempId === data._tempId ? { ...data } : r));

    // AG Grid 셀 새로고침
    const api = gridRef.current?.api;
    if (api) {
      api.refreshCells({ rowNodes: [event.node], force: true });
    }
  }, []);

  // 저장
  const handleSave = useCallback(async () => {
    setError(null);

    // 유효성 검증
    if (!orderDate) { setError('주문일자를 입력하세요.'); return; }
    if (!customerCd) { setError('거래처코드를 입력하세요.'); return; }

    // 빈 행 필터링 (materialCd가 있는 행만)
    const validRows = rows.filter(r => r.materialCd && r.materialCd.trim() !== '');
    if (validRows.length === 0) { setError('최소 1건 이상의 품목을 입력하세요.'); return; }

    const request: SalesOrderCreateRequest = {
      orderDate,
      deliveryDate: deliveryDate || undefined,
      customerCd,
      orderType: orderType || undefined,
      siteCd: siteCd || undefined,
      siteNm: siteNm || undefined,
      siteAddress: siteAddress || undefined,
      taxSeparate,
      duoLight: duoLight || undefined,
      remarks: remarks || undefined,
      isUrgent,
      details: validRows.map(r => ({
        materialCd: r.materialCd,
        materialNm: r.materialNm,
        productCategory: r.productCategory,
        width: r.width,
        height: r.height,
        thickness: r.thickness,
        unitType: r.unitType,
        quantity: r.quantity || 1,
        area: r.area,
        unit: r.unit,
        unitPrice: r.unitPrice,
        amount: r.amount,
        dong: r.dong,
        ho: r.ho,
        floor: r.floor,
        windowType: r.windowType,
        locationDetail: r.locationDetail,
        deliveryDate: r.deliveryDate,
        remarks: r.remarks,
      })),
    };

    setSaving(true);
    try {
      const res = isEditMode
        ? await salesOrderApi.update(editOrder!.id, request)
        : await salesOrderApi.create(request);

      if (res.success && res.data) {
        onSaved(res.data);
      } else {
        setError(res.message || '저장에 실패했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  }, [orderDate, deliveryDate, customerCd, orderType, siteCd, siteNm, siteAddress, taxSeparate, duoLight, remarks, isUrgent, rows, isEditMode, editOrder, onSaved]);

  // 디테일 컬럼 정의 (인라인 편집)
  const columnDefs = useMemo<ColDef<EditableDetail>[]>(() => [
    {
      headerName: '', width: 40, checkboxSelection: true,
      headerCheckboxSelection: true, sortable: false, resizable: false,
    },
    { headerName: 'No', valueGetter: 'node.rowIndex + 1', width: 50, sortable: false },
    { headerName: '자재코드', field: 'materialCd', width: 110, editable: true },
    { headerName: '자재명', field: 'materialNm', flex: 2, minWidth: 180, editable: true },
    { headerName: '가로(mm)', field: 'width', width: 90, editable: true, type: 'numericColumn', cellDataType: 'number' },
    { headerName: '세로(mm)', field: 'height', width: 90, editable: true, type: 'numericColumn', cellDataType: 'number' },
    { headerName: '두께', field: 'thickness', width: 70, editable: true, type: 'numericColumn', cellDataType: 'number' },
    { headerName: '수량', field: 'quantity', width: 65, editable: true, type: 'numericColumn', cellDataType: 'number' },
    {
      headerName: '면적(M2)', field: 'area', width: 90, type: 'numericColumn',
      valueFormatter: p => p.value ? Number(p.value).toFixed(4) : '',
    },
    { headerName: '단가', field: 'unitPrice', width: 90, editable: true, type: 'numericColumn', cellDataType: 'number',
      valueFormatter: p => p.value ? Number(p.value).toLocaleString() : '',
    },
    {
      headerName: '금액', field: 'amount', width: 100, type: 'numericColumn',
      valueFormatter: p => p.value ? Number(p.value).toLocaleString() : '',
    },
    { headerName: '동', field: 'dong', width: 70, editable: true },
    { headerName: '호', field: 'ho', width: 70, editable: true },
    { headerName: '층', field: 'floor', width: 60, editable: true },
    { headerName: '창종류', field: 'windowType', width: 90, editable: true },
    { headerName: '비고', field: 'remarks', flex: 1, minWidth: 100, editable: true },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: false,
    resizable: true,
    suppressMovable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={containerStyle}>
      {/* 상단: 헤더 폼 */}
      <div style={headerSectionStyle}>
        <button
          type="button"
          style={headerToggleStyle}
          onClick={() => setHeaderOpen(prev => !prev)}
        >
          <span style={headerTitleStyle}>
            {isEditMode ? `주문 수정 (${orderNo})` : `신규 주문 (${orderNo || '...'})`}
          </span>
          {headerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {headerOpen && (
          <div style={formGridStyle}>
            {/* 1행 */}
            <FormInput label="주문일자" value={orderDate} onChange={setOrderDate} type="date" required />
            <FormInput label="납기일" value={deliveryDate} onChange={setDeliveryDate} type="date" />
            <FormInput label="거래처코드" value={customerCd} onChange={setCustomerCd} required />
            <FormInput label="주문유형" value={orderType} onChange={setOrderType} />
            {/* 2행 */}
            <FormInput label="현장코드" value={siteCd} onChange={setSiteCd} />
            <FormInput label="현장명" value={siteNm} onChange={setSiteNm} wide />
            <FormInput label="현장주소" value={siteAddress} onChange={setSiteAddress} wide />
            {/* 3행 */}
            <FormInput label="복층유리" value={duoLight} onChange={setDuoLight} />
            <FormInput label="비고" value={remarks} onChange={setRemarks} wide />
            <div style={checkboxRowStyle}>
              <label style={checkLabelStyle}>
                <input type="checkbox" checked={taxSeparate} onChange={e => setTaxSeparate(e.target.checked)} />
                별도세금
              </label>
              <label style={checkLabelStyle}>
                <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} />
                긴급
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 디테일 툴바 */}
      <div style={detailToolbarStyle}>
        <span style={detailTitleStyle}>품목 내역</span>
        <div style={detailActionsStyle}>
          <button type="button" style={iconBtnStyle} onClick={addRow} title="행 추가">
            <Plus size={15} />
            행 추가
          </button>
          <button type="button" style={iconBtnDangerStyle} onClick={deleteSelectedRows} title="선택 행 삭제">
            <Trash2 size={14} />
            삭제
          </button>
        </div>
      </div>

      {/* 디테일 AG Grid */}
      <div style={gridWrapperStyle} className="ag-theme-quartz">
        <AgGridReact<EditableDetail>
          ref={gridRef}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          rowSelection="multiple"
          animateRows={false}
          singleClickEdit
          stopEditingWhenCellsLoseFocus
          getRowId={params => String(params.data._tempId)}
        />
      </div>

      {/* 하단 바 */}
      <div style={footerBarStyle}>
        <div style={summaryLeftStyle}>
          <span style={summaryItemStyle}>
            품목 <strong>{rows.filter(r => r.materialCd).length}</strong>건
          </span>
          <span style={summaryDivStyle}>|</span>
          <span style={summaryItemStyle}>
            수량 <strong>{totalQty}</strong>
          </span>
          <span style={summaryDivStyle}>|</span>
          <span style={summaryItemStyle}>
            합계 <strong>{totalAmount.toLocaleString()}</strong> 원
          </span>
        </div>

        {error && (
          <div style={errorStyle}>
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <div style={footerActionsStyle}>
          <button type="button" style={cancelBtnStyle} onClick={onCancel} disabled={saving}>
            <X size={15} />
            취소
          </button>
          <button type="button" style={saveBtnStyle} onClick={handleSave} disabled={saving}>
            <Save size={15} />
            {saving ? '저장 중...' : isEditMode ? '수정' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── FormInput 헬퍼 ─── */

function parseDateStr(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function fmtDate(d: Date | null): string {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function FormInput({ label, value, onChange, type = 'text', required, wide }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <div style={{ ...fieldStyle, ...(wide ? { gridColumn: 'span 2' } : {}) }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>}
      </label>
      {type === 'date' ? (
        <DatePicker
          selected={parseDateStr(value)}
          onChange={d => onChange(fmtDate(d))}
          placeholder={label}
          isClearable={!required}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

/* ─── 유틸 ─── */

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function detailToEditable(d: SalesOrderDetail): EditableDetail {
  return {
    _tempId: _tempIdSeq++,
    materialCd: d.materialCd || '',
    materialNm: d.materialNm || '',
    productCategory: d.productCategory || '',
    width: d.width ?? undefined,
    height: d.height ?? undefined,
    thickness: d.thickness ?? undefined,
    unitType: d.unitType || '',
    quantity: d.quantity || 1,
    area: d.area ?? undefined,
    unit: d.unit || 'M2',
    unitPrice: d.unitPrice ?? undefined,
    amount: d.amount ?? undefined,
    dong: d.dong || '',
    ho: d.ho || '',
    floor: d.floor || '',
    windowType: d.windowType || '',
    locationDetail: d.locationDetail || '',
    deliveryDate: d.deliveryDate || '',
    remarks: d.remarks || '',
  };
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: 0,
};

const headerSectionStyle: CSSProperties = {
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  overflow: 'hidden',
  flexShrink: 0,
};

const headerToggleStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '10px 16px',
  background: 'var(--panel-2)',
  border: 'none',
  borderBottom: '1px solid var(--border)',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const headerTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--text)',
};

const formGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '6px 12px',
  padding: '12px 16px',
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const labelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const inputStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text)',
  padding: '6px 10px',
  borderRadius: 6,
  border: '1px solid var(--border)',
  background: 'var(--panel-2)',
  minHeight: 32,
  fontFamily: 'inherit',
  outline: 'none',
};

const checkboxRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  gap: 16,
  paddingBottom: 4,
};

const checkLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

const detailToolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 4px 6px',
  flexShrink: 0,
};

const detailTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const detailActionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const iconBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const iconBtnDangerStyle: CSSProperties = {
  ...iconBtnStyle,
  color: '#ef4444',
};

const gridWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  borderRadius: 10,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

const footerBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 4px 0',
  flexShrink: 0,
  gap: 12,
};

const summaryLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const summaryItemStyle: CSSProperties = { whiteSpace: 'nowrap' };
const summaryDivStyle: CSSProperties = { color: 'var(--border)' };

const errorStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 5,
  fontSize: 12,
  fontWeight: 500,
  color: '#ef4444',
  flex: 1,
  justifyContent: 'center',
};

const footerActionsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const cancelBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const saveBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 20px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'opacity 0.15s',
};

export default OrderCreateView;
