/**
 * QualityDashboard3D - 품질 SPC 3D 대시보드
 *
 * SPC 관리도를 3D로 표현 (X축=시간, Y축=측정값, 관리한계=반투명 평면).
 * 불량 유형별 분석은 KpiBar3D/KpiDonut3D 재사용.
 */

import { lazy, Suspense, useState, useEffect, useCallback } from 'react';
import { BentoGrid, BentoCard } from '../../ui/BentoGrid';
import { Skeleton } from '../../ui/Skeleton';
import { fetchQualityDashboard } from '../../../services/qualityApi';
import type { QualityDashboardData } from '../../../types/quality.types';
import type { Kpi3DData, DonutSegment } from '../../../types/three.types';

const KpiBar3D = lazy(() =>
  import('../dashboard/KpiBar3D').then(m => ({ default: m.KpiBar3D }))
);
const KpiDonut3D = lazy(() =>
  import('../dashboard/KpiDonut3D').then(m => ({ default: m.KpiDonut3D }))
);
const SPC3DChart = lazy(() =>
  import('./SPC3DChart').then(m => ({ default: m.SPC3DChart }))
);

function ThreeDFallback() {
  return <Skeleton variant="rounded" width="100%" height={200} />;
}

function ErrorCard({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
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
      height: 200,
      color: 'var(--text-secondary)',
      fontSize: 13,
    }}>
      데이터 로딩 중...
    </div>
  );
}

export function QualityDashboard3D() {
  const [data, setData] = useState<QualityDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchQualityDashboard('30d');
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

  // 데이터 변환: defectByReason → Kpi3DData
  const defectByReasonKpi: Kpi3DData[] = data?.defectByReason.map(d => ({
    label: d.reason,
    value: d.count,
    color: d.color,
  })) ?? [];

  // 데이터 변환: defectByProcess → DonutSegment
  const defectByProcessDonut: DonutSegment[] = data?.defectByProcess.map(d => ({
    label: d.reason,
    value: d.count,
    color: d.color,
  })) ?? [];

  // 데이터 변환: dailyDefectRate → Kpi3DData
  const dailyRateKpi: Kpi3DData[] = data?.dailyDefectRate.map(d => ({
    label: d.date.slice(5), // MM-DD
    value: d.rate,
    maxValue: 10,
    color: d.rate > 5 ? '#ff453a' : '#30d158',
  })) ?? [];

  if (error && !data) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>
          품질 관리 대시보드
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
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            품질 관리 대시보드
          </h2>
          {data && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              SPC 관리도 (최근 30일) | 관리 이탈 {data.spcChart.outOfControlCount}건
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

      {/* SPC 관리도 (큰 차트) */}
      {data && (
        <div style={{ marginBottom: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
              {data.spcChart.metric} - SPC 관리도
            </h3>
            <Suspense fallback={<ThreeDFallback />}>
              <SPC3DChart
                measurements={data.spcChart.measurements}
                controlLimits={data.spcChart.controlLimits}
                height={280}
              />
            </Suspense>
          </div>
        </div>
      )}

      <BentoGrid cols={3}>
        {/* 불량 유형별 분석 */}
        <BentoCard
          title="불량 유형별 분석"
          description="불량 사유별 건수"
          header={
            loading && !data ? <LoadingCard /> :
            data ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiBar3D data={defectByReasonKpi} height={160} />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 공정별 불량 분포 */}
        <BentoCard
          title="공정별 불량 분포"
          description="공정별 불량 비율"
          header={
            loading && !data ? <LoadingCard /> :
            data ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiDonut3D
                  segments={defectByProcessDonut}
                  centerValue={String(defectByProcessDonut.reduce((s, d) => s + d.value, 0))}
                  centerLabel="총 불량"
                  height={160}
                />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />

        {/* 일별 불량률 추이 */}
        <BentoCard
          title="일별 불량률 추이"
          description="최근 7일 불량률 (%)"
          header={
            loading && !data ? <LoadingCard /> :
            data ? (
              <Suspense fallback={<ThreeDFallback />}>
                <KpiBar3D data={dailyRateKpi} height={160} />
              </Suspense>
            ) : <ErrorCard message="데이터 없음" />
          }
        />
      </BentoGrid>
    </div>
  );
}
