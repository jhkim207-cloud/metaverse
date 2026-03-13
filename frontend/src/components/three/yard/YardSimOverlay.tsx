/**
 * YardSimOverlay - 배치 추천 시뮬레이션 오버레이
 *
 * 추천 셀을 초록색으로 하이라이트 + 점수 표시
 */

import { Text } from '@react-three/drei';

export interface SimRecommendation {
  spaceId: string;
  score: number;
  position: [number, number, number];
  size: { width: number; length: number };
}

interface YardSimOverlayProps {
  recommendations: SimRecommendation[];
}

export function YardSimOverlay({ recommendations }: YardSimOverlayProps) {
  if (recommendations.length === 0) return null;

  return (
    <group>
      {recommendations.map((rec, i) => (
        <group key={rec.spaceId} position={rec.position}>
          {/* 추천 하이라이트 */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <planeGeometry args={[rec.size.width * 0.95, rec.size.length * 0.95]} />
            <meshBasicMaterial
              color={i === 0 ? '#00ff88' : '#30d158'}
              transparent
              opacity={0.35 - i * 0.05}
            />
          </mesh>

          {/* 점수 */}
          <Text
            position={[0, 0.9, 0]}
            fontSize={rec.size.width * 0.25}
            color={i === 0 ? '#00ff88' : '#30d158'}
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
          >
            {`#${i + 1} (${rec.score})`}
          </Text>
        </group>
      ))}
    </group>
  );
}
