import { useState, useEffect, useCallback } from 'react';
import type { MeetingDashboard, DailyMeeting } from '../types/meeting.types';
import { meetingApi } from '../services/meetingApi';

export function useDailyMeeting() {
  const [dashboard, setDashboard] = useState<MeetingDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentMeetings, setRecentMeetings] = useState<DailyMeeting[]>([]);

  const loadRecentMeetings = useCallback(async () => {
    try {
      const res = await meetingApi.getRecent(30);
      if (res.success && res.data) {
        setRecentMeetings(res.data);
      }
    } catch {
      // 목록 로드 실패는 무시 (메인 대시보드에 영향 없음)
    }
  }, []);

  const loadToday = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const res = await meetingApi.getTodayDashboard();
      if (res.success && res.data) {
        setDashboard(res.data);
      } else {
        setError(res.message || '대시보드를 불러올 수 없습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      if (showLoading) setLoading(false);
    }
    loadRecentMeetings();
  }, [loadRecentMeetings]);

  const loadByDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await meetingApi.getByDate(date);
      if (res.success && res.data) {
        setDashboard(res.data);
      } else {
        setDashboard(null);
        setError('해당 날짜의 회의가 없습니다.');
      }
    } catch {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      meetingApi.getTodayDashboard(),
      meetingApi.getRecent(30),
    ]).then(([dashRes, recentRes]) => {
      if (cancelled) return;
      if (dashRes.success && dashRes.data) {
        setDashboard(dashRes.data);
      } else {
        setError(dashRes.message || '대시보드를 불러올 수 없습니다.');
      }
      if (recentRes.success && recentRes.data) {
        setRecentMeetings(recentRes.data);
      }
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setError('서버 연결에 실패했습니다.');
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const startMeeting = useCallback(async () => {
    if (!dashboard?.meeting) return;
    const res = await meetingApi.startMeeting(dashboard.meeting.id);
    if (res.success && res.data) {
      setDashboard(prev => prev ? { ...prev, meeting: res.data as DailyMeeting } : prev);
      loadRecentMeetings();
    }
  }, [dashboard?.meeting, loadRecentMeetings]);

  const completeMeeting = useCallback(async () => {
    if (!dashboard?.meeting) return;
    const res = await meetingApi.completeMeeting(dashboard.meeting.id);
    if (res.success && res.data) {
      setDashboard(prev => prev ? { ...prev, meeting: res.data as DailyMeeting } : prev);
      loadRecentMeetings();
    }
  }, [dashboard?.meeting, loadRecentMeetings]);

  const updateMeeting = useCallback(async (data: Partial<DailyMeeting>) => {
    if (!dashboard?.meeting) return;
    const res = await meetingApi.updateMeeting(dashboard.meeting.id, data);
    if (res.success && res.data) {
      setDashboard(prev => prev ? { ...prev, meeting: res.data as DailyMeeting } : prev);
    }
  }, [dashboard?.meeting]);

  return {
    dashboard,
    meeting: dashboard?.meeting ?? null,
    recentMeetings,
    loading,
    error,
    loadToday,
    loadByDate,
    startMeeting,
    completeMeeting,
    updateMeeting,
  };
}

export default useDailyMeeting;
