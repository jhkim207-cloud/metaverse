/**
 * 임가공(외주발주) 타입 정의
 */
export interface SubcontractOrder {
  id: number;
  subcontractNo: string;
  lineSeq: number;
  subcontractDate: string;
  subcontractType: string;
  subcontractorCd: string | null;
  subcontractorNm: string;
  orderNo: string | null;
  siteNm: string | null;
  location: string | null;
  materialCd: string | null;
  materialNm: string | null;
  productType: string | null;
  thickness: number | null;
  orderQty: number | null;
  unit: string | null;
  areaM2: number | null;
  areaPyeong: number | null;
  unitPrice: number | null;
  totalAmount: number | null;
  requestedReceiptDate: string | null;
  actualReceiptDate: string | null;
  receiptChangedDate: string | null;
  receiptLocation: string | null;
  completedQty: number | null;
  subcontractStatus: string;
  remarks: string | null;
}
