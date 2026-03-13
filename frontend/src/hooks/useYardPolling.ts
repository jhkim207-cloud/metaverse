/**
 * 야적장 폴링 훅 - 차량 위치/상태/이탈 이력 5초 간격 갱신
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { YardVehicle, YardRoute } from '../types/yardVehicle.types';
import type { DeviationPoint } from '../components/three/yard/YardDeviationMarker';
import { fetchVehicles, fetchRoutes, fetchDeviations } from '../services/yardVehicleApi';

const POLL_INTERVAL = 5000;

export function useYardPolling(yardCd: string) {
  const [vehicles, setVehicles] = useState<YardVehicle[]>([]);
  const [routes, setRoutes] = useState<YardRoute[]>([]);
  const [deviations, setDeviations] = useState<DeviationPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    const [vRes, rRes, dRes] = await Promise.all([
      fetchVehicles(yardCd),
      fetchRoutes(yardCd),
      fetchDeviations(yardCd),
    ]);
    if (vRes.success && vRes.data) setVehicles(vRes.data);
    if (rRes.success && rRes.data) setRoutes(rRes.data);
    if (dRes.success && dRes.data) setDeviations(dRes.data);
    setLoading(false);
  }, [yardCd]);

  useEffect(() => {
    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [poll]);

  return { vehicles, routes, deviations, loading, refresh: poll };
}
