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
