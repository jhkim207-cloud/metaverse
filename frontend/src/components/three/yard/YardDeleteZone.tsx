/**
 * YardDeleteZone - 물건 삭제 영역
 *
 * 물건을 이 영역으로 드래그하면 삭제됨
 */

import { Text } from '@react-three/drei';
import { YARD_SCALE, YARD_COLORS } from '../../../constants/yardLayout';
import type { YardConfig } from '../../../types/yard.types';

interface YardDeleteZoneProps {
  config: YardConfig;
}

export function YardDeleteZone({ config }: YardDeleteZoneProps) {
  const x = (-4 * config.spaceWidth - 2 * config.spacing) * YARD_SCALE;
  const w = 2 * config.spaceWidth * YARD_SCALE;
  const l = 5 * config.spaceLength * YARD_SCALE;
  return (
    <group position={[x, 0, 0]}>
      {/* 삭제 영역 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[w, l]} />
        <meshLambertMaterial color={YARD_COLORS.DELETE_ZONE} transparent opacity={0.2} />
      </mesh>

      {/* 테두리 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[w, l]} />
        <meshBasicMaterial color={YARD_COLORS.DELETE_ZONE} wireframe />
      </mesh>

      {/* 라벨 */}
      <Text
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={w * 0.15}
        color={YARD_COLORS.DELETE_ZONE}
        anchorX="center"
        anchorY="middle"
      >
        {'야적장\n(드래그하여 삭제)'}
      </Text>
    </group>
  );
}
