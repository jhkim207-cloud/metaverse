/**
 * 작업자 배치 API 서비스
 */

import type { WorkerDailyDistribution } from '../types/worker.types';

const API_BASE = '/api/v1/workers';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 작업자 일일 분포 조회 */
export async function fetchWorkerDistribution(date?: string): Promise<WorkerDailyDistribution> {
  const params = date ? `?date=${date}` : '';
  const res = await fetch(`${API_BASE}/daily-distribution${params}`);
  if (!res.ok) {
    throw new Error(`작업자 분포 조회 실패: ${res.status}`);
  }
  const json: ApiResponse<WorkerDailyDistribution> = await res.json();
  if (!json.success) {
    throw new Error(json.message || '작업자 분포 조회 실패');
  }
  return json.data;
}
