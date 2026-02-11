/**
 * ThemeAwareScene - 다크/라이트 테마 자동 대응 3D 씬 래퍼
 *
 * - Canvas + 조명 + 배경을 data-theme에 맞게 자동 전환
 * - frameloop="demand" 기본 적용 (정적 시 GPU 0%)
 * - ErrorBoundary 포함: WebGL 미지원 시 폴백 렌더링
 */

import { ReactNode, Component, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import type { SceneConfig } from '../../../types/three.types';

interface ThemeAwareSceneProps {
  children: ReactNode;
  config?: SceneConfig;
  style?: React.CSSProperties;
  fallback?: ReactNode;
  className?: string;
}

/** 내부: 씬 조명 + 그림자 (테마 반응형) */
function SceneLighting() {
  const { ambientIntensity, directionalIntensity, isDark } = useThreeTheme();
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={directionalIntensity}
        castShadow={false}
      />
      <ContactShadows
        opacity={isDark ? 0.2 : 0.4}
        scale={10}
        blur={2}
        far={4}
        position={[0, -1.5, 0]}
      />
    </>
  );
}

/** WebGL 미지원 ErrorBoundary */
interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--text-tertiary)',
          fontSize: 13,
        }}>
          3D 렌더링을 지원하지 않는 환경입니다.
        </div>
      );
    }
    return this.props.children;
  }
}

/** 로딩 폴백 */
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'var(--text-tertiary)',
      fontSize: 13,
    }}>
      3D 로딩 중...
    </div>
  );
}

export function ThemeAwareScene({
  children,
  config,
  style,
  fallback,
  className,
}: ThemeAwareSceneProps) {
  const {
    demandRendering = true,
    dpr = [1, 2],
    cameraPosition = [0, 2, 6],
    cameraFov = 45,
  } = config ?? {};

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          frameloop={demandRendering ? 'demand' : 'always'}
          dpr={dpr}
          camera={{ position: cameraPosition, fov: cameraFov }}
          style={{ background: 'transparent', ...style }}
          className={className}
          gl={{ alpha: true, antialias: true }}
        >
          <SceneLighting />
          {children}
        </Canvas>
      </Suspense>
    </WebGLErrorBoundary>
  );
}
