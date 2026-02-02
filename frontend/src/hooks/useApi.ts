/**
 * API 호출 훅
 */

import { useState, useCallback } from 'react';
import type { ApiResponse } from '../types/api.types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();

      if (response.success) {
        setState({ data: response.data, loading: false, error: null });
        return response.data;
      } else {
        setState({
          data: null,
          loading: false,
          error: response.message || '요청 실패',
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

export default useApi;
