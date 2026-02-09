/**
 * 현장 마스터 / 거래처 마스터 API 서비스
 */

import api from './api';
import type { SiteMaster, SiteMasterCreateRequest, BusinessPartner } from '../types/site.types';

export const siteApi = {
  findAll: () => api.get<SiteMaster[]>('/v1/sites'),

  findById: (id: number) => api.get<SiteMaster>(`/v1/sites/${id}`),

  create: (data: SiteMasterCreateRequest) => api.post<void>('/v1/sites', data),
};

export const bpApi = {
  findByBpCd: (bpCd: string) => api.get<BusinessPartner>(`/v1/business-partners/by-bp-cd/${bpCd}`),
};
