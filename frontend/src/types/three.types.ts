/**
 * Three.js 3D 컴포넌트 공통 타입 정의
 */

/** 3D 테마 소재 설정 (Liquid Glass) */
export interface ThreeMaterialConfig {
  panelColor: string;
  panelOpacity: number;
  accentColor: string;
  textColor: string;
  bgColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  ambientIntensity: number;
  directionalIntensity: number;
}

/** 3D 씬 설정 */
export interface SceneConfig {
  /** on-demand 렌더링 여부 (기본 true) */
  demandRendering?: boolean;
  /** 디바이스 픽셀 비율 (기본 [1, 2]) */
  dpr?: [number, number];
  /** 카메라 기본 위치 */
  cameraPosition?: [number, number, number];
  /** 카메라 FOV */
  cameraFov?: number;
}

/** 워크플로우 3D 파이프라인 단계 데이터 */
export interface Pipeline3DStage {
  code: string;
  name: string;
  nameEn: string;
  icon: string;
  type: 'ENTRY' | 'MAIN' | 'BRANCH';
  parentCode?: string;
  sortOrder: number;
  count: number;
  isActive: boolean;
  isCompleted: boolean;
}

/** 3D KPI 데이터 */
export interface Kpi3DData {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

/** 3D 도넛 세그먼트 */
export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

/** 공장 구역 3D 데이터 */
export interface FactoryZone3D {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  type: 'PRODUCTION' | 'WAREHOUSE' | 'PACKING' | 'SHIPPING' | 'INSPECTION' | 'PREPARATION' | 'UTILITY';
  status: 'ACTIVE' | 'IDLE' | 'ERROR';
}

/** 재고 위치 3D 데이터 */
export interface InventoryLocation3D {
  locationId: string;
  position: [number, number, number];
  occupancyRate: number;
  materialType: string;
  currentQty: number;
  maxQty: number;
}

/** 재단 파트 3D 데이터 */
export interface CuttingPart3D {
  id: string;
  shape: [x: number, y: number, width: number, height: number];
  orderId: string;
  sequence: number;
  color: string;
}

/** 생산 대시보드 KPI 데이터 */
export interface ProductionDashboardKpi {
  dailyProduction: Kpi3DData[];
  defectRate: DonutSegment[];
  lossRate: DonutSegment[];
  stageProgress: Kpi3DData[];
  weeklyTrend: Kpi3DData[];
  containerStatus: DonutSegment[];
}
