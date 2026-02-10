/**
 * InventoryView - 제품재고 현황 뷰
 *
 * KPI 요약 + 유형 필터/검색 + 재고 그리드(재고수준 바) + 입출고 이력 타임라인
 * inventory / inventory_transaction 테이블 연동
 */

import { useState, useEffect, useMemo, useCallback, useRef, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import {
  Layers, Package, AlertTriangle, ArrowDownCircle, ArrowUpCircle,
  Search, X, RefreshCw, Warehouse, TrendingDown,
} from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { inventoryApi } from '../../services/inventoryApi';
import type { InventoryItem, InventoryTransaction } from '../../types/inventory.types';

/* ─── 유형 필터 ─── */
const TYPE_FILTERS = [
  { value: '', label: '전체' },
  { value: '원판', label: '원판유리' },
  { value: '부자재', label: '부자재' },
];

/* ─── 이동 유형 ─── */
const TX_TYPE: Record<string, { label: string; color: string; icon: 'in' | 'out' | 'adjust' | 'move' }> = {
  IN:     { label: '입고', color: '#22c55e', icon: 'in' },
  OUT:    { label: '출고', color: '#ef4444', icon: 'out' },
  ADJUST: { label: '조정', color: '#f59e0b', icon: 'adjust' },
  MOVE:   { label: '이동', color: '#3b82f6', icon: 'move' },
};

/* ─── 입출고 이력 필터 ─── */
const TX_FILTERS = [
  { value: '', label: '전체', color: 'var(--accent)' },
  { value: 'IN', label: '입고', color: '#22c55e' },
  { value: 'OUT', label: '출고', color: '#ef4444' },
];

/* ─── 유틸 ─── */
function numFmt(params: { value: number | null | undefined }) {
  if (params.value == null || params.value === 0) return '-';
  return Number(params.value).toLocaleString();
}

function decFmt(params: { value: number | null | undefined }) {
  if (params.value == null || params.value === 0) return '-';
  return Number(params.value).toFixed(1);
}

function getStockStatus(item: InventoryItem): { label: string; color: string; bg: string } {
  const pct = item.maxQty > 0 ? (item.currentQty / item.maxQty) * 100 : 100;
  if (item.currentQty <= 0) return { label: '품절', color: '#ef4444', bg: 'rgba(239,68,68,0.10)' };
  if (item.currentQty <= item.minQty) return { label: '부족', color: '#ef4444', bg: 'rgba(239,68,68,0.10)' };
  if (pct <= 30) return { label: '경고', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' };
  if (pct > 90) return { label: '과다', color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' };
  return { label: '정상', color: '#22c55e', bg: 'rgba(34,197,94,0.10)' };
}

/* ─── AG Grid React cell renderers ─── */

function StatusCellRenderer(params: ICellRendererParams<InventoryItem>) {
  if (!params.data) return null;
  const st = getStockStatus(params.data);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 12,
      fontSize: 11, fontWeight: 600,
      color: st.color, background: st.bg,
    }}>
      {st.label}
    </span>
  );
}

function StockLevelCellRenderer(params: ICellRendererParams<InventoryItem>) {
  if (!params.data) return null;
  const item = params.data;
  const max = item.maxQty || 1;
  const min = item.minQty || 0;
  const cur = item.currentQty;
  const pct = Math.min(Math.round((cur / max) * 100), 100);

  let barColor = '#22c55e';
  if (cur <= 0) barColor = '#ef4444';
  else if (cur <= min) barColor = '#ef4444';
  else if (pct <= 30) barColor = '#f59e0b';
  else if (pct > 90) barColor = '#8b5cf6';

  const minPct = Math.round((min / max) * 100);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', paddingRight: 4 }}>
      <div style={{
        flex: 1, height: 8, borderRadius: 4,
        background: 'var(--panel-2)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width: `${pct}%`, background: barColor, borderRadius: 4,
          transition: 'width 0.3s',
        }} />
        {minPct > 0 && (
          <div style={{
            position: 'absolute', left: `${minPct}%`, top: 0,
            width: 1, height: '100%',
            background: 'var(--text-tertiary)', opacity: 0.4,
          }} />
        )}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, color: barColor,
        minWidth: 32, textAlign: 'right',
      }}>
        {pct}%
      </span>
    </div>
  );
}

/* ─── 메인 컴포넌트 ─── */

