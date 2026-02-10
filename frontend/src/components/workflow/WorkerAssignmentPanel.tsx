/**
 * WorkerAssignmentPanel - 작업자 배치 현황 + 설비 현황 (목업)
 * 우측 상세 패널에 표시, targetDate와 연동
 */

import { useState, useEffect, useMemo, CSSProperties } from 'react';
import {
  Users, HardHat, Factory, AlertTriangle,
  Clock, Wrench,
  Zap, Thermometer, Gauge, Settings,
} from 'lucide-react';
import { workerAssignmentApi } from '../../services/workerAssignmentApi';
import type { WorkerDailyAssignment } from '../../types/workerAssignment.types';

/* ─── Work Area config ─── */
const AREA_CONFIG: Record<string, { label: string; icon: typeof Factory; color: string }> = {
  '복층1호기': { label: '복층 1호기', icon: Factory, color: '#007aff' },
  '복층2호기': { label: '복층 2호기', icon: Factory, color: '#5856d6' },
  '재단/강화':  { label: '재단 / 강화', icon: HardHat, color: '#ff9f0a' },
};

/* ─── Position color map ─── */
const POSITION_COLORS: Record<string, string> = {
  '관리자': '#ff453a',
  '투입': '#30d158',
  '조립': '#007aff',
  '부틸': '#bf5af2',
  '부착': '#64d2ff',
  '후처리': '#ff9f0a',
  '재단': '#ffd60a',
  '강화': '#ff6482',
  '간봉': '#ac8e68',
  '지게차': '#8e8e93',
};

function getPositionColor(pos: string | null): string {
  if (!pos) return 'var(--text-tertiary)';
  return POSITION_COLORS[pos] ?? 'var(--text-secondary)';
}

interface WorkerAssignmentPanelProps {
  targetDate: string;
}

