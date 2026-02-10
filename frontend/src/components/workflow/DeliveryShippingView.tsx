/**
 * DeliveryShippingView - 출고 관리 뷰
 *
 * KPI 요약 카드 + 검색 필터 + 마스터 그리드 + 디테일 패널
 * delivery_header / delivery_detail 테이블 연동
 */

import { useState, useEffect, useMemo, useRef, useCallback, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import {
  Package, Clock, Truck, PackageCheck, CheckCircle2,
  Search, X, ChevronDown, ChevronUp, MapPin, Phone, User,
} from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { DatePicker } from '../common/DatePicker';
import { deliveryApi } from '../../services/deliveryApi';
import type { DeliveryHeader, DeliveryDetail } from '../../types/delivery.types';

/* ─── 날짜 변환 유틸 ─── */

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date | null): string {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ─── 상태 정의 ─── */

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:   { label: '출고대기', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', icon: '⏳' },
  LOADING:   { label: '적재중',   color: '#3b82f6', bg: 'rgba(59,130,246,0.10)',  icon: '📦' },
  SHIPPED:   { label: '출고완료', color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)',  icon: '🚛' },
  DELIVERED: { label: '배송완료', color: '#22c55e', bg: 'rgba(34,197,94,0.10)',   icon: '✅' },
};

const STATUS_FILTERS = [
  { value: '', label: '전체' },
  { value: 'PENDING', label: '대기' },
  { value: 'LOADING', label: '적재중' },
  { value: 'SHIPPED', label: '출고' },
  { value: 'DELIVERED', label: '완료' },
];

/* ─── 포맷 유틸 ─── */

function numFmt(params: { value: number | null | undefined }) {
  if (params.value == null || params.value === 0) return '-';
  return Number(params.value).toLocaleString();
}

function moneyFmt(v: number | null | undefined) {
  if (v == null || v === 0) return '-';
  if (v >= 100000000) return `${(v / 100000000).toFixed(1)}억`;
  if (v >= 10000) return `${Math.round(v / 10000).toLocaleString()}만`;
  return v.toLocaleString();
}

/* ─── 메인 컴포넌트 ─── */

export function DeliveryShippingView() {
  const [headers, setHeaders] = useState<DeliveryHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHeader, setSelectedHeader] = useState<DeliveryHeader | null>(null);
  const [details, setDetails] = useState<DeliveryDetail[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // 필터
  const [statusFilter, setStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // 디테일 패널 열림/닫힘
  const [detailOpen, setDetailOpen] = useState(false);

  const gridRef = useRef<AgGridReact>(null);

  // 데이터 로드
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilter = statusFilter || keyword || dateFrom || dateTo;
      const res = hasFilter
        ? await deliveryApi.search({ status: statusFilter, keyword, dateFrom, dateTo })
        : await deliveryApi.findAll();
      if (res.success && res.data) setHeaders(res.data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, keyword, dateFrom, dateTo]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const hasFilter = statusFilter || keyword || dateFrom || dateTo;
    const promise = hasFilter
      ? deliveryApi.search({ status: statusFilter, keyword, dateFrom, dateTo })
      : deliveryApi.findAll();

    promise.then(res => {
      if (cancelled) return;
      if (res.success && res.data) setHeaders(res.data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [statusFilter, dateFrom, dateTo]);

  // 키워드 검색은 엔터 or 버튼
  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // 행 선택 → 디테일 로드
  useEffect(() => {
    if (!selectedHeader) {
      setDetails([]);
      setDetailOpen(false);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailOpen(true);
    deliveryApi.findDetails(selectedHeader.deliveryNo).then(res => {
      if (cancelled) return;
      if (res.success && res.data) setDetails(res.data);
      setDetailLoading(false);
    }).catch(() => {
      if (!cancelled) setDetailLoading(false);
    });
    return () => { cancelled = true; };
  }, [selectedHeader?.deliveryNo]);

  // KPI 계산
  const kpi = useMemo(() => {
    const total = headers.length;
    const pending = headers.filter(h => h.deliveryStatus === 'PENDING').length;
    const loading_ = headers.filter(h => h.deliveryStatus === 'LOADING').length;
    const shipped = headers.filter(h => h.deliveryStatus === 'SHIPPED').length;
    const delivered = headers.filter(h => h.deliveryStatus === 'DELIVERED').length;
    const totalAmt = headers.reduce((sum, h) => sum + (h.totalAmount || 0), 0);
    return { total, pending, loading: loading_, shipped, delivered, totalAmt };
  }, [headers]);

  // 마스터 그리드 컬럼
  const columnDefs = useMemo<ColDef<DeliveryHeader>[]>(() => [
    {
      headerName: '상태', field: 'deliveryStatus', width: 100,
      cellRenderer: (params: { value: string }) => {
        const cfg = STATUS_MAP[params.value];
        if (!cfg) return params.value;
        return `<span style="display:inline-flex;align-items:center;gap:5px;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;color:${cfg.color};background:${cfg.bg}">${cfg.icon} ${cfg.label}</span>`;
      },
    },
    { headerName: '출고번호', field: 'deliveryNo', width: 120 },
    { headerName: '출고일', field: 'deliveryDate', width: 110 },
    { headerName: '실출고일', field: 'actualDate', width: 110 },
    { headerName: '수주번호', field: 'orderNo', width: 120 },
    { headerName: '거래처', field: 'customerCd', width: 130 },
    { headerName: '현장코드', field: 'siteCd', width: 110 },
    { headerName: '품목수', field: 'detailCount', width: 70, type: 'rightAligned' },
    { headerName: '출고금액', field: 'totalAmount', width: 130, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '운송사', field: 'shippingCompany', width: 100 },
    { headerName: '차량', field: 'vehicleNo', width: 100 },
    { headerName: '기사', field: 'driverNm', width: 80 },
    { headerName: '특이사항', field: 'specialNotes', flex: 1, minWidth: 150 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const handleRowClicked = useCallback((event: { data?: DeliveryHeader }) => {
    if (event.data) {
      setSelectedHeader(prev =>
        prev?.deliveryNo === event.data!.deliveryNo ? prev : event.data!
      );
    }
  }, []);

  return (
    <div style={containerStyle}>
      {/* ─── KPI 요약 카드 ─── */}
      <div style={kpiRowStyle}>
        <KpiCard icon={<Package size={18} />} color="var(--text)" label="전체 출고" value={kpi.total} />
        <KpiCard icon={<Clock size={18} />} color="#f59e0b" label="출고대기" value={kpi.pending} highlight={kpi.pending > 0} />
        <KpiCard icon={<Truck size={18} />} color="#3b82f6" label="적재/출고" value={kpi.loading + kpi.shipped} />
        <KpiCard icon={<CheckCircle2 size={18} />} color="#22c55e" label="배송완료" value={kpi.delivered} />
        <KpiCard icon={<PackageCheck size={18} />} color="var(--accent)" label="출고금액" value={moneyFmt(kpi.totalAmt)} isMoney />
      </div>

      {/* ─── 필터 바 ─── */}
      <div style={filterBarStyle}>
        {/* 상태 필터 */}
        <div style={statusFilterGroupStyle}>
          {STATUS_FILTERS.map(sf => (
            <button
              key={sf.value}
              type="button"
              style={statusFilter === sf.value ? statusChipActiveStyle : statusChipStyle}
              onClick={() => setStatusFilter(sf.value)}
            >
              {sf.label}
            </button>
          ))}
        </div>

        <div style={filterRightStyle}>
          {/* 기간 필터 */}
          <div style={dateRangeStyle}>
            <DatePicker
              selected={parseDate(dateFrom)}
              onChange={d => setDateFrom(formatDate(d))}
              placeholder="시작일"
            />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>~</span>
            <DatePicker
              selected={parseDate(dateTo)}
              onChange={d => setDateTo(formatDate(d))}
              placeholder="종료일"
            />
          </div>

          {/* 검색 */}
          <div style={searchBoxStyle}>
            <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="출고번호, 수주번호, 거래처..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              style={searchInputStyle}
            />
            {keyword && (
              <button type="button" style={clearBtnStyle} onClick={() => { setKeyword(''); fetchData(); }}>
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── 마스터 그리드 ─── */}
      <div style={{
        ...gridWrapperStyle,
        flex: detailOpen ? undefined : 1,
        height: detailOpen ? 280 : undefined,
        minHeight: detailOpen ? 280 : 200,
        transition: 'height 0.2s ease',
      }} className="ag-theme-quartz">
        {loading ? (
          <div style={{ padding: 16 }}>
            <Skeleton variant="rounded" width="100%" height={180} />
          </div>
        ) : headers.length === 0 ? (
          <EmptyState title="출고 데이터가 없습니다" message="조건에 해당하는 출고 건이 없습니다." />
        ) : (
          <AgGridReact<DeliveryHeader>
            ref={gridRef}
            rowData={headers}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={handleRowClicked}
            rowSelection="single"
            animateRows
            suppressCellFocus
            getRowId={(params) => String(params.data.id)}
            rowHeight={40}
          />
        )}
      </div>

      {/* ─── 디테일 패널 ─── */}
      {selectedHeader && (
        <div style={detailPanelStyle}>
          {/* 디테일 헤더 */}
          <div style={detailHeaderBarStyle}>
            <div style={detailHeaderLeftStyle}>
              <StatusPill status={selectedHeader.deliveryStatus} />
              <span style={detailDeliveryNoStyle}>
                {selectedHeader.deliveryNo}
              </span>
              <span style={detailMetaStyle}>
                {selectedHeader.deliveryDate}
                {selectedHeader.customerCd ? ` · ${selectedHeader.customerCd}` : ''}
                {selectedHeader.siteCd ? ` · ${selectedHeader.siteCd}` : ''}
              </span>
            </div>
            <button type="button" style={detailToggleBtn} onClick={() => setDetailOpen(o => !o)}>
              {detailOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </button>
          </div>

          {detailOpen && (
            <>
              {/* 출고 정보 요약 */}
              <div style={deliveryInfoRowStyle}>
                {selectedHeader.deliveryAddress && (
                  <InfoChip icon={<MapPin size={12} />} label={selectedHeader.deliveryAddress} />
                )}
                {selectedHeader.driverNm && (
                  <InfoChip icon={<User size={12} />} label={`${selectedHeader.driverNm}${selectedHeader.vehicleNo ? ` (${selectedHeader.vehicleNo})` : ''}`} />
                )}
                {selectedHeader.driverPhone && (
                  <InfoChip icon={<Phone size={12} />} label={selectedHeader.driverPhone} />
                )}
                {selectedHeader.shippingCompany && (
                  <InfoChip icon={<Truck size={12} />} label={`${selectedHeader.shippingCompany} · 운반비 ${(selectedHeader.shippingCost || 0).toLocaleString()}원`} />
                )}
                {selectedHeader.specialNotes && (
                  <div style={specialNotesStyle}>
                    {selectedHeader.specialNotes}
                  </div>
                )}
              </div>

              {/* 디테일 그리드 */}
              <div style={detailGridWrapperStyle} className="ag-theme-quartz">
                {detailLoading ? (
                  <div style={{ padding: 12 }}>
                    <Skeleton variant="rounded" width="100%" height={100} />
                  </div>
                ) : (
                  <DeliveryDetailGrid details={details} />
                )}
              </div>

              {/* 디테일 합계 바 */}
              {details.length > 0 && (
                <div style={detailSummaryBarStyle}>
                  <span style={summaryItemStyle}>
                    품목 <strong>{details.length}</strong>건
                  </span>
                  <span style={summaryItemStyle}>
                    총수량 <strong>{details.reduce((s, d) => s + d.deliveryQty, 0).toLocaleString()}</strong>
                  </span>
                  <span style={summaryItemStyle}>
                    면적 <strong>{details.reduce((s, d) => s + (d.area || 0), 0).toFixed(2)}</strong> m2
                  </span>
                  <span style={{ flex: 1 }} />
                  <span style={summaryTotalStyle}>
                    합계 <strong>{details.reduce((s, d) => s + (d.totalAmount || 0), 0).toLocaleString()}</strong>원
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── KPI 카드 ─── */

function KpiCard({ icon, color, label, value, highlight, isMoney }: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: number | string;
  highlight?: boolean;
  isMoney?: boolean;
}) {
  return (
    <div style={{
      ...kpiCardStyle,
      ...(highlight ? { borderColor: color, boxShadow: `0 0 0 1px ${color}20` } : {}),
    }}>
      <div style={{ ...kpiIconStyle, color, background: `${color}12` }}>
        {icon}
      </div>
      <div style={kpiTextGroup}>
        <div style={{ ...kpiValueStyle, ...(isMoney ? { fontSize: 18 } : {}) }}>
          {typeof value === 'number' ? value : value}
        </div>
        <div style={kpiLabelStyle}>{label}</div>
      </div>
    </div>
  );
}

/* ─── 상태 Pill ─── */

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_MAP[status];
  if (!cfg) return <span>{status}</span>;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─── InfoChip ─── */

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span style={infoChipStyle}>
      {icon}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </span>
  );
}

/* ─── 디테일 그리드 ─── */

function DeliveryDetailGrid({ details }: { details: DeliveryDetail[] }) {
  const columnDefs = useMemo<ColDef<DeliveryDetail>[]>(() => [
    { headerName: '#', field: 'lineNo', width: 50 },
    { headerName: '자재코드', field: 'materialCd', width: 120 },
    { headerName: '품명', field: 'materialNm', flex: 2, minWidth: 200 },
    { headerName: '구분', field: 'category', width: 55 },
    {
      headerName: '규격(두께×가로×세로)', width: 170,
      valueGetter: (params) => {
        const d = params.data;
        if (!d || !d.thickness) return '-';
        return `${d.thickness}×${d.width}×${d.height}`;
      },
    },
    { headerName: '주문수량', field: 'orderQuantity', width: 85, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '미출수량', field: 'unshippedQuantity', width: 85, type: 'rightAligned', valueFormatter: numFmt },
    {
      headerName: '출고수량', field: 'deliveryQty', width: 85, type: 'rightAligned',
      valueFormatter: numFmt,
      cellStyle: { fontWeight: 600, color: 'var(--accent)' } as CSSProperties,
    },
    { headerName: '단위', field: 'unit', width: 55 },
    { headerName: '면적', field: 'area', width: 75, type: 'rightAligned', valueFormatter: (p) => p.value != null ? Number(p.value).toFixed(2) : '-' },
    { headerName: '단가', field: 'unitPrice', width: 95, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '금액', field: 'amount', width: 110, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '세액', field: 'tax', width: 90, type: 'rightAligned', valueFormatter: numFmt },
    {
      headerName: '합계', field: 'totalAmount', width: 120, type: 'rightAligned',
      valueFormatter: numFmt,
      cellStyle: { fontWeight: 600 } as CSSProperties,
    },
    { headerName: '비고', field: 'remarks', flex: 1, minWidth: 120 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  return (
    <AgGridReact<DeliveryDetail>
      rowData={details}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      domLayout="autoHeight"
      suppressCellFocus
      headerHeight={32}
      rowHeight={34}
      getRowId={(params) => String(params.data.id)}
    />
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  flex: 1,
  minHeight: 0,
};

/* KPI */
const kpiRowStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexShrink: 0,
};

const kpiCardStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const kpiIconStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 10,
  flexShrink: 0,
};

const kpiTextGroup: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

const kpiValueStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--text)',
  lineHeight: 1.1,
};

const kpiLabelStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

/* Filter */
const filterBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
  flexWrap: 'wrap',
};

const statusFilterGroupStyle: CSSProperties = {
  display: 'flex',
  gap: 4,
};

const statusChipStyle: CSSProperties = {
  padding: '5px 14px',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 20,
  cursor: 'pointer',
  transition: 'all 0.12s',
};

const statusChipActiveStyle: CSSProperties = {
  ...statusChipStyle,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  borderColor: 'var(--accent)',
  fontWeight: 600,
};

const filterRightStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const dateRangeStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
};


const searchBoxStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '5px 10px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: 'var(--panel)',
  minWidth: 220,
};

const searchInputStyle: CSSProperties = {
  flex: 1,
  border: 'none',
  outline: 'none',
  fontSize: 12,
  background: 'transparent',
  color: 'var(--text)',
};

const clearBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: 9,
  border: 'none',
  background: 'var(--panel-2)',
  color: 'var(--text-tertiary)',
  cursor: 'pointer',
  padding: 0,
};

/* Grid */
const gridWrapperStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

/* Detail Panel */
const detailPanelStyle: CSSProperties = {
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  overflow: 'hidden',
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
};

const detailHeaderBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 14px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const detailHeaderLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const detailDeliveryNoStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--text)',
};

const detailMetaStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-tertiary)',
  fontWeight: 500,
};

const detailToggleBtn: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 7,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

const deliveryInfoRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  padding: '8px 14px',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
};

const infoChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 10px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--panel-2)',
  maxWidth: 350,
};

const specialNotesStyle: CSSProperties = {
  width: '100%',
  fontSize: 11,
  color: 'var(--text-tertiary)',
  fontStyle: 'italic',
  marginTop: 2,
};

const detailGridWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
};

const detailSummaryBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '8px 14px',
  borderTop: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const summaryItemStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
  fontWeight: 500,
};

const summaryTotalStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--accent)',
  fontWeight: 700,
};

export default DeliveryShippingView;
