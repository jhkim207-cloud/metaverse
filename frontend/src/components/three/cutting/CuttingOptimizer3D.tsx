/**
 * CuttingOptimizer3D - 유리 재단 최적화 3D 뷰어
 *
 * 원판 유리 위에 절단 배치(Nesting)를 2.5D로 시각화.
 * 각 파트는 주문별 색상, 로스 영역은 빨간색 반투명 표시.
 */

import { useState, useEffect, useCallback } from 'react';
import { Text, OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { fetchCuttingDailyLayout } from '../../../services/cuttingApi';
import type { CuttingSheet, CuttingSheetPart, CuttingDailyLayout } from '../../../types/cutting.types';

/** mm → 3D 단위 변환 스케일 */
const SCALE = 0.002;
const SHEET_THICKNESS = 0.02;
const PART_LIFT = 0.025;

interface SheetSceneProps {
  sheet: CuttingSheet;
}

/** 개별 원판 씬 */
function SheetScene({ sheet }: SheetSceneProps) {
  const { isDark } = useThreeTheme();
  const w = sheet.rawWidth * SCALE;
  const h = sheet.rawHeight * SCALE;

  return (
    <>
      {/* 원판 유리 (반투명 Glass) */}
      <mesh position={[w / 2, 0, h / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          color={isDark ? '#2a3a4a' : '#e8f4f8'}
          transparent
          opacity={0.25}
          roughness={0.05}
          metalness={0.02}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
          side={2}
        />
      </mesh>

      {/* 원판 테두리 */}
      <lineSegments position={[w / 2, 0.001, h / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
        <lineBasicMaterial color={isDark ? '#5a5a68' : '#b0b0bc'} />
      </lineSegments>

      {/* 절단 파트들 */}
      {sheet.parts.map((part) => (
        <CutPart key={part.id} part={part} />
      ))}

      {/* 로스율 텍스트 */}
      <Text
        position={[w / 2, 0.08, h + 0.15]}
        fontSize={0.12}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        {`로스율: ${sheet.lossRate}%`}
      </Text>

      {/* 원판 ID */}
      <Text
        position={[w / 2, 0.08, -0.12]}
        fontSize={0.1}
        color={isDark ? '#86868b' : '#6e6e73'}
        anchorX="center"
        anchorY="middle"
      >
        {`${sheet.sheetId} (${sheet.rawWidth}×${sheet.rawHeight}mm)`}
      </Text>
    </>
  );
}

/** 개별 절단 파트 */
function CutPart({ part }: { part: CuttingSheetPart }) {
  const { isDark } = useThreeTheme();
  const x = part.x * SCALE;
  const z = part.y * SCALE;
  const pw = part.width * SCALE;
  const ph = part.height * SCALE;

  return (
    <group position={[x + pw / 2, PART_LIFT, z + ph / 2]}>
      {/* 파트 박스 */}
      <RoundedBox
        args={[pw - 0.005, SHEET_THICKNESS, ph - 0.005]}
        radius={0.003}
        smoothness={2}
      >
        <meshPhysicalMaterial
          color={part.color}
          transparent
          opacity={0.75}
          roughness={0.15}
          metalness={0.05}
          clearcoat={0.4}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* 순서 번호 */}
      <Text
        position={[0, SHEET_THICKNESS / 2 + 0.005, 0]}
        fontSize={Math.min(pw, ph) * 0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
        fontWeight={700}
      >
        {String(part.sequence)}
      </Text>

      {/* 고객명 (충분히 큰 파트만) */}
      {pw > 0.4 && ph > 0.3 && (
        <Text
          position={[0, SHEET_THICKNESS / 2 + 0.005, ph * 0.25]}
          fontSize={0.06}
          color={isDark ? '#d0d0d0' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 2, 0, 0]}
        >
          {part.customerNm}
        </Text>
      )}
    </group>
  );
}

/** 시트 선택기 */
function SheetSelector({
  sheets,
  selectedIdx,
  onSelect,
}: {
  sheets: CuttingSheet[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
      {sheets.map((sheet, i) => (
        <button
          key={sheet.sheetId}
          type="button"
          onClick={() => onSelect(i)}
          style={{
            padding: '6px 14px',
            fontSize: 12,
            fontWeight: selectedIdx === i ? 700 : 500,
            background: selectedIdx === i ? 'var(--accent)' : 'var(--btn-bg)',
            color: selectedIdx === i ? 'var(--on-accent)' : 'var(--btn-text)',
            border: selectedIdx === i ? 'none' : '1px solid var(--btn-border)',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          {sheet.sheetId} ({sheet.lossRate}%)
        </button>
      ))}
    </div>
  );
}

/** 메인 컴포넌트 */
export function CuttingOptimizer3D() {
  const [layout, setLayout] = useState<CuttingDailyLayout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSheet, setSelectedSheet] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCuttingDailyLayout();
      setLayout(data);
      setSelectedSheet(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const currentSheet = layout?.sheets[selectedSheet];

  if (error && !layout) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          재단 최적화 뷰어
        </h2>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--error)', marginBottom: 12 }}>{error}</p>
          <button
            type="button"
            onClick={loadData}
            style={{
              padding: '8px 20px',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            재단 최적화 뷰어
          </h2>
          {layout && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {layout.date} | 원판 {layout.totalSheetCount}장 | 전체 로스율 {layout.totalLossRate}%
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={loadData}
          style={{
            padding: '4px 12px',
            background: 'var(--btn-bg)',
            border: '1px solid var(--btn-border)',
            borderRadius: 6,
            color: 'var(--btn-text)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          {loading ? '로딩...' : '새로고침'}
        </button>
      </div>

      {layout && layout.sheets.length > 1 && (
        <SheetSelector
          sheets={layout.sheets}
          selectedIdx={selectedSheet}
          onSelect={setSelectedSheet}
        />
      )}

      {currentSheet && (
        <div style={{ width: '100%', height: 450, borderRadius: 12, overflow: 'hidden' }}>
          <ThemeAwareScene
            config={{
              cameraPosition: [3.5, 5, 5],
              cameraFov: 40,
              demandRendering: false,
            }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          >
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              maxPolarAngle={Math.PI / 2.2}
              minDistance={2}
              maxDistance={15}
              target={[
                currentSheet.rawWidth * SCALE / 2,
                0,
                currentSheet.rawHeight * SCALE / 2,
              ]}
            />
            <SheetScene sheet={currentSheet} />
          </ThemeAwareScene>
        </div>
      )}

      {/* 파트 범례 */}
      {currentSheet && currentSheet.parts.length > 0 && (
        <div style={{
          marginTop: 12,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          {currentSheet.parts.map((p) => (
            <span
              key={p.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 11,
                color: 'var(--text-secondary)',
                background: 'var(--btn-bg)',
                border: '1px solid var(--btn-border)',
              }}
            >
              <span style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: p.color,
                display: 'inline-block',
              }} />
              #{p.sequence} {p.customerNm} ({Math.round(p.width)}×{Math.round(p.height)})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
