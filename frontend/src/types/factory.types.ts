/**
 * 공장 디지털 트윈 타입 정의
 */

export type ZoneType = 'PRODUCTION' | 'WAREHOUSE' | 'PACKING' | 'SHIPPING';
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
}

/** 물류 흐름 경로 */
export interface FlowPath {
  id: string;
  from: string;
  to: string;
  isActive: boolean;
}

/** 공장 실시간 상태 응답 */
export interface FactoryRealtimeStatus {
  zones: FactoryZone[];
  flows: FlowPath[];
  totalWorkers: number;
  activeLines: number;
  totalLines: number;
}
