export interface WorkOrderWithResult {
  id: number;
  requestNo: string;
  requestDate: string;
  orderNo: string | null;
  customerNm: string | null;
  supplierNm: string | null;
  siteNm: string | null;
  workCategory: string | null;
  approvalStatus: string | null;
  memo: string | null;
  remarks: string | null;
  productCategory: string | null;
  materialNm: string | null;
  thickness: number | null;
  unitType: string | null;
  width: number | null;
  height: number | null;
  quantity: number | null;
  unrequestedQuantity: number | null;
  requestedQuantity: number | null;
  area: number | null;
  goodQtySum: number;
  defectQtySum: number;
  resultStatus: 'NONE' | 'PARTIAL' | 'COMPLETED';
  resultCount: number;
}

export interface ProductionResult {
  id: number;
  productionNo: string;
  productionDate: string;
  planNo: string | null;
  planLineNo: number | null;
  orderNo: string | null;
  workRequestId: number;
  workRequestNo: string;
  materialCd: string;
  materialNm: string | null;
  goodQty: number;
  defectQty: number;
  totalQty: number;
  unit: string | null;
  goodArea: number;
  defectArea: number;
  totalArea: number;
  workerCd: string | null;
  defectReason: string | null;
  remarks: string | null;
}

export interface ProductionResultCreateRequest {
  workRequestId: number;
  productionDate: string;
  goodQty: number;
  defectQty?: number;
  defectReason?: string;
  remarks?: string;
}

export interface ProductionResultUpdateRequest {
  goodQty?: number;
  defectQty?: number;
  defectReason?: string;
  remarks?: string;
}

export interface FullCompleteRequest {
  workRequestId: number;
  productionDate: string;
}

export interface ProductionSummary {
  totalCount: number;
  completedCount: number;
  partialCount: number;
  pendingCount: number;
  defectCount: number;
  completionRate: number;
}
