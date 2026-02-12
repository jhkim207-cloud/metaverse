/**
 * useCharacterControls - 캐릭터 키보드 입력 처리 훅
 *
 * drei의 useKeyboardControls와 연동하여
 * WASD 이동 + Space 점프 + Shift 달리기를 처리한다.
 */

import { useRef, useCallback } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls, CHARACTER_CONFIG } from '../types/metaverse.types';

const _direction = new THREE.Vector3();
const _frontVector = new THREE.Vector3();
const _sideVector = new THREE.Vector3();

interface UseCharacterControlsOptions {
  yaw: React.MutableRefObject<number>;
}

export function useCharacterControls({ yaw }: UseCharacterControlsOptions) {
  const velocityRef = useRef(new THREE.Vector3());
  const isGroundedRef = useRef(true);
  const verticalVelocityRef = useRef(0);

  const [, getKeys] = useKeyboardControls<Controls>();

  const getMovementVector = useCallback(() => {
    const { forward, backward, left, right, sprint } = getKeys();

    const speed = sprint ? CHARACTER_CONFIG.sprintSpeed : CHARACTER_CONFIG.walkSpeed;

    _frontVector.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
    _sideVector.set((left ? 1 : 0) - (right ? 1 : 0), 0, 0);

    _direction
      .subVectors(_frontVector, _sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    return _direction;
  }, [getKeys, yaw]);

  const update = useCallback((delta: number, currentPosition: THREE.Vector3) => {
    const { jump } = getKeys();
    const movement = getMovementVector();

    // 수평 이동 보간
    velocityRef.current.x = THREE.MathUtils.lerp(
      velocityRef.current.x,
      movement.x,
      CHARACTER_CONFIG.lerpFactor
    );
    velocityRef.current.z = THREE.MathUtils.lerp(
      velocityRef.current.z,
      movement.z,
      CHARACTER_CONFIG.lerpFactor
    );

    // 수직 (점프/중력)
    if (jump && isGroundedRef.current) {
      verticalVelocityRef.current = CHARACTER_CONFIG.jumpForce;
      isGroundedRef.current = false;
    }

    verticalVelocityRef.current -= 9.81 * delta;

    // 바닥 충돌 (간단한 Y=0 체크)
    const nextY = currentPosition.y + verticalVelocityRef.current * delta;
    if (nextY <= CHARACTER_CONFIG.radius + CHARACTER_CONFIG.halfHeight) {
      verticalVelocityRef.current = 0;
      isGroundedRef.current = true;
    }

    velocityRef.current.y = verticalVelocityRef.current;

    return velocityRef.current;
  }, [getKeys, getMovementVector]);

  const isMoving = useCallback(() => {
    const { forward, backward, left, right } = getKeys();
    return forward || backward || left || right;
  }, [getKeys]);

  return { update, isMoving, isGroundedRef };
}
