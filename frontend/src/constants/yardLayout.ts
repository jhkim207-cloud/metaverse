/**
 * 야적장 레이아웃 설정
 *
 * PDF 원본 기준: 5행 x 6열 = 30칸, 3개 블록(섹터)
 * 스케일: 100 단위 = 야적장 한 칸
 */

import type { YardConfig, YardCCTV, CCTVDirection } from '../types/yard.types';

/** 기본 야적장 설정 */
export const DEFAULT_YARD_CONFIG: YardConfig = {
  rows: 5,
  columns: 6,
  sectors: 3,
  spaceWidth: 100,
  spaceLength: 100,
  spacing: 120,
};

/** 3D 렌더링 스케일 (월드 유닛 변환) */
export const YARD_SCALE = 0.01; // 100 → 1 월드 유닛

/** 색상 */
export const YARD_COLORS = {
  SCENE_BG: '#CCCCCC',
  GROUND: '#E59100',
  WALL: '#808080',
  DELETE_ZONE: '#FF4444',
  BOX_DEFAULT: '#FFFF00',
  HEXAGON_DEFAULT: '#00FFFF',
  CCTV_POLE: '#333333',
  CCTV_SPHERE: '#FF0000',
  CCTV_ALARM: '#FF0000',
  GRID_BORDER: '#000000',
  GRID_EMPTY: '#CCCCCC',
  GRID_LOW: '#00FF00',
  GRID_MEDIUM: '#FFFF00',
  GRID_HIGH: '#FF0000',
} as const;

/** 벽 치수 */
export const WALL_CONFIG = {
  thickness: 10,
  height: 50,
} as const;

/** CCTV 기본 배치 (12개) - PDF 원본 기준 */
export function generateDefaultCCTVs(config: YardConfig): Omit<YardCCTV, 'id'>[] {
  const { spaceWidth, spaceLength, spacing } = config;
  const a = 2 * spaceWidth + spacing;
  const b = 2 * spaceWidth + 2 * spacing;
  const c = 3.5 * spaceLength;

  const positions: { x: number; z: number; name: string; direction: CCTVDirection }[] = [
    // 하단 (down)
    { x: -a, z: -c, name: 'cctv1', direction: 'down' },
    { x: 0, z: -c, name: 'cctv2', direction: 'down' },
    { x: a, z: -c, name: 'cctv3', direction: 'down' },
    // 오른쪽 (right)
    { x: b, z: -c / 2, name: 'cctv4', direction: 'right' },
    { x: b, z: 0, name: 'cctv5', direction: 'right' },
    { x: b, z: c / 2, name: 'cctv6', direction: 'right' },
    // 상단 (up)
    { x: a, z: c, name: 'cctv7', direction: 'up' },
    { x: 0, z: c, name: 'cctv8', direction: 'up' },
    { x: -a, z: c, name: 'cctv9', direction: 'up' },
    // 왼쪽 (left)
    { x: -b, z: c / 2, name: 'cctv10', direction: 'left' },
    { x: -b, z: 0, name: 'cctv11', direction: 'left' },
    { x: -b, z: -c / 2, name: 'cctv12', direction: 'left' },
  ];

  return positions.map(({ x, z, name, direction }) => ({
    name,
    position: [x * YARD_SCALE, 0, z * YARD_SCALE] as [number, number, number],
    direction,
    alarmActive: false,
  }));
}

/** 야적장 구역(칸) 위치 계산 */
export function generateSpacePositions(config: YardConfig) {
  const { rows, columns, spaceWidth, spaceLength } = config;
  const spaces: { x: number; z: number; name: string }[] = [];
  let index = 1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const x = j * spaceWidth - (columns * spaceWidth) / 2 + spaceWidth / 2;
      const z = i * spaceLength - (rows * spaceLength) / 2 + spaceLength / 2;
      spaces.push({ x, z, name: `${index}` });
      index++;
    }
  }

  return spaces;
}

/** 삭제 영역 위치 (야적장 왼쪽) */
export function getDeleteZonePosition(config: YardConfig) {
  const { spaceWidth, spacing } = config;
  return {
    x: -4 * spaceWidth - 2 * spacing,
    z: 0,
    width: 2 * spaceWidth,
    length: 5 * config.spaceLength,
  };
}

/** 준비 영역 (야적장 왼쪽, 물건 생성 위치) */
export function getReadyZonePosition(config: YardConfig) {
  const { spaceWidth, spacing } = config;
  return {
    x: -4 * spaceWidth - 2 * spacing,
    z: 0,
    width: 2 * spaceWidth,
    length: 5 * config.spaceLength,
  };
}

/** 벽 위치 계산 */
export function getWallPositions(config: YardConfig) {
  const { spaceWidth, spaceLength, spacing, rows } = config;
  const halfW = 3 * spaceWidth + 1.5 * spacing;
  const halfH = 4 * spaceLength;

  return {
    left: -halfW,
    right: halfW,
    top: -halfH,
    bottom: rows * spaceLength,
  };
}
