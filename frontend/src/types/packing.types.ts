/**
 * 포장지시 타입 정의
 */
export interface PackingOrder {
  id: number;
  packingNo: string;
  packingDate: string;
  orderNo: string;
  materialCd: string;
  materialNm: string | null;
  packingQty: number;
  unit: string | null;
  containerCd: string | null;
  containerQty: number | null;
  workerCd: string | null;
  packingStatus: string;
  remarks: string | null;
}
