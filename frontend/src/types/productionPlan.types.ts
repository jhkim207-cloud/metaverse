export interface ProductionPlan {
  id: number;
  planNo: string;
  productionDate: string | null;
  startDate: string | null;
  endDate: string | null;
  machineNo: string | null;
  category: string | null;
  customerNm: string | null;
  siteNm: string | null;
  location: string | null;
  thickness: number | null;
  productType: string | null;
  materialNm: string | null;
  quantity: number;
  area: number | null;
  options: string | null;
  completedQuantity: number;
  completedArea: number | null;
  defectQuantity: number;
  defectArea: number | null;
  pendingQuantity: number;
  pendingArea: number | null;
  shippingDate: string | null;
  unitPrice: number | null;
  amount: number | null;
  planStatus: string;
  remarks: string | null;
  workRequestNo: string | null;
}

export interface Machine {
  codeId: string;
  codeName: string;
  sortOrder: number;
}

export interface ScheduleAssignment {
  startDate: string;
  endDate: string;
  machineNo: string;
}

export interface DetailAssignment {
  detailId: number;
  assignedQuantity: number;
}

export interface PlanCreateWithDetailsRequest {
  startDate: string;
  endDate: string;
  machineNo: string;
  category: string;
  customerNm: string;
  siteNm: string;
  siteCd: string;
  remarks: string | null;
  workRequestNo: string;
  details: DetailAssignment[];
}
