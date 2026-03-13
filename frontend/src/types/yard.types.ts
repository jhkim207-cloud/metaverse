/**
 * 야적장(Storage Yard) 3D 시뮬레이션 타입 정의
 */

/** 물건 형태 */
export type YardItemType = 'BOX' | 'HEXAGON' | 'CIRCLE';

/** 물건 상태 */
export type YardItemStatus = 'PLACED' | 'RESERVED' | 'DRAGGING';

/** CCTV 방향 */
export type CCTVDirection = 'up' | 'down' | 'left' | 'right';

/** 점유율 레벨 */
export type OccupancyLevel = 'EMPTY' | 'LOW' | 'MEDIUM' | 'HIGH';

/** 야적장 구역 (한 칸) */
export interface YardSpace {
  id: string;
  name: string;
  position: [number, number, number];
  size: { width: number; length: number };
  occupiedArea: number;
  occupancyLevel: OccupancyLevel;
  occupiedBy: string[];
}

/** 야적장 물건 */
export interface YardItem {
  id: string;
  itemType: YardItemType;
  width: number;
  length: number;
  position: [number, number, number];
  rotationY: number;
  color: string;
  status: YardItemStatus;
}

/** CCTV */
export interface YardCCTV {
  id: string;
  name: string;
  position: [number, number, number];
  direction: CCTVDirection;
  alarmActive: boolean;
}

/** 야적장 레이아웃 설정 */
export interface YardConfig {
  rows: number;
  columns: number;
  sectors: number;
  spaceWidth: number;
  spaceLength: number;
  spacing: number;
}

/** 야적장 전체 상태 */
export interface YardState {
  config: YardConfig;
  spaces: YardSpace[];
  items: YardItem[];
  cctvs: YardCCTV[];
  selectedItemId: string | null;
  nightMode: boolean;
}

/** 점유율 색상 매핑 */
export const OCCUPANCY_COLORS: Record<OccupancyLevel, string> = {
  EMPTY: '#CCCCCC',
  LOW: '#00FF00',
  MEDIUM: '#FFFF00',
  HIGH: '#FF0000',
};

/** 점유율 임계값 (%) */
export const OCCUPANCY_THRESHOLDS = {
  LOW: 30,
  HIGH: 70,
} as const;
