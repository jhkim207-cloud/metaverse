/**
 * YardVehicle3D - 차량/중장비 3D 렌더링
 *
 * GLTF 모델 우선 로딩, 없을 시 절차적 지오메트리 폴백
 * 상태별 색상, 방향 화살표, 이름 레이블
 */

import { Text } from '@react-three/drei';
import type { YardVehicle } from '../../../types/yardVehicle.types';
import { VEHICLE_STATUS_COLORS } from '../../../types/yardVehicle.types';
import { YARD_SCALE } from '../../../constants/yardLayout';
import { Model } from '../common/ModelLoader';

interface YardVehicle3DProps {
  vehicle: YardVehicle;
}

/** 모델 URL 매핑 */
const VEHICLE_MODEL_URLS: Record<string, string> = {
  FORKLIFT: '/models/vehicles/forklift.glb',
  TRUCK: '/models/vehicles/truck.glb',
};

/** 절차적 차량 지오메트리 (폴백) */
function ProceduralVehicle({ color, isAlert }: { color: string; isAlert: boolean }) {
  return (
    <>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.2, 0.6]} />
        <meshStandardMaterial
          color={color}
          emissive={isAlert ? '#ff0000' : '#000000'}
          emissiveIntensity={isAlert ? 2.0 : 0}
        />
      </mesh>
      <mesh position={[0, 0.15, -0.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.12, 0.2, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}

export function YardVehicle3D({ vehicle }: YardVehicle3DProps) {
  const x = vehicle.currentX * YARD_SCALE;
  const z = vehicle.currentZ * YARD_SCALE;
  const color = VEHICLE_STATUS_COLORS[vehicle.status] || '#86868b';
  const isAlert = vehicle.status === 'OFF_ROUTE';
  const modelUrl = VEHICLE_MODEL_URLS[vehicle.vehicleType] || VEHICLE_MODEL_URLS.TRUCK;

  return (
    <group position={[x, 0, z]} rotation={[0, vehicle.heading, 0]}>
      {/* GLTF 모델 또는 절차적 폴백 */}
      <Model
        url={modelUrl}
        scale={0.5}
        fallback={<ProceduralVehicle color={color} isAlert={isAlert} />}
        castShadow
      />

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