export function InventoryView() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [txFilter, setTxFilter] = useState<'' | 'IN' | 'OUT'>('');

  const gridRef = useRef<AgGridReact>(null);

  // 재고 데이터 로드
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const hasFilter = typeFilter || keyword;
      const res = hasFilter
        ? await inventoryApi.search(typeFilter, keyword)
        : await inventoryApi.findAll();
      if (res.success && res.data) setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, keyword]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const hasFilter = typeFilter;
    const promise = hasFilter
      ? inventoryApi.search(typeFilter, '')
      : inventoryApi.findAll();
    promise.then(res => {
      if (cancelled) return;
      if (res.success && res.data) setItems(res.data);
      setLoading(false);
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [typeFilter]);

  // 최근 입출고 이력
  useEffect(() => {
    let cancelled = false;
    setTxLoading(true);
    inventoryApi.recentTransactions(20).then(res => {
      if (cancelled) return;
      if (res.success && res.data) setTransactions(res.data);
      setTxLoading(false);
    }).catch(() => { if (!cancelled) setTxLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback(() => { fetchItems(); }, [fetchItems]);

  // 입출고 이력 필터링
  const filteredTx = useMemo(() => {
    if (!txFilter) return transactions;
    return transactions.filter(tx => tx.transactionType === txFilter);
  }, [transactions, txFilter]);

  // KPI 계산
  const kpi = useMemo(() => {
    const totalSku = items.length;
    const totalQty = items.reduce((s, i) => s + i.currentQty, 0);
    const totalPyeong = items.reduce((s, i) => s + (i.areaPyeong || 0), 0);
    const lowStock = items.filter(i => i.currentQty <= i.minQty && i.currentQty > 0).length;
    const outOfStock = items.filter(i => i.currentQty <= 0).length;
    const reserved = items.reduce((s, i) => s + (i.reservedQty || 0), 0);
    return { totalSku, totalQty, totalPyeong, lowStock, outOfStock, reserved };
  }, [items]);

  // 재고 그리드 컬럼
  const columnDefs = useMemo<ColDef<InventoryItem>[]>(() => [
    {
      headerName: '상태', width: 75,
      cellRenderer: StatusCellRenderer,
    },
    { headerName: '유형', field: 'inventoryType', width: 70 },
    { headerName: '자재코드', field: 'materialCd', width: 100 },
    { headerName: '자재명', field: 'materialNm', flex: 1, minWidth: 140 },
    {
      headerName: '규격(mm)', width: 130,
      valueGetter: p => {
        if (!p.data?.widthMm) return '-';
        return `${p.data.widthMm.toFixed(0)} × ${p.data.heightMm?.toFixed(0) || ''}`;
      },
    },
    { headerName: '현재고', field: 'currentQty', width: 80, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '가용', field: 'availableQty', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '예약', field: 'reservedQty', width: 65, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단위', field: 'unit', width: 50 },
    {
      headerName: '재고수준', width: 140,
      cellRenderer: StockLevelCellRenderer,
    },
    { headerName: '면적(평)', field: 'areaPyeong', width: 85, type: 'rightAligned', valueFormatter: decFmt },
    { headerName: '최소', field: 'minQty', width: 60, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '최대', field: 'maxQty', width: 60, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '공급사', field: 'supplierNm', width: 100 },
    { headerName: '위치', field: 'location', width: 120 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  const handleRowClicked = useCallback((e: { data?: InventoryItem }) => {
    if (e.data) setSelectedItem(e.data);
  }, []);

  return (
    <div style={containerStyle}>
      {/* ─── KPI 카드 ─── */}
      <div style={kpiRowStyle}>
        <KpiCard icon={<Layers size={18} />} color="var(--accent)" label="품목 수" value={kpi.totalSku} />
        <KpiCard icon={<Package size={18} />} color="var(--text)" label="총 수량" value={kpi.totalQty.toLocaleString()} sub={`${kpi.totalPyeong.toFixed(0)}평`} />
        <KpiCard icon={<TrendingDown size={18} />} color="#f59e0b" label="재고부족" value={kpi.lowStock} highlight={kpi.lowStock > 0} />
        <KpiCard icon={<AlertTriangle size={18} />} color="#ef4444" label="품절" value={kpi.outOfStock} highlight={kpi.outOfStock > 0} />
        <KpiCard icon={<Warehouse size={18} />} color="#3b82f6" label="예약중" value={kpi.reserved.toLocaleString()} />
      </div>

      {/* ─── 필터 바 ─── */}
      <div style={filterBarStyle}>
        <div style={typeGroupStyle}>
          {TYPE_FILTERS.map(tf => (
            <button
              key={tf.value}
              type="button"
              style={typeFilter === tf.value ? chipActiveStyle : chipStyle}
              onClick={() => setTypeFilter(tf.value)}
            >
              {tf.label}
            </button>
          ))}
        </div>
        <div style={searchBoxStyle}>
          <Search size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="자재코드, 자재명, 공급사, 위치..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            style={searchInputStyle}
          />
          {keyword && (
            <button type="button" style={clearBtnStyle} onClick={() => { setKeyword(''); fetchItems(); }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ─── 재고 그리드 (2/3 높이) ─── */}
      <div style={gridWrapperStyle} className="ag-theme-quartz">
        {loading ? (
          <div style={{ padding: 16 }}>
            <Skeleton variant="rounded" width="100%" height={200} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="재고 데이터가 없습니다" message="조건에 해당하는 재고가 없습니다." />
        ) : (
          <AgGridReact<InventoryItem>
            ref={gridRef}
            rowData={items}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onRowClicked={handleRowClicked}
            rowSelection="single"
            animateRows
            suppressCellFocus
            getRowId={p => String(p.data.id)}
            rowHeight={38}
          />
        )}
      </div>

      {/* ─── 하단: 입출고 이력 타임라인 (1/3 높이) ─── */}
      <div style={txSectionStyle}>
        <div style={txHeaderStyle}>
          <span style={txTitleStyle}>최근 입출고 이력</span>
          <span style={txCountStyle}>{filteredTx.length}건</span>
          <span style={{ flex: 1 }} />
          <div style={txFilterGroupStyle}>
            {TX_FILTERS.map(f => (
              <button
                key={f.value}
                type="button"
                style={txFilter === f.value ? txFilterActiveStyle(f.color) : txFilterStyle}
                onClick={() => setTxFilter(f.value as '' | 'IN' | 'OUT')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div style={txListStyle}>
          {txLoading ? (
            <div style={{ padding: 12 }}>
              <Skeleton variant="rounded" width="100%" height={80} />
            </div>
          ) : filteredTx.length === 0 ? (
            <div style={txEmptyStyle}>입출고 이력이 없습니다.</div>
          ) : (
            filteredTx.map(tx => <TxRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── KPI Card ─── */
function KpiCard({ icon, color, label, value, sub, highlight }: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div style={{
      ...kpiCardStyle,
      ...(highlight ? { borderColor: color, boxShadow: `0 0 0 1px ${color}20` } : {}),
    }}>
      <div style={{ ...kpiIconStyle, color, background: `${color}12` }}>{icon}</div>
      <div style={kpiTextGroup}>
        <div style={kpiValueStyle}>{value}</div>
        <div style={kpiLabelStyle}>
          {label}
          {sub && <span style={{ marginLeft: 4, color: 'var(--accent)', fontWeight: 600 }}>{sub}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── 입출고 이력 행 ─── */
function TxRow({ tx }: { tx: InventoryTransaction }) {
  const cfg = TX_TYPE[tx.transactionType] || { label: tx.transactionType, color: 'var(--text-tertiary)', icon: 'move' };
  const isIn = tx.quantity > 0;
  const IconComp = cfg.icon === 'in' ? ArrowDownCircle
    : cfg.icon === 'out' ? ArrowUpCircle
    : cfg.icon === 'adjust' ? RefreshCw
    : RefreshCw;

  return (
    <div style={txRowStyle}>
      {/* 타임라인 도트 */}
      <div style={{ ...txDotStyle, background: cfg.color }}>
        <IconComp size={10} color="#fff" />
      </div>
      {/* 내용 */}
      <div style={txContentStyle}>
        <div style={txTopLine}>
          <span style={{ ...txBadgeStyle, color: cfg.color, background: `${cfg.color}15` }}>
            {cfg.label}
          </span>
          <span style={txQtyStyle}>
            {isIn ? '+' : ''}{tx.quantity} {tx.unit || ''}
          </span>
          <span style={txMaterialStyle}>
            {tx.materialNm || ''}
            {tx.widthMm ? ` (${tx.widthMm.toFixed(0)}×${tx.heightMm?.toFixed(0) || ''})` : ''}
          </span>
          <span style={{ flex: 1 }} />
          <span style={txDateStyle}>{tx.transactionDate}</span>
        </div>
        <div style={txBottomLine}>
          {tx.fromLocation && tx.toLocation && (
            <span style={txLocStyle}>{tx.fromLocation} → {tx.toLocation}</span>
          )}
          {tx.refDocNo && (
            <span style={txRefStyle}>{tx.refDocType}: {tx.refDocNo}</span>
          )}
          {tx.siteNm && <span style={txLocStyle}>{tx.siteNm}</span>}
          {tx.remarks && <span style={txRemarkStyle}>{tx.remarks}</span>}
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 10, flex: 1, minHeight: 0,
};

const kpiRowStyle: CSSProperties = { display: 'flex', gap: 10, flexShrink: 0 };

const kpiCardStyle: CSSProperties = {
  flex: 1, display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 14px', borderRadius: 12,
  border: '1px solid var(--border)', background: 'var(--panel)',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};
const kpiIconStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
};
const kpiTextGroup: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 1 };
const kpiValueStyle: CSSProperties = { fontSize: 22, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 };
const kpiLabelStyle: CSSProperties = { fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)' };

const filterBarStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  gap: 12, flexShrink: 0,
};
const typeGroupStyle: CSSProperties = { display: 'flex', gap: 4 };

const chipStyle: CSSProperties = {
  padding: '5px 14px', fontSize: 12, fontWeight: 500,
  color: 'var(--text-secondary)', background: 'transparent',
  border: '1px solid var(--border)', borderRadius: 20, cursor: 'pointer',
};
const chipActiveStyle: CSSProperties = {
  ...chipStyle, color: 'var(--on-accent)', background: 'var(--accent)',
  borderColor: 'var(--accent)', fontWeight: 600,
};

const searchBoxStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '5px 10px', border: '1px solid var(--border)',
  borderRadius: 8, background: 'var(--panel)', minWidth: 260,
};
const searchInputStyle: CSSProperties = {
  flex: 1, border: 'none', outline: 'none', fontSize: 12,
  background: 'transparent', color: 'var(--text)',
};
const clearBtnStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 18, height: 18, borderRadius: 9, border: 'none',
  background: 'var(--panel-2)', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0,
};

/* 재고 그리드: flex 1 → 입출고 이력과 동일 비율 */
const gridWrapperStyle: CSSProperties = {
  width: '100%', flex: 1, minHeight: 180,
  borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
};

/* 입출고 이력: flex 1 → 재고 그리드와 동일 비율 */
const txSectionStyle: CSSProperties = {
  borderRadius: 12, border: '1px solid var(--border)', background: 'var(--panel)',
  overflow: 'hidden', flex: 1, minHeight: 160,
  display: 'flex', flexDirection: 'column',
};
const txHeaderStyle: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '8px 14px', borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)', flexShrink: 0,
};
const txTitleStyle: CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text)' };
const txCountStyle: CSSProperties = {
  fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 10,
  background: 'color-mix(in srgb, var(--accent) 15%, transparent)', color: 'var(--accent)',
};
const txListStyle: CSSProperties = { flex: 1, overflowY: 'auto', padding: '6px 0' };
const txEmptyStyle: CSSProperties = {
  padding: '20px 14px', fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center',
};

const txRowStyle: CSSProperties = {
  display: 'flex', alignItems: 'flex-start', gap: 10,
  padding: '6px 14px', transition: 'background 0.1s',
};
const txDotStyle: CSSProperties = {
  width: 22, height: 22, borderRadius: 11, flexShrink: 0, marginTop: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};
const txContentStyle: CSSProperties = {
  flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2,
};
const txTopLine: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
};
const txBadgeStyle: CSSProperties = {
  padding: '1px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
};
const txQtyStyle: CSSProperties = { fontWeight: 700, fontSize: 13, color: 'var(--text)' };
const txMaterialStyle: CSSProperties = {
  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500,
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};
const txDateStyle: CSSProperties = {
  fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 500, whiteSpace: 'nowrap',
};
const txBottomLine: CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-tertiary)',
};
const txLocStyle: CSSProperties = { fontWeight: 500 };
const txRefStyle: CSSProperties = {
  padding: '0 6px', borderRadius: 4, background: 'var(--panel-2)', fontWeight: 500,
};
const txRemarkStyle: CSSProperties = {
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0,
};

/* 입출고 이력 필터 버튼 */
const txFilterGroupStyle: CSSProperties = { display: 'flex', gap: 3 };
const txFilterStyle: CSSProperties = {
  padding: '2px 10px', fontSize: 11, fontWeight: 500,
  color: 'var(--text-tertiary)', background: 'transparent',
  border: '1px solid var(--border)', borderRadius: 12, cursor: 'pointer',
};
function txFilterActiveStyle(color: string): CSSProperties {
  return {
    ...txFilterStyle,
    color: '#fff', background: color, borderColor: color, fontWeight: 600,
  };
}

export default InventoryView;
