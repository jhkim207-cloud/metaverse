/**
 * FactoryFloor3D - 공장 평면도 디지털 트윈
 *
 * HK지앤텍 복층유리(IGU) 공장 레이아웃을 3D로 시각화.
 * 각 구역의 실시간 상태(가동/대기/에러), 작업자 수, 물류 흐름을 표현.
 */

import { Text, Line, OrbitControls, RoundedBox } from '@react-three/drei';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { GlassPanel } from '../common/GlassPanel';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import {
  DEFAULT_FACTORY_ZONES,
  DEFAULT_FLOW_PATHS,
  ZONE_STATUS_COLORS,
  ZONE_TYPE_COLORS,
  FACTORY_WORLD_BOUNDS,
} from '../../../constants/factoryLayout';
import type { FactoryZone, FlowPath } from '../../../types/factory.types';
import * as THREE from 'three';

/** 구역 노드 */
function ZoneNode({ zone }: { zone: FactoryZone }) {
  const { isDark } = useThreeTheme();
  const statusColor = ZONE_STATUS_COLORS[zone.status] || '#86868b';
  const typeColor = ZONE_TYPE_COLORS[zone.type] || '#1e3a5f';

  const occupancyHeight = zone.capacity && zone.occupancy
    ? (zone.occupancy / zone.capacity) * zone.size[1]
    : 0;

  return (
    <group position={zone.position}>
      {/* 구역 바닥 (Glass Panel) */}
      <GlassPanel
        width={zone.size[0]}
        height={zone.size[2]}
        depth={0.05}
        radius={0.06}
        color={typeColor}
        opacity={0.35}
      />

      {/* 구역 벽 (높이 표현) */}
      <RoundedBox
        args={[zone.size[0], zone.size[1], zone.size[2]]}
        radius={0.04}
        smoothness={2}
        position={[0, zone.size[1] / 2, 0]}
      >
        <meshPhysicalMaterial
          color={typeColor}
          transparent
          opacity={0.18}
          roughness={0.3}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* 상태 표시등 */}
      <mesh position={[zone.size[0] / 2 - 0.15, zone.size[1] + 0.1, -zone.size[2] / 2 + 0.15]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshPhysicalMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={zone.status === 'ERROR' ? 0.8 : 0.3}
        />
      </mesh>

      {/* 구역 이름 */}
      <Text
        position={[0, zone.size[1] + 0.25, 0]}
        fontSize={0.22}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="bottom"
        fontWeight={700}
      >
        {zone.name}
      </Text>

      {/* 작업자 수 뱃지 */}
      {zone.workerCount > 0 && (
        <group position={[-zone.size[0] / 2 + 0.2, zone.size[1] + 0.15, -zone.size[2] / 2 + 0.2]}>
          <mesh>
            <circleGeometry args={[0.14, 16]} />
            <meshBasicMaterial color="#0a84ff" />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
          >
            {String(zone.workerCount)}
          </Text>
        </group>
      )}

      {/* 재고 구역: 적재율 바 */}
      {zone.type === 'WAREHOUSE' && occupancyHeight > 0 && (
        <RoundedBox
          args={[zone.size[0] * 0.6, occupancyHeight, zone.size[2] * 0.6]}
          radius={0.03}
          smoothness={2}
          position={[0, occupancyHeight / 2, 0]}
        >
          <meshPhysicalMaterial
            color="#0a84ff"
            transparent
            opacity={0.5}
            roughness={0.2}
          />
        </RoundedBox>
      )}

      {/* 현재 작업 표시 */}
      {zone.currentJob && (
        <Text
          position={[0, -0.12, zone.size[2] / 2 + 0.1]}
          fontSize={0.1}
          color={isDark ? '#86868b' : '#6e6e73'}
          anchorX="center"
          anchorY="top"
          maxWidth={zone.size[0]}
        >
          {zone.currentJob}
        </Text>
      )}

      {/* 장비 목록 표시 */}
      {zone.equipment && zone.equipment.map((eq, i) => (
        <Text
          key={eq}
          position={[
            -zone.size[0] / 2 + 0.15,
            0.03,
            -zone.size[2] / 2 + 0.3 + i * 0.22,
          ]}
          fontSize={0.1}
          color={isDark ? '#636366' : '#9e9ea6'}
          anchorX="left"
          anchorY="bottom"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {eq}
        </Text>
      ))}
    </group>
  );
}

/** 물류 흐름 화살표 */
function FlowArrow({ path, zones }: { path: FlowPath; zones: FactoryZone[] }) {
  const { isDark } = useThreeTheme();
  const fromZone = zones.find(z => z.id === path.from);
  const toZone = zones.find(z => z.id === path.to);

  if (!fromZone || !toZone) return null;

  const start: [number, number, number] = [
    fromZone.position[0],
    0.15,
    fromZone.position[2],
  ];
  const end: [number, number, number] = [
    toZone.position[0],
    0.15,
    toZone.position[2],
  ];

  const color = path.color
    ? path.color
    : path.isActive
      ? '#30d158'
      : (isDark ? '#3a3a42' : '#d0d0d8');

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={path.isActive ? 2 : 1}
      dashed={!path.isActive}
      dashSize={0.15}
      gapSize={0.1}
    />
  );
}

