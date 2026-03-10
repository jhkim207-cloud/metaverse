/**
 * 생산 대시보드 API 서비스
 */

import type { ProductionDashboardKpi } from '../types/three.types';
import { API_BASE_URL } from './api';

const API_BASE = `${API_BASE_URL}/v1/production`;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 대시보드 KPI 통합 조회 */
export async function fetchDashboardKpi(date?: string): Promise<ProductionDashboardKpi> {
  const params = date ? `?date=${date}` : '';
  const res = await fetch(`${API_BASE}/dashboard-kpi${params}`);
  if (!res.ok) {
    throw new Error(`대시보드 KPI 조회 실패: ${res.status}`);
  }
  const json: ApiResponse<ProductionDashboardKpi> = await res.json();
  if (!json.success) {
    throw new Error(json.message || '대시보드 KPI 조회 실패');
  }
  return json.data;
}
