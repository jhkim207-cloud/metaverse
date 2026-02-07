/**
 * 워크플로우 데이터 조회 훅
 */

import { useState, useEffect, useCallback } from 'react';
import { workflowApi } from '../services/workflowApi';
import type { StageCount, WorkflowItem } from '../types/workflow.types';

export function useWorkflowCounts() {
  const [stageCounts, setStageCounts] = useState<StageCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetch() {
      try {
        const response = await workflowApi.getStageCounts();
        if (!cancelled) {
          if (response.success && response.data) {
            setStageCounts(response.data);
          } else {
            setError(response.message || '단계별 건수 조회 실패');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '단계별 건수 조회 실패');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, []);

  return { stageCounts, loading, error };
}

export function useStageItems(stageCode: string | null) {
  const [items, setItems] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stageCode) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    async function fetch() {
      try {
        const response = await workflowApi.getStageItems(stageCode!);
        if (!cancelled) {
          if (response.success && response.data) {
            setItems(response.data);
          } else {
            setError(response.message || '업무 항목 조회 실패');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '업무 항목 조회 실패');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetch();
    return () => { cancelled = true; };
  }, [stageCode]);

  return { items, loading, error };
}

export function useWorkflowItem() {
  const [item, setItem] = useState<WorkflowItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchItem = useCallback(async (itemId: number) => {
    setLoading(true);
    try {
      const response = await workflowApi.getItem(itemId);
      if (response.success && response.data) {
        setItem(response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { item, loading, fetchItem, setItem };
}
