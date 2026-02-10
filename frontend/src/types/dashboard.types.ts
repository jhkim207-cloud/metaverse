/** 대시보드 타입 정의 (업무흐름 기반) */

export type PeriodType = 'daily' | 'weekly' | 'monthly';

/** 업무흐름 단계 하나 */
export interface WorkflowStep {
  label: string;
  count: number;
  mainValue: string;
  mainUnit: string;
  subValue: string;
  subUnit: string;
}

/** 업무흐름 응답 (생산/원자재 공통) */
export interface WorkflowResponse {
  period: string;
  steps: WorkflowStep[];
}

/** 운영 현황 카드 하나 */
export interface OperationCard {
  label: string;
  mainValue: string;
  mainUnit: string;
  subValue: string;
  subUnit: string;
}

/** 운영 현황 응답 */
export interface OperationsResponse {
  period: string;
  cards: OperationCard[];
}

/** 현장별 현황 행 */
export interface SiteSummaryRow {
  siteNm: string;
  orderCount: number;
  orderAmount: number;
  planCount: number;
  planQty: number;
  resultGoodQty: number;
  resultGoodRate: number;
  deliveryCount: number;
  deliveryQty: number;
  pendingCount: number;
  pendingArea: number;
  salesAmount: number;
  salesCount: number;
}

/** 현장별 현황 응답 */
export interface SiteSummaryResponse {
  period: string;
  rows: SiteSummaryRow[];
}
