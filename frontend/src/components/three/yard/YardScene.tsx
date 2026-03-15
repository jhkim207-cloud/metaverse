/**
 * YardScene - 야적장 관제 3D 메인 씬
 *
 * 기능: 그리드 + Capacity 바, 물건 드래그, CCTV 커버리지, 차량/경로, 배치 시뮬레이션
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid, Environment } from '@react-three/drei';
import { SceneEffects } from '../common/SceneEffects';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useYard } from '../../../hooks/useYard';
import { usePlacementSimulation } from '../../../hooks/usePlacementSimulation';
import { useYardPolling } from '../../../hooks/useYardPolling';
import { YardGrid } from './YardGrid';
import { YardItem } from './YardItem';
import { YardCCTV } from './YardCCTV';
import { YardDeleteZone } from './YardDeleteZone';
import { YardSimOverlay } from './YardSimOverlay';
import { YardVehicle3D } from './YardVehicle3D';
import { YardRoutePath } from './YardRoutePath';
import { YardDeviationMarker } from './YardDeviationMarker';
import type { DeviationPoint } from './YardDeviationMarker';
import { YardHUD } from './YardHUD';
import { YARD_SCALE, YARD_COLORS } from '../../../constants/yardLayout';
import type { SimRecommendation } from './YardSimOverlay';
import type { YardVehicle, YardRoute } from '../../../types/yardVehicle.types';

/** 내부 3D 씬 컨텐츠 */
function YardSceneContent({
  state,
  startDrag,
  moveItem,
  endDrag,
  toggleCCTVAlarm,
  recommendations,
  vehicles,
  routes,
  deviations,
  isDraggingItem,
}: {
  state: ReturnType<typeof useYard>['state'];
  startDrag: (id: string) => void;
  moveItem: (id: string, pos: [number, number, number]) => void;
  endDrag: (id: string) => void;
  toggleCCTVAlarm: (id: string) => void;
  recommendations: SimRecommendation[];
  vehicles: YardVehicle[];
  routes: YardRoute[];
  deviations: DeviationPoint[];
  isDraggingItem: boolean;
}) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const ambientIntensity = state.nightMode ? 0.15 : 0.6;
  const dirIntensity = state.nightMode ? 0.3 : 0.8;

  // 드래그 중 OrbitControls 비활성화
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enabled = !isDraggingItem;
    }
  }, [isDraggingItem]);
  const highlightedSpaces = recommendations.map((r) => r.spaceId);

  return (
    <>
      {/* 환경맵 + 조명 */}
      <Environment preset="city" background={false} environmentIntensity={state.nightMode ? 0.2 : 0.5} />
      <ambientLight intensity={ambientIntensity * 0.5} />
      <directionalLight
        position={[0, 10, 5]}
        intensity={dirIntensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={30}
        shadow-camera-near={0.1}
      />
      {state.nightMode && (
        <pointLight position={[0, 5, 0]} intensity={0.4} color="#FFA500" distance={15} />
      )}

      {/* 바닥 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color={YARD_COLORS.GROUND} />
      </mesh>

      {/* 그리드 보조선 */}
      <Grid
        position={[0, 0, 0]}
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#999999"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#666666"
        fadeDistance={30}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* 야적장 그리드 (구역 + Capacity 바) */}
      <YardGrid spaces={state.spaces} highlightedSpaces={highlightedSpaces} />

      {/* 배치 시뮬레이션 오버레이 */}
      <YardSimOverlay recommendations={recommendations} />

      {/* 계획/활성 경로 */}
      {routes.map((route) => (
        <YardRoutePath key={route.id} route={route} />
      ))}

      {/* 차량/중장비 */}
      {vehicles.map((v) => (
        <YardVehicle3D key={v.id} vehicle={v} />
      ))}

      {/* 이탈 마커 */}
      {deviations
        .filter((d) => !d.acknowledged)
        .map((d) => (
          <YardDeviationMarker key={d.id} deviation={d} />
        ))}

      {/* 삭제 영역 */}
      <YardDeleteZone config={state.config} />

      {/* 벽 */}
      <YardWalls config={state.config} />

      {/* 물건들 */}
      {state.items.map((item) => (
        <YardItem
          key={item.id}
          item={item}
          isSelected={state.selectedItemId === item.id}
          onDragStart={startDrag}
          onDragMove={moveItem}
          onDragEnd={endDrag}
        />
      ))}

      {/* CCTV */}
      {state.cctvs.map((cctv) => (
        <YardCCTV key={cctv.id} cctv={cctv} onClick={toggleCCTVAlarm} />
      ))}

      {/* 그림자 */}
      <ContactShadows
        opacity={state.nightMode ? 0.2 : 0.4}
        scale={20}
        blur={2}
        far={4}
        position={[0, -0.005, 0]}
      />

      {/* 카메라 컨트롤 - 좌클릭: 회전, 우클릭: 팬, 드래그 중 비활성 */}
      <OrbitControls
        ref={controlsRef}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={25}
        enableDamping
        dampingFactor={0.1}
        target={[0, 0, 0]}
      />

      {/* 후처리 효과 */}
      <SceneEffects bloom ssao />
    </>
  );
}

