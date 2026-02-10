import api from './api';
import type { ProductionPlan } from '../types/productionPlan.types';
import type { WorkOrder, ProductionPlanDetail, WorkOrderCreateRequest } from '../types/workOrder.types';

export const workOrderApi = {
  findUncompletedPlans: (targetDate: string) =>
    api.get<ProductionPlan[]>(`/v1/work-orders/plans?targetDate=${targetDate}`),

  findPlanDetails: (planId: number) =>
    api.get<ProductionPlanDetail[]>(`/v1/work-orders/plans/${planId}/details`),

  createWorkOrders: (data: WorkOrderCreateRequest) =>
    api.post<WorkOrder[]>('/v1/work-orders', data),

  findAll: () =>
    api.get<WorkOrder[]>('/v1/work-orders'),

  findByRequestDate: (requestDate: string) =>
    api.get<WorkOrder[]>(`/v1/work-orders?requestDate=${requestDate}`),

  findByPlanId: (planId: number) =>
    api.get<WorkOrder[]>(`/v1/work-orders/by-plan/${planId}`),
};
