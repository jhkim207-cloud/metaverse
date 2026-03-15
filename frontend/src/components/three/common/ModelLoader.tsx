/**
 * ModelLoader - GLTF 3D 모델 로딩 유틸리티
 *
 * - useGLTF + useAnimations 기반 모델 로딩
 * - fallback prop으로 .glb 없을 때 기존 지오메트리 렌더링
 * - scene.traverse로 모든 메시에 castShadow/receiveShadow 자동 설정
 */

import { Suspense, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import type { GroupProps } from '@react-three/fiber';

interface ModelProps extends Omit<GroupProps, 'children'> {
  url: string;
  fallback?: React.ReactNode;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

function GLTFModel({
  url,
  castShadow = true,
  receiveShadow = true,
  ...groupProps
}: Omit<ModelProps, 'fallback'>) {
  const { scene, animations } = useGLTF(url);
  const { ref } = useAnimations(animations);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as any).isMesh) {
        (child as any).castShadow = castShadow;
        (child as any).receiveShadow = receiveShadow;
      }
    });
    return clone;
  }, [scene, castShadow, receiveShadow]);

  return <primitive ref={ref} object={clonedScene} {...groupProps} />;
}

export function Model({ fallback, url, ...props }: ModelProps) {
  return (
    <Suspense fallback={fallback ?? null}>
      <ModelErrorBoundary fallback={fallback}>
        <GLTFModel url={url} {...props} />
      </ModelErrorBoundary>
    </Suspense>
  );
}

/** 모델 로딩 실패 시 폴백으로 대체 */
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

/** Draco 압축 모델용 프리로드 */
export function preloadModel(url: string) {
  useGLTF.preload(url);
}
