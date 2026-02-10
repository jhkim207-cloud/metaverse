export interface WorkerDailyAssignment {
  id: number;
  workDate: string;
  assignmentTypeCd: string | null;
  assignmentTypeNm: string | null;
  workArea: string | null;
  position: string | null;
  workerNm: string | null;
  workerCd: string | null;
  planNo: string | null;
  workRequestNo: string | null;
  assignmentRemarks: string | null;
  dept: string | null;
  prodLine: string | null;
}

export interface WorkerAssignmentType {
  id: number;
  assignmentTypeCd: string;
  assignmentTypeNm: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
}
