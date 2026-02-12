/**
 * MetaverseHUD - 메타버스 오버레이 UI
 *
 * 화면 위에 떠있는 조작 안내, 미니맵, 모드 전환 버튼 등
 */

import type { MetaverseMode, CameraMode } from '../../../types/metaverse.types';
import * as THREE from 'three';

interface MetaverseHUDProps {
  mode: MetaverseMode;
  cameraMode: CameraMode;
  onModeChange: (mode: MetaverseMode) => void;
  onCameraModeChange: (mode: CameraMode) => void;
  characterPosition: THREE.Vector3;
  isLocked: boolean;
}

export function MetaverseHUD({
  mode,
  cameraMode,
  onModeChange,
  onCameraModeChange,
  characterPosition,
  isLocked,
}: MetaverseHUDProps) {
  if (mode === 'topview') return null;

  return (
    <>
      {/* 조작 안내 (잠금 해제 상태) */}
      {!isLocked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.75)',
          color: '#fff',
          padding: '24px 32px',
          borderRadius: 12,
          textAlign: 'center',
          fontSize: 14,
          zIndex: 10,
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
            클릭하여 워크스루 시작
          </div>
          <div style={{ color: '#aaa', lineHeight: 1.8 }}>
            <div><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> — 이동</div>
            <div><kbd>Space</kbd> — 점프 &nbsp; <kbd>Shift</kbd> — 달리기</div>
            <div><kbd>V</kbd> — 카메라 전환 &nbsp; <kbd>ESC</kbd> — 마우스 해제</div>
          </div>
        </div>
      )}

      {/* 십자선 (잠금 상태) */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.3)',
          zIndex: 10,
          pointerEvents: 'none',
        }} />
      )}

      {/* 하단 상태 바 */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        {/* 좌측: 위치 정보 */}
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          color: '#ccc',
          padding: '6px 12px',
          borderRadius: 8,
          fontSize: 11,
          fontFamily: 'monospace',
          backdropFilter: 'blur(4px)',
        }}>
          X: {characterPosition.x.toFixed(1)} &nbsp;
          Y: {characterPosition.y.toFixed(1)} &nbsp;
          Z: {characterPosition.z.toFixed(1)}
        </div>

        {/* 우측: 카메라 모드 + 탑뷰 복귀 */}
        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          <button
            onClick={() => onCameraModeChange(cameraMode === 'thirdPerson' ? 'firstPerson' : 'thirdPerson')}
            style={{
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              cursor: 'pointer',
              backdropFilter: 'blur(4px)',
            }}
          >
            {cameraMode === 'firstPerson' ? '1인칭' : '3인칭'} (V)
          </button>
          <button
            onClick={() => onModeChange('topview')}
            style={{
              background: 'rgba(10,132,255,0.8)',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 11,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            탑뷰로 돌아가기
          </button>
        </div>
      </div>
    </>
  );
}
