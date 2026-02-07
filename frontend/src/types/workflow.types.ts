/**
 * 워크플로우 타입 정의
 */

export interface StageCount {
  stageCode: string;
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export interface WorkflowItem {
  id: number;
  title: string;
  customer: string | null;
  product: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string | null;
  orderType: 'PROJECT' | 'SUBCONTRACT' | null;
  stageCode: string;
  projectName: string | null;
  projectPhase: string | null;
}
