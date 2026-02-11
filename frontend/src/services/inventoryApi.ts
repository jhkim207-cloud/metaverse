import api from './api';
import type { InventoryItem, InventoryTransaction } from '../types/inventory.types';
import type { WarehouseViewData } from '../types/warehouse.types';

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

/** 창고 3D 뷰 데이터 조회 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function fetchWarehouseView(): Promise<WarehouseViewData> {
  const res = await fetch('/api/v1/inventory/warehouse-view');
  if (!res.ok) {
    throw new Error(`창고 데이터 조회 실패: ${res.status}`);
  }
  const json: ApiResponse<WarehouseViewData> = await res.json();
  if (!json.success) {
    throw new Error(json.message || '창고 데이터 조회 실패');
  }
  return json.data;
}
