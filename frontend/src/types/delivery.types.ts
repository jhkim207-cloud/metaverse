/**
 * 출고 타입 정의
 */
export interface DeliveryHeader {
  id: number;
  deliveryNo: string;
  deliveryDate: string;
  actualDate: string | null;
  orderNo: string;
  customerCd: string;
  siteCd: string | null;
  transactionType: string | null;
  specialNotes: string | null;
  deliveryAddress: string | null;
  vehicleNo: string | null;
  driverNm: string | null;
  driverPhone: string | null;
  shippingCompany: string | null;
  shippingCost: number;
  shippingTax: number;
  deliveryStatus: string;
  remarks: string | null;
  detailCount: number;
  totalAmount: number;
}

export interface DeliveryDetail {
  id: number;
  deliveryNo: string;
  lineNo: number;
  orderNo: string | null;
  orderLineNo: number | null;
  materialCd: string;
  materialNm: string | null;
  category: string | null;
  thickness: number | null;
  width: number | null;
  height: number | null;
  orderQuantity: number | null;
  unshippedQuantity: number | null;
  deliveryQty: number;
  unit: string | null;
  area: number | null;
  unitPrice: number | null;
  amount: number | null;
  tax: number | null;
  totalAmount: number | null;
  remarks: string | null;
}

export type DeliveryStatus = 'PENDING' | 'LOADING' | 'SHIPPED' | 'DELIVERED';
