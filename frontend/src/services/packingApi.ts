import api from './api';
import type { PackingOrder } from '../types/packing.types';

export const packingApi = {
  findAll: () => api.get<PackingOrder[]>('/v1/packing-orders'),
};
