/**
 * YardRoutePath - 계획/활성 경로 시각화
 *
 * 계획 경로: 파선 흰색, 활성 경로: 실선 초록, 이탈 시: 빨강
 */

import { Line } from '@react-three/drei';
import type { YardRoute } from '../../../types/yardVehicle.types';
import { YARD_SCALE } from '../../../constants/yardLayout';

interface YardRoutePathProps {
  route: YardRoute;
}

export function YardRoutePath({ route }: YardRoutePathProps) {
  if (!route.waypoints || route.waypoints.length < 2) return null;

  const points = route.waypoints.map((wp) => [
    wp.positionX * YARD_SCALE,
    0.02,
    wp.positionZ * YARD_SCALE,
  ] as [number, number, number]);

  const isActive = route.status === 'ACTIVE';
  const isPlanned = route.status === 'PLANNED';

  return (
    <group>
      <Line
        points={points}
        color={isActive ? '#30d158' : isPlanned ? '#ffffff' : '#86868b'}
        lineWidth={isActive ? 3 : 2}
        dashed={!isActive}
        dashSize={isActive ? 0 : 0.15}
        gapSize={isActive ? 0 : 0.1}
      />

      {/* 웨이포인트 마커 */}
      {route.waypoints.map((wp) => (
        <mesh
          key={wp.id || wp.seq}
          position={[wp.positionX * YARD_SCALE, 0.03, wp.positionZ * YARD_SCALE]}
        >
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color={wp.actionType === 'LOAD' ? '#F59E0B' : wp.actionType === 'UNLOAD' ? '#3B82F6' : '#ffffff'}
          />
        </mesh>
      ))}
    </group>
  );
}
