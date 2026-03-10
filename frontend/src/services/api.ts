/**
 * API 클라이언트
 */

import type { ApiResponse } from '../types/api.types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/metaverse-api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    // non-JSON 응답 처리 (CORS 거부, 프록시 오류 등)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      return {
        success: false,
        data: null,
        message: 'API 요청 실패',
        errorCode: 'NON_JSON_RESPONSE',
        detail: `HTTP ${response.status}: ${text}`,
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        data: null,
        message: data.message || 'API 요청 실패',
        errorCode: data.errorCode || 'API_ERROR',
        detail: data.detail || null,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : '네트워크 오류',
      errorCode: 'NETWORK_ERROR',
      detail: null,
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export default api;
