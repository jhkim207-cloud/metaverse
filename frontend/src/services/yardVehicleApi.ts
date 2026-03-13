/**
 * 야적장 차량/경로 API 서비스
 */

import { API_BASE_URL } from './api';
import type { ApiResponse } from '../types/api.types';
import type { YardVehicle, YardRoute } from '../types/yardVehicle.types';
import type { DeviationPoint } from '../components/three/yard/YardDeviationMarker';

const BASE = `${API_BASE_URL}/v1/yard`;

async function request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };
  try {
    const response = await fetch(url, config);
    const ct = response.headers.get('content-type');
    if (!ct || !ct.includes('application/json')) {
      return { success: false, data: null, message: 'API 요청 실패' } as ApiResponse<T>;
    }
    return await response.json();
  } catch {
    return { success: false, data: null, message: '네트워크 오류' } as ApiResponse<T>;
  }
}

export function fetchVehicles(yardCd: string) {
  return request<YardVehicle[]>(`${BASE}/${yardCd}/vehicles`);
}

export function fetchRoutes(yardCd: string) {
  return request<YardRoute[]>(`${BASE}/${yardCd}/routes`);
}

export function createRoute(yardCd: string, route: Partial<YardRoute>) {
  return request<YardRoute>(`${BASE}/${yardCd}/routes`, {
    method: 'POST',
    body: JSON.stringify(route),
  });
}

export function fetchDeviations(yardCd: string) {
  return request<DeviationPoint[]>(`${BASE}/${yardCd}/deviations`);
}

export function acknowledgeDeviation(yardCd: string, deviationId: number) {
  return request<void>(`${BASE}/${yardCd}/deviations/${deviationId}/ack`, {
    method: 'PUT',
  });
}
