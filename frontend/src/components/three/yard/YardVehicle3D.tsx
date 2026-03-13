/**
 * YardVehicle3D - 차량/중장비 3D 렌더링
 *
 * 상태별 색상, 방향 화살표, 이름 레이블
 */

import { Text } from '@react-three/drei';
import type { YardVehicle } from '../../../types/yardVehicle.types';
import { VEHICLE_STATUS_COLORS } from '../../../types/yardVehicle.types';
import { YARD_SCALE } from '../../../constants/yardLayout';

interface YardVehicle3DProps {
  vehicle: YardVehicle;
}

export function YardVehicle3D({ vehicle }: YardVehicle3DProps) {
  const x = vehicle.currentX * YARD_SCALE;
  const z = vehicle.currentZ * YARD_SCALE;
  const color = VEHICLE_STATUS_COLORS[vehicle.status] || '#86868b';
  const isAlert = vehicle.status === 'OFF_ROUTE';

  return (
    <group position={[x, 0, z]} rotation={[0, vehicle.heading, 0]}>
      {/* 차체 */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={isAlert ? '#ff0000' : '#000000'}
          emissiveIntensity={isAlert ? 0.4 : 0}
        />
      </mesh>

      {/* 방향 화살표 (앞쪽) */}
      <mesh position={[0, 0.15, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.12, 0.2, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 차량 이름 */}
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.12}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {vehicle.vehicleNm}
      </Text>

      {/* 상태 뱃지 */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {vehicle.status}
      </Text>
    </group>
  );
}
