/**
 * KpiDonut3D - 3D 도넛 차트 (Liquid Glass 스타일)
 *
 * BentoCard header 영역에 삽입하는 3D 도넛 차트.
 * Glass Material로 반투명 세그먼트 렌더링.
 */

import { useMemo, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import type { DonutSegment } from '../../../types/three.types';
import * as THREE from 'three';

interface KpiDonut3DProps {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

const OUTER_RADIUS = 1.0;
const INNER_RADIUS = 0.55;
const DONUT_DEPTH = 0.25;

function DonutScene({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const { isDark } = useThreeTheme();
  const groupRef = useRef<THREE.Group>(null);

  // 느린 회전 애니메이션
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const total = useMemo(() => segments.reduce((sum, s) => sum + s.value, 0), [segments]);

  const segmentGeometries = useMemo(() => {
    let startAngle = 0;
    return segments.map((seg) => {
      const angle = total > 0 ? (seg.value / total) * Math.PI * 2 : 0;
      const shape = new THREE.Shape();

      // 외부 원호
      const outerPoints: THREE.Vector2[] = [];
      const innerPoints: THREE.Vector2[] = [];
      const steps = Math.max(8, Math.floor(angle / 0.1));

      for (let i = 0; i <= steps; i++) {
        const a = startAngle + (angle * i) / steps;
        outerPoints.push(new THREE.Vector2(Math.cos(a) * OUTER_RADIUS, Math.sin(a) * OUTER_RADIUS));
        innerPoints.push(new THREE.Vector2(Math.cos(a) * INNER_RADIUS, Math.sin(a) * INNER_RADIUS));
      }

      // Shape 구성: 외부 시계 → 내부 반시계
      shape.moveTo(outerPoints[0].x, outerPoints[0].y);
      for (let i = 1; i < outerPoints.length; i++) {
        shape.lineTo(outerPoints[i].x, outerPoints[i].y);
      }
      for (let i = innerPoints.length - 1; i >= 0; i--) {
        shape.lineTo(innerPoints[i].x, innerPoints[i].y);
      }
      shape.closePath();

      const result = { shape, color: seg.color, startAngle };
      startAngle += angle;
      return result;
    });
  }, [segments, total]);

  return (
    <>
      <group ref={groupRef} rotation={[-0.5, 0, 0]}>
        {segmentGeometries.map((seg, i) => (
          <mesh key={i}>
            <extrudeGeometry
              args={[
                seg.shape,
                { depth: DONUT_DEPTH, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.01 },
              ]}
            />
            <meshPhysicalMaterial
              color={seg.color}
              transparent
              opacity={0.8}
              roughness={0.2}
              metalness={0.05}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* 중앙 텍스트 */}
      {centerValue && (
        <Text
          position={[0, 0.08, 0.5]}
          fontSize={0.3}
          color={isDark ? '#f5f5f7' : '#1d1d1f'}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          {centerValue}
        </Text>
      )}
      {centerLabel && (
        <Text
          position={[0, -0.2, 0.5]}
          fontSize={0.14}
          color={isDark ? '#86868b' : '#6e6e73'}
          anchorX="center"
          anchorY="middle"
        >
          {centerLabel}
        </Text>
      )}
    </>
  );
}

export function KpiDonut3D({ segments, centerLabel, centerValue, height = 180 }: KpiDonut3DProps) {
  if (segments.length === 0) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ThemeAwareScene
        config={{
          cameraPosition: [0, 0, 3.5],
          cameraFov: 35,
          demandRendering: false,
        }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      >
        <DonutScene
          segments={segments}
          centerLabel={centerLabel}
          centerValue={centerValue}
        />
      </ThemeAwareScene>
    </div>
  );
}
