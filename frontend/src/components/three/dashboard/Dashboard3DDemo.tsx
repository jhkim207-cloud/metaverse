/**
 * Dashboard3DDemo - 3D KPI 대시보드 데모
 *
 * BentoGrid + BentoCard 내부에 3D 미니차트를 삽입하는 예시.
 * 실제 대시보드 페이지에서 이 패턴을 활용.
 */

import { lazy, Suspense } from 'react';
import { BentoGrid, BentoCard } from '../../ui/BentoGrid';
import { Skeleton } from '../../ui/Skeleton';
import type { Kpi3DData, DonutSegment } from '../../../types/three.types';

// Dynamic Import: 3D 차트는 렌더링 시에만 로드
const KpiBar3D = lazy(() =>
  import('./KpiBar3D').then(m => ({ default: m.KpiBar3D }))
);
const KpiDonut3D = lazy(() =>
  import('./KpiDonut3D').then(m => ({ default: m.KpiDonut3D }))
);

/** 샘플 데이터: 월간 생산량 */
const MONTHLY_PRODUCTION: Kpi3DData[] = [
  { label: '1월', value: 120 },
  { label: '2월', value: 95 },
  { label: '3월', value: 140 },
  { label: '4월', value: 110 },
  { label: '5월', value: 165 },
  { label: '6월', value: 130 },
];

/** 샘플 데이터: 불량률 도넛 */
const DEFECT_SEGMENTS: DonutSegment[] = [
  { label: '양품', value: 92, color: '#30d158' },
  { label: '불량', value: 5, color: '#ff453a' },
  { label: '검사중', value: 3, color: '#ff9f0a' },
];

/** 샘플 데이터: 주문 유형 */
const ORDER_TYPE_DATA: Kpi3DData[] = [
  { label: '프로젝트', value: 24, color: '#1e3a5f' },
  { label: '임가공', value: 18, color: '#0a84ff' },
  { label: '긴급', value: 7, color: '#ff453a' },
];

/** 샘플 데이터: 공정별 진행률 */
const PROCESS_SEGMENTS: DonutSegment[] = [
  { label: '수주', value: 30, color: '#1e3a5f' },
  { label: '생산', value: 25, color: '#0a84ff' },
  { label: '포장', value: 20, color: '#30d158' },
  { label: '출고', value: 15, color: '#ff9f0a' },
  { label: '대기', value: 10, color: '#86868b' },
];

function ThreeDFallback() {
  return <Skeleton variant="rounded" width="100%" height={180} />;
}

export function Dashboard3DDemo() {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 16,
      }}>
        3D KPI Dashboard
      </h2>

      <BentoGrid cols={2}>
        {/* 월간 생산량 3D Bar */}
        <BentoCard
          title="월간 생산량"
          description="최근 6개월 생산 실적"
          header={
            <Suspense fallback={<ThreeDFallback />}>
              <KpiBar3D data={MONTHLY_PRODUCTION} height={160} />
            </Suspense>
          }
        />

        {/* 불량률 3D Donut */}
        <BentoCard
          title="품질 현황"
          description="이번 달 양품/불량 비율"
          header={
            <Suspense fallback={<ThreeDFallback />}>
              <KpiDonut3D
                segments={DEFECT_SEGMENTS}
                centerValue="92%"
                centerLabel="양품률"
                height={160}
              />
            </Suspense>
          }
        />

        {/* 주문 유형 3D Bar */}
        <BentoCard
          title="주문 유형별 현황"
          description="이번 달 주문 건수"
          header={
            <Suspense fallback={<ThreeDFallback />}>
              <KpiBar3D data={ORDER_TYPE_DATA} height={160} />
            </Suspense>
          }
        />

        {/* 공정별 진행률 3D Donut */}
        <BentoCard
          title="공정별 진행률"
          description="전체 작업의 공정 분포"
          header={
            <Suspense fallback={<ThreeDFallback />}>
              <KpiDonut3D
                segments={PROCESS_SEGMENTS}
                centerValue="120"
                centerLabel="전체 건수"
                height={160}
              />
            </Suspense>
          }
        />
      </BentoGrid>
    </div>
  );
}
