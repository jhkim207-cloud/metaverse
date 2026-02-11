/**
 * ProductionDashboard3D - 실시간 생산 대시보드 (3D KPI)
 *
 * 백엔드 API에서 실제 생산 데이터를 조회하여 3D 차트로 표시.
 * API 실패 시 로딩/에러 상태 표시.
 */

import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { BentoGrid, BentoCard } from '../../ui/BentoGrid';
import { Skeleton } from '../../ui/Skeleton';
import { fetchDashboardKpi } from '../../../services/productionApi';
import type { ProductionDashboardKpi, Kpi3DData, DonutSegment } from '../../../types/three.types';

const KpiBar3D = lazy(() =>
  import('./KpiBar3D').then(m => ({ default: m.KpiBar3D }))
);
const KpiDonut3D = lazy(() =>
  import('./KpiDonut3D').then(m => ({ default: m.KpiDonut3D }))
);

function ThreeDFallback() {
  return <Skeleton variant="rounded" width="100%" height={160} />;
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 160,
      color: 'var(--error)',
      fontSize: 13,
      padding: 16,
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
}

function LoadingCard() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 160,
      color: 'var(--text-secondary)',
      fontSize: 13,
    }}>
      데이터 로딩 중...
    </div>
  );
}

/** 양품률 계산 */
function calcGoodRate(defectRate: DonutSegment[]): string {
  const good = defectRate.find(s => s.label === '양품');
  const total = defectRate.reduce((sum, s) => sum + s.value, 0);
  if (!good || total === 0) return '0%';
  return `${Math.round((good.value / total) * 100)}%`;
}

/** 로스율 계산 */
function calcLossRate(lossRate: DonutSegment[]): string {
  const loss = lossRate.find(s => s.label === '손실');
  const total = lossRate.reduce((sum, s) => sum + s.value, 0);
  if (!loss || total === 0) return '0%';
  return `${Math.round((loss.value / total) * 100)}%`;
}

export function ProductionDashboard3D() {
  const [kpi, setKpi] = useState<ProductionDashboardKpi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardKpi();
      setKpi(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터 로딩 실패');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // 30초 간격 자동 새로고침
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (error && !kpi) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          생산 대시보드
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
        marginBottom: 16,
      }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
          생산 대시보드
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>갱신 중...</span>
          )}
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
            새로고침
          </button>
        </div>
      </div>

      <BentoGrid cols={3}>
        {/* 오늘의 생산 실적 (호기별) */}
        <BentoCard
          title="오늘의 생산 실적"
          description="호기별 생산량 (수량)"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiBar3D data={kpi.dailyProduction as Kpi3DData[]} height={160} />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 양품률 */}
        <BentoCard
          title="양품률"
          description="오늘의 양품/불량 비율"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiDonut3D
                  segments={kpi.defectRate as DonutSegment[]}
                  centerValue={calcGoodRate(kpi.defectRate as DonutSegment[])}
                  centerLabel="양품률"
                  height={160}
                />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 재단 로스율 */}
        <BentoCard
          title="재단 로스율"
          description="사용면적 대비 손실면적"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiDonut3D
                  segments={kpi.lossRate as DonutSegment[]}
                  centerValue={calcLossRate(kpi.lossRate as DonutSegment[])}
                  centerLabel="로스율"
                  height={160}
                />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 공정별 진행 현황 */}
        <BentoCard
          title="공정별 진행 현황"
          description="주요 공정 잔량 현황"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiBar3D data={kpi.stageProgress as Kpi3DData[]} height={160} />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 주간 생산 추이 */}
        <BentoCard
          title="주간 생산 추이"
          description="최근 7일 일별 생산량"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiBar3D data={kpi.weeklyTrend as Kpi3DData[]} height={160} />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 용기 현황 */}
        <BentoCard
          title="용기 현황"
          description="위치별 용기 분포"
          header={
            loading && !kpi ? <LoadingCard /> :
            kpi ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiDonut3D
                  segments={kpi.containerStatus as DonutSegment[]}
                  centerValue={String(kpi.containerStatus.reduce((s, c) => s + c.value, 0))}
                  centerLabel="전체"
                  height={160}
                />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />
      </BentoGrid>
    </div>
  );
}
