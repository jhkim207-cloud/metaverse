/**
 * CharacterController - Rapier 기반 캐릭터 물리 컨트롤러
 *
 * KinematicPosition RigidBody + CapsuleCollider로 구현.
 * WASD 이동, Space 점프, Shift 달리기를 지원한다.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { CHARACTER_CONFIG } from '../../../types/metaverse.types';
import { useCharacterControls } from '../../../hooks/useCharacterControls';
import { PlayerAvatar } from './PlayerAvatar';

const _position = new THREE.Vector3();

interface CharacterControllerProps {
  /** 현재 yaw 각도 (라디안) ref */
  yawRef: React.MutableRefObject<number>;
  /** 캐릭터 위치를 외부에 공유하기 위한 ref */
  positionRef: React.MutableRefObject<THREE.Vector3>;
  /** 1인칭 모드 여부 */
  isFirstPerson: boolean;
}

export function CharacterController({
  yawRef,
  positionRef,
  isFirstPerson,
}: CharacterControllerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { update, isMoving } = useCharacterControls({ yaw: yawRef });

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const clampedDelta = Math.min(delta, 0.05);

    // 현재 위치
    const translation = rb.translation();
    _position.set(translation.x, translation.y, translation.z);

    // 이동 벡터 계산
    const velocity = update(clampedDelta, _position);

    // 다음 위치 계산
    const nextX = _position.x + velocity.x * clampedDelta;
    const nextY = Math.max(
      _position.y + velocity.y * clampedDelta,
      CHARACTER_CONFIG.radius + CHARACTER_CONFIG.halfHeight
    );
    const nextZ = _position.z + velocity.z * clampedDelta;

    // KinematicPosition 이동
    rb.setNextKinematicTranslation({ x: nextX, y: nextY, z: nextZ });

    // 위치 공유
    positionRef.current.set(nextX, nextY, nextZ);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={CHARACTER_CONFIG.spawnPosition}
      colliders={false}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider
        args={[CHARACTER_CONFIG.halfHeight, CHARACTER_CONFIG.radius]}
      />
      {/* 1인칭에서는 아바타 숨김 */}
      {!isFirstPerson && (
        <PlayerAvatar
          isMoving={isMoving()}
          yaw={yawRef.current}
        />
      )}
    </RigidBody>
  );
}
