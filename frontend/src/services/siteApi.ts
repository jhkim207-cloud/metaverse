/**
 * 현장 마스터 / 거래처 마스터 API 서비스
 */

import api from './api';
import type { SiteMaster, SiteMasterCreateRequest, BusinessPartner, SitePrice, SalesOrderHeader, SalesOrderDetail, SalesOrderCreateRequest } from '../types/site.types';

export const siteApi = {
  findAll: () => api.get<SiteMaster[]>('/v1/sites'),

  findById: (id: number) => api.get<SiteMaster>(`/v1/sites/${id}`),

  create: (data: SiteMasterCreateRequest) => api.post<void>('/v1/sites', data),

  update: (id: number, data: SiteMasterCreateRequest) => api.put<void>(`/v1/sites/${id}`, data),

  delete: (id: number) => api.delete<void>(`/v1/sites/${id}`),
};

export const sitePriceApi = {
  findBySiteCd: (siteCd: string) => api.get<SitePrice[]>(`/v1/site-prices/by-site-cd/${siteCd}`),
};

export const bpApi = {
  findByBpCd: (bpCd: string) => api.get<BusinessPartner>(`/v1/business-partners/by-bp-cd/${bpCd}`),
};

export const salesOrderApi = {
  findAll: () => api.get<SalesOrderHeader[]>('/v1/sales-orders'),

  findDetailsByHeaderId: (headerId: number) =>
    api.get<SalesOrderDetail[]>(`/v1/sales-orders/${headerId}/details`),

  nextOrderNo: () => api.get<string>('/v1/sales-orders/next-order-no'),

  create: (data: SalesOrderCreateRequest) =>
    api.post<SalesOrderHeader>('/v1/sales-orders', data),

  update: (id: number, data: SalesOrderCreateRequest) =>
    api.put<SalesOrderHeader>(`/v1/sales-orders/${id}`, data),

  delete: (id: number) => api.delete<void>(`/v1/sales-orders/${id}`),
};