/** 벽 */
function YardWalls({ config }: { config: ReturnType<typeof useYard>['state']['config'] }) {
  const { spaceWidth, spaceLength, spacing } = config;
  const s = YARD_SCALE;
  const halfW = (3 * spaceWidth + 1.5 * spacing) * s;
  const halfH = (4 * spaceLength) * s;
  const wallH = 0.5;
  const wallT = 0.1;

  return (
    <group>
      <mesh position={[-halfW, wallH / 2, 0]}>
        <boxGeometry args={[wallT, wallH, halfH * 2]} />
        <meshStandardMaterial color={YARD_COLORS.WALL} />
      </mesh>
      <mesh position={[halfW, wallH / 2, 0]}>
        <boxGeometry args={[wallT, wallH, halfH * 2]} />
        <meshStandardMaterial color={YARD_COLORS.WALL} />
      </mesh>
      <mesh position={[0, wallH / 2, -halfH]}>
        <boxGeometry args={[halfW * 2, wallH, wallT]} />
        <meshStandardMaterial color={YARD_COLORS.WALL} />
      </mesh>
      <mesh position={[0, wallH / 2, halfH]}>
        <boxGeometry args={[halfW * 2, wallH, wallT]} />
        <meshStandardMaterial color={YARD_COLORS.WALL} />
      </mesh>
    </group>
  );
}

/** 메인 export - 야적장 관제 3D */
export function YardSimulation3D() {
  const {
    state,
    addItem,
    removeItem,
    moveItem,
    startDrag,
    endDrag,
    rotateItem,
    toggleCCTVAlarm,
    toggleNightMode,
  } = useYard();

  const { recommendations, isSimulating, simulate, clearSimulation } = usePlacementSimulation();
  const { vehicles, routes, deviations } = useYardPolling('YARD01');
  const [isDraggingItem, setIsDraggingItem] = useState(false);

  const handleStartDrag = useCallback((id: string) => {
    setIsDraggingItem(true);
    startDrag(id);
  }, [startDrag]);

  const handleEndDrag = useCallback((id: string) => {
    setIsDraggingItem(false);
    endDrag(id);
  }, [endDrag]);

  // 키보드 이벤트
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        if (state.selectedItemId) rotateItem(state.selectedItemId);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedItemId) removeItem(state.selectedItemId);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedItemId, rotateItem, removeItem]);

  const handleRotateSelected = useCallback(() => {
    if (state.selectedItemId) rotateItem(state.selectedItemId);
  }, [state.selectedItemId, rotateItem]);

  const handleSimulate = useCallback(
    (width: number, length: number) => {
      simulate(state.spaces, width, length);
    },
    [state.spaces, simulate],
  );

  const offRouteCount = vehicles.filter((v) => v.isOffRoute).length;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Canvas
        shadows
        frameloop="always"
        dpr={[1, 2]}
        camera={{ position: [0, 8, 8], fov: 45, near: 0.1, far: 100 }}
        style={{ background: state.nightMode ? '#1a1a2e' : YARD_COLORS.SCENE_BG }}
        gl={{ antialias: true, toneMapping: 4 /* ACESFilmicToneMapping */ }}
      >
        <YardSceneContent
          state={state}
          startDrag={handleStartDrag}
          moveItem={moveItem}
          endDrag={handleEndDrag}
          toggleCCTVAlarm={toggleCCTVAlarm}
          recommendations={recommendations}
          vehicles={vehicles}
          routes={routes}
          deviations={deviations}
          isDraggingItem={isDraggingItem}
        />
      </Canvas>

      {/* UI 오버레이 */}
      <YardHUD
        cctvs={state.cctvs}
        spaces={state.spaces}
        nightMode={state.nightMode}
        onAddItem={addItem}
        onToggleCCTVAlarm={toggleCCTVAlarm}
        onToggleNightMode={toggleNightMode}
        onRotateSelected={handleRotateSelected}
        selectedItemId={state.selectedItemId}
        onSimulate={handleSimulate}
        onClearSimulation={clearSimulation}
        isSimulating={isSimulating}
      />

      {/* 상태 표시 */}
      <div
        style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'var(--card-bg, rgba(255,255,255,0.9))',
          borderRadius: 6,
          padding: '8px 12px',
          fontSize: 11,
          color: 'var(--text-secondary, #666)',
          zIndex: 10,
          border: '1px solid var(--border, #e0e0e0)',
        }}
      >
        물건: {state.items.length} |
        차량: {vehicles.length} |
        CCTV: {state.cctvs.filter((c) => c.alarmActive).length}/{state.cctvs.length} |
        {offRouteCount > 0 && <span style={{ color: '#EF4444', fontWeight: 700 }}> 이탈: {offRouteCount}</span>}
        {deviations.filter((d) => !d.acknowledged).length > 0 && (
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>
            {' '}미확인: {deviations.filter((d) => !d.acknowledged).length}
          </span>
        )}
        {state.nightMode ? ' 야간' : ' 주간'}
      </div>
    </div>
  );
}
