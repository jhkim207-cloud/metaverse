/**
 * YardDeviationMarker - 경로 이탈 지점 3D 마커
 *
 * 빨간 펄싱 링 + 경고 텍스트
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { YARD_SCALE } from '../../../constants/yardLayout';

export interface DeviationPoint {
  id: number;
  vehicleId: number;
  positionX: number;
  positionZ: number;
  deviationDist: number;
  detectedByCctvId: number | null;
  acknowledged: boolean;
}

interface Props {
  deviation: DeviationPoint;
}

export function YardDeviationMarker({ deviation }: Props) {
  const ringRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  const x = deviation.positionX * YARD_SCALE;
  const z = deviation.positionZ * YARD_SCALE;

  useFrame(() => {
    if (!ringRef.current || !matRef.current) return;
    // 펄싱 스케일
    const t = Date.now() * 0.003;
    const scale = 1 + 0.3 * Math.sin(t);
    ringRef.current.scale.set(scale, scale, 1);
    // 깜빡임
    matRef.current.opacity = 0.3 + 0.3 * Math.sin(t * 2);
  });

  if (deviation.acknowledged) return null;

  return (
    <group position={[x, 0.01, z]}>
      {/* 빨간 펄싱 링 */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 32]} />
        <meshStandardMaterial
          ref={matRef}
          color="#EF4444"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 경고 아이콘 */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.15}
        color="#EF4444"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        ⚠ 이탈
      </Text>
    </group>
  );
}
