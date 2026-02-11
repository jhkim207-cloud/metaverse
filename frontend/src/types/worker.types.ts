/**
 * 작업자 배치 히트맵 타입 정의
 */

/** 구역별 작업자 배치 */
export interface WorkerZoneDistribution {
  zoneId: string;
  zoneName: string;
  workerCount: number;
  workers: WorkerInfo[];
  heatLevel: number;
}

/** 작업자 정보 */
export interface WorkerInfo {
  name: string;
  role: string;
  dept: string;
}

/** 작업자 일일 분포 응답 */
export interface WorkerDailyDistribution {
  date: string;
  zones: WorkerZoneDistribution[];
  totalWorkers: number;
}
