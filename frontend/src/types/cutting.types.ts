/**
 * 재단 최적화 뷰어 타입 정의
 */

/** 원판 유리 한 장의 재단 배치 */
export interface CuttingSheet {
  sheetId: string;
  rawMaterialCd: string;
  rawWidth: number;
  rawHeight: number;
  parts: CuttingSheetPart[];
  usedArea: number;
  lossArea: number;
  lossRate: number;
}

/** 원판 위의 절단 파트 */
export interface CuttingSheetPart {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  orderId: string;
  customerNm: string;
  sequence: number;
  color: string;
}

/** 일별 재단 레이아웃 응답 */
export interface CuttingDailyLayout {
  date: string;
  sheets: CuttingSheet[];
  totalLossRate: number;
  totalSheetCount: number;
}
