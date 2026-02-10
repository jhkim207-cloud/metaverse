import { api } from './api';
import type {
  PeriodType,
  WorkflowResponse,
  OperationsResponse,
  SiteSummaryResponse,
} from '../types/dashboard.types';

const BASE = '/v1/dashboard';

export const dashboardApi = {
  getProductionFlow: (period: PeriodType) =>
    api.get<WorkflowResponse>(`${BASE}/production-flow?period=${period}`),

  getMaterialFlow: (period: PeriodType) =>
    api.get<WorkflowResponse>(`${BASE}/material-flow?period=${period}`),

  getOperations: (period: PeriodType) =>
    api.get<OperationsResponse>(`${BASE}/operations?period=${period}`),

  getSiteSummary: (period: PeriodType) =>
    api.get<SiteSummaryResponse>(`${BASE}/site-summary?period=${period}`),
};
