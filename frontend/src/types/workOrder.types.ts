export interface WorkOrder {
  id: number;
  requestNo: string;
  requestDate: string;
  planId: number | null;
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
}

export interface ProductionPlanDetail {
  id: number;
  planId: number;
  orderDetailId: number | null;
  processStatus: string;
  orderNo: string | null;
  lineSeq: number | null;
  materialCd: string | null;
  materialNm: string | null;
  productCategory: string | null;
  width: number | null;
  height: number | null;
  thickness: number | null;
  unitType: string | null;
  quantity: number | null;
  area: number | null;
  unit: string | null;
  unitPrice: number | null;
  amount: number | null;
  dong: string | null;
  ho: string | null;
  floor: string | null;
  windowType: string | null;
  locationDetail: string | null;
  deliveryDate: string | null;
  remarks: string | null;
}

export interface WorkOrderCreateRequest {
  requestDate: string;
  planDetailIds: number[];
}
