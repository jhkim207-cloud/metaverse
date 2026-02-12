/**
 * 공장 디지털 트윈 타입 정의
 */

export type ZoneType = 'PRODUCTION' | 'WAREHOUSE' | 'PACKING' | 'SHIPPING'
  | 'INSPECTION' | 'PREPARATION' | 'UTILITY';
export type ZoneStatus = 'ACTIVE' | 'IDLE' | 'ERROR' | 'MAINTENANCE';

/** 공장 구역 */
export interface FactoryZone {
  id: string;
  name: string;
  type: ZoneType;
  status: ZoneStatus;
  position: [number, number, number];
  size: [number, number, number];
  workerCount: number;
  currentJob?: string;
  capacity?: number;
  occupancy?: number;
  /** 구역 내 장비 목록 */
  equipment?: string[];
  /** 공정 순서 번호 (1~17) */
  processStep?: number;
  /** 실제 크기(m) 참조용 [width, depth] */
  realSize?: [number, number];
}

/** 물류 흐름 경로 */
export interface FlowPath {
  id: string;
  from: string;
  to: string;
  isActive: boolean;
  /** 기본 색상 오버라이드 */
  color?: string;
}

/** 공장 실시간 상태 응답 */
export interface FactoryRealtimeStatus {
  zones: FactoryZone[];
  flows: FlowPath[];
  totalWorkers: number;
  activeLines: number;
  totalLines: number;
}
