export interface InventoryItem {
  id: number;
  inventoryType: string;
  materialCd: string;
  materialNm: string;
  widthMm: number | null;
  heightMm: number | null;
  currentQty: number;
  availableQty: number;
  reservedQty: number;
  unit: string | null;
  areaPyeong: number | null;
  minQty: number;
  maxQty: number;
  supplierCd: string | null;
  supplierNm: string | null;
  warehouseCd: string | null;
  location: string | null;
  snapshotDate: string | null;
}

export interface InventoryTransaction {
  id: number;
  transactionNo: string;
  transactionDate: string;
  transactionType: string;
  materialCd: string | null;
  materialNm: string | null;
  widthMm: number | null;
  heightMm: number | null;
  quantity: number;
  unit: string | null;
  areaPyeong: number | null;
  beforeQty: number | null;
  afterQty: number | null;
  fromLocation: string | null;
  toLocation: string | null;
  siteCd: string | null;
  siteNm: string | null;
  vehicleNo: string | null;
  refDocType: string | null;
  refDocNo: string | null;
  remarks: string | null;
}
