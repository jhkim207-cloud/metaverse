/**
 * WorkflowPipeline3D - 생산 워크플로우 3D 파이프라인 시각화
 *
 * 레이아웃 (Z축 깊이 활용):
 *   전면 레이어 (z=0): 메인 흐름 7단계 (수주 → 출고)
 *   상단 레이어 (y+): 진입점 (프로젝트, 임가공) → 수주로 연결
 *   후면 레이어 (z=-1): 분기 흐름 (발주, 작업자배치, 불량, 제품재고)
 *
 * 각 단계의 건수를 실린더 높이로 매핑. 활성 단계 강조.
 */

import { useMemo, useCallback } from 'react';
import { Text, Line, OrbitControls } from '@react-three/drei';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { GlassPanel } from '../common/GlassPanel';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import type { StageCount } from '../../../types/workflow.types';
import {
  MAIN_STAGES,
  ENTRY_STAGES,
  getBranches,
} from '../../../constants/workflow';
import * as THREE from 'three';

interface WorkflowPipeline3DProps {
  activeStage: string;
  onStageClick: (code: string) => void;
  stageCounts?: StageCount[];
}

/** 상수: 레이아웃 배치 */
const MAIN_START_X = -3;
const MAIN_SPACING = 1.1;
const MAIN_Y = 0;
const MAIN_Z = 0;
const ENTRY_X = MAIN_START_X - 1.8;
const ENTRY_Y_TOP = 0.5;
const ENTRY_Y_BOTTOM = -0.5;
const BRANCH_Z = -1.2;
const NODE_RADIUS = 0.3;

