import api from './api';
import type {
  DailyMeeting,
  MeetingDashboard,
  MeetingNote,
  MeetingNoteCreateRequest,
  MeetingActionItem,
  MeetingActionItemCreateRequest,
  MeetingActionItemUpdateRequest,
} from '../types/meeting.types';

export const meetingApi = {
  getTodayDashboard: () =>
    api.get<MeetingDashboard>('/v1/meetings/today'),

  getByDate: (date: string) =>
    api.get<MeetingDashboard>(`/v1/meetings?date=${date}`),

  getRecent: (limit = 5) =>
    api.get<DailyMeeting[]>(`/v1/meetings/recent?limit=${limit}`),

  updateMeeting: (id: number, data: Partial<DailyMeeting>) =>
    api.put<DailyMeeting>(`/v1/meetings/${id}`, data),

  startMeeting: (id: number) =>
    api.put<DailyMeeting>(`/v1/meetings/${id}/start`, {}),

  completeMeeting: (id: number) =>
    api.put<DailyMeeting>(`/v1/meetings/${id}/complete`, {}),

  // Work Order Confirmation
  confirmWorkOrders: (ids: number[]) =>
    api.put<number>('/v1/meetings/work-orders/confirm', ids),

  // Notes
  getNotes: (meetingId: number) =>
    api.get<MeetingNote[]>(`/v1/meetings/${meetingId}/notes`),

  createNote: (meetingId: number, data: MeetingNoteCreateRequest) =>
    api.post<MeetingNote>(`/v1/meetings/${meetingId}/notes`, data),

  updateNote: (noteId: number, data: Partial<MeetingNote>) =>
    api.put<MeetingNote>(`/v1/meetings/notes/${noteId}`, data),

  deleteNote: (noteId: number) =>
    api.delete<void>(`/v1/meetings/notes/${noteId}`),

  // Action Items
  getActions: (meetingId: number) =>
    api.get<MeetingActionItem[]>(`/v1/meetings/${meetingId}/actions`),

  getUnresolvedActions: () =>
    api.get<MeetingActionItem[]>('/v1/meetings/actions/unresolved'),

  createAction: (meetingId: number, data: MeetingActionItemCreateRequest) =>
    api.post<MeetingActionItem>(`/v1/meetings/${meetingId}/actions`, data),

  updateAction: (actionId: number, data: MeetingActionItemUpdateRequest) =>
    api.put<MeetingActionItem>(`/v1/meetings/actions/${actionId}`, data),

  deleteAction: (actionId: number) =>
    api.delete<void>(`/v1/meetings/actions/${actionId}`),
};

export default meetingApi;
