/**
 * 배치 시뮬레이션 훅
 *
 * 물건 치수를 입력하면 최적 배치 위치를 추천
 * MVP: 클라이언트 측 계산 (향후 백엔드 API 연동)
 */

import { useState, useCallback } from 'react';
import type { YardSpace } from '../types/yard.types';
import type { SimRecommendation } from '../components/three/yard/YardSimOverlay';

export function usePlacementSimulation() {
  const [recommendations, setRecommendations] = useState<SimRecommendation[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  /** 클라이언트 측 시뮬레이션: 각 셀의 빈 공간을 계산하여 점수화 */
  const simulate = useCallback(
    (spaces: YardSpace[], itemWidth: number, itemLength: number) => {
      setIsSimulating(true);

      const results: SimRecommendation[] = [];

      for (const space of spaces) {
        const spaceArea = space.size.width * space.size.length;
        const itemArea = (itemWidth * 0.01) * (itemLength * 0.01);
        const availableArea = spaceArea - space.occupiedArea;

        // 물건이 들어갈 수 있는지 확인
        if (availableArea < itemArea * 0.9) continue;

        // 물건이 셀보다 크면 스킵
        if (itemWidth * 0.01 > space.size.width || itemLength * 0.01 > space.size.length) continue;

        // 점수 계산: 빈 공간 비율 60% + 중앙 근접도 20% + 이웃 셀 여유 20%
        const availableRatio = availableArea / spaceArea;
        const distFromCenter = Math.sqrt(
          space.position[0] ** 2 + space.position[2] ** 2,
        );
        const proximityScore = Math.max(0, 1 - distFromCenter / 5);

        const score = Math.round(
          availableRatio * 60 + proximityScore * 20 + (space.occupiedBy.length === 0 ? 20 : 0),
        );

        results.push({
          spaceId: space.id,
          score,
          position: space.position,
          size: space.size,
        });
      }

      // 점수 높은 순 상위 5개
      results.sort((a, b) => b.score - a.score);
      setRecommendations(results.slice(0, 5));
      setIsSimulating(false);
    },
    [],
  );

  const clearSimulation = useCallback(() => {
    setRecommendations([]);
  }, []);

  return { recommendations, isSimulating, simulate, clearSimulation };
}
