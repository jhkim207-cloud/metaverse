/**
 * 야적장 상태 관리 hook
 *
 * 충돌 검사, 점유율 계산, 드래그 처리 등 야적장 핵심 로직
 */

import { useState, useCallback, useRef } from 'react';
import type {
  YardState,
  YardItem,
  YardSpace,
  YardItemType,
  OccupancyLevel,
  YardCCTV,
} from '../types/yard.types';
import { OCCUPANCY_THRESHOLDS } from '../types/yard.types';
import {
  DEFAULT_YARD_CONFIG,
  YARD_SCALE,
  generateSpacePositions,
  generateDefaultCCTVs,
  YARD_COLORS,
} from '../constants/yardLayout';

function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

/** 점유율 → 레벨 변환 */
function getOccupancyLevel(percentage: number): OccupancyLevel {
  if (percentage === 0) return 'EMPTY';
  if (percentage <= OCCUPANCY_THRESHOLDS.LOW) return 'LOW';
  if (percentage > OCCUPANCY_THRESHOLDS.HIGH) return 'HIGH';
  return 'MEDIUM';
}

/** 두 박스의 겹침 면적 계산 (2D XZ 평면) */
function calculateOverlapArea(
  box: { x: number; z: number; hw: number; hl: number },
  space: { x: number; z: number; hw: number; hl: number },
): number {
  const overlapMinX = Math.max(box.x - box.hw, space.x - space.hw);
  const overlapMaxX = Math.min(box.x + box.hw, space.x + space.hw);
  const overlapMinZ = Math.max(box.z - box.hl, space.z - space.hl);
  const overlapMaxZ = Math.min(box.z + box.hl, space.z + space.hl);

  if (overlapMaxX <= overlapMinX || overlapMaxZ <= overlapMinZ) return 0;
  return (overlapMaxX - overlapMinX) * (overlapMaxZ - overlapMinZ);
}

/** 아이템의 바운딩 박스 (스케일 적용된 월드 좌표) */
function getItemBounds(item: YardItem) {
  if (item.itemType === 'HEXAGON' || item.itemType === 'CIRCLE') {
    const r = Math.max(item.width, item.length) / 2 * YARD_SCALE;
    return { x: item.position[0], z: item.position[2], hw: r, hl: r };
  }
  return {
    x: item.position[0],
    z: item.position[2],
    hw: (item.width / 2) * YARD_SCALE,
    hl: (item.length / 2) * YARD_SCALE,
  };
}

/** 초기 상태 생성 */
function createInitialState(): YardState {
  const config = DEFAULT_YARD_CONFIG;
  const rawSpaces = generateSpacePositions(config);

  const spaces: YardSpace[] = rawSpaces.map((s) => ({
    id: `space${s.name}`,
    name: s.name,
    position: [s.x * YARD_SCALE, 0, s.z * YARD_SCALE] as [number, number, number],
    size: { width: config.spaceWidth * YARD_SCALE, length: config.spaceLength * YARD_SCALE },
    occupiedArea: 0,
    occupancyLevel: 'EMPTY' as OccupancyLevel,
    occupiedBy: [],
  }));

  const rawCctvs = generateDefaultCCTVs(config);
  const cctvs: YardCCTV[] = rawCctvs.map((c) => ({
    ...c,
    id: generateId('cctv'),
  }));

  // 초기 물건 (PDF처럼 빨간 박스 1개 + 육각형 1개)
  const readyX = (-4 * config.spaceWidth - 2 * config.spacing) * YARD_SCALE;
  const items: YardItem[] = [
    {
      id: generateId('item'),
      itemType: 'BOX',
      width: 40,
      length: 40,
      position: [readyX - 0.5, 0.05, -0.5],
      rotationY: 0,
      color: '#FF0000',
      status: 'PLACED',
    },
    {
      id: generateId('item'),
      itemType: 'HEXAGON',
      width: 40,
      length: 40,
      position: [readyX - 0.5, 0.05, 0.5],
      rotationY: 0,
      color: YARD_COLORS.HEXAGON_DEFAULT,
      status: 'PLACED',
    },
  ];

  return {
    config,
    spaces,
    items,
    cctvs,
    selectedItemId: null,
    nightMode: false,
  };
}

