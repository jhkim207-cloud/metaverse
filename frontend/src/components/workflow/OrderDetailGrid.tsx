/**
 * OrderDetailGrid - 주문 디테일 AG Grid
 *
 * 선택된 주문 헤더의 디테일(라인) 목록을 표시
 * 상단 요약 바 + AG Grid
 */

import { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Package } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { salesOrderApi } from '../../services/siteApi';
import type { SalesOrderHeader, SalesOrderDetail } from '../../types/site.types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

interface OrderDetailGridProps {
  selectedOrder: SalesOrderHeader | null;
}

export function OrderDetailGrid({ selectedOrder }: OrderDetailGridProps) {
  const [details, setDetails] = useState<SalesOrderDetail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedOrder) {
      setDetails([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    salesOrderApi.findDetailsByHeaderId(selectedOrder.id)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) setDetails(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedOrder]);

  // 합계 계산
  const summary = useMemo(() => {
    let totalQty = 0;
    let totalArea = 0;
    for (const d of details) {
      totalQty += d.quantity || 0;
      totalArea += d.area || 0;
    }
    return { totalQty, totalArea: totalArea.toFixed(2) };
  }, [details]);

  const columnDefs = useMemo<ColDef<SalesOrderDetail>[]>(() => [
    { headerName: 'No', field: 'lineSeq', width: 60, sort: 'asc' },
    { headerName: '자재코드', field: 'materialCd', width: 90 },
    { headerName: '자재명', field: 'materialNm', flex: 2, minWidth: 200, tooltipField: 'materialNm' },
    { headerName: '가로', field: 'width', width: 70, type: 'numericColumn' },
    { headerName: '세로', field: 'height', width: 70, type: 'numericColumn' },
    { headerName: '두께', field: 'thickness', width: 60, type: 'numericColumn' },
    { headerName: '수량', field: 'quantity', width: 60, type: 'numericColumn' },
    { headerName: '면적', field: 'area', width: 70, type: 'numericColumn' },
    { headerName: '동', field: 'dong', width: 120 },
    { headerName: '호', field: 'ho', width: 120, tooltipField: 'ho' },
    { headerName: '창종류', field: 'windowType', width: 100 },
    {
      headerName: '생산상태', field: 'productionStatus', width: 85,
      cellRenderer: (params: { value: string }) =>
        STATUS_LABELS[params.value] || params.value || '',
    },
    { headerName: '비고', field: 'remarks', flex: 1, minWidth: 100, tooltipField: 'remarks' },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  if (!selectedOrder) {
    return (
      <div style={emptyContainerStyle}>
        <EmptyState
          title="주문을 선택하세요"
          message="상단 그리드에서 주문을 클릭하면 디테일이 표시됩니다."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 12 }}>
        <Skeleton variant="rounded" width="100%" height={200} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 디테일 헤더 바 */}
      <div style={headerBarStyle}>
        <div style={headerLeftStyle}>
          <Package size={14} style={{ color: 'var(--accent)' }} />
          <span style={headerOrderNoStyle}>{selectedOrder.orderNo}</span>
          <span style={headerSiteStyle}>{selectedOrder.siteNm}</span>
          <span style={headerCountStyle}>{details.length}건</span>
        </div>
        <div style={summaryStyle}>
          <span>수량 <strong>{summary.totalQty}</strong></span>
          <span style={summaryDivider}>|</span>
          <span>면적 <strong>{summary.totalArea}</strong> M2</span>
        </div>
      </div>

      {/* 디테일 그리드 */}
      {details.length === 0 ? (
        <EmptyState title="디테일이 없습니다" message="이 주문에 등록된 품목이 없습니다." />
      ) : (
        <div style={gridWrapperStyle} className="ag-theme-quartz">
          <AgGridReact<SalesOrderDetail>
            rowData={details}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            rowSelection="single"
            animateRows
            suppressCellFocus
            tooltipShowDelay={300}
            getRowId={(params) => String(params.data.id)}
          />
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
};

const emptyContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
};

const headerBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  borderRadius: '8px 8px 0 0',
  flexShrink: 0,
};

const headerLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const headerOrderNoStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const headerSiteStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const headerCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 6px',
  borderRadius: 8,
};

const summaryStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const summaryDivider: CSSProperties = {
  color: 'var(--border)',
};

const gridWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  borderRadius: '0 0 8px 8px',
  overflow: 'hidden',
  border: '1px solid var(--border)',
  borderTop: 'none',
};

export default OrderDetailGrid;
