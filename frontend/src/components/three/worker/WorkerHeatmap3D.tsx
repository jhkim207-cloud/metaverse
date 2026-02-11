/**
 * WorkerHeatmap3D - 작업자 배치 히트맵 3D
 *
 * 공장 평면도 위에 구역별 작업자 분포를 히트맵으로 표현.
 * 인원수에 따라 높이+색상 강도 변화, 작업자 목록 패널 포함.
 */

import { useState, useEffect, useCallback } from 'react';
import { Text, RoundedBox, OrbitControls } from '@react-three/drei';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { fetchWorkerDistribution } from '../../../services/workerApi';
import { DEFAULT_FACTORY_ZONES } from '../../../constants/factoryLayout';
import type { WorkerDailyDistribution, WorkerZoneDistribution } from '../../../types/worker.types';

/** 히트 레벨에 따른 색상 보간 */
function heatColor(level: number): string {
  if (level >= 0.8) return '#ff453a';
  if (level >= 0.6) return '#ff9f0a';
  if (level >= 0.4) return '#ffd60a';
  if (level >= 0.2) return '#30d158';
  return '#5ac8fa';
}

/** 구역 히트맵 블록 */
function HeatZone({ zone }: { zone: WorkerZoneDistribution & { position: [number, number, number]; size: [number, number, number] } }) {
  const { isDark } = useThreeTheme();
  const [w, , d] = zone.size;
  const heatH = 0.2 + zone.heatLevel * 1.2;
  const color = heatColor(zone.heatLevel);

  return (
    <group position={zone.position}>
      {/* 바닥 */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* 히트 바 */}
      <RoundedBox
        args={[w * 0.8, heatH, d * 0.8]}
        radius={0.05}
        smoothness={2}
        position={[0, heatH / 2, 0]}
      >
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.4 + zone.heatLevel * 0.35}
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.3}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>

      {/* 인원수 뱃지 */}
      <Text
        position={[0, heatH + 0.15, 0]}
        fontSize={0.2}
        color={color}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {String(zone.workerCount)}
      </Text>

      {/* 구역명 */}
      <Text
        position={[0, heatH + 0.35, 0]}
        fontSize={0.1}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        {zone.zoneName}
      </Text>

      {/* 구역 테두리 */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.35, Math.min(w, d) * 0.38, 32]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          side={2}
        />
      </mesh>
    </group>
  );
}

/** 히트맵 씬 */
function HeatmapScene({ data }: { data: WorkerDailyDistribution }) {
  const { isDark } = useThreeTheme();

  // 공장 구역 좌표와 작업자 데이터 매핑
  const mergedZones = data.zones.map(wz => {
    const factoryZone = DEFAULT_FACTORY_ZONES.find(fz => fz.id === wz.zoneId);
    return {
      ...wz,
      position: factoryZone?.position ?? [0, 0, 0] as [number, number, number],
      size: factoryZone?.size ?? [2, 0.8, 1.5] as [number, number, number],
    };
  });

  return (
    <>
      {mergedZones.map(zone => (
        <HeatZone key={zone.zoneId} zone={zone} />
      ))}

      {/* 바닥 그리드 */}
      <gridHelper
        args={[14, 28, isDark ? '#2a2a35' : '#d0d0d8', isDark ? '#2a2a35' : '#d0d0d8']}
        position={[0, -0.02, 0]}
      />
    </>
  );
}

/** 메인 컴포넌트 */
export function WorkerHeatmap3D() {
  const [data, setData] = useState<WorkerDailyDistribution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWorkerDistribution();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (error && !data) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          작업자 배치 현황
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
            작업자 배치 현황
          </h2>
          {data && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {data.date} | 총 {data.totalWorkers}명 배치
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

      {data && (
        <div style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden' }}>
          <ThemeAwareScene
            config={{
              cameraPosition: [0, 6, 8],
              cameraFov: 45,
              demandRendering: false,
            }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
          >
            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              maxPolarAngle={Math.PI / 2.2}
              minDistance={4}
              maxDistance={18}
              target={[0, 0, 0]}
            />
            <HeatmapScene data={data} />
          </ThemeAwareScene>
        </div>
      )}

      {/* 작업자 테이블 */}
      {data && (
        <div style={{
          marginTop: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 8,
        }}>
          {data.zones.map(zone => (
            <div
              key={zone.zoneId}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--btn-bg)',
                border: '1px solid var(--btn-border)',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 6,
              }}>
                <span style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: heatColor(zone.heatLevel),
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                  {zone.zoneName} ({zone.workerCount}명)
                </span>
              </div>
              {zone.workers.map(w => (
                <div
                  key={w.name}
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    padding: '1px 0',
                  }}
                >
                  {w.name} · {w.role} · {w.dept}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
