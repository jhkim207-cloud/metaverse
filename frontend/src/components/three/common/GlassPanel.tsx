/**
 * GlassPanel - Liquid Glass 3D 패널
 *
 * CSS의 rgba + backdrop-filter 효과를 Three.js MeshPhysicalMaterial로 구현.
 * 테마(Light/Dark) 자동 대응.
 */

import { useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import * as THREE from 'three';

interface GlassPanelProps {
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  opacity?: number;
  color?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function GlassPanel({
  width = 1,
  height = 1,
  depth = 0.05,
  radius = 0.06,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  opacity,
  color,
  onClick,
  children,
}: GlassPanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { panelColor, panelOpacity, isDark } = useThreeTheme();

  const finalColor = color ?? panelColor;
  const finalOpacity = opacity ?? panelOpacity;

  return (
    <group position={position} rotation={rotation}>
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={radius}
        smoothness={4}
        onClick={onClick}
      >
        <meshPhysicalMaterial
          color={finalColor}
          transparent
          opacity={finalOpacity}
          roughness={isDark ? 0.15 : 0.1}
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          envMapIntensity={isDark ? 0.5 : 1.0}
        />
      </RoundedBox>
      {children}
    </group>
  );
}
