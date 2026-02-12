/**
 * HK지앤텍 복층유리(IGU) 공장 레이아웃 정의
 *
 * 실제 복층유리 가공공장의 표준 공정(17단계)을 기반으로 설계.
 * 스케일: 1 월드 유닛 = 2미터 (실제 공장 50m×25m → 월드 25×12.5)
 *
 * 배치 구조:
 *   북쪽(Z<0): 유리 가공 라인 (원판→재단→강화→세척→검사)
 *   중앙(Z≈0): 지게차 통로 (4m)
 *   남쪽(Z>0): 조립 라인 + 지원 (간봉→조립→실링→포장→출고)
 */

import type { FactoryZone, FlowPath } from '../types/factory.types';

/** 월드 스케일: 1 유닛 = FACTORY_SCALE 미터 */
export const FACTORY_SCALE = 2;

/** 공장 월드 바운더리 */
export const FACTORY_WORLD_BOUNDS = {
  width: 25,
  depth: 12.5,
  height: 3.5,
  center: [12.5, 0, 0] as [number, number, number],
  /** 지게차 통로 Z 범위 */
  aisleZ: [-1, 1] as [number, number],
} as const;

/** IGU 공정 단계 (17단계) */
export const IGU_PROCESS_STEPS = [
  { step: 1, name: '원판 입고/적재', zone: 'RAW_STORAGE' },
  { step: 2, name: 'CNC 재단', zone: 'CNC_CUTTING' },
  { step: 3, name: '유리 절단', zone: 'CNC_CUTTING' },
  { step: 4, name: '에지 가공', zone: 'CNC_CUTTING' },
  { step: 5, name: '강화', zone: 'TEMPERING' },
  { step: 6, name: '세척/건조', zone: 'WASHING' },
  { step: 7, name: '외관검사', zone: 'INSPECTION_1' },
  { step: 8, name: '간봉 벤딩', zone: 'SPACER_PREP' },
  { step: 9, name: '건조제 충전', zone: 'SPACER_PREP' },
  { step: 10, name: '1차 실링(부틸)', zone: 'SPACER_PREP' },
  { step: 11, name: '간봉 부착', zone: 'ASSEMBLY_PRESS' },
  { step: 12, name: '외판 합착', zone: 'ASSEMBLY_PRESS' },
  { step: 13, name: '압착', zone: 'ASSEMBLY_PRESS' },
  { step: 14, name: '아르곤 충전', zone: 'ARGON_FILL' },
  { step: 15, name: '2차 실링', zone: 'SECONDARY_SEAL' },
  { step: 16, name: '품질검사', zone: 'INSPECTION_2' },
  { step: 17, name: '완제품 적재', zone: 'FG_STORAGE' },
] as const;

