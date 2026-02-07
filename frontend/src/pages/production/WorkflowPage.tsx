/**
 * WorkflowPage - 생산 워크플로우 메인 페이지
 *
 * Grid/칸반 전환 뷰 (스테퍼는 App.tsx 필터 헤더에서 렌더링)
 */

import { useState, useMemo, useCallback, useRef, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { KanbanBoard } from '../../components/workflow/KanbanBoard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useStageItems } from '../../hooks/useWorkflow';
import type { WorkflowItem } from '../../types/workflow.types';
import { WORKFLOW_STAGES, STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants/workflow';

ModuleRegistry.registerModules([AllCommunityModule]);

const VIEW_OPTIONS = [
  { value: 'grid', label: '그리드' },
  { value: 'kanban', label: '칸반' },
];

interface WorkflowPageProps {
  menuCode: string;
  onItemSelect: (item: WorkflowItem | null) => void;
}

export function WorkflowPage({ menuCode, onItemSelect }: WorkflowPageProps) {
  // menuCode가 곧 활성 단계 (스테퍼 클릭 시 App.tsx에서 selectedMenuCode 변경)
  const activeStage = useMemo(() => {
    if (menuCode === 'PROD_WORKFLOW' || menuCode === 'MAIN_WORKFLOW') return 'PROD_SALES_ORDER';
    const found = WORKFLOW_STAGES.find(s => s.code === menuCode);
    return found ? menuCode : 'PROD_SALES_ORDER';
  }, [menuCode]);

  const [viewMode, setViewMode] = useState<string>('grid');
  const gridRef = useRef<AgGridReact>(null);

  const { items, loading: itemsLoading } = useStageItems(activeStage);

  const activeStageName = useMemo(
    () => WORKFLOW_STAGES.find(s => s.code === activeStage)?.name ?? '',
    [activeStage],
  );

  const handleItemClick = useCallback((item: WorkflowItem) => {
    onItemSelect(item);
  }, [onItemSelect]);

  const handleRowClicked = useCallback((event: { data: WorkflowItem }) => {
    if (event.data) {
      onItemSelect(event.data);
    }
  }, [onItemSelect]);

  // AG Grid 컬럼 정의
  const columnDefs = useMemo<ColDef<WorkflowItem>[]>(() => [
    {
      headerName: '제목',
      field: 'title',
      flex: 2,
      minWidth: 180,
    },
    {
      headerName: '고객사',
      field: 'customer',
      flex: 1,
      minWidth: 100,
    },
    {
      headerName: '제품',
      field: 'product',
      flex: 1,
      minWidth: 120,
    },
    {
      headerName: '유형',
      field: 'orderType',
      width: 90,
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return '';
        return params.value === 'PROJECT' ? '프로젝트' : '임가공';
      },
    },
    {
      headerName: '상태',
      field: 'status',
      width: 90,
      cellRenderer: (params: { value: string }) => {
        const cfg = STATUS_CONFIG[params.value];
        return cfg ? cfg.label : params.value;
      },
    },
    {
      headerName: '우선순위',
      field: 'priority',
      width: 80,
      cellRenderer: (params: { value: string }) => {
        const cfg = PRIORITY_CONFIG[params.value];
        return cfg ? cfg.label : params.value;
      },
    },
    {
      headerName: '납기일',
      field: 'dueDate',
      width: 110,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div style={pageStyle}>
      {/* Toolbar: 단계명 + 뷰 전환 */}
      <div style={toolbarStyle}>
        <div style={toolbarLeftStyle}>
          <h3 style={stageNameStyle}>{activeStageName}</h3>
          <span style={itemCountStyle}>
            {itemsLoading ? '...' : `${items.length}건`}
          </span>
        </div>
        <SegmentedControl
          options={VIEW_OPTIONS}
          value={viewMode}
          onChange={setViewMode}
          size="sm"
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div style={contentStyle}>
        {itemsLoading ? (
          <div style={{ padding: 16 }}>
            <Skeleton variant="rounded" width="100%" height={200} />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title={`${activeStageName}에 항목이 없습니다`}
            message="해당 단계에 등록된 업무 항목이 없습니다."
          />
        ) : viewMode === 'kanban' ? (
          <div style={{ padding: 12 }}>
            <KanbanBoard items={items} onItemClick={handleItemClick} />
          </div>
        ) : (
          <div style={gridWrapperStyle} className="ag-theme-quartz">
            <AgGridReact
              ref={gridRef}
              rowData={items}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onRowClicked={handleRowClicked}
              rowSelection="single"
              animateRows
              domLayout="autoHeight"
              suppressCellFocus
              getRowId={(params) => String(params.data.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const pageStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
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
  gap: 10,
};

const stageNameStyle: CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--text)',
  margin: 0,
};

const itemCountStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--text-tertiary)',
  fontWeight: 500,
};

const contentStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
};

const gridWrapperStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

export default WorkflowPage;
