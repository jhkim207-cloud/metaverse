/**
 * PackagingListView - 포장지시 목록 뷰
 *
 * packing_order 테이블에서 조회한 AG Grid
 */

import { useState, useEffect, useMemo, useRef, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { packingApi } from '../../services/packingApi';
import type { PackingOrder } from '../../types/packing.types';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:    { label: '대기',   color: 'var(--text-tertiary)' },
  PROCESSING: { label: '작업중', color: '#f59e0b' },
  COMPLETED:  { label: '완료',   color: '#22c55e' },
};

function numFmt(params: { value: number | null | undefined }) {
  if (params.value == null || params.value === 0) return '-';
  return Number(params.value).toLocaleString();
}

export function PackagingListView() {
  const [data, setData] = useState<PackingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    packingApi.findAll().then(res => {
      if (cancelled) return;
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const columnDefs = useMemo<ColDef<PackingOrder>[]>(() => [
    { headerName: '포장번호', field: 'packingNo', width: 170 },
    { headerName: '포장일', field: 'packingDate', width: 110 },
    { headerName: '수주번호', field: 'orderNo', width: 140 },
    { headerName: '자재코드', field: 'materialCd', width: 100 },
    { headerName: '자재명', field: 'materialNm', flex: 2, minWidth: 200 },
    { headerName: '수량', field: 'packingQty', width: 90, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단위', field: 'unit', width: 60 },
    { headerName: '용기', field: 'containerCd', width: 80 },
    { headerName: '용기수', field: 'containerQty', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '작업자', field: 'workerCd', width: 80 },
    {
      headerName: '상태', field: 'packingStatus', width: 90,
      cellRenderer: (params: { value: string }) => {
        const cfg = STATUS_MAP[params.value];
        if (!cfg) return params.value;
        return cfg.label;
      },
      cellStyle: (params: { value: string }): CSSProperties | null => {
        const cfg = STATUS_MAP[params.value];
        if (!cfg) return null;
        return { color: cfg.color, fontWeight: 600 };
      },
    },
    { headerName: '비고', field: 'remarks', flex: 1, minWidth: 120 },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton variant="rounded" width="100%" height={200} />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title="포장지시가 없습니다" message="등록된 포장지시 데이터가 없습니다." />;
  }

  return (
    <div className="ag-theme-quartz" style={gridStyle}>
      <AgGridReact<PackingOrder>
        ref={gridRef}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        suppressCellFocus
        getRowId={(params) => String(params.data.id)}
      />
    </div>
  );
}

const gridStyle: CSSProperties = {
  width: '100%',
  flex: 1,
  minHeight: 0,
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

export default PackagingListView;
