/**
 * PlayerAvatar - 심플 캡슐 아바타
 *
 * Phase 1: 캡슐 + 색상 + 이름 태그로 구성.
 * 향후 Ready Player Me glTF 아바타로 교체 가능.
 */

import { Text } from '@react-three/drei';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { CHARACTER_CONFIG } from '../../../types/metaverse.types';

interface PlayerAvatarProps {
  isMoving: boolean;
  yaw: number;
  name?: string;
  color?: string;
}

export function PlayerAvatar({
  isMoving,
  yaw,
  name = '나',
  color = '#0a84ff',
}: PlayerAvatarProps) {
  const { isDark } = useThreeTheme();
  const totalHeight = CHARACTER_CONFIG.halfHeight * 2 + CHARACTER_CONFIG.radius * 2;

  return (
    <group rotation={[0, yaw, 0]}>
      {/* 몸통 (캡슐) */}
      <mesh>
        <capsuleGeometry args={[CHARACTER_CONFIG.radius, CHARACTER_CONFIG.halfHeight * 2, 8, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 머리 방향 표시 (작은 구) */}
      <mesh position={[0, CHARACTER_CONFIG.halfHeight + CHARACTER_CONFIG.radius * 0.5, -CHARACTER_CONFIG.radius * 0.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 이름 태그 */}
      <Text
        position={[0, totalHeight / 2 + 0.25, 0]}
        fontSize={0.12}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="bottom"
        fontWeight={700}
      >
        {name}
      </Text>

      {/* 이동 중 표시 (발밑 링) */}
      {isMoving && (
        <mesh position={[0, -totalHeight / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}
