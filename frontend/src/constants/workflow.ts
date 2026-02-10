/**
 * 워크플로우 정의 (고정 흐름)
 */

export type StageType = 'ENTRY' | 'MAIN' | 'BRANCH';

export interface WorkflowStage {
  code: string;
  name: string;
  nameEn: string;
  icon: string;
  type: StageType;
  parentCode?: string;
  sortOrder: number;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  // 진입점 (프로젝트/임가공 → 주문으로 합류)
  { code: 'PROD_PROJECT',     name: '현장',     nameEn: 'Site',          icon: 'Building2',      type: 'ENTRY', parentCode: 'PROD_ORDER', sortOrder: 0 },
  { code: 'PROD_SUBCONTRACT', name: '임가공',   nameEn: 'Subcontract',   icon: 'Handshake',      type: 'ENTRY', parentCode: 'PROD_ORDER', sortOrder: 0 },
  // 메인 흐름
  { code: 'PROD_ORDER',       name: '주문',     nameEn: 'Order',         icon: 'ShoppingCart',   type: 'MAIN', sortOrder: 1 },
  { code: 'PROD_PLAN',        name: '생산계획', nameEn: 'Plan',          icon: 'Calendar',       type: 'MAIN', sortOrder: 2 },
  { code: 'PROD_WORK_ORDER',  name: '작업지시', nameEn: 'Work Order',    icon: 'Wrench',         type: 'MAIN', sortOrder: 3 },
  { code: 'PROD_RESULT',      name: '생산실적', nameEn: 'Result',        icon: 'BarChart3',      type: 'MAIN', sortOrder: 4 },
  { code: 'PROD_PACKAGING',   name: '포장',     nameEn: 'Packaging',     icon: 'Package',        type: 'MAIN', sortOrder: 5 },
  { code: 'PROD_SHIPPING',    name: '출고',     nameEn: 'Shipping',      icon: 'Truck',          type: 'MAIN', sortOrder: 6 },
  // 분기 흐름
  { code: 'PROD_PURCHASE',  name: '발주(원부자재)', nameEn: 'Purchase',  icon: 'Receipt',       type: 'BRANCH', parentCode: 'PROD_ORDER',      sortOrder: 1 },
  { code: 'PROD_WORKER',    name: '작업자 배치',   nameEn: 'Worker',    icon: 'HardHat',       type: 'BRANCH', parentCode: 'PROD_WORK_ORDER', sortOrder: 2 },
  { code: 'PROD_DEFECT',    name: '불량',          nameEn: 'Defect',    icon: 'AlertTriangle', type: 'BRANCH', parentCode: 'PROD_RESULT',     sortOrder: 3 },
  { code: 'PROD_INVENTORY', name: '제품재고',      nameEn: 'Inventory', icon: 'Warehouse',     type: 'BRANCH', parentCode: 'PROD_SHIPPING',   sortOrder: 4 },
];

export const PROJECT_PHASES = [
  { code: 'CONTRACT',      name: '수주' },
  { code: 'DESIGN',        name: '설계' },
  { code: 'CONSTRUCT',     name: '시공' },
  { code: 'COMPLETE',      name: '완공' },
  { code: 'AFTER_SERVICE', name: 'A/S' },
];

export const ENTRY_STAGES = WORKFLOW_STAGES.filter(s => s.type === 'ENTRY');
export const MAIN_STAGES = WORKFLOW_STAGES.filter(s => s.type === 'MAIN');
export const getBranches = (parentCode: string) =>
  WORKFLOW_STAGES.filter(s => s.type === 'BRANCH' && s.parentCode === parentCode);

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:     { label: '대기',   color: 'gray' },
  IN_PROGRESS: { label: '진행중', color: 'blue' },
  COMPLETED:   { label: '완료',   color: 'green' },
  BLOCKED:     { label: '차단',   color: 'red' },
};

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  HIGH:   { label: '높음', color: 'red' },
  MEDIUM: { label: '보통', color: 'orange' },
  LOW:    { label: '낮음', color: 'gray' },
};
