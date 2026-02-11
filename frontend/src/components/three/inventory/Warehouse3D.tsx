/**
 * Warehouse3D - 창고/재고 3D 뷰어
 *
 * 원판유리/부자재/완제품/용기의 재고를 구역별로 3D 시각화.
 * 적재율은 높이+색상 강도로 표현, 안전재고 미달은 경고 표시.
 */

import { useState, useEffect, useCallback } from 'react';
import { Text, RoundedBox, OrbitControls } from '@react-three/drei';
import { ThemeAwareScene } from '../common/ThemeAwareScene';
import { useThreeTheme } from '../../../hooks/useThreeTheme';
import { fetchWarehouseView } from '../../../services/inventoryApi';
import type { WarehouseViewData, WarehouseZone } from '../../../types/warehouse.types';

/** 개별 창고 구역 블록 */
function ZoneBlock({ zone, offsetX }: { zone: WarehouseZone; offsetX: number }) {
  const { isDark } = useThreeTheme();
  const [w, , d] = zone.size;
  const maxH = zone.size[1];

  return (
    <group position={[offsetX, 0, 0]}>
      {/* 바닥 플레이트 */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial
          color={isDark ? '#2a2a32' : '#e8e8ef'}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* 재고 아이템 바 */}
      {zone.items.map((item, i) => {
        const barW = Math.min(0.5, (w - 0.3) / Math.max(zone.items.length, 1));
        const totalBarW = zone.items.length * (barW + 0.1) - 0.1;
        const startX = -totalBarW / 2 + barW / 2;
        const x = startX + i * (barW + 0.1);
        const fillRate = item.currentQty / Math.max(item.maxQty, 1);
        const barH = fillRate * maxH;
        const isLow = item.currentQty <= item.minQty;

        return (
          <group key={item.materialCd} position={[x, 0, 0]}>
            {/* 적재 바 */}
            <RoundedBox
              args={[barW, Math.max(0.05, barH), 0.4]}
              radius={0.03}
              smoothness={2}
              position={[0, Math.max(0.025, barH / 2), 0]}
            >
              <meshPhysicalMaterial
                color={isLow ? '#ff453a' : item.color}
                transparent
                opacity={0.75}
                roughness={0.15}
                metalness={0.05}
                clearcoat={0.4}
                clearcoatRoughness={0.1}
              />
            </RoundedBox>

            {/* 최대 용량 와이어프레임 */}
            <RoundedBox
              args={[barW, maxH, 0.4]}
              radius={0.03}
              smoothness={2}
              position={[0, maxH / 2, 0]}
            >
              <meshStandardMaterial
                color={isDark ? '#4a4a52' : '#c0c0c8'}
                transparent
                opacity={0.1}
                wireframe
              />
            </RoundedBox>

            {/* 안전재고선 */}
            {item.minQty > 0 && (
              <mesh position={[0, (item.minQty / item.maxQty) * maxH, 0]}>
                <boxGeometry args={[barW + 0.05, 0.008, 0.42]} />
                <meshStandardMaterial color="#ff453a" transparent opacity={0.6} />
              </mesh>
            )}

            {/* 수량 텍스트 */}
            <Text
              position={[0, Math.max(0.05, barH) + 0.08, 0.22]}
              fontSize={0.09}
              color={isLow ? '#ff453a' : (isDark ? '#f5f5f7' : '#1d1d1f')}
              anchorX="center"
              anchorY="bottom"
              fontWeight={600}
            >
              {String(item.currentQty)}
            </Text>

            {/* 자재명 */}
            <Text
              position={[0, -0.08, 0.22]}
              fontSize={0.06}
              color={isDark ? '#86868b' : '#6e6e73'}
              anchorX="center"
              anchorY="top"
              maxWidth={barW + 0.1}
            >
              {item.materialNm}
            </Text>
          </group>
        );
      })}

      {/* 구역명 */}
      <Text
        position={[0, maxH + 0.2, 0]}
        fontSize={0.12}
        color={isDark ? '#f5f5f7' : '#1d1d1f'}
        anchorX="center"
        anchorY="middle"
        fontWeight={600}
      >
        {zone.name}
      </Text>

      {/* 적재율 */}
      <Text
        position={[0, maxH + 0.05, 0]}
        fontSize={0.08}
        color={isDark ? '#86868b' : '#6e6e73'}
        anchorX="center"
        anchorY="middle"
      >
        {`적재율 ${Math.round(zone.occupancyRate * 100)}%`}
      </Text>
    </group>
  );
}

/** 창고 전체 씬 */
function WarehouseScene({ data }: { data: WarehouseViewData }) {
  const { isDark } = useThreeTheme();
  const zones = data.zones;

  const spacing = 1.0;
  let offsetX = 0;
  const offsets: number[] = [];
  for (const zone of zones) {
    offsets.push(offsetX + zone.size[0] / 2);
    offsetX += zone.size[0] + spacing;
  }
  const totalW = offsetX - spacing;
  const centerX = totalW / 2;

  return (
    <>
      {zones.map((zone, i) => (
        <ZoneBlock
          key={zone.id}
          zone={zone}
          offsetX={offsets[i] - centerX}
        />
      ))}

      {/* 바닥 그리드 */}
      <gridHelper
        args={[totalW + 4, 20, isDark ? '#2a2a35' : '#d0d0d8', isDark ? '#2a2a35' : '#d0d0d8']}
        position={[0, -0.02, 0]}
      />
    </>
  );
}

/** 메인 컴포넌트 */
export function Warehouse3D() {
  const [data, setData] = useState<WarehouseViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchWarehouseView();
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
          창고 재고 현황
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
            창고 재고 현황
          </h2>
          {data && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              총 {data.totalItems}종 자재 | 안전재고 미달 {data.alertCount}건
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
        <div style={{ width: '100%', height: 450, borderRadius: 12, overflow: 'hidden' }}>
          <ThemeAwareScene
            config={{
              cameraPosition: [0, 4, 8],
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
              minDistance={3}
              maxDistance={18}
              target={[0, 0.5, 0]}
            />
            <WarehouseScene data={data} />
          </ThemeAwareScene>
        </div>
      )}

      {/* 범례 */}
      {data && (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.zones.flatMap(z => z.items).map(item => (
            <span
              key={item.materialCd}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 11,
                color: item.currentQty <= item.minQty ? 'var(--error)' : 'var(--text-secondary)',
                background: 'var(--btn-bg)',
                border: `1px solid ${item.currentQty <= item.minQty ? 'var(--error)' : 'var(--btn-border)'}`,
                fontWeight: item.currentQty <= item.minQty ? 600 : 400,
              }}
            >
              <span style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: item.currentQty <= item.minQty ? '#ff453a' : item.color,
                display: 'inline-block',
              }} />
              {item.materialNm}: {item.currentQty}/{item.maxQty} {item.unit}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
