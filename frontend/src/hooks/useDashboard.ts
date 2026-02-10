import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../services/dashboardApi';
import type {
  PeriodType,
  WorkflowResponse,
  OperationsResponse,
  SiteSummaryResponse,
} from '../types/dashboard.types';

interface DashboardState {
  productionFlow: WorkflowResponse | null;
  materialFlow: WorkflowResponse | null;
  salesSummary: OperationsResponse | null;
  operations: OperationsResponse | null;
  siteSummary: SiteSummaryResponse | null;
  loading: boolean;
  error: string | null;
}

// ── Mock 데이터 (백엔드 미실행 시 fallback) ──

function getMockProductionFlow(period: PeriodType): WorkflowResponse {
  const data: Record<PeriodType, WorkflowResponse> = {
    daily: {
      period: 'daily',
      steps: [
        { label: '수주', count: 5, mainValue: '5', mainUnit: '건', subValue: '2,400만원', subUnit: '' },
        { label: '작업지시', count: 3, mainValue: '3', mainUnit: '건', subValue: '480장', subUnit: '' },
        { label: '생산계획', count: 8, mainValue: '8', mainUnit: '건', subValue: '320장', subUnit: '' },
        { label: '생산실적', count: 267, mainValue: '267', mainUnit: '장', subValue: '98.5%', subUnit: '양품률' },
        { label: '출고실적', count: 2, mainValue: '2', mainUnit: '건', subValue: '출고중 1', subUnit: '' },
        { label: '재고현황', count: 89, mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
      ],
    },
    weekly: {
      period: 'weekly',
      steps: [
        { label: '수주', count: 25, mainValue: '25', mainUnit: '건', subValue: '1.2억원', subUnit: '' },
        { label: '작업지시', count: 18, mainValue: '18', mainUnit: '건', subValue: '1,920장', subUnit: '' },
        { label: '생산계획', count: 48, mainValue: '48', mainUnit: '건', subValue: '1,920장', subUnit: '' },
        { label: '생산실적', count: 1680, mainValue: '1,680', mainUnit: '장', subValue: '97.8%', subUnit: '양품률' },
        { label: '출고실적', count: 15, mainValue: '15', mainUnit: '건', subValue: '출고중 3', subUnit: '' },
        { label: '재고현황', count: 89, mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
      ],
    },
    monthly: {
      period: 'monthly',
      steps: [
        { label: '수주', count: 82, mainValue: '82', mainUnit: '건', subValue: '4.8억원', subUnit: '' },
        { label: '작업지시', count: 65, mainValue: '65', mainUnit: '건', subValue: '6,400장', subUnit: '' },
        { label: '생산계획', count: 155, mainValue: '155', mainUnit: '건', subValue: '6,400장', subUnit: '' },
        { label: '생산실적', count: 5280, mainValue: '5,280', mainUnit: '장', subValue: '98.2%', subUnit: '양품률' },
        { label: '출고실적', count: 48, mainValue: '48', mainUnit: '건', subValue: '출고중 5', subUnit: '' },
        { label: '재고현황', count: 89, mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
      ],
    },
  };
  return data[period];
}

function getMockMaterialFlow(period: PeriodType): WorkflowResponse {
  const data: Record<PeriodType, WorkflowResponse> = {
    daily: {
      period: 'daily',
      steps: [
        { label: '원자재 발주', count: 2, mainValue: '2', mainUnit: '건', subValue: '850만원', subUnit: '' },
        { label: '입고확인', count: 1, mainValue: '1', mainUnit: '건', subValue: '합격 100%', subUnit: '' },
        { label: '재고현황', count: 45, mainValue: '45', mainUnit: '종', subValue: '320평', subUnit: '' },
      ],
    },
    weekly: {
      period: 'weekly',
      steps: [
        { label: '원자재 발주', count: 12, mainValue: '12', mainUnit: '건', subValue: '2,500만원', subUnit: '' },
        { label: '입고확인', count: 8, mainValue: '8', mainUnit: '건', subValue: '합격 95%', subUnit: '' },
        { label: '재고현황', count: 45, mainValue: '45', mainUnit: '종', subValue: '320평', subUnit: '' },
      ],
    },
    monthly: {
      period: 'monthly',
      steps: [
        { label: '원자재 발주', count: 38, mainValue: '38', mainUnit: '건', subValue: '8,200만원', subUnit: '' },
        { label: '입고확인', count: 30, mainValue: '30', mainUnit: '건', subValue: '합격 96%', subUnit: '' },
        { label: '재고현황', count: 45, mainValue: '45', mainUnit: '종', subValue: '320평', subUnit: '' },
      ],
    },
  };
  return data[period];
}

function getMockSalesSummary(period: PeriodType): OperationsResponse {
  const data: Record<PeriodType, OperationsResponse> = {
    daily: {
      period: 'daily',
      cards: [
        { label: '거래처 매출', mainValue: '3,200', mainUnit: '만원', subValue: '거래처 4곳', subUnit: '' },
        { label: '제품 매출', mainValue: '2,800', mainUnit: '만원', subValue: '복층유리 85%', subUnit: '' },
      ],
    },
    weekly: {
      period: 'weekly',
      cards: [
        { label: '거래처 매출', mainValue: '1.8', mainUnit: '억원', subValue: '거래처 12곳', subUnit: '' },
        { label: '제품 매출', mainValue: '1.5', mainUnit: '억원', subValue: '복층유리 82%', subUnit: '' },
      ],
    },
    monthly: {
      period: 'monthly',
      cards: [
        { label: '거래처 매출', mainValue: '6.2', mainUnit: '억원', subValue: '거래처 28곳', subUnit: '' },
        { label: '제품 매출', mainValue: '5.4', mainUnit: '억원', subValue: '복층유리 80%', subUnit: '' },
      ],
    },
  };
  return data[period];
}

function getMockOperations(period: PeriodType): OperationsResponse {
  const data: Record<PeriodType, OperationsResponse> = {
    daily: {
      period: 'daily',
      cards: [
        { label: '외주발주현황', mainValue: '3', mainUnit: '건', subValue: '1,200만원', subUnit: '' },
        { label: '미출고현황', mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
        { label: '인원현황', mainValue: '24', mainUnit: '명', subValue: '4개 영역', subUnit: '' },
        { label: '재단일보', mainValue: '3.2', mainUnit: '%', subValue: '15평 로스', subUnit: '' },
        { label: '호기별현황', mainValue: '80%', mainUnit: '', subValue: '1호기 80% / 2호기 65%', subUnit: '' },
      ],
    },
    weekly: {
      period: 'weekly',
      cards: [
        { label: '외주발주현황', mainValue: '8', mainUnit: '건', subValue: '3,200만원', subUnit: '' },
        { label: '미출고현황', mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
        { label: '인원현황', mainValue: '23', mainUnit: '명', subValue: '평균 인원', subUnit: '' },
        { label: '재단일보', mainValue: '2.8', mainUnit: '%', subValue: '평균 로스율', subUnit: '' },
        { label: '호기별현황', mainValue: '75%', mainUnit: '', subValue: '1호기 78% / 2호기 62%', subUnit: '' },
      ],
    },
    monthly: {
      period: 'monthly',
      cards: [
        { label: '외주발주현황', mainValue: '15', mainUnit: '건', subValue: '8,200만원', subUnit: '' },
        { label: '미출고현황', mainValue: '89', mainUnit: '건', subValue: '120평', subUnit: '' },
        { label: '인원현황', mainValue: '22', mainUnit: '명', subValue: '평균 인원', subUnit: '' },
        { label: '재단일보', mainValue: '3.0', mainUnit: '%', subValue: '평균 로스율', subUnit: '' },
        { label: '호기별현황', mainValue: '72%', mainUnit: '', subValue: '1호기 75% / 2호기 60%', subUnit: '' },
      ],
    },
  };
  return data[period];
}

function getMockSiteSummary(period: PeriodType): SiteSummaryResponse {
  const sites = [
    { siteNm: '힐스테이트 위버필드', d: [1,1200,3,80,75,93.8,1,40,0,0,980,1], w: [5,6000,12,280,265,94.6,3,180,2,8.5,4800,4], m: [18,22000,42,980,920,93.9,12,650,5,25.0,18500,15] },
    { siteNm: '래미안 원베일리', d: [2,2400,4,120,110,91.7,1,50,1,3.5,1500,1], w: [8,9600,18,420,395,94.0,5,250,4,15.2,8200,7], m: [25,35000,58,1350,1280,94.8,18,850,8,42.0,28000,22] },
    { siteNm: '디에이치 라클라스', d: [0,0,2,60,55,91.7,0,0,1,2.8,0,0], w: [3,3600,8,150,140,93.3,2,90,1,5.0,3200,3], m: [12,14400,28,520,490,94.2,8,320,3,15.5,12800,10] },
    { siteNm: '자이 르네시떼', d: [1,800,1,30,28,93.3,0,0,0,0,650,1], w: [4,4800,6,140,130,92.9,2,80,2,7.5,3800,3], m: [15,18000,22,480,450,93.8,6,280,4,20.0,15200,12] },
    { siteNm: '아크로 리버파크', d: [1,1500,2,50,48,96.0,1,30,0,0,1200,1], w: [5,7500,10,200,190,95.0,3,120,1,4.0,6500,5], m: [12,18000,35,650,620,95.4,10,400,2,12.0,16000,10] },
  ];

  const key = period === 'daily' ? 'd' : period === 'weekly' ? 'w' : 'm';
  return {
    period,
    rows: sites.map(s => {
      const v = s[key];
      return {
        siteNm: s.siteNm,
        orderCount: v[0], orderAmount: v[1],
        planCount: v[2], planQty: v[3],
        resultGoodQty: v[4], resultGoodRate: v[5],
        deliveryCount: v[6], deliveryQty: v[7],
        pendingCount: v[8], pendingArea: v[9],
        salesAmount: v[10], salesCount: v[11],
      };
    }),
  };
}

// ── Hook ──

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    productionFlow: null,
    materialFlow: null,
    salesSummary: null,
    operations: null,
    siteSummary: null,
    loading: true,
    error: null,
  });

  const [periods, setPeriods] = useState<{
    production: PeriodType;
    material: PeriodType;
    sales: PeriodType;
    operations: PeriodType;
    site: PeriodType;
  }>({
    production: 'daily',
    material: 'daily',
    sales: 'daily',
    operations: 'daily',
    site: 'daily',
  });

  const fetchAll = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [pf, mf, ops, ss] = await Promise.all([
        dashboardApi.getProductionFlow(periods.production),
        dashboardApi.getMaterialFlow(periods.material),
        dashboardApi.getOperations(periods.operations),
        dashboardApi.getSiteSummary(periods.site),
      ]);

      // API 성공 시 서버 데이터 사용, 실패 시 mock fallback
      setState({
        productionFlow: pf.success && pf.data ? pf.data : getMockProductionFlow(periods.production),
        materialFlow: mf.success && mf.data ? mf.data : getMockMaterialFlow(periods.material),
        salesSummary: getMockSalesSummary(periods.sales),
        operations: ops.success && ops.data ? ops.data : getMockOperations(periods.operations),
        siteSummary: ss.success && ss.data ? ss.data : getMockSiteSummary(periods.site),
        loading: false,
        error: null,
      });
    } catch (err) {
      // 네트워크 완전 실패 시에도 mock 데이터로 표시
      setState({
        productionFlow: getMockProductionFlow(periods.production),
        materialFlow: getMockMaterialFlow(periods.material),
        salesSummary: getMockSalesSummary(periods.sales),
        operations: getMockOperations(periods.operations),
        siteSummary: getMockSiteSummary(periods.site),
        loading: false,
        error: null,
      });
    }
  }, [periods]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const setPeriod = useCallback((section: keyof typeof periods, period: PeriodType) => {
    setPeriods(prev => ({ ...prev, [section]: period }));
  }, []);

  return {
    ...state,
    periods,
    setPeriod,
    refresh: fetchAll,
  };
}
