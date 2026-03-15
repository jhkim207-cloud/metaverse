/**
 * SceneEffects - 후처리 효과 래퍼
 *
 * Bloom: 발광체(LED, 경고마커) 강조
 * SSAO: 깊이감/입체감 향상
 * Vignette: 워크스루 몰입감
 */

import { EffectComposer, Bloom, SSAO, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import type { EffectsConfig } from '../../../types/three.types';

export function SceneEffects({
  bloom = true,
  ssao = true,
  vignette = false,
}: EffectsConfig) {
  const { isDark } = useThreeTheme();

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        luminanceThreshold={bloom ? 0.6 : 999}
        luminanceSmoothing={0.9}
        intensity={bloom ? (isDark ? 1.2 : 0.5) : 0}
        mipmapBlur
      />
      <SSAO
        samples={21}
        radius={0.12}
        intensity={ssao ? (isDark ? 15 : 10) : 0}
        luminanceInfluence={0.6}
        worldDistanceThreshold={1.0}
        worldDistanceFalloff={0.0}
        worldProximityThreshold={0.5}
        worldProximityFalloff={0.3}
      />
      <Vignette
        offset={0.3}
        darkness={vignette ? (isDark ? 0.7 : 0.4) : 0}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
