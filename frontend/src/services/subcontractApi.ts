import api from './api';
import type { SubcontractOrder } from '../types/subcontract.types';

export const subcontractApi = {
  findAll: () => api.get<SubcontractOrder[]>('/v1/subcontract-orders'),
};