/** 공장 바닥 그리드 */
function FloorGrid() {
  const { isDark } = useThreeTheme();
  const { center } = FACTORY_WORLD_BOUNDS;
  return (
    <>
      <gridHelper
        args={[
          30, 60,
          new THREE.Color(isDark ? '#2a2a32' : '#d0d0d8'),
          new THREE.Color(isDark ? '#1a1a22' : '#e8e8f0'),
        ]}
        position={[center[0], -0.01, center[2]]}
      />
      {/* 공장 제목 */}
      <Text
        position={[center[0], 0.01, -7.5]}
        fontSize={0.35}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        HK지앤텍 복층유리 공장
      </Text>
    </>
  );
}

/** 공장 외곽선 */
function FactoryOutline() {
  const { isDark } = useThreeTheme();
  const color = isDark ? '#3a3a42' : '#c0c0c8';
  const { width, depth, center } = FACTORY_WORLD_BOUNDS;
  const hw = width / 2;
  const hd = depth / 2;
  const cx = center[0];
  const cz = center[2];
  const y = 0.02;
  const points: [number, number, number][] = [
    [cx - hw, y, cz - hd],
    [cx + hw, y, cz - hd],
    [cx + hw, y, cz + hd],
    [cx - hw, y, cz + hd],
    [cx - hw, y, cz - hd],
  ];
  return <Line points={points} color={color} lineWidth={2} />;
}

/** 지게차 통로 표시 */
function MainAisle() {
  const { isDark } = useThreeTheme();
  const color = isDark ? '#ff9f0a44' : '#ff9f0a66';
  const { aisleZ, center, width } = FACTORY_WORLD_BOUNDS;
  const hw = width / 2;
  const cx = center[0];
  const y = 0.02;

  return (
    <>
      <Line
        points={[[cx - hw, y, aisleZ[0]], [cx + hw, y, aisleZ[0]]]}
        color={color}
        lineWidth={1.5}
        dashed
        dashSize={0.3}
        gapSize={0.15}
      />
      <Line
        points={[[cx - hw, y, aisleZ[1]], [cx + hw, y, aisleZ[1]]]}
        color={color}
        lineWidth={1.5}
        dashed
        dashSize={0.3}
        gapSize={0.15}
      />
      <Text
        position={[cx, 0.03, 0]}
        fontSize={0.2}
        color={isDark ? '#ff9f0a66' : '#ff9f0a88'}
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        FORKLIFT AISLE
      </Text>
    </>
  );
}

/** 메인 씬 */
function FactoryScene() {
  const zones = DEFAULT_FACTORY_ZONES;
  const flows = DEFAULT_FLOW_PATHS;
  const { center } = FACTORY_WORLD_BOUNDS;

  return (
    <>
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.1}
        minDistance={6}
        maxDistance={40}
        target={[center[0], 0, center[2]]}
      />

      <FloorGrid />
      <FactoryOutline />
      <MainAisle />

      {/* 구역 노드 */}
      {zones.map(zone => (
        <ZoneNode key={zone.id} zone={zone} />
      ))}

      {/* 물류 흐름 */}
      {flows.map(path => (
        <FlowArrow key={path.id} path={path} zones={zones} />
      ))}
    </>
  );
}

/** 범례 */
function Legend() {
  const statusItems = [
    { color: '#30d158', label: '가동중' },
    { color: '#86868b', label: '대기' },
    { color: '#ff453a', label: '에러' },
    { color: '#ff9f0a', label: '정비' },
  ];

  const typeItems = [
    { color: '#1e3a5f', label: '생산' },
    { color: '#0a84ff', label: '창고' },
    { color: '#30d158', label: '검사' },
    { color: '#5e5ce6', label: '준비' },
    { color: '#bf5af2', label: '포장' },
    { color: '#ff9f0a', label: '출고' },
    { color: '#636366', label: '사무실' },
  ];

  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>상태:</span>
        {statusItems.map(item => (
          <span
            key={item.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: item.color,
              display: 'inline-block',
            }} />
            {item.label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>구역:</span>
        {typeItems.map(item => (
          <span
            key={item.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: item.color,
              display: 'inline-block',
            }} />
            {item.label}
          </span>
        ))}
      </div>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 11,
        color: 'var(--text-secondary)',
      }}>
        <span style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#0a84ff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 8,
          fontWeight: 700,
        }}>
          N
        </span>
        작업자 수
      </span>
    </div>
  );
}

/** 외부 공개 컴포넌트 */
export function FactoryFloor3D() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          공장 현황 (디지털 트윈)
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          HK지앤텍 복층유리 공장 | CNC재단 → 강화 → 세척 → 조립/압착 → 실링 → 출고
        </p>
      </div>

      <div style={{ width: '100%', height: 550, borderRadius: 12, overflow: 'hidden' }}>
        <ThemeAwareScene
          config={{
            cameraPosition: [12.5, 18, 22],
            cameraFov: 50,
            demandRendering: false,
          }}
          style={{ width: '100%', height: '100%', borderRadius: 12 }}
        >
          <FactoryScene />
        </ThemeAwareScene>
      </div>

      <Legend />
    </div>
  );
}
