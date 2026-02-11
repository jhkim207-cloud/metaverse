/**
 * KpiBar3D - 3D 막대 차트 (Liquid Glass 스타일)
 *
 * BentoCard header 영역에 삽입하는 3D 미니 차트.
 * 각 막대는 Glass Material로 렌더링되며, 테마 자동 대응.
 */

import { useMemo } from 'react';
import { Text, RoundedBox } from '@react-three/drei';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import type { Kpi3DData } from '../../../types/three.types';

interface KpiBar3DProps {
  data: Kpi3DData[];
  height?: number;
}

const BAR_COLORS = ['#1e3a5f', '#30d158', '#0a84ff', '#ff9f0a', '#ff453a', '#bf5af2'];

function BarScene({ data }: { data: Kpi3DData[] }) {
  const { isDark } = useThreeTheme();

  const maxValue = useMemo(() => {
    const maxFromData = Math.max(...data.map(d => d.maxValue ?? d.value));
    return maxFromData || 1;
  }, [data]);

  const barWidth = Math.min(0.6, 3 / Math.max(data.length, 1));
  const totalWidth = data.length * (barWidth + 0.15) - 0.15;
  const startX = -totalWidth / 2 + barWidth / 2;

  return (
    <>
      {data.map((item, i) => {
        const barHeight = Math.max(0.05, (item.value / maxValue) * 2);
        const x = startX + i * (barWidth + 0.15);
        const color = item.color ?? BAR_COLORS[i % BAR_COLORS.length];

        return (
          <group key={item.label} position={[x, 0, 0]}>
            {/* 막대 */}
            <RoundedBox
              args={[barWidth, barHeight, 0.3]}
              radius={0.04}
              smoothness={4}
              position={[0, barHeight / 2 - 0.8, 0]}
            >
              <meshPhysicalMaterial
                color={color}
                transparent
                opacity={0.75}
                roughness={0.15}
                metalness={0.05}
                clearcoat={0.4}
                clearcoatRoughness={0.1}
              />
            </RoundedBox>

            {/* 값 */}
            <Text
              position={[0, barHeight - 0.65, 0.2]}
              fontSize={0.15}
              color={isDark ? '#f5f5f7' : '#1d1d1f'}
              anchorX="center"
              anchorY="bottom"
              fontWeight={600}
            >
              {String(item.value)}
            </Text>

            {/* 라벨 */}
            <Text
              position={[0, -0.9, 0.2]}
              fontSize={0.1}
              color={isDark ? '#86868b' : '#6e6e73'}
              anchorX="center"
              anchorY="top"
            >
              {item.label}
            </Text>
          </group>
        );
      })}

      {/* 바닥선 */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[totalWidth + 0.5, 0.01, 0.35]} />
        <meshStandardMaterial
          color={isDark ? '#3a3a42' : '#d0d0d8'}
          transparent
          opacity={0.3}
        />
      </mesh>
    </>
  );
}

export function KpiBar3D({ data, height = 180 }: KpiBar3DProps) {
  if (data.length === 0) return null;

  return (
    <div style={{ width: '100%', height }}>
      <ThemeAwareScene
        config={{
          cameraPosition: [0, 0.5, 4],
          cameraFov: 35,
          demandRendering: true,
        }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      >
        <BarScene data={data} />
      </ThemeAwareScene>
    </div>
  );
}
