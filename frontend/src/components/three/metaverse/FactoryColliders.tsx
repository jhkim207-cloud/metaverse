/**
 * FactoryColliders - 공장 구역을 물리 콜라이더로 자동 변환
 *
 * DEFAULT_FACTORY_ZONES의 position/size 데이터를 기반으로
 * Rapier RigidBody + CuboidCollider를 자동 생성한다.
 */

import { RigidBody, CuboidCollider } from '@react-three/rapier';
import type { FactoryZone } from '../../../types/factory.types';

interface FactoryCollidersProps {
  zones: FactoryZone[];
}

/** 공장 바운더리 (보이지 않는 외벽) */
const FACTORY_BOUNDS = {
  center: [12.5, 0, 0] as [number, number, number],
  halfWidth: 13.5,
  halfDepth: 7,
  wallHeight: 3.5,
  wallThickness: 0.1,
};

export function FactoryColliders({ zones }: FactoryCollidersProps) {
  const { center, halfWidth, halfDepth, wallHeight, wallThickness } = FACTORY_BOUNDS;

  return (
    <>
      {/* 공장 바닥 */}
      <RigidBody type="fixed" position={[center[0], -0.05, center[2]]}>
        <CuboidCollider args={[halfWidth, 0.05, halfDepth]} />
      </RigidBody>

      {/* 구역별 벽 콜라이더 (기존 ZoneNode와 동일 위치/크기) */}
      {zones.map(zone => (
        <RigidBody
          key={zone.id}
          type="fixed"
          position={[
            zone.position[0],
            zone.size[1] / 2,
            zone.position[2],
          ]}
        >
          <CuboidCollider
            args={[zone.size[0] / 2, zone.size[1] / 2, zone.size[2] / 2]}
          />
        </RigidBody>
      ))}

      {/* 공장 외벽 (보이지 않는 벽) - 4면 */}
      {/* X- (왼쪽) */}
      <RigidBody type="fixed" position={[center[0] - halfWidth, wallHeight / 2, center[2]]}>
        <CuboidCollider args={[wallThickness, wallHeight / 2, halfDepth]} />
      </RigidBody>
      {/* X+ (오른쪽) */}
      <RigidBody type="fixed" position={[center[0] + halfWidth, wallHeight / 2, center[2]]}>
        <CuboidCollider args={[wallThickness, wallHeight / 2, halfDepth]} />
      </RigidBody>
      {/* Z- (위쪽) */}
      <RigidBody type="fixed" position={[center[0], wallHeight / 2, center[2] - halfDepth]}>
        <CuboidCollider args={[halfWidth, wallHeight / 2, wallThickness]} />
      </RigidBody>
      {/* Z+ (아래쪽) */}
      <RigidBody type="fixed" position={[center[0], wallHeight / 2, center[2] + halfDepth]}>
        <CuboidCollider args={[halfWidth, wallHeight / 2, wallThickness]} />
      </RigidBody>
    </>
  );
}
