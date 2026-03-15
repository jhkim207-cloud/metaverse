/**
 * SPC3DChart - SPC 관리도 3D 차트
 *
 * X축=시간, Y축=측정값, 관리한계선=반투명 평면.
 * 관리 이탈 포인트는 빨간색 구체로 강조.
 */

import { useMemo } from 'react';
import { Text, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import type { SpcDataPoint, SpcControlLimits } from '../../../types/quality.types';

interface SPC3DChartProps {
  measurements: SpcDataPoint[];
  controlLimits: SpcControlLimits;
  height?: number;
}

const CHART_WIDTH = 6;
const CHART_HEIGHT = 3;

function SpcScene({
  measurements,
  controlLimits,
}: {
  measurements: SpcDataPoint[];
  controlLimits: SpcControlLimits;
}) {
  const { isDark } = useThreeTheme();

  const { minVal, maxVal, points, linePoints } = useMemo(() => {
    const allVals = measurements.map(m => m.value);
    const mn = Math.min(...allVals, controlLimits.lcl) - 1;
    const mx = Math.max(...allVals, controlLimits.ucl) + 1;
    const range = mx - mn || 1;

    const pts = measurements.map((m, i) => {
      const x = (i / Math.max(measurements.length - 1, 1)) * CHART_WIDTH - CHART_WIDTH / 2;
      const y = ((m.value - mn) / range) * CHART_HEIGHT - CHART_HEIGHT / 2;
      return { x, y, value: m.value, date: m.date, ooc: m.isOutOfControl };
    });

    const lnPts = pts.map(p => new THREE.Vector3(p.x, p.y, 0));

    return { minVal: mn, maxVal: mx, points: pts, linePoints: lnPts };
  }, [measurements, controlLimits]);

  const range = maxVal - minVal || 1;

  // 관리 한계선 Y 위치
  const uclY = ((controlLimits.ucl - minVal) / range) * CHART_HEIGHT - CHART_HEIGHT / 2;
  const clY = ((controlLimits.cl - minVal) / range) * CHART_HEIGHT - CHART_HEIGHT / 2;
  const lclY = ((controlLimits.lcl - minVal) / range) * CHART_HEIGHT - CHART_HEIGHT / 2;

  return (
    <>
      {/* UCL 평면 (빨간 반투명) */}
      <mesh position={[0, uclY, 0]}>
        <planeGeometry args={[CHART_WIDTH + 0.5, 0.01]} />
        <meshStandardMaterial color="#ff453a" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[CHART_WIDTH / 2 + 0.4, uclY, 0]}
        fontSize={0.12}
        color="#ff453a"
        anchorX="left"
        anchorY="middle"
      >
        {`UCL ${controlLimits.ucl}`}
      </Text>

      {/* CL 중심선 (녹색) */}
      <mesh position={[0, clY, 0]}>
        <planeGeometry args={[CHART_WIDTH + 0.5, 0.008]} />
        <meshStandardMaterial color="#30d158" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[CHART_WIDTH / 2 + 0.4, clY, 0]}
        fontSize={0.12}
        color="#30d158"
        anchorX="left"
        anchorY="middle"
      >
        {`CL ${controlLimits.cl}`}
      </Text>

      {/* LCL 평면 (빨간 반투명) */}
      <mesh position={[0, lclY, 0]}>
        <planeGeometry args={[CHART_WIDTH + 0.5, 0.01]} />
        <meshStandardMaterial color="#ff453a" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <Text
        position={[CHART_WIDTH / 2 + 0.4, lclY, 0]}
        fontSize={0.12}
        color="#ff453a"
        anchorX="left"
        anchorY="middle"
      >
        {`LCL ${controlLimits.lcl}`}
      </Text>

      {/* 관리 범위 배경 (UCL~LCL 사이 반투명) */}
      <mesh position={[0, (uclY + lclY) / 2, -0.05]}>
        <planeGeometry args={[CHART_WIDTH + 0.5, uclY - lclY]} />
        <meshStandardMaterial
          color={isDark ? '#1a3a1a' : '#e8f8e8'}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 데이터 연결선 */}
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color={isDark ? '#5ac8fa' : '#0a84ff'}
          lineWidth={1.5}
        />
      )}

      {/* 데이터 포인트 */}
      {points.map((pt, i) => (
        <group key={i} position={[pt.x, pt.y, 0]}>
          <Sphere args={[pt.ooc ? 0.07 : 0.04, 16, 16]}>
            <meshStandardMaterial
              color={pt.ooc ? '#ff453a' : (isDark ? '#5ac8fa' : '#0a84ff')}
              emissive={pt.ooc ? '#ff453a' : '#000000'}
              emissiveIntensity={pt.ooc ? 2.0 : 0}
            />
          </Sphere>
          {/* 이탈 포인트 값 표시 */}
          {pt.ooc && (
            <Text
              position={[0, 0.15, 0]}
              fontSize={0.1}
              color="#ff453a"
              anchorX="center"
              anchorY="bottom"
              fontWeight={700}
            >
              {String(pt.value)}
            </Text>
          )}
        </group>
      ))}

      {/* X축 날짜 라벨 (5개만) */}
      {points
        .filter((_, i) => i % Math.max(1, Math.floor(points.length / 5)) === 0 || i === points.length - 1)
        .map((pt, i) => (
          <Text
            key={i}
            position={[pt.x, -CHART_HEIGHT / 2 - 0.2, 0]}
            fontSize={0.08}
            color={isDark ? '#86868b' : '#6e6e73'}
            anchorX="center"
            anchorY="top"
          >
            {pt.date.slice(5)}
          </Text>
        ))}

      {/* 바닥선 */}
      <mesh position={[0, -CHART_HEIGHT / 2 - 0.05, 0]}>
        <planeGeometry args={[CHART_WIDTH + 0.5, 0.005]} />
        <meshStandardMaterial
          color={isDark ? '#3a3a42' : '#d0d0d8'}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

export function SPC3DChart({ measurements, controlLimits, height = 280 }: SPC3DChartProps) {
  if (measurements.length === 0) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ThemeAwareScene
        config={{
          cameraPosition: [0, 0, 6],
          cameraFov: 40,
          demandRendering: true,
        }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      >
        <SpcScene measurements={measurements} controlLimits={controlLimits} />
      </ThemeAwareScene>
    </div>
  );
}
