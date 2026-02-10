import type { WorkOrder } from './workOrder.types';
import type { WorkerDailyAssignment } from './workerAssignment.types';

export interface DailyMeeting {
  id: number;
  meetingDate: string;
  meetingNo: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
  title: string | null;
  startTime: string | null;
  endTime: string | null;
  attendees: string | null;
  carryforwardNotes: string | null;
  generalNotes: string | null;
  totalWorkOrders: number;
  totalQuantity: number;
  totalArea: number;
  assignedCount: number;
}

export interface ProductionSummary {
  totalCount: number;
  completedCount: number;
  partialCount: number;
  pendingCount: number;
  defectCount: number;
  completionRate: number;
}

export interface MeetingDashboard {
  meeting: DailyMeeting;
  todayWorkOrders: WorkOrder[];
  todayAssignments: WorkerDailyAssignment[];
  yesterdaySummary: ProductionSummary | null;
  unresolvedActions: MeetingActionItem[];
  totalSites: number;
  totalCustomers: number;
}

export interface MeetingNote {
  id: number;
  meetingId: number;
  sectionType: 'AGENDA' | 'DISCUSSION' | 'DECISION' | 'SAFETY' | 'QUALITY' | 'OTHER';
  sortOrder: number;
  content: string;
  workRequestNo: string | null;
}

export interface MeetingNoteCreateRequest {
  sectionType: string;
  content: string;
  workRequestNo?: string;
}

export interface MeetingActionItem {
  id: number;
  meetingId: number;
  title: string;
  description: string | null;
  assignee: string;
  dueDate: string | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  workRequestNo: string | null;
  resolutionNote: string | null;
  resolvedAt: string | null;
  meetingDate: string | null;
}

export interface MeetingActionItemCreateRequest {
  title: string;
  description?: string;
  assignee: string;
  dueDate?: string;
  priority?: string;
  workRequestNo?: string;
}

export interface MeetingActionItemUpdateRequest {
  title?: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: string;
  status?: string;
  workRequestNo?: string;
  resolutionNote?: string;
}

export type NoteSectionType = MeetingNote['sectionType'];

export const NOTE_SECTIONS: { type: NoteSectionType; label: string }[] = [
  { type: 'AGENDA', label: '안건' },
  { type: 'DISCUSSION', label: '논의사항' },
  { type: 'DECISION', label: '결정사항' },
  { type: 'SAFETY', label: '안전사항' },
  { type: 'QUALITY', label: '품질이슈' },
  { type: 'OTHER', label: '기타' },
];
