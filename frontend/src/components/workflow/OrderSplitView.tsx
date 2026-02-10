/**
 * OrderSplitView - 주문 Split Layout
 *
 * 좌측: site_master 기반 현장 카드 목록 (siteNm + remark)
 * 우측 상단: sales_order_header 그리드 (현장 필터링)
 * 우측 하단: sales_order_detail 그리드 (선택된 헤더의 디테일)
 * 리사이즈 핸들로 상하 비율 조정 가능
 */

import { useState, useMemo, useCallback, useEffect, useRef, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { OrderDetailGrid } from './OrderDetailGrid';
import { OrderCreateView } from './OrderCreateView';
import { siteApi, salesOrderApi } from '../../services/siteApi';
import type { SiteMaster, SalesOrderHeader } from '../../types/site.types';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
];

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

interface OrderSplitViewProps {
  onOrderSelect?: (order: SalesOrderHeader | null) => void;
}

export function OrderSplitView({ onOrderSelect }: OrderSplitViewProps) {
  const [sites, setSites] = useState<SiteMaster[]>([]);
  const [orders, setOrders] = useState<SalesOrderHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSiteNm, setSelectedSiteNm] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderHeader | null>(null);

  // 모드: 'list' | 'create' | 'edit'
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');

  // 리사이즈 상태
  const [topHeight, setTopHeight] = useState(40); // 상단 비율 (%)
  const splitRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 현장 + 주문 데이터 페치
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([siteApi.findAll(), salesOrderApi.findAll()])
      .then(([siteRes, orderRes]) => {
        if (cancelled) return;
        if (siteRes.success && siteRes.data) setSites(siteRes.data);
        if (orderRes.success && orderRes.data) setOrders(orderRes.data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // 현장별 주문 건수 (siteNm 매칭)
  const siteOrderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const order of orders) {
      if (order.siteNm) {
        counts[order.siteNm] = (counts[order.siteNm] || 0) + 1;
      }
    }
    return counts;
  }, [orders]);

  // 필터링된 주문 목록
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (selectedSiteNm) {
      filtered = filtered.filter(o => o.siteNm === selectedSiteNm);
    }
    if (statusFilter === 'active') {
      filtered = filtered.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'IN_PROGRESS');
    }
    return filtered;
  }, [orders, selectedSiteNm, statusFilter]);

  const handleRowClicked = useCallback((event: { data?: SalesOrderHeader }) => {
    if (event.data) {
      setSelectedOrder(event.data);
      if (onOrderSelect) onOrderSelect(event.data);
    }
  }, [onOrderSelect]);

  // 리사이즈 핸들 드래그
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const handleMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current || !splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const y = moveEvent.clientY - rect.top;
      const pct = Math.min(Math.max((y / rect.height) * 100, 20), 80);
      setTopHeight(pct);
    };

    const handleUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, []);

  // 주문 등록 버튼: 현장 선택 상태에서 등록
  const handleCreateOrder = useCallback(() => {
    setMode('create');
  }, []);

  // 주문 수정 버튼
  const handleEditOrder = useCallback(() => {
    if (!selectedOrder) return;
    setMode('edit');
  }, [selectedOrder]);

  // 주문 삭제
  const handleDeleteOrder = useCallback(async () => {
    if (!selectedOrder) return;
    if (!window.confirm(`주문 ${selectedOrder.orderNo}을(를) 삭제하시겠습니까?`)) return;
    const res = await salesOrderApi.delete(selectedOrder.id);
    if (res.success) {
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      if (onOrderSelect) onOrderSelect(null);
    }
  }, [selectedOrder, onOrderSelect]);

  // 저장 완료 후 → 목록 새로고침
  const handleOrderSaved = useCallback((saved: SalesOrderHeader) => {
    setMode('list');
    // 주문 목록 새로고침
    salesOrderApi.findAll().then(res => {
      if (res.success && res.data) setOrders(res.data);
    });
    setSelectedOrder(saved);
    if (onOrderSelect) onOrderSelect(saved);
  }, [onOrderSelect]);

  // 현장 정보 조회 (등록 시 현장 데이터 전달용)
  const selectedSiteObj = useMemo(() => {
    if (!selectedSiteNm) return null;
    return sites.find(s => s.siteNm === selectedSiteNm) || null;
  }, [sites, selectedSiteNm]);

  const columnDefs = useMemo<ColDef<SalesOrderHeader>[]>(() => [
    { headerName: '주문번호', field: 'orderNo', width: 110 },
    { headerName: '주문일자', field: 'orderDate', width: 110 },
    { headerName: '현장명', field: 'siteNm', flex: 2, minWidth: 150 },
    { headerName: '거래처', field: 'customerNm', flex: 1, minWidth: 120 },
    { headerName: '건수', field: 'detailCount', width: 65, type: 'numericColumn' },
    { headerName: '주문유형', field: 'orderType', width: 90 },
    {
      headerName: '상태', field: 'orderStatus', width: 80,
      cellRenderer: (params: { value: string }) =>
        ORDER_STATUS_LABELS[params.value] || params.value,
    },
    { headerName: '납기일', field: 'deliveryDate', width: 100 },
    { headerName: '비고', field: 'remarks', flex: 1, minWidth: 100 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton variant="rounded" width="100%" height={300} />
      </div>
    );
  }

  // 등록/수정 모드
  if (mode === 'create' || mode === 'edit') {
    return (
      <OrderCreateView
        editOrder={mode === 'edit' ? selectedOrder : null}
        site={selectedSiteObj}
        onSaved={handleOrderSaved}
        onCancel={() => setMode('list')}
      />
    );
  }

  return (
    <div style={containerStyle}>
      {/* 상단 툴바 */}
      <div style={toolbarStyle}>
        <div style={toolbarLeftStyle}>
          <span style={countStyle}>{filteredOrders.length}건</span>
          <button type="button" style={addBtnStyle} onClick={handleCreateOrder}>
            <Plus size={14} />
            주문 등록
          </button>
          {selectedOrder && (
            <>
              <button type="button" style={actionBtnStyle} onClick={handleEditOrder}>
                <Pencil size={13} />
                수정
              </button>
              <button type="button" style={actionBtnDangerStyle} onClick={handleDeleteOrder}>
                <Trash2 size={13} />
                삭제
              </button>
            </>
          )}
        </div>
        <SegmentedControl
          options={STATUS_FILTER_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          size="sm"
        />
      </div>

      {/* Split Layout */}
      <div style={splitStyle}>
        {/* 좌: 현장 카드 목록 */}
        <div style={siteListStyle}>
          <div style={siteHeaderStyle}>
            <Building2 size={14} />
            현장
          </div>
          <div style={siteScrollStyle}>
            {/* 전체 현장 카드 */}
            <button
              type="button"
              style={{
                ...cardStyle,
                ...(selectedSiteNm === null ? cardActiveStyle : {}),
              }}
              onClick={(e) => { e.currentTarget.blur(); setSelectedSiteNm(null); }}
            >
              <div style={cardTopRow}>
                <div style={cardNameStyle}>전체 현장</div>
                <span style={badgeStyle}>{orders.length}</span>
              </div>
            </button>
            {/* site_master 현장 카드 */}
            {sites.map(site => {
              const count = siteOrderCounts[site.siteNm] || 0;
              const isActive = selectedSiteNm === site.siteNm;
              return (
                <button
                  key={site.siteCd}
                  type="button"
                  style={{
                    ...cardStyle,
                    ...(isActive ? cardActiveStyle : {}),
                  }}
                  onClick={(e) => { e.currentTarget.blur(); setSelectedSiteNm(site.siteNm); }}
                >
                  <div style={cardTopRow}>
                    <div style={cardNameStyle}>{site.siteNm}</div>
                    {count > 0 && <span style={badgeStyle}>{count}</span>}
                  </div>
                  {site.remark && <div style={cardRemarkStyle}>{site.remark}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* 우: 상하 Split (헤더 + 디테일) */}
        <div style={gridPanelStyle} ref={splitRef}>
          {/* 상단: 헤더 그리드 */}
          <div style={{ flex: `0 0 ${topHeight}%`, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {filteredOrders.length === 0 ? (
              <EmptyState
                title="주문이 없습니다"
                message={selectedSiteNm
                  ? '선택한 현장에 해당하는 주문이 없습니다.'
                  : '등록된 주문이 없습니다.'
                }
              />
            ) : (
              <div style={headerGridWrapperStyle} className="ag-theme-quartz">
                <AgGridReact<SalesOrderHeader>
                  rowData={filteredOrders}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  onRowClicked={handleRowClicked}
                  rowSelection="single"
                  animateRows
                  suppressCellFocus
                  getRowId={(params) => String(params.data.id)}
                />
              </div>
            )}
          </div>

          {/* 리사이즈 핸들 */}
          <div
            style={resizeHandleStyle}
            onMouseDown={handleResizeStart}
          >
            <div style={resizeLineStyle} />
          </div>

          {/* 하단: 디테일 그리드 */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <OrderDetailGrid selectedOrder={selectedOrder} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  flex: 1,
  minHeight: 0,
};

const toolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 4px',
  marginBottom: 12,
};

const toolbarLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const countStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--text-tertiary)',
  fontWeight: 500,
};

const addBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '5px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 7,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const actionBtnStyle: CSSProperties = {
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

const actionBtnDangerStyle: CSSProperties = {
  ...actionBtnStyle,
  color: '#ef4444',
};

const splitStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
  flex: 1,
  minHeight: 0,
};

const siteListStyle: CSSProperties = {
  width: 240,
  minWidth: 240,
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const siteHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const siteScrollStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  paddingBottom: 8,
};

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  width: 'calc(100% - 16px)',
  margin: '8px auto 0',
  padding: '10px 12px',
  border: '1px solid var(--border)',
  borderColor: 'var(--border)',
  borderRadius: 10,
  background: 'var(--panel-2)',
  boxShadow: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit',
  outline: 'none',
};

const cardActiveStyle: CSSProperties = {
  borderColor: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  boxShadow: '0 0 0 1px var(--accent)',
};

const cardTopRow: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
};

const cardNameStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
};

const cardRemarkStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const badgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '2px 7px',
  borderRadius: 10,
  flexShrink: 0,
};

const gridPanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
};

const headerGridWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

const resizeHandleStyle: CSSProperties = {
  flexShrink: 0,
  height: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'row-resize',
  userSelect: 'none',
};

const resizeLineStyle: CSSProperties = {
  width: 40,
  height: 3,
  borderRadius: 2,
  background: 'var(--border)',
};

export default OrderSplitView;
