import api from './api';
import type {
  WorkOrderWithResult,
  ProductionResult,
  ProductionResultCreateRequest,
  ProductionResultUpdateRequest,
  FullCompleteRequest,
  ProductionSummary,
} from '../types/productionResult.types';

export const productionResultApi = {
  findWorkOrders: (requestDate?: string) =>
    api.get<WorkOrderWithResult[]>(`/v1/production-results/work-orders${requestDate ? `?requestDate=${requestDate}` : ''}`),

  findResults: (workRequestId: number) =>
    api.get<ProductionResult[]>(`/v1/production-results/${workRequestId}/results`),

  getSummary: (requestDate?: string) =>
    api.get<ProductionSummary>(`/v1/production-results/summary${requestDate ? `?requestDate=${requestDate}` : ''}`),

  createResult: (data: ProductionResultCreateRequest) =>
    api.post<ProductionResult>('/v1/production-results', data),

  fullComplete: (data: FullCompleteRequest) =>
    api.post<ProductionResult>('/v1/production-results/full-complete', data),

  updateResult: (id: number, data: ProductionResultUpdateRequest) =>
    api.put<ProductionResult>(`/v1/production-results/${id}`, data),

  deleteResult: (id: number) =>
    api.delete<void>(`/v1/production-results/${id}`),
};
