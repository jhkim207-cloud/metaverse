/**
 * 워크플로우 API 서비스
 */

import api from './api';
import type { StageCount, WorkflowItem } from '../types/workflow.types';

export const workflowApi = {
  getStageCounts: () => api.get<StageCount[]>('/v1/workflow/stage-counts'),

  getStageItems: (stageCode: string) =>
    api.get<WorkflowItem[]>(`/v1/workflow/stages/${stageCode}/items`),

  getItem: (itemId: number) =>
    api.get<WorkflowItem>(`/v1/workflow/items/${itemId}`),
};
