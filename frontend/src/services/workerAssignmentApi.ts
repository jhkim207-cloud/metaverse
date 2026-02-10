import api from './api';
import type { WorkerDailyAssignment, WorkerAssignmentType } from '../types/workerAssignment.types';

export const workerAssignmentApi = {
  findByWorkDate: (workDate: string) =>
    api.get<WorkerDailyAssignment[]>(`/v1/worker-assignments/daily?workDate=${workDate}`),

  findAssignmentTypes: () =>
    api.get<WorkerAssignmentType[]>('/v1/worker-assignments/types'),

  findAvailableDates: () =>
    api.get<string[]>('/v1/worker-assignments/dates'),
};
