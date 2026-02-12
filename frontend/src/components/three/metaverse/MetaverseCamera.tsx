/**
 * MetaverseCamera - 3인칭/1인칭 카메라 시스템
 *
 * - 3인칭: 캐릭터 뒤쪽 오프셋에서 추적
 * - 1인칭: 캐릭터 머리 위치 고정
 * - 마우스 이동으로 yaw/pitch 제어 (PointerLock)
 */

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_CONFIG } from '../../../types/metaverse.types';

const _cameraTarget = new THREE.Vector3();
const _offset = new THREE.Vector3();

interface MetaverseCameraProps {
  /** 캐릭터 위치 ref */
  positionRef: React.MutableRefObject<THREE.Vector3>;
  /** yaw 각도 ref (라디안) */
  yawRef: React.MutableRefObject<number>;
  /** pitch 각도 ref (라디안) */
  pitchRef: React.MutableRefObject<number>;
  /** 1인칭 모드 여부 */
  isFirstPerson: boolean;
  /** 마우스 잠금 활성 여부 */
  isLocked: boolean;
}

export function MetaverseCamera({
  positionRef,
  yawRef,
  pitchRef,
  isFirstPerson,
  isLocked,
}: MetaverseCameraProps) {
  const { camera } = useThree();
  const smoothPosition = useRef(new THREE.Vector3());

  // 마우스 이동 핸들러
  useEffect(() => {
    if (!isLocked) return;

    const handleMouseMove = (e: MouseEvent) => {
      yawRef.current -= e.movementX * CAMERA_CONFIG.mouseSensitivity;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - e.movementY * CAMERA_CONFIG.mouseSensitivity,
        CAMERA_CONFIG.minPitch,
        CAMERA_CONFIG.maxPitch
      );
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isLocked, yawRef, pitchRef]);

  // 카메라 업데이트 (매 프레임)
  useFrame(() => {
    const charPos = positionRef.current;

    if (isFirstPerson) {
      // 1인칭: 캐릭터 머리 위치
      _cameraTarget.set(
        charPos.x,
        charPos.y + CAMERA_CONFIG.firstPersonEyeHeight,
        charPos.z
      );

      smoothPosition.current.lerp(_cameraTarget, CAMERA_CONFIG.followLerp * 3);
      camera.position.copy(smoothPosition.current);

      // 바라보는 방향 계산
      const lookX = charPos.x + Math.sin(yawRef.current) * Math.cos(pitchRef.current) * -1;
      const lookY = charPos.y + CAMERA_CONFIG.firstPersonEyeHeight + Math.sin(pitchRef.current);
      const lookZ = charPos.z + Math.cos(yawRef.current) * Math.cos(pitchRef.current) * -1;
      camera.lookAt(lookX, lookY, lookZ);
    } else {
      // 3인칭: 캐릭터 뒤쪽 오프셋
      const [offX, offY, offZ] = CAMERA_CONFIG.thirdPersonOffset;

      _offset.set(
        Math.sin(yawRef.current) * offZ + Math.sin(yawRef.current + Math.PI / 2) * offX,
        offY + Math.sin(pitchRef.current) * offZ * 0.5,
        Math.cos(yawRef.current) * offZ + Math.cos(yawRef.current + Math.PI / 2) * offX
      );

      _cameraTarget.copy(charPos).add(_offset);

      smoothPosition.current.lerp(_cameraTarget, CAMERA_CONFIG.followLerp);
      camera.position.copy(smoothPosition.current);

      camera.lookAt(charPos.x, charPos.y + 0.5, charPos.z);
    }
  });

  return null;
}