/** 기본 공장 구역 정의 (14개 구역) */
export const DEFAULT_FACTORY_ZONES: FactoryZone[] = [
  // ========== 북쪽 (Z < 0): 유리 가공 라인 ==========

  {
    id: 'RAW_STORAGE',
    name: '원판유리 창고',
    type: 'WAREHOUSE',
    status: 'ACTIVE',
    position: [2.5, 0, -3.75],
    size: [5, 1.2, 3.5],
    workerCount: 2,
    capacity: 200,
    occupancy: 145,
    processStep: 1,
    realSize: [10, 7],
  },
  {
    id: 'CNC_CUTTING',
    name: 'CNC 재단',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [9, 0, -3.75],
    size: [7, 0.8, 3.5],
    workerCount: 4,
    currentJob: '재단 #CT-2026-0101',
    equipment: ['CNC 재단기', '에어 플로팅 테이블', '유리 로더'],
    processStep: 2,
    realSize: [14, 7],
  },
  {
    id: 'TEMPERING',
    name: '강화로',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [16, 0, -3.75],
    size: [6, 1.5, 3.5],
    workerCount: 3,
    currentJob: '강화 작업 진행중',
    equipment: ['강화 가열로', '퀀칭 블로워'],
    processStep: 5,
    realSize: [12, 7],
  },
  {
    id: 'WASHING',
    name: '세척/건조',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [21, 0, -3.75],
    size: [3.5, 0.9, 2],
    workerCount: 2,
    currentJob: '세척 가동중',
    equipment: ['수직 세척기', '건조기'],
    processStep: 6,
    realSize: [7, 4],
  },
  {
    id: 'INSPECTION_1',
    name: '외관검사',
    type: 'INSPECTION',
    status: 'ACTIVE',
    position: [23.75, 0, -3.75],
    size: [1.5, 0.7, 1.5],
    workerCount: 2,
    processStep: 7,
    realSize: [3, 3],
  },

  // ========== 남쪽 (Z > 0): 조립 라인 + 지원 ==========

  {
    id: 'OFFICE_UTIL',
    name: '사무실',
    type: 'UTILITY',
    status: 'ACTIVE',
    position: [2, 0, 3.5],
    size: [4, 1.0, 3],
    workerCount: 3,
    realSize: [8, 6],
  },
  {
    id: 'SPACER_PREP',
    name: '간봉 준비',
    type: 'PREPARATION',
    status: 'ACTIVE',
    position: [7.5, 0, 3],
    size: [3, 0.7, 2],
    workerCount: 2,
    currentJob: '간봉 벤딩 + 건조제',
    equipment: ['간봉 벤딩기', '건조제 충전기', '부틸 도포기'],
    processStep: 8,
    realSize: [6, 4],
  },
  {
    id: 'ASSEMBLY_PRESS',
    name: '조립/압착',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [13, 0, 3],
    size: [7, 0.8, 2],
    workerCount: 6,
    currentJob: '생산계획 PP-2026-0021',
    equipment: ['간봉 부착기', '패널 조립기', '프레스'],
    processStep: 11,
    realSize: [14, 4],
  },
  {
    id: 'ARGON_FILL',
    name: '가스충전',
    type: 'PRODUCTION',
    status: 'IDLE',
    position: [17.25, 0, 4.5],
    size: [1, 0.5, 0.5],
    workerCount: 1,
    processStep: 14,
    realSize: [2, 1],
  },
  {
    id: 'SECONDARY_SEAL',
    name: '2차 실링',
    type: 'PRODUCTION',
    status: 'ACTIVE',
    position: [20.25, 0, 3],
    size: [5, 0.8, 2],
    workerCount: 3,
    currentJob: '실링 로봇 가동중',
    equipment: ['폴리설파이드 도포 로봇'],
    processStep: 15,
    realSize: [10, 4],
  },
  {
    id: 'INSPECTION_2',
    name: '품질검사',
    type: 'INSPECTION',
    status: 'ACTIVE',
    position: [23.5, 0, 2],
    size: [1.5, 0.7, 1],
    workerCount: 2,
    processStep: 16,
    realSize: [3, 2],
  },
  {
    id: 'PACKING_AREA',
    name: '포장',
    type: 'PACKING',
    status: 'ACTIVE',
    position: [17, 0, 5.5],
    size: [3, 0.5, 1.5],
    workerCount: 3,
    currentJob: '포장 진행중',
    realSize: [6, 3],
  },
  {
    id: 'FG_STORAGE',
    name: '완제품 창고',
    type: 'WAREHOUSE',
    status: 'ACTIVE',
    position: [22.5, 0, 5.25],
    size: [5, 1.2, 2],
    workerCount: 2,
    capacity: 150,
    occupancy: 63,
    processStep: 17,
    realSize: [10, 4],
  },
  {
    id: 'SHIPPING_AREA',
    name: '출고장',
    type: 'SHIPPING',
    status: 'IDLE',
    position: [24.5, 0, 0],
    size: [2.5, 0.5, 1.5],
    workerCount: 1,
    realSize: [5, 3],
  },
];

/** 기본 물류 흐름 경로 (16개) */
export const DEFAULT_FLOW_PATHS: FlowPath[] = [
  // 유리 가공 라인 (북쪽)
  { id: 'F01', from: 'RAW_STORAGE', to: 'CNC_CUTTING', isActive: true },
  { id: 'F02', from: 'CNC_CUTTING', to: 'TEMPERING', isActive: true },
  { id: 'F03', from: 'CNC_CUTTING', to: 'WASHING', isActive: true },
  { id: 'F04', from: 'TEMPERING', to: 'WASHING', isActive: true },
  { id: 'F05', from: 'WASHING', to: 'INSPECTION_1', isActive: true },

  // 통로 횡단
  { id: 'F06', from: 'INSPECTION_1', to: 'ASSEMBLY_PRESS', isActive: true },

  // 간봉 서브라인
  { id: 'F07', from: 'SPACER_PREP', to: 'ASSEMBLY_PRESS', isActive: true, color: '#5e5ce6' },

  // 조립 라인 (남쪽)
  { id: 'F08', from: 'ASSEMBLY_PRESS', to: 'ARGON_FILL', isActive: false },
  { id: 'F09', from: 'ASSEMBLY_PRESS', to: 'SECONDARY_SEAL', isActive: true },
  { id: 'F10', from: 'ARGON_FILL', to: 'SECONDARY_SEAL', isActive: false },
  { id: 'F11', from: 'SECONDARY_SEAL', to: 'INSPECTION_2', isActive: true },

  // 출고 라인
  { id: 'F12', from: 'INSPECTION_2', to: 'PACKING_AREA', isActive: true },
  { id: 'F13', from: 'PACKING_AREA', to: 'FG_STORAGE', isActive: true },
  { id: 'F14', from: 'FG_STORAGE', to: 'SHIPPING_AREA', isActive: false },
  { id: 'F15', from: 'RAW_STORAGE', to: 'SHIPPING_AREA', isActive: false },
  { id: 'F16', from: 'FG_STORAGE', to: 'SHIPPING_AREA', isActive: true },
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
  INSPECTION: '#30d158',
  PREPARATION: '#5e5ce6',
  UTILITY: '#636366',
};
