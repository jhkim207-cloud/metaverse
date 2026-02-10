import api from './api';
import type { DeliveryHeader, DeliveryDetail } from '../types/delivery.types';

export interface DeliverySearchParams {
  status?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const deliveryApi = {
  findAll: () => api.get<DeliveryHeader[]>('/v1/deliveries'),

  search: (params: DeliverySearchParams) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.dateFrom) query.set('dateFrom', params.dateFrom);
    if (params.dateTo) query.set('dateTo', params.dateTo);
    const qs = query.toString();
    return api.get<DeliveryHeader[]>(`/v1/deliveries/search${qs ? `?${qs}` : ''}`);
  },

  findDetails: (deliveryNo: string) =>
    api.get<DeliveryDetail[]>(`/v1/deliveries/${deliveryNo}/details`),
};
