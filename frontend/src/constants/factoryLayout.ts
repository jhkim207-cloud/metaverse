/**
 * HK지앤텍 공장 구역 레이아웃 정의
 *
 * 3D 좌표 기준 (X: 좌→우, Y: 높이, Z: 위→아래)
 * 단위: 3D 월드 유닛 (실제 비율은 아님, 시각적 가독성 우선)
 */

import type { FactoryZone, FlowPath } from '../types/factory.types';

/** 기본 공장 구역 정의 (백엔드 미연동 시 기본값) */
export const DEFAULT_FACTORY_ZONES: FactoryZone[] = [
  {
    id: 'MULTI_LINE1',
    name: '복층 1호기',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [-3, 0, -1.5],
    size: [2.2, 0.8, 1.8],
    workerCount: 8,
    currentJob: '생산계획 PP-2026-0021',
  },
  {
    id: 'MULTI_LINE2',
    name: '복층 2호기',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [0, 0, -1.5],
    size: [2.2, 0.8, 1.8],
    workerCount: 7,
    currentJob: '생산계획 PP-2026-0022',
  },
  {
    id: 'CUTTING_TEMPER',
    name: '재단/강화 라인',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [3.5, 0, -1.5],
    size: [3, 0.8, 1.8],
    workerCount: 5,
    currentJob: '재단 작업',
  },
  {
    id: 'RAW_WAREHOUSE',
    name: '원판유리 창고',
    type: 'WAREHOUSE',
    status: 'ACTIVE',
    position: [-3, 0, 2],
    size: [2.2, 0.6, 1.5],
    workerCount: 2,
    capacity: 100,
    occupancy: 72,
  },
  {
    id: 'PACKING_AREA',
    name: '포장 구역',
    type: 'PACKING',
    status: 'ACTIVE',
    position: [1, 0, 2],
    size: [2.5, 0.5, 1.5],
    workerCount: 4,
    currentJob: '포장 진행 중',
  },
  {
    id: 'SHIPPING_AREA',
    name: '출고 구역',
    type: 'SHIPPING',
    status: 'IDLE',
    position: [4.5, 0, 2],
    size: [2, 0.5, 1.5],
    workerCount: 1,
  },
];

/** 기본 물류 흐름 경로 */
export const DEFAULT_FLOW_PATHS: FlowPath[] = [
  { id: 'F1', from: 'RAW_WAREHOUSE', to: 'CUTTING_TEMPER', isActive: true },
  { id: 'F2', from: 'CUTTING_TEMPER', to: 'MULTI_LINE1', isActive: true },
  { id: 'F3', from: 'CUTTING_TEMPER', to: 'MULTI_LINE2', isActive: true },
  { id: 'F4', from: 'MULTI_LINE1', to: 'PACKING_AREA', isActive: true },
  { id: 'F5', from: 'MULTI_LINE2', to: 'PACKING_AREA', isActive: true },
  { id: 'F6', from: 'PACKING_AREA', to: 'SHIPPING_AREA', isActive: false },
];

/** 구역 상태별 색상 */
export const ZONE_STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#30d158',
  IDLE: '#86868b',
  ERROR: '#ff453a',
  MAINTENANCE: '#ff9f0a',
};

/** 구역 타입별 기본 색상 */
export const ZONE_TYPE_COLORS: Record<string, string> = {
  PRODUCTION: '#1e3a5f',
  WAREHOUSE: '#0a84ff',
  PACKING: '#bf5af2',
  SHIPPING: '#ff9f0a',
};
