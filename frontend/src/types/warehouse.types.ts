/**
 * 창고 3D 뷰 타입 정의
 */

export type MaterialType = 'RAW_GLASS' | 'SPACER' | 'SEALANT' | 'GAS' | 'FINISHED' | 'CONTAINER';

/** 재고 아이템 */
export interface WarehouseItem {
  materialCd: string;
  materialNm: string;
  materialType: MaterialType;
  currentQty: number;
  maxQty: number;
  minQty: number;
  unit: string;
  color: string;
}

/** 창고 구역 */
export interface WarehouseZone {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  items: WarehouseItem[];
  occupancyRate: number;
}

/** 창고 뷰 응답 */
export interface WarehouseViewData {
  zones: WarehouseZone[];
  totalItems: number;
  alertCount: number;
}
