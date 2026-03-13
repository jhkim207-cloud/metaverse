/**
 * YardGrid - 야적장 구역 그리드 렌더링
 *
 * 각 구역의 점유율에 따라 3D 바 차트 + 색상으로 Capacity 시각화
 */

import { Text, RoundedBox } from '@react-three/drei';
import type { YardSpace } from '../../../types/yard.types';

interface YardGridProps {
  spaces: YardSpace[];
  highlightedSpaces?: string[];
}

/** 점유율(0~1) → 색상 (heatColor 패턴) */
function capacityColor(ratio: number): string {
  if (ratio >= 0.7) return '#ff453a';
  if (ratio >= 0.5) return '#ff9f0a';
  if (ratio >= 0.3) return '#ffd60a';
  if (ratio > 0) return '#30d158';
  return '#86868b';
}

function SpaceCell({ space, highlighted }: { space: YardSpace; highlighted?: boolean }) {
  const spaceArea = space.size.width * space.size.length;
  const ratio = spaceArea > 0 ? space.occupiedArea / spaceArea : 0;
  const barHeight = Math.max(0.02, ratio * 0.8);
  const color = capacityColor(ratio);
  const pct = Math.round(ratio * 100);

  return (
    <group position={space.position}>
      {/* 바닥 평면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[space.size.width, space.size.length]} />
        <meshLambertMaterial color={highlighted ? '#30d158' : '#e8e8e8'} transparent opacity={highlighted ? 0.5 : 0.4} />
      </mesh>

      {/* 테두리 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[space.size.width, space.size.length]} />
        <meshBasicMaterial color={highlighted ? '#30d158' : '#000000'} wireframe />
      </mesh>

      {/* Capacity 3D 바 */}
      {ratio > 0 && (
        <RoundedBox
          args={[space.size.width * 0.7, barHeight, space.size.length * 0.7]}
          radius={0.01}
          position={[0, barHeight / 2 + 0.003, 0]}
        >
          <meshStandardMaterial color={color} transparent opacity={0.75} />
        </RoundedBox>
      )}

      {/* 구역 번호 + 점유율 % */}
      <Text
        position={[0, barHeight + 0.04, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={space.size.width * 0.2}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {space.name}
      </Text>
      <Text
        position={[0, barHeight + 0.02, space.size.length * 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={space.size.width * 0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {pct}%
      </Text>
    </group>
  );
}

export function YardGrid({ spaces, highlightedSpaces }: YardGridProps) {
  return (
    <group>
      {spaces.map((space) => (
        <SpaceCell
          key={space.id}
          space={space}
          highlighted={highlightedSpaces?.includes(space.id)}
        />
      ))}
    </group>
  );
}
