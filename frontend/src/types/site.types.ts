/**
 * 현장 마스터 타입 정의
 */

export interface SiteMaster {
  id: number;
  siteCd: string;
  siteNm: string;
  constructorNm: string | null;
  bpCd: string | null;
  address: string | null;
  remark: string | null;
  isActive: boolean;
}

export interface SiteMasterCreateRequest {
  siteCd: string;
  siteNm: string;
  constructorNm: string;
  bpCd: string;
  address: string;
  remark: string;
}

/**
 * 주문 헤더 타입 정의
 */
export interface SalesOrderHeader {
  id: number;
  orderNo: string;
  orderDate: string;
  deliveryDate: string | null;
  customerCd: string;
  orderType: string | null;
  siteCd: string | null;
  siteNm: string | null;
  siteAddress: string | null;
  totalAmount: number | null;
  taxAmount: number | null;
  taxSeparate: boolean | null;
  duoLight: string | null;
  remarks: string | null;
  orderStatus: string;
  isUrgent: boolean | null;
  customerNm: string | null;
  detailCount: number | null;
}

/**
 * 주문 디테일 타입 정의
 */
export interface SalesOrderDetail {
  id: number;
  orderHeaderId: number;
  orderNo: string;
  lineSeq: number;
  materialCd: string;
  materialNm: string | null;
  productCategory: string | null;
  width: number | null;
  height: number | null;
  thickness: number | null;
  unitType: string | null;
  quantity: number;
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
  productionStatus: string | null;
  deliveryStatus: string | null;
  remarks: string | null;
}

/**
 * 주문 등록/수정 요청 타입
 */
export interface SalesOrderCreateRequest {
  orderDate: string;
  deliveryDate?: string;
  customerCd: string;
  orderType?: string;
  siteCd?: string;
  siteNm?: string;
  siteAddress?: string;
  taxSeparate?: boolean;
  duoLight?: string;
  remarks?: string;
  isUrgent?: boolean;
  details: SalesOrderDetailItem[];
}

export interface SalesOrderDetailItem {
  materialCd: string;
  materialNm?: string;
  productCategory?: string;
  width?: number;
  height?: number;
  thickness?: number;
  unitType?: string;
  quantity: number;
  area?: number;
  unit?: string;
  unitPrice?: number;
  amount?: number;
  dong?: string;
  ho?: string;
  floor?: string;
  windowType?: string;
  locationDetail?: string;
  deliveryDate?: string;
  remarks?: string;
}

/**
 * 현장 견적단가 타입 정의
 */
export interface SitePrice {
  id: number;
  siteCd: string;
  siteNm: string | null;
  customerNm: string | null;
  spec: string;
  remark: string | null;
  bidPrice: number | null;
  procPrice: number | null;
  processingCost: number | null;
  argonCost: number | null;
  insulCost: number | null;
  structCost: number | null;
  edgeCost: number | null;
  etchingCost: number | null;
  stepCost: number | null;
  deformCost: number | null;
  temper1Cost: number | null;
  temper2Cost: number | null;
  temper3Cost: number | null;
  totalProcessingCost: number | null;
}

/**
 * 거래처 마스터 타입 정의
 */
export interface BusinessPartner {
  id: number;
  bpCd: string;
  bpType: string | null;
  salesCategory: string | null;
  purchaseCategory: string | null;
  bpNm: string;
  ceoNm: string | null;
  bizRegNo: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  contactPerson: string | null;
  email: string | null;
  address1: string | null;
  address2: string | null;
  bizType: string | null;
  bizItem: string | null;
  bankHolder: string | null;
  bankAccount: string | null;
  bankNm: string | null;
  isActive: boolean;
}
