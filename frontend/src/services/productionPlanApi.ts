import api from './api';
import type { ProductionPlan, Machine, ScheduleAssignment, PlanCreateWithDetailsRequest } from '../types/productionPlan.types';

export const productionPlanApi = {
  findByWeek: (weekStart: string) =>
    api.get<ProductionPlan[]>(`/v1/production-plans?weekStart=${weekStart}`),

  findBySiteNm: (siteNm: string) =>
    api.get<ProductionPlan[]>(`/v1/production-plans/by-site?siteNm=${encodeURIComponent(siteNm)}`),

  assignSchedule: (id: number, data: ScheduleAssignment) =>
    api.put<void>(`/v1/production-plans/${id}/schedule`, data),

  create: (data: Partial<ProductionPlan>) =>
    api.post<ProductionPlan>('/v1/production-plans', data),

  createWithDetails: (data: PlanCreateWithDetailsRequest) =>
    api.post<ProductionPlan>('/v1/production-plans/with-details', data),
};

export const codeApi = {
  findByGroupCode: (groupCode: string) =>
    api.get<Machine[]>(`/v1/codes?groupCode=${groupCode}`),
};
