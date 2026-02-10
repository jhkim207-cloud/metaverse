import api from './api';
import type { InventoryItem, InventoryTransaction } from '../types/inventory.types';

export const inventoryApi = {
  findAll: () => api.get<InventoryItem[]>('/v1/inventory'),

  search: (inventoryType?: string, keyword?: string) => {
    const query = new URLSearchParams();
    if (inventoryType) query.set('inventoryType', inventoryType);
    if (keyword) query.set('keyword', keyword);
    const qs = query.toString();
    return api.get<InventoryItem[]>(`/v1/inventory/search${qs ? `?${qs}` : ''}`);
  },

  recentTransactions: (limit = 30) =>
    api.get<InventoryTransaction[]>(`/v1/inventory/transactions/recent?limit=${limit}`),

  transactionsByMaterial: (materialCd: string) =>
    api.get<InventoryTransaction[]>(`/v1/inventory/transactions/${materialCd}`),
};
