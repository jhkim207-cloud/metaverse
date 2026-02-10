/**
 * AI API 서비스 (SSE 헬퍼 포함)
 */

import type { SSECallbacks, NL2SQLResult } from '../types/ai.types';
import type { ApiResponse } from '../types/api.types';
import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * SSE EventSource 연결 헬퍼
 */
function createSSEConnection(url: string, callbacks: SSECallbacks): EventSource {
  const fullUrl = `${API_BASE_URL}${url}`;
  const eventSource = new EventSource(fullUrl);
  let completed = false;

  eventSource.addEventListener('status', (event: MessageEvent) => {
    callbacks.onStatus?.(event.data);
  });

  eventSource.addEventListener('content', (event: MessageEvent) => {
    callbacks.onContent?.(event.data);
  });

  eventSource.addEventListener('sql', (event: MessageEvent) => {
    callbacks.onSQL?.(event.data);
  });

  eventSource.addEventListener('result', (event: MessageEvent) => {
    callbacks.onResult?.(event.data);
  });

  eventSource.addEventListener('done', () => {
    completed = true;
    callbacks.onDone?.();
    eventSource.close();
  });

  eventSource.addEventListener('error', (event: MessageEvent) => {
    if (completed) return;
    if (event.data) {
      callbacks.onError?.(event.data);
      eventSource.close();
    }
  });

  eventSource.onerror = () => {
    if (completed) return;
    callbacks.onError?.('SSE 연결 오류');
    eventSource.close();
  };

  return eventSource;
}

/**
 * 출고(매출) 분석 SSE 스트림
 */
export function streamDeliveryAnalysis(question: string, callbacks: SSECallbacks): EventSource {
  const encodedQuestion = encodeURIComponent(question);
  return createSSEConnection(
    `/v1/delivery-analysis-ai/analyze/stream?question=${encodedQuestion}`,
    callbacks
  );
}

/**
 * NL2SQL POST (동기)
 */
export async function executeNL2SQL(question: string): Promise<ApiResponse<NL2SQLResult>> {
  return api.post<NL2SQLResult>('/v1/nl2sql/query', { question });
}

/**
 * NL2SQL SSE 스트림
 */
export function streamNL2SQL(question: string, callbacks: SSECallbacks): EventSource {
  const encodedQuestion = encodeURIComponent(question);
  return createSSEConnection(
    `/v1/nl2sql/query/stream?question=${encodedQuestion}`,
    callbacks
  );
}
