/**
 * WorkflowPage - 생산 워크플로우 메인 페이지
 *
 * Grid/칸반 전환 뷰 (스테퍼는 App.tsx 필터 헤더에서 렌더링)
 * PROD_PROJECT 단계: site_master 그리드 + 하단 견적/거래처 탭
 * 기타 단계: 기존 workflow 데이터 표시
 */

import { useState, useMemo, useCallback, useRef, useEffect, lazy, Suspense, CSSProperties } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Plus, Building2, User, Phone, Mail, MapPin, FileText, CreditCard, Briefcase, Receipt, ClipboardList } from 'lucide-react';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { KanbanBoard } from '../../components/workflow/KanbanBoard';
import { OrderSplitView } from '../../components/workflow/OrderSplitView';
import { ProductionPlanView } from '../../components/workflow/ProductionPlanView';
import { SubcontractListView } from '../../components/workflow/SubcontractListView';
import { WorkOrderView } from '../../components/workflow/WorkOrderView';
import { ProductionResultView } from '../../components/workflow/ProductionResultView';
import { PackagingListView } from '../../components/workflow/PackagingListView';
import { DeliveryShippingView } from '../../components/workflow/DeliveryShippingView';
import { InventoryView } from '../../components/workflow/InventoryView';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ProjectCreateModal } from '../../components/site/ProjectCreateModal';
import { SiteInfoForm } from '../../components/site/SiteInfoForm';
import { useStageItems } from '../../hooks/useWorkflow';
import { siteApi, bpApi, sitePriceApi } from '../../services/siteApi';
import type { WorkflowItem } from '../../types/workflow.types';
import type { SiteMaster, BusinessPartner, SitePrice } from '../../types/site.types';
import { WORKFLOW_STAGES, STATUS_CONFIG, PRIORITY_CONFIG } from '../../constants/workflow';

// 3D 파이프라인: Dynamic Import (Three.js 번들 분리)
const WorkflowPipeline3D = lazy(() =>
  import('../../components/three/workflow/WorkflowPipeline3D').then(m => ({ default: m.WorkflowPipeline3D }))
);

ModuleRegistry.registerModules([AllCommunityModule]);

const VIEW_OPTIONS = [
  { value: 'grid', label: '그리드' },
  { value: 'kanban', label: '칸반' },
  { value: '3d', label: '3D' },
];

interface WorkflowPageProps {
  menuCode: string;
  mode: 'monitor' | 'manage';
  filterStage?: string;
  onItemSelect: (item: WorkflowItem | SiteMaster | null) => void;
  stageCounts?: import('../../types/workflow.types').StageCount[];
}

