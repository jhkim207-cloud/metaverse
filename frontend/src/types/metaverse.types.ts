/**
 * 메타버스 관련 타입 정의
 */

/** 카메라 모드 */
export type CameraMode = 'topview' | 'thirdPerson' | 'firstPerson';

/** 캐릭터 이동 상태 */
export interface CharacterMovement {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
}

/** 캐릭터 상태 */
export interface CharacterState {
  position: [number, number, number];
  rotation: number; // Y축 회전 (라디안)
  isGrounded: boolean;
  isMoving: boolean;
  isSprinting: boolean;
}

/** 메타버스 씬 모드 */
export type MetaverseMode = 'topview' | 'walkthrough';

/** 캐릭터 설정 상수 */
export const CHARACTER_CONFIG = {
  /** 캡슐 반지름 */
  radius: 0.3,
  /** 캡슐 높이 (반지름 제외 몸통) */
  halfHeight: 0.25,
  /** 걷기 속도 (유닛/초) */
  walkSpeed: 4.0,
  /** 달리기 속도 (유닛/초) */
  sprintSpeed: 8.0,
  /** 점프 힘 */
  jumpForce: 5.0,
  /** 바닥 감지 레이 길이 */
  groundRayLength: 0.7,
  /** 이동 보간 계수 */
  lerpFactor: 0.15,
  /** 스폰 위치 */
  spawnPosition: [2, 1.5, 5] as [number, number, number],
} as const;

/** 카메라 설정 상수 */
export const CAMERA_CONFIG = {
  /** 3인칭 오프셋 */
  thirdPersonOffset: [0, 2, 3] as [number, number, number],
  /** 1인칭 눈높이 오프셋 Y */
  firstPersonEyeHeight: 0.8,
  /** 카메라 추적 보간 */
  followLerp: 0.1,
  /** 마우스 감도 */
  mouseSensitivity: 0.002,
  /** 피치 제한 (라디안) */
  minPitch: -Math.PI * 0.47,
  maxPitch: Math.PI * 0.47,
} as const;

/** 키보드 입력 맵 */
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  jump = 'jump',
  sprint = 'sprint',
  toggleCamera = 'toggleCamera',
}
