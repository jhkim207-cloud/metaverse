/**
 * 야적장 차량/경로 관련 타입
 */

export type VehicleType = 'FORKLIFT' | 'TRUCK' | 'AGV' | 'CRANE';
export type VehicleStatus = 'IDLE' | 'MOVING' | 'LOADING' | 'UNLOADING' | 'OFF_ROUTE' | 'STOPPED';

export interface YardVehicle {
  id: number;
  vehicleNm: string;
  vehicleType: VehicleType;
  currentX: number;
  currentZ: number;
  heading: number;
  speed: number;
  status: VehicleStatus;
  assignedRouteId: number | null;
  isOffRoute: boolean;
}

export interface RouteWaypoint {
  id: number;
  routeId: number;
  seq: number;
  positionX: number;
  positionZ: number;
  actionType: string | null;
}

export interface YardRoute {
  id: number;
  routeNm: string;
  vehicleId: number | null;
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  waypoints: RouteWaypoint[];
}

/** 차량 상태별 색상 */
export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  IDLE: '#86868b',
  MOVING: '#3B82F6',
  LOADING: '#F59E0B',
  UNLOADING: '#F97316',
  OFF_ROUTE: '#EF4444',
  STOPPED: '#374151',
};

/** 차량 유형별 라벨 */
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  FORKLIFT: '지게차',
  TRUCK: '트럭',
  AGV: 'AGV',
  CRANE: '크레인',
};
