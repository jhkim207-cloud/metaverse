/**
 * 품질 SPC 3D 타입 정의
 */

/** SPC 측정 포인트 */
export interface SpcDataPoint {
  date: string;
  value: number;
  isOutOfControl: boolean;
}

/** SPC 관리 한계 */
export interface SpcControlLimits {
  ucl: number;
  cl: number;
  lcl: number;
}

/** SPC 데이터 응답 */
export interface SpcChartData {
  measurements: SpcDataPoint[];
  controlLimits: SpcControlLimits;
  outOfControlCount: number;
  metric: string;
}

/** 불량 유형별 분석 */
export interface DefectAnalysisItem {
  reason: string;
  count: number;
  color: string;
}

/** 품질 대시보드 응답 */
export interface QualityDashboardData {
  spcChart: SpcChartData;
  defectByReason: DefectAnalysisItem[];
  defectByProcess: DefectAnalysisItem[];
  dailyDefectRate: { date: string; rate: number }[];
}
