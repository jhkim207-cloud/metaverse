/**
 * 품질 SPC API 서비스
 */

import type { QualityDashboardData } from '../types/quality.types';

const API_BASE = '/api/v1/quality';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 품질 대시보드 데이터 조회 */
export async function fetchQualityDashboard(period?: string): Promise<QualityDashboardData> {
  const params = period ? `?period=${period}` : '';
  const res = await fetch(`${API_BASE}/dashboard${params}`);
  if (!res.ok) {
    throw new Error(`품질 데이터 조회 실패: ${res.status}`);
  }
  const json: ApiResponse<QualityDashboardData> = await res.json();
  if (!json.success) {
    throw new Error(json.message || '품질 데이터 조회 실패');
  }
  return json.data;
}