export function useYard() {
  const [state, setState] = useState<YardState>(createInitialState);
  const dragStartPos = useRef<[number, number, number] | null>(null);

  /** 물건 추가 */
  const addItem = useCallback((type: YardItemType, width: number, length: number) => {
    const config = DEFAULT_YARD_CONFIG;
    const readyX = (-4 * config.spaceWidth - 2 * config.spacing) * YARD_SCALE;
    const color = type === 'BOX'
      ? `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
      : YARD_COLORS.HEXAGON_DEFAULT;

    const newItem: YardItem = {
      id: generateId('item'),
      itemType: type,
      width,
      length,
      position: [readyX, 0.05, 0],
      rotationY: 0,
      color,
      status: 'PLACED',
    };

    setState((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    return newItem.id;
  }, []);

  /** 물건 삭제 */
  const removeItem = useCallback((itemId: string) => {
    setState((prev) => {
      const items = prev.items.filter((i) => i.id !== itemId);
      const spaces = recalculateOccupancy(prev.spaces, items);
      return { ...prev, items, spaces, selectedItemId: null };
    });
  }, []);

  /** 물건 위치 업데이트 (드래그 중) */
  const moveItem = useCallback((itemId: string, newPos: [number, number, number]) => {
    setState((prev) => {
      const items = prev.items.map((item) =>
        item.id === itemId ? { ...item, position: newPos } : item,
      );
      return { ...prev, items };
    });
  }, []);

  /** 드래그 시작 */
  const startDrag = useCallback((itemId: string) => {
    setState((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (item) dragStartPos.current = [...item.position];
      return {
        ...prev,
        selectedItemId: itemId,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, status: 'DRAGGING' as const } : i,
        ),
      };
    });
  }, []);

  /** 드래그 종료 - 충돌 검사 후 유효하면 배치, 아니면 원위치 */
  const endDrag = useCallback((itemId: string) => {
    setState((prev) => {
      const item = prev.items.find((i) => i.id === itemId);
      if (!item) return prev;

      const bounds = getItemBounds(item);

      // 다른 아이템과 충돌 검사
      const hasCollision = prev.items.some((other) => {
        if (other.id === itemId) return false;
        const otherBounds = getItemBounds(other);
        return calculateOverlapArea(bounds, otherBounds) > 0;
      });

      // 삭제 영역 체크
      const config = prev.config;
      const deleteX = (-4 * config.spaceWidth - 2 * config.spacing) * YARD_SCALE;
      const deleteHW = config.spaceWidth * YARD_SCALE;
      const deleteHL = (5 * config.spaceLength / 2) * YARD_SCALE;
      const isInDeleteZone =
        item.position[0] >= deleteX - deleteHW &&
        item.position[0] <= deleteX + deleteHW &&
        item.position[2] >= -deleteHL &&
        item.position[2] <= deleteHL;

      if (isInDeleteZone) {
        const items = prev.items.filter((i) => i.id !== itemId);
        const spaces = recalculateOccupancy(prev.spaces, items);
        return { ...prev, items, spaces, selectedItemId: null };
      }

      // 충돌이 있으면 원위치, 구역 밖은 허용 (공간 확보 가능)
      let items: YardItem[];
      if (hasCollision) {
        const originalPos = dragStartPos.current ?? item.position;
        items = prev.items.map((i) =>
          i.id === itemId ? { ...i, position: originalPos, status: 'PLACED' as const } : i,
        );
      } else {
        items = prev.items.map((i) =>
          i.id === itemId ? { ...i, status: 'PLACED' as const } : i,
        );
      }

      const spaces = recalculateOccupancy(prev.spaces, items);
      dragStartPos.current = null;
      return { ...prev, items, spaces, selectedItemId: null };
    });
  }, []);

  /** 물건 회전 (90도) */
  const rotateItem = useCallback((itemId: string) => {
    setState((prev) => {
      const items = prev.items.map((item) =>
        item.id === itemId
          ? { ...item, rotationY: item.rotationY + Math.PI / 2 }
          : item,
      );
      return { ...prev, items };
    });
  }, []);

  /** CCTV 알람 토글 */
  const toggleCCTVAlarm = useCallback((cctvId: string) => {
    setState((prev) => ({
      ...prev,
      cctvs: prev.cctvs.map((c) =>
        c.id === cctvId ? { ...c, alarmActive: !c.alarmActive } : c,
      ),
    }));
  }, []);

  /** 야간 모드 토글 */
  const toggleNightMode = useCallback(() => {
    setState((prev) => ({ ...prev, nightMode: !prev.nightMode }));
  }, []);

  /** 선택 해제 */
  const clearSelection = useCallback(() => {
    setState((prev) => ({ ...prev, selectedItemId: null }));
  }, []);

  return {
    state,
    addItem,
    removeItem,
    moveItem,
    startDrag,
    endDrag,
    rotateItem,
    toggleCCTVAlarm,
    toggleNightMode,
    clearSelection,
  };
}

/** 전체 구역 점유율 재계산 */
function recalculateOccupancy(spaces: YardSpace[], items: YardItem[]): YardSpace[] {
  return spaces.map((space) => {
    let totalArea = 0;
    const occupiedBy: string[] = [];
    const spaceArea = space.size.width * space.size.length;
    const spaceBounds = {
      x: space.position[0],
      z: space.position[2],
      hw: space.size.width / 2,
      hl: space.size.length / 2,
    };

    items.forEach((item) => {
      if (item.status === 'DRAGGING') return;
      const itemBounds = getItemBounds(item);
      const overlap = calculateOverlapArea(itemBounds, spaceBounds);
      if (overlap > 0) {
        totalArea += overlap;
        occupiedBy.push(item.id);
      }
    });

    const percentage = spaceArea > 0 ? (totalArea / spaceArea) * 100 : 0;
    return {
      ...space,
      occupiedArea: totalArea,
      occupancyLevel: getOccupancyLevel(percentage),
      occupiedBy,
    };
  });
}