export function WorkerAssignmentPanel({ targetDate }: WorkerAssignmentPanelProps) {
  const [assignments, setAssignments] = useState<WorkerDailyAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignmentTypeCd, setAssignmentTypeCd] = useState<string | null>(null);
  const [assignmentTypeNm, setAssignmentTypeNm] = useState<string | null>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [activeDate, setActiveDate] = useState(targetDate);

  // 가용 날짜 목록 로드
  useEffect(() => {
    let cancelled = false;
    workerAssignmentApi.findAvailableDates().then(res => {
      if (cancelled) return;
      const dates = res.success && res.data ? res.data : [];
      setAvailableDates(dates);
      if (dates.length > 0 && !dates.includes(targetDate)) {
        setActiveDate(dates[0]);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [targetDate]);

  // 데이터 조회
  useEffect(() => {
    if (!activeDate) return;
    let cancelled = false;
    setLoading(true);
    workerAssignmentApi.findByWorkDate(activeDate).then(res => {
      if (cancelled) return;
      const data = res.success && res.data ? res.data : [];
      setAssignments(data);
      if (data.length > 0) {
        setAssignmentTypeCd(data[0].assignmentTypeCd);
        setAssignmentTypeNm(data[0].assignmentTypeNm);
      } else {
        setAssignmentTypeCd(null);
        setAssignmentTypeNm(null);
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) { setAssignments([]); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [activeDate]);

  // Group by work_area
  const grouped = useMemo(() => {
    const map = new Map<string, WorkerDailyAssignment[]>();
    for (const a of assignments) {
      const area = a.workArea || '기타';
      if (!map.has(area)) map.set(area, []);
      map.get(area)!.push(a);
    }
    const order = Object.keys(AREA_CONFIG);
    return Array.from(map.entries()).sort(([a], [b]) => {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [assignments]);

  return (
    <div style={panelStyle}>
      {/* ═══ Section 1: 작업자 배치 현황 ═══ */}
      <div style={sectionStyle}>
        {/* Header */}
        <div style={sectionHeaderStyle}>
          <div style={sectionHeaderLeftStyle}>
            <Users size={15} style={{ color: 'var(--accent)' }} />
            <span style={sectionTitleStyle}>작업자 배치 현황</span>
          </div>
          <div style={sectionHeaderRightStyle}>
            {availableDates.length > 1 ? (
              <select
                value={activeDate}
                onChange={e => setActiveDate(e.target.value)}
                style={dateSelectStyle}
                aria-label="작업일자 선택"
              >
                {availableDates.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <span style={dateBadgeStyle}>{activeDate}</span>
            )}
            {assignmentTypeCd && (
              <span style={typeBadgeStyle}>{assignmentTypeCd}유형</span>
            )}
            <span style={countBadgeStyle}>{assignments.length}명</span>
          </div>
        </div>

        {/* Assignment type description */}
        {assignmentTypeNm && (
          <div style={typeDescStyle}>
            <Settings size={11} style={{ color: 'var(--accent)', opacity: 0.7 }} />
            <span>{assignmentTypeNm}</span>
          </div>
        )}

        {/* Worker groups */}
        <div style={workerListStyle}>
          {loading ? (
            <div style={emptyStyle}>
              <Clock size={22} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>로딩 중...</div>
            </div>
          ) : assignments.length === 0 ? (
            <div style={emptyStyle}>
              <Users size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.25 }} />
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>
                해당 날짜의 배치 정보가 없습니다
              </div>
            </div>
          ) : (
            grouped.map(([area, workers]) => {
              const cfg = AREA_CONFIG[area] || { label: area, icon: Factory, color: 'var(--text-secondary)' };
              const AreaIcon = cfg.icon;
              return (
                <div key={area} style={{ marginBottom: 2 }}>
                  {/* Area header with color bar */}
                  <div style={{ ...areaHeaderStyle, borderLeft: `3px solid ${cfg.color}` }}>
                    <AreaIcon size={13} style={{ color: cfg.color }} />
                    <span style={{ ...areaLabelStyle, color: cfg.color }}>{cfg.label}</span>
                    <span style={areaCountStyle}>{workers.length}명</span>
                  </div>

                  {/* Worker rows (table-like) */}
                  {workers.map((w, idx) => {
                    const posColor = getPositionColor(w.position);
                    return (
                      <div
                        key={w.id}
                        style={{
                          ...workerRowStyle,
                          borderLeft: `3px solid color-mix(in srgb, ${cfg.color} 25%, transparent)`,
                          borderBottom: idx < workers.length - 1
                            ? '1px solid color-mix(in srgb, var(--border) 40%, transparent)'
                            : '1px solid var(--border)',
                        }}
                      >
                        {/* 직책 뱃지 */}
                        <span style={{ ...posBadgeStyle, color: posColor, background: `color-mix(in srgb, ${posColor} 14%, transparent)` }}>
                          {w.position}
                        </span>
                        {/* 이름 */}
                        <span style={workerNameStyle}>{w.workerNm}</span>
                        {/* 비고 */}
                        {w.assignmentRemarks && (
                          <span style={remarkTagStyle} title={w.assignmentRemarks}>
                            <AlertTriangle size={10} />
                            <span style={remarkTextStyle}>{w.assignmentRemarks}</span>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ═══ Section 2: 설비 현황 (목업) ═══ */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={sectionHeaderLeftStyle}>
            <Wrench size={15} style={{ color: '#ff9f0a' }} />
            <span style={sectionTitleStyle}>설비 현황</span>
          </div>
          <span style={{ ...countBadgeStyle, color: '#ff9f0a', background: 'color-mix(in srgb, #ff9f0a 12%, transparent)' }}>
            4대
          </span>
        </div>

        <div style={equipmentGridStyle}>
          <EquipmentCard name="복층 1호기" status="running" utilization={87} temperature={42} output={156} />
          <EquipmentCard name="복층 2호기" status="running" utilization={73} temperature={39} output={128} />
          <EquipmentCard name="강화로" status="idle" utilization={0} temperature={22} output={0} />
          <EquipmentCard name="재단기" status="maintenance" utilization={0} temperature={25} output={0} />
        </div>
      </div>
    </div>
  );
}

/* ─── Equipment Card (목업) ─── */

type EquipmentStatus = 'running' | 'idle' | 'maintenance';

const STATUS_CONFIG: Record<EquipmentStatus, { label: string; color: string; bg: string }> = {
  running:     { label: '가동중', color: '#30d158', bg: 'color-mix(in srgb, #30d158 15%, transparent)' },
  idle:        { label: '대기',   color: 'var(--text-tertiary)', bg: 'color-mix(in srgb, var(--text-tertiary) 12%, transparent)' },
  maintenance: { label: '정비중', color: '#ff453a', bg: 'color-mix(in srgb, #ff453a 15%, transparent)' },
};

function EquipmentCard({
  name, status, utilization, temperature, output,
}: {
  name: string;
  status: EquipmentStatus;
  utilization: number;
  temperature: number;
  output: number;
}) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div style={{ ...eqCardStyle, borderLeft: `3px solid ${cfg.color}` }}>
      {/* Header */}
      <div style={eqCardHeaderStyle}>
        <Factory size={13} style={{ color: cfg.color }} />
        <span style={eqNameStyle}>{name}</span>
      </div>
      {/* Status badge */}
      <div style={{ marginBottom: 8 }}>
        <span style={{ ...eqStatusBadgeStyle, color: cfg.color, background: cfg.bg }}>
          {cfg.label}
        </span>
      </div>
      {/* Metrics */}
      <div style={eqMetricsStyle}>
        <div style={eqMetricStyle}>
          <Gauge size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span style={eqMetricLabelStyle}>가동률</span>
          <span style={{ ...eqMetricValueStyle, color: utilization > 50 ? '#30d158' : 'var(--text-tertiary)' }}>
            {utilization}%
          </span>
        </div>
        <div style={eqMetricStyle}>
          <Thermometer size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span style={eqMetricLabelStyle}>온도</span>
          <span style={eqMetricValueStyle}>{temperature}°C</span>
        </div>
        <div style={eqMetricStyle}>
          <Zap size={11} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <span style={eqMetricLabelStyle}>생산량</span>
          <span style={eqMetricValueStyle}>{output}EA</span>
        </div>
      </div>
      {/* Progress bar */}
      {status === 'running' && (
        <div style={eqProgressTrackStyle}>
          <div style={{ ...eqProgressBarStyle, width: `${utilization}%` }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/* ─── Styles ─── */
/* ═══════════════════════════════════════════ */

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'auto',
};

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

/* ─── Section header ─── */

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const sectionHeaderLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const sectionHeaderRightStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--text)',
};

const dateBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  background: 'var(--panel)',
  padding: '2px 8px',
  borderRadius: 4,
  border: '1px solid var(--border)',
};

const dateSelectStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text)',
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 5,
  padding: '2px 6px',
  cursor: 'pointer',
};

const typeBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  padding: '2px 8px',
  borderRadius: 4,
  letterSpacing: 0.3,
};

const countBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '2px 8px',
  borderRadius: 10,
};

const typeDescStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 16px',
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'color-mix(in srgb, var(--accent) 4%, transparent)',
  borderBottom: '1px solid var(--border)',
};

const workerListStyle: CSSProperties = {};

const emptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 16px',
};

/* ─── Area group ─── */

const areaHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 16px 8px 13px',
  fontSize: 12,
  fontWeight: 700,
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
};

const areaLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
};

const areaCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  marginLeft: 'auto',
};

/* ─── Worker row ─── */

const workerRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '7px 16px 7px 13px',
  fontSize: 12,
  minHeight: 32,
};

const posBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 4,
  whiteSpace: 'nowrap',
  minWidth: 42,
  textAlign: 'center',
};

const workerNameStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
  minWidth: 48,
};

const remarkTagStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  color: '#ff9f0a',
  marginLeft: 'auto',
  maxWidth: 200,
  overflow: 'hidden',
};

const remarkTextStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/* ─── Equipment section ─── */

const equipmentGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
  padding: '12px 16px 16px',
};

const eqCardStyle: CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--panel-2)',
};

const eqCardHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 4,
};

const eqNameStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
};

const eqStatusBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  fontSize: 10,
  fontWeight: 700,
  padding: '2px 8px',
  borderRadius: 4,
};

const eqMetricsStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const eqMetricStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
};

const eqMetricLabelStyle: CSSProperties = {
  color: 'var(--text-tertiary)',
  width: 36,
  fontSize: 11,
};

const eqMetricValueStyle: CSSProperties = {
  fontWeight: 700,
  color: 'var(--text)',
  fontSize: 12,
};

const eqProgressTrackStyle: CSSProperties = {
  height: 4,
  borderRadius: 2,
  background: 'color-mix(in srgb, var(--border) 60%, transparent)',
  marginTop: 8,
  overflow: 'hidden',
};

const eqProgressBarStyle: CSSProperties = {
  height: '100%',
  borderRadius: 2,
  background: '#30d158',
  transition: 'width 0.3s',
};

export default WorkerAssignmentPanel;