export function WorkflowPage({ menuCode, mode, filterStage, onItemSelect, stageCounts }: WorkflowPageProps) {
  const activeStage = useMemo(() => {
    // monitor 모드: 스테퍼에서 선택한 filterStage 사용
    if (mode === 'monitor' && filterStage) return filterStage;
    if (!WORKFLOW_STAGES.find(s => s.code === menuCode)) return 'PROD_ORDER';
    const found = WORKFLOW_STAGES.find(s => s.code === menuCode);
    return found ? menuCode : 'PROD_ORDER';
  }, [menuCode, mode, filterStage]);

  const isProjectStage = activeStage === 'PROD_PROJECT';
  const isSubcontractStage = activeStage === 'PROD_SUBCONTRACT';
  const isOrderStage = activeStage === 'PROD_ORDER';
  const isPlanStage = activeStage === 'PROD_PLAN';
  const isWorkOrderStage = activeStage === 'PROD_WORK_ORDER';
  const isResultStage = activeStage === 'PROD_RESULT';
  const isPackagingStage = activeStage === 'PROD_PACKAGING';
  const isShippingStage = activeStage === 'PROD_SHIPPING';
  const isInventoryStage = activeStage === 'PROD_INVENTORY';

  const [viewMode, setViewMode] = useState<string>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const gridRef = useRef<AgGridReact>(null);

  // site_master 데이터 (현장 단계 전용)
  const [sites, setSites] = useState<SiteMaster[]>([]);
  const [sitesLoading, setSitesLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<SiteMaster | null>(null);

  // 견적단가 데이터
  const [prices, setPrices] = useState<SitePrice[]>([]);
  const [pricesLoading, setPricesLoading] = useState(false);

  // 거래처 데이터
  const [bp, setBp] = useState<BusinessPartner | null>(null);
  const [bpLoading, setBpLoading] = useState(false);

  // 하단 탭 상태
  const [activeTab, setActiveTab] = useState<'site' | 'price' | 'bp'>('site');

  const fetchSites = useCallback(async () => {
    setSitesLoading(true);
    try {
      const response = await siteApi.findAll();
      if (response.success && response.data) {
        setSites(response.data);
      }
    } finally {
      setSitesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isProjectStage) return;
    let cancelled = false;
    setSitesLoading(true);
    siteApi.findAll().then(response => {
      if (cancelled) return;
      if (response.success && response.data) {
        setSites(response.data);
      }
      setSitesLoading(false);
    }).catch(() => {
      if (!cancelled) setSitesLoading(false);
    });
    return () => { cancelled = true; };
  }, [isProjectStage]);

  // 현장 선택 시 견적단가 조회
  useEffect(() => {
    if (!selectedSite?.siteCd) {
      setPrices([]);
      return;
    }
    let cancelled = false;
    setPricesLoading(true);
    sitePriceApi.findBySiteCd(selectedSite.siteCd).then(response => {
      if (cancelled) return;
      if (response.success && response.data) {
        setPrices(response.data);
      } else {
        setPrices([]);
      }
      setPricesLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setPrices([]);
        setPricesLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [selectedSite?.siteCd]);

  // 현장 선택 시 거래처 조회
  useEffect(() => {
    if (!selectedSite?.bpCd) {
      setBp(null);
      return;
    }
    let cancelled = false;
    setBpLoading(true);
    bpApi.findByBpCd(selectedSite.bpCd).then(response => {
      if (cancelled) return;
      if (response.success && response.data) {
        setBp(response.data);
      } else {
        setBp(null);
      }
      setBpLoading(false);
    }).catch(() => {
      if (!cancelled) {
        setBp(null);
        setBpLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [selectedSite?.bpCd]);

  // 단계 전환 시 선택 초기화
  useEffect(() => {
    setSelectedSite(null);
    setBp(null);
  }, [activeStage]);

  // 기존 workflow 데이터 (현장 외 단계)
  const { items, loading: itemsLoading } = useStageItems(isProjectStage || isSubcontractStage || isWorkOrderStage || isResultStage || isPackagingStage || isShippingStage || isInventoryStage ? null : activeStage);

  const activeStageName = useMemo(
    () => WORKFLOW_STAGES.find(s => s.code === activeStage)?.name ?? '',
    [activeStage],
  );

  const currentItems = isProjectStage ? sites : items;
  const currentLoading = isProjectStage ? sitesLoading : itemsLoading;

  const handleItemClick = useCallback((item: WorkflowItem) => {
    onItemSelect(item);
  }, [onItemSelect]);

  const handleSiteRowClicked = useCallback((event: { data?: SiteMaster }) => {
    if (event.data) {
      setSelectedSite(event.data);
      onItemSelect(event.data);
    }
  }, [onItemSelect]);

  // SiteInfoForm 콜백: 수정 완료
  const handleSiteSaved = useCallback((updated: SiteMaster) => {
    setSites(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSite(updated);
    // AG Grid 행 플래시 (안전하게 감싸기)
    try {
      const api = gridRef.current?.api;
      if (api) {
        const rowNode = api.getRowNode(String(updated.id));
        if (rowNode) {
          rowNode.setData(updated);
          api.flashCells({ rowNodes: [rowNode] });
        }
      }
    } catch {
      // flashCells 미지원 시 무시
    }
  }, []);

  // SiteInfoForm 콜백: 삭제 완료
  const handleSiteDeleted = useCallback((id: number) => {
    setSites(prev => prev.filter(s => s.id !== id));
    setSelectedSite(null);
    onItemSelect(null);
  }, [onItemSelect]);

  // SiteInfoForm 콜백: 신규 등록 완료
  const handleSiteCreated = useCallback(() => {
    fetchSites();
  }, [fetchSites]);

  const handleWorkflowRowClicked = useCallback((event: { data?: WorkflowItem }) => {
    if (event.data) onItemSelect(event.data);
  }, [onItemSelect]);

  // site_master 컬럼 정의
  const siteColumnDefs = useMemo<ColDef<SiteMaster>[]>(() => [
    { headerName: '현장코드', field: 'siteCd', width: 120 },
    { headerName: '현장명', field: 'siteNm', flex: 2, minWidth: 180 },
    { headerName: '건설사', field: 'constructorNm', flex: 1, minWidth: 120 },
    { headerName: '거래처코드', field: 'bpCd', width: 110 },
    { headerName: '주소', field: 'address', flex: 2, minWidth: 150 },
    { headerName: '비고', field: 'remark', flex: 1, minWidth: 100 },
  ], []);

  // 기존 workflow 컬럼 정의
  const workflowColumnDefs = useMemo<ColDef<WorkflowItem>[]>(() => [
    { headerName: '제목', field: 'title', flex: 2, minWidth: 180 },
    { headerName: '고객사', field: 'customer', flex: 1, minWidth: 100 },
    { headerName: '제품', field: 'product', flex: 1, minWidth: 120 },
    {
      headerName: '유형', field: 'orderType', width: 90,
      cellRenderer: (params: { value: string }) => {
        if (!params.value) return '';
        return params.value === 'PROJECT' ? '프로젝트' : '임가공';
      },
    },
    {
      headerName: '상태', field: 'status', width: 90,
      cellRenderer: (params: { value: string }) => {
        const cfg = STATUS_CONFIG[params.value];
        return cfg ? cfg.label : params.value;
      },
    },
    {
      headerName: '우선순위', field: 'priority', width: 80,
      cellRenderer: (params: { value: string }) => {
        const cfg = PRIORITY_CONFIG[params.value];
        return cfg ? cfg.label : params.value;
      },
    },
    { headerName: '납기일', field: 'dueDate', width: 110 },
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
      {/* Toolbar */}
      <div style={toolbarStyle}>
        <div style={toolbarLeftStyle}>
          {mode === 'monitor' && (
            <h3 style={stageNameStyle}>{activeStageName}</h3>
          )}
          {!isOrderStage && !isPlanStage && !isSubcontractStage && !isWorkOrderStage && !isResultStage && !isPackagingStage && !isShippingStage && !isInventoryStage && (
            <span style={itemCountStyle}>
              {currentLoading ? '...' : `${currentItems.length}건`}
            </span>
          )}
          {false && isProjectStage && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              style={addBtnStyle}
            >
              <Plus size={15} />
              현장 등록
            </button>
          )}
        </div>
        {!isProjectStage && !isOrderStage && !isPlanStage && !isSubcontractStage && !isWorkOrderStage && !isResultStage && !isPackagingStage && !isShippingStage && !isInventoryStage && (
          <SegmentedControl
            options={VIEW_OPTIONS}
            value={viewMode}
            onChange={setViewMode}
            size="sm"
          />
        )}
      </div>

      {/* 콘텐츠 영역 */}
      <div style={contentStyle}>
        {isInventoryStage ? (
          <InventoryView />
        ) : isShippingStage ? (
          <DeliveryShippingView />
        ) : isPackagingStage ? (
          <PackagingListView />
        ) : isResultStage ? (
          <ProductionResultView />
        ) : isWorkOrderStage ? (
          <WorkOrderView />
        ) : isPlanStage ? (
          <ProductionPlanView />
        ) : isSubcontractStage ? (
          <SubcontractListView />
        ) : isOrderStage ? (
          <OrderSplitView />
        ) : currentLoading ? (
          <div style={{ padding: 16 }}>
            <Skeleton variant="rounded" width="100%" height={200} />
          </div>
        ) : currentItems.length === 0 ? (
          <EmptyState
            title={`${activeStageName}에 항목이 없습니다`}
            message={isProjectStage
              ? '등록된 현장이 없습니다.'
              : '해당 단계에 등록된 업무 항목이 없습니다.'
            }
          />
        ) : !isProjectStage && viewMode === '3d' ? (
          <Suspense fallback={<div style={{ padding: 16 }}><Skeleton variant="rounded" width="100%" height={360} /></div>}>
            <WorkflowPipeline3D
              activeStage={activeStage}
              onStageClick={(code) => {
                const menu = WORKFLOW_STAGES.find(s => s.code === code);
                if (menu) onItemSelect(null);
              }}
              stageCounts={stageCounts}
            />
          </Suspense>
        ) : !isProjectStage && viewMode === 'kanban' ? (
          <div style={{ padding: 12 }}>
            <KanbanBoard items={items} onItemClick={handleItemClick} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minHeight: 0 }}>
            {/* 그리드 */}
            <div
              style={{
                ...gridWrapperStyle,
                ...(isProjectStage ? { height: 370, minHeight: 370 } : {}),
              }}
              className="ag-theme-quartz"
            >
              {isProjectStage ? (
                <AgGridReact<SiteMaster>
                  ref={gridRef}
                  rowData={sites}
                  columnDefs={siteColumnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  onRowClicked={handleSiteRowClicked}
                  rowSelection="single"
                  animateRows
                  suppressCellFocus
                  getRowId={(params) => String(params.data.id)}
                />
              ) : (
                <AgGridReact<WorkflowItem>
                  ref={gridRef}
                  rowData={items}
                  columnDefs={workflowColumnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                  onRowClicked={handleWorkflowRowClicked}
                  rowSelection="single"
                  animateRows
                  domLayout="autoHeight"
                  suppressCellFocus
                  getRowId={(params) => String(params.data.id)}
                />
              )}
            </div>

            {/* 현장 단계: 하단 견적/거래처 탭 */}
            {isProjectStage && (
              <div style={bpSectionStyle}>
                <div style={bpTabBarStyle}>
                  <button
                    type="button"
                    style={activeTab === 'site' ? bpTabActiveStyle : tabInactiveStyle}
                    onClick={() => setActiveTab('site')}
                  >
                    <ClipboardList size={13} />
                    현장정보
                  </button>
                  <button
                    type="button"
                    style={activeTab === 'price' ? bpTabActiveStyle : tabInactiveStyle}
                    onClick={() => setActiveTab('price')}
                  >
                    <Receipt size={13} />
                    견적 단가
                    {prices.length > 0 && (
                      <span style={tabBadgeStyle}>{prices.length}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    style={activeTab === 'bp' ? bpTabActiveStyle : tabInactiveStyle}
                    onClick={() => setActiveTab('bp')}
                  >
                    <Building2 size={13} />
                    거래처 정보
                  </button>
                </div>
                <div style={bpContentStyle}>
                  {activeTab === 'site' ? (
                    <SiteInfoForm
                      selectedSite={selectedSite}
                      onSaved={handleSiteSaved}
                      onDeleted={handleSiteDeleted}
                      onCreated={handleSiteCreated}
                    />
                  ) : activeTab === 'price' ? (
                    !selectedSite ? (
                      <div style={bpEmptyStyle}>
                        현장을 선택하면 견적 단가가 표시됩니다.
                      </div>
                    ) : pricesLoading ? (
                      <div style={{ padding: 16 }}>
                        <Skeleton variant="rounded" width="100%" height={100} />
                      </div>
                    ) : prices.length === 0 ? (
                      <div style={bpEmptyStyle}>
                        등록된 견적 단가가 없습니다. (현장: {selectedSite.siteCd})
                      </div>
                    ) : (
                      <PriceGrid prices={prices} />
                    )
                  ) : (
                    !selectedSite ? (
                      <div style={bpEmptyStyle}>
                        현장을 선택하면 거래처 정보가 표시됩니다.
                      </div>
                    ) : !selectedSite.bpCd ? (
                      <div style={bpEmptyStyle}>
                        선택한 현장에 거래처코드가 등록되지 않았습니다.
                      </div>
                    ) : bpLoading ? (
                      <div style={{ padding: 16 }}>
                        <Skeleton variant="rounded" width="100%" height={100} />
                      </div>
                    ) : !bp ? (
                      <div style={bpEmptyStyle}>
                        거래처 정보를 찾을 수 없습니다. (코드: {selectedSite.bpCd})
                      </div>
                    ) : (
                      <BpForm bp={bp} />
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchSites}
      />
    </div>
  );
}

/* ─── 견적단가 Grid 컴포넌트 ─── */

function PriceGrid({ prices }: { prices: SitePrice[] }) {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo<ColDef<SitePrice>[]>(() => [
    { headerName: '사양', field: 'spec', flex: 2, minWidth: 200 },
    { headerName: '비고', field: 'remark', width: 90 },
    { headerName: '입찰가', field: 'bidPrice', width: 100, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '가공가', field: 'procPrice', width: 100, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '가공비', field: 'processingCost', width: 90, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '아르곤', field: 'argonCost', width: 80, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단열', field: 'insulCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '접합', field: 'structCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '면취', field: 'edgeCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '식각', field: 'etchingCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '단차', field: 'stepCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '이형', field: 'deformCost', width: 70, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화1', field: 'temper1Cost', width: 75, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화2', field: 'temper2Cost', width: 75, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '강화3', field: 'temper3Cost', width: 75, type: 'rightAligned', valueFormatter: numFmt },
    { headerName: '합계', field: 'totalProcessingCost', width: 100, type: 'rightAligned', valueFormatter: numFmt },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({ sortable: true, resizable: true }), []);

  return (
    <div className="ag-theme-quartz" style={{ width: '100%', height: '100%' }}>
      <AgGridReact<SitePrice>
        ref={gridRef}
        rowData={prices}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        suppressCellFocus
        getRowId={(params) => String(params.data.id)}
      />
    </div>
  );
}

function numFmt(params: { value: number | null }) {
  if (params.value == null || params.value === 0) return '-';
  return params.value.toLocaleString();
}

/* ─── 거래처 Form 컴포넌트 ─── */

function BpForm({ bp }: { bp: BusinessPartner }) {
  return (
    <div style={formGridStyle}>
      {/* 1행: 기본정보 */}
      <FormField icon={<Building2 size={13} />} label="거래처명" value={bp.bpNm} />
      <FormField icon={<FileText size={13} />} label="거래처코드" value={bp.bpCd} />
      <FormField icon={<Briefcase size={13} />} label="거래처유형" value={bp.bpType} />
      <FormField icon={<User size={13} />} label="대표자" value={bp.ceoNm} />

      {/* 2행: 사업자/업종 */}
      <FormField icon={<FileText size={13} />} label="사업자번호" value={bp.bizRegNo} />
      <FormField icon={<Briefcase size={13} />} label="업태" value={bp.bizType} />
      <FormField icon={<Briefcase size={13} />} label="업종" value={bp.bizItem} />
      <FormField icon={<User size={13} />} label="담당자" value={bp.contactPerson} />

      {/* 3행: 연락처 */}
      <FormField icon={<Phone size={13} />} label="전화" value={bp.phone} />
      <FormField icon={<Phone size={13} />} label="휴대폰" value={bp.mobile} />
      <FormField icon={<Phone size={13} />} label="팩스" value={bp.fax} />
      <FormField icon={<Mail size={13} />} label="이메일" value={bp.email} />

      {/* 4행: 주소 */}
      <FormField icon={<MapPin size={13} />} label="주소1" value={bp.address1} wide />
      <FormField icon={<MapPin size={13} />} label="주소2" value={bp.address2} wide />

      {/* 5행: 계좌 */}
      <FormField icon={<CreditCard size={13} />} label="은행" value={bp.bankNm} />
      <FormField icon={<CreditCard size={13} />} label="계좌번호" value={bp.bankAccount} />
      <FormField icon={<User size={13} />} label="예금주" value={bp.bankHolder} />
      <FormField label="매출구분" value={bp.salesCategory} />
    </div>
  );
}

function FormField({ icon, label, value, wide }: {
  icon?: React.ReactNode;
  label: string;
  value: string | null | undefined;
  wide?: boolean;
}) {
  return (
    <div style={{ ...formFieldStyle, ...(wide ? { gridColumn: 'span 2' } : {}) }}>
      <label style={formLabelStyle}>
        {icon && <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</span>}
        {label}
      </label>
      <div style={formValueStyle}>
        {value || '-'}
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
  flexShrink: 0,
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
  display: 'flex',
  flexDirection: 'column',
};

const gridWrapperStyle: CSSProperties = {
  width: '100%',
  borderRadius: 12,
  overflow: 'hidden',
  border: '1px solid var(--border)',
};

const addBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '5px 14px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'opacity 0.15s',
};

/* 거래처 섹션 */
const bpSectionStyle: CSSProperties = {
  marginTop: 16,
  borderRadius: 12,
  border: '1px solid var(--border)',
  background: 'var(--panel)',
  overflow: 'hidden',
  flex: 1,
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
};

const bpTabBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  paddingLeft: 4,
};

const bpTabActiveStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 18px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--accent)',
  borderBottom: '2px solid var(--accent)',
  background: 'var(--panel)',
  marginBottom: -1,
  cursor: 'default',
  border: 'none',
  borderBlockEnd: '2px solid var(--accent)',
};

const tabInactiveStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '9px 18px',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'transparent',
  border: 'none',
  marginBottom: -1,
  cursor: 'pointer',
};

const tabBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  padding: '1px 7px',
  borderRadius: 10,
  background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
  color: 'var(--accent)',
  marginLeft: 2,
};

const bpContentStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const bpEmptyStyle: CSSProperties = {
  padding: '24px 20px',
  fontSize: 13,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
};

/* Form Grid */
const formGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '2px 12px',
  padding: '12px 16px',
};

const formFieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '4px 0',
};

const formLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const formValueStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text)',
  padding: '4px 8px',
  borderRadius: 6,
  background: 'var(--panel-2)',
  minHeight: 28,
  display: 'flex',
  alignItems: 'center',
};

export default WorkflowPage;