/** 메인 단계 노드 */
function MainStageNode({
  name,
  nameEn,
  count,
  isActive,
  isCompleted,
  position,
  onClick,
}: {
  name: string;
  nameEn: string;
  count: number;
  isActive: boolean;
  isCompleted: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const { accentColor, successColor, isDark } = useThreeTheme();
  const barHeight = Math.max(0.05, Math.min(count / 20, 1.5));

  const nodeColor = isCompleted
    ? successColor
    : isActive
    ? accentColor
    : isDark ? '#3a3a42' : '#d0d0d8';

  const emissiveColor = isActive ? accentColor : isCompleted ? successColor : '#000000';
  const emissiveIntensity = isActive ? 0.4 : isCompleted ? 0.2 : 0;

  return (
    <group position={position} onClick={onClick}>
      {/* 원형 노드 */}
      <mesh>
        <cylinderGeometry args={[NODE_RADIUS, NODE_RADIUS, 0.08, 32]} />
        <meshPhysicalMaterial
          color={nodeColor}
          roughness={0.3}
          metalness={0.1}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          clearcoat={0.5}
        />
      </mesh>

      {/* 건수 바 (위로 솟아오름) */}
      {count > 0 && (
        <mesh position={[0, barHeight / 2 + 0.1, 0]}>
          <cylinderGeometry args={[0.12, 0.15, barHeight, 16]} />
          <meshPhysicalMaterial
            color={isActive ? accentColor : isDark ? '#5a5a68' : '#b0b0bc'}
            transparent
            opacity={0.7}
            roughness={0.2}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* 건수 텍스트 */}
      {count > 0 && (
        <Text
          position={[0, barHeight + 0.25, 0]}
          fontSize={0.14}
          color={isActive ? accentColor : isDark ? '#a1a1a6' : '#6e6e73'}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {`${count}건`}
        </Text>
      )}

      {/* 단계명 */}
      <Text
        position={[0, -0.32, 0]}
        fontSize={0.15}
        color={isActive ? accentColor : isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="top"
        fontWeight={isActive ? 700 : 500}
      >
        {name}
      </Text>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.1}
        color={isDark ? '#86868b' : '#86868b'}
        anchorX="center"
        anchorY="top"
      >
        {nameEn}
      </Text>
    </group>
  );
}

/** 진입점 노드 */
function EntryNode({
  name,
  isActive,
  position,
  onClick,
}: {
  name: string;
  isActive: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const { accentColor, isDark } = useThreeTheme();

  return (
    <group position={position} onClick={onClick}>
      <GlassPanel
        width={0.9}
        height={0.35}
        depth={0.04}
        radius={0.04}
        color={isActive ? accentColor : undefined}
        opacity={isActive ? 0.9 : 0.5}
      />
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.12}
        color={isActive ? '#ffffff' : isDark ? '#a1a1a6' : '#6e6e73'}
        anchorX="center"
        anchorY="middle"
        fontWeight={isActive ? 700 : 500}
      >
        {name}
      </Text>
    </group>
  );
}

/** 분기 노드 */
function BranchNode({
  name,
  isActive,
  position,
  onClick,
}: {
  name: string;
  isActive: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const { accentColor, isDark } = useThreeTheme();

  return (
    <group position={position} onClick={onClick}>
      <mesh>
        <boxGeometry args={[0.8, 0.28, 0.04]} />
        <meshPhysicalMaterial
          color={isActive ? accentColor : isDark ? '#2a2a32' : '#e8e8f0'}
          transparent
          opacity={isActive ? 0.85 : 0.5}
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.1}
        color={isActive ? '#ffffff' : isDark ? '#86868b' : '#8e8e93'}
        anchorX="center"
        anchorY="middle"
        fontWeight={isActive ? 600 : 400}
      >
        {name}
      </Text>
    </group>
  );
}

/** 연결 라인 */
function ConnectionLine({
  start,
  end,
  isCompleted,
  dashed = false,
}: {
  start: [number, number, number];
  end: [number, number, number];
  isCompleted: boolean;
  dashed?: boolean;
}) {
  const { successColor, isDark } = useThreeTheme();
  const color = isCompleted ? successColor : isDark ? '#3a3a42' : '#d0d0d8';

  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={isCompleted ? 2 : 1}
      dashed={dashed}
      dashSize={dashed ? 0.08 : undefined}
      gapSize={dashed ? 0.06 : undefined}
    />
  );
}

/** 메인 씬 내부 */
function PipelineScene({ activeStage, onStageClick, stageCounts = [] }: WorkflowPipeline3DProps) {
  const countsMap = useMemo(() => {
    const map: Record<string, number> = {};
    stageCounts.forEach(c => { map[c.stageCode] = c.total; });
    return map;
  }, [stageCounts]);

  const getCount = useCallback((code: string) => countsMap[code] ?? 0, [countsMap]);

  const activeMainIndex = useMemo(() => {
    const idx = MAIN_STAGES.findIndex(s => s.code === activeStage);
    if (idx >= 0) return idx;
    const entry = ENTRY_STAGES.find(s => s.code === activeStage);
    if (entry) return -1;
    for (const main of MAIN_STAGES) {
      const branches = getBranches(main.code);
      if (branches.some(b => b.code === activeStage)) {
        return MAIN_STAGES.findIndex(s => s.code === main.code);
      }
    }
    return 0;
  }, [activeStage]);

  return (
    <>
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={12}
        target={[0, 0, -0.3]}
      />

      {/* 진입점 노드 */}
      {ENTRY_STAGES.map((stage, i) => (
        <EntryNode
          key={stage.code}
          name={stage.name}
          isActive={activeStage === stage.code}
          position={[ENTRY_X, i === 0 ? ENTRY_Y_TOP : ENTRY_Y_BOTTOM, MAIN_Z]}
          onClick={() => onStageClick(stage.code)}
        />
      ))}

      {/* 진입점 → 수주 연결선 */}
      <ConnectionLine
        start={[ENTRY_X + 0.5, ENTRY_Y_TOP, MAIN_Z]}
        end={[MAIN_START_X - NODE_RADIUS, MAIN_Y, MAIN_Z]}
        isCompleted={false}
        dashed
      />
      <ConnectionLine
        start={[ENTRY_X + 0.5, ENTRY_Y_BOTTOM, MAIN_Z]}
        end={[MAIN_START_X - NODE_RADIUS, MAIN_Y, MAIN_Z]}
        isCompleted={false}
        dashed
      />

      {/* 메인 흐름 노드 */}
      {MAIN_STAGES.map((stage, index) => {
        const x = MAIN_START_X + index * MAIN_SPACING;
        const isActive = activeStage === stage.code;
        const isCompleted = activeMainIndex > index;
        const branches = getBranches(stage.code);

        return (
          <group key={stage.code}>
            <MainStageNode
              name={stage.name}
              nameEn={stage.nameEn}
              count={getCount(stage.code)}
              isActive={isActive}
              isCompleted={isCompleted}
              position={[x, MAIN_Y, MAIN_Z]}
              onClick={() => onStageClick(stage.code)}
            />

            {/* 메인 흐름 연결선 */}
            {index < MAIN_STAGES.length - 1 && (
              <ConnectionLine
                start={[x + NODE_RADIUS, MAIN_Y, MAIN_Z]}
                end={[x + MAIN_SPACING - NODE_RADIUS, MAIN_Y, MAIN_Z]}
                isCompleted={activeMainIndex > index}
              />
            )}

            {/* 분기 연결선 + 노드 */}
            {branches.map((branch, bi) => {
              const branchY = MAIN_Y - 0.6 - bi * 0.45;
              return (
                <group key={branch.code}>
                  <ConnectionLine
                    start={[x, MAIN_Y - NODE_RADIUS, MAIN_Z]}
                    end={[x, branchY, BRANCH_Z]}
                    isCompleted={false}
                    dashed
                  />
                  <BranchNode
                    name={branch.name}
                    isActive={activeStage === branch.code}
                    position={[x, branchY, BRANCH_Z]}
                    onClick={() => onStageClick(branch.code)}
                  />
                </group>
              );
            })}
          </group>
        );
      })}

      {/* 바닥 그리드 (미세한 참조선) */}
      <gridHelper
        args={[12, 24, new THREE.Color('#8888880a'), new THREE.Color('#8888880a')]}
        position={[0, -1.5, 0]}
      />
    </>
  );
}

/** 외부 공개 컴포넌트: Canvas 래핑 */
export function WorkflowPipeline3D(props: WorkflowPipeline3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 320 }}>
      <ThemeAwareScene
        config={{
          cameraPosition: [0, 3, 7],
          cameraFov: 40,
          demandRendering: false,
        }}
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      >
        <PipelineScene {...props} />
      </ThemeAwareScene>
    </div>
  );
}
