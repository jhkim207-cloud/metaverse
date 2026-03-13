/**
 * YardCCTV - CCTV 기둥 + 커버리지 영역 + 알람
 *
 * 항상 부채꼴 커버리지 영역 표시 (초록)
 * 알람 활성화 시 빨간색 깜빡임
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { YardCCTV as YardCCTVType } from '../../../types/yard.types';
import { YARD_COLORS } from '../../../constants/yardLayout';

interface YardCCTVProps {
  cctv: YardCCTVType;
  onClick?: (id: string) => void;
}

const POLE_HEIGHT = 1.0;
const POLE_RADIUS = 0.075;
const SPHERE_RADIUS = 0.15;
const COVERAGE_RADIUS = 2.0;
const COVERAGE_ANGLE_DEG = 120;

/** direction에 따른 부채꼴 시작 각도 계산 */
function getCoverageRotationY(direction: string): number {
  switch (direction) {
    case 'down': return 0;
    case 'right': return -Math.PI / 2;
    case 'up': return Math.PI;
    case 'left': return Math.PI / 2;
    default: return 0;
  }
}

export function YardCCTV({ cctv, onClick }: YardCCTVProps) {
  const alarmMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const blinkTimer = useRef(0);

  const angleRad = (COVERAGE_ANGLE_DEG * Math.PI) / 180;
  const thetaStart = -angleRad / 2 + Math.PI / 2; // 중심 기준 좌우 대칭
  const rotY = getCoverageRotationY(cctv.direction);

  // 알람 깜빡임 애니메이션
  useFrame((_, delta) => {
    if (!alarmMatRef.current) return;
    if (cctv.alarmActive) {
      blinkTimer.current += delta;
      const blink = Math.sin(blinkTimer.current * 6) > 0;
      alarmMatRef.current.color.set(blink ? '#ff453a' : '#ff9f0a');
      alarmMatRef.current.opacity = blink ? 0.4 : 0.2;
    } else {
      alarmMatRef.current.color.set('#30d158');
      alarmMatRef.current.opacity = 0.15;
      blinkTimer.current = 0;
    }
  });

  return (
    <group
      position={cctv.position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(cctv.id);
      }}
    >
      {/* 기둥 */}
      <mesh position={[0, POLE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[POLE_RADIUS, POLE_RADIUS, POLE_HEIGHT, 8]} />
        <meshStandardMaterial color={YARD_COLORS.CCTV_POLE} />
      </mesh>

      {/* 구체 (카메라 헤드) */}
      <mesh position={[0, POLE_HEIGHT, 0]}>
        <sphereGeometry args={[SPHERE_RADIUS, 16, 16]} />
        <meshStandardMaterial
          color={cctv.alarmActive ? '#ff453a' : YARD_COLORS.CCTV_SPHERE}
          emissive={cctv.alarmActive ? '#ff453a' : '#000000'}
          emissiveIntensity={cctv.alarmActive ? 0.5 : 0}
        />
      </mesh>

      {/* 커버리지 부채꼴 영역 (항상 표시) */}
      <mesh
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, rotY]}
      >
        <circleGeometry args={[COVERAGE_RADIUS, 48, thetaStart, angleRad]} />
        <meshStandardMaterial
          ref={alarmMatRef}
          color="#30d158"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
