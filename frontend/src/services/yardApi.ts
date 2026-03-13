/**
 * 야적장 API 서비스
 */

import { API_BASE_URL } from './api';
import type { ApiResponse } from '../types/api.types';

const BASE = `${API_BASE_URL}/v1/yard`;

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${BASE}${endpoint}`;
  const config: RequestInit = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return { success: false, data: null, message: 'API 요청 실패' } as ApiResponse<T>;
    }
    return await response.json();
  } catch {
    return { success: false, data: null, message: '네트워크 오류' } as ApiResponse<T>;
  }
}

/** 야적장 전체 조회 */
export function fetchYardView(yardCd: string) {
  return request(`/${yardCd}`);
}

/** 물건 추가 */
export function createYardItem(yardCd: string, item: {
  itemNm?: string;
  itemType: string;
  widthVal: number;
  lengthVal: number;
  positionX: number;
  positionZ: number;
  rotationY?: number;
  color?: string;
  status?: string;
}) {
  return request(`/${yardCd}/items`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

/** 물건 업데이트 */
export function updateYardItem(yardCd: string, id: number, updates: {
  positionX: number;
  positionZ: number;
  rotationY?: number;
  status?: string;
}) {
  return request(`/${yardCd}/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

/** 물건 삭제 */
export function deleteYardItem(yardCd: string, id: number) {
  return request(`/${yardCd}/items/${id}`, { method: 'DELETE' });
}

/** CCTV 알람 토글 */
export function toggleCctvAlarm(yardCd: string, cctvId: number, cctvNm?: string) {
  const params = cctvNm ? `?cctvNm=${encodeURIComponent(cctvNm)}` : '';
  return request(`/${yardCd}/cctv/${cctvId}/alarm${params}`, { method: 'PUT' });
}
