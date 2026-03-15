/**
 * PlayerAvatar - GLTF 캐릭터 아바타 (캡슐 폴백)
 *
 * GLTF 모델이 있으면 Mixamo 애니메이션 캐릭터 렌더링,
 * 없으면 기존 캡슐 + 색상 + 이름 태그로 폴백.
 */

import { Text } from '@react-three/drei';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { CHARACTER_CONFIG } from '../../../types/metaverse.types';
import { Model } from '../common/ModelLoader';

const CHARACTER_MODEL_URL = '/models/characters/worker.glb';

interface PlayerAvatarProps {
  isMoving: boolean;
  yaw: number;
  name?: string;
  color?: string;
}

/** 절차적 캡슐 아바타 (폴백) */
function CapsuleAvatar({ isMoving, color }: { isMoving: boolean; color: string }) {
  const totalHeight = CHARACTER_CONFIG.halfHeight * 2 + CHARACTER_CONFIG.radius * 2;

  return (
    <>
      <mesh castShadow>
        <capsuleGeometry args={[CHARACTER_CONFIG.radius, CHARACTER_CONFIG.halfHeight * 2, 8, 16]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0, CHARACTER_CONFIG.halfHeight + CHARACTER_CONFIG.radius * 0.5, -CHARACTER_CONFIG.radius * 0.8]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {isMoving && (
        <mesh position={[0, -totalHeight / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.28, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      )}
    </>
  );
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
      {/* GLTF 캐릭터 또는 캡슐 폴백 */}
      <Model
        url={CHARACTER_MODEL_URL}
        scale={0.8}
        fallback={<CapsuleAvatar isMoving={isMoving} color={color} />}
        castShadow
      />

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
    </group>
  );
}
