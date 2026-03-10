/**
 * 재단 최적화 API 서비스
 */

import type { CuttingDailyLayout } from '../types/cutting.types';
import { API_BASE_URL } from './api';

const API_BASE = `${API_BASE_URL}/v1/cutting`;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 일별 재단 배치도 조회 */
export async function fetchCuttingDailyLayout(date?: string): Promise<CuttingDailyLayout> {
  const params = date ? `?date=${date}` : '';
  const res = await fetch(`${API_BASE}/daily-layout${params}`);
  if (!res.ok) {
    throw new Error(`재단 배치도 조회 실패: ${res.status}`);
  }
  const json: ApiResponse<CuttingDailyLayout> = await res.json();
  if (!json.success) {
    throw new Error(json.message || '재단 배치도 조회 실패');
  }
  return json.data;
}
