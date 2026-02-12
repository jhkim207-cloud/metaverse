import { useState, useMemo, CSSProperties } from 'react';
import { List, ListTree } from 'lucide-react';
import { addDays, subWeeks, addWeeks, format, isSameDay, isWithinInterval, parseISO, differenceInDays, startOfWeek, isSameWeek } from 'date-fns';
import type { ProductionPlan, Machine } from '../../types/productionPlan.types';
import type { SalesOrderHeader } from '../../types/site.types';

const DAY_LABELS = ['월', '화', '수', '목', '금', '토'];
const DAYS_PER_WEEK = 6;
const NUM_WEEKS = 4;
const TOTAL_DAYS = DAYS_PER_WEEK * NUM_WEEKS; // 24 days across 4 weeks

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  REGISTERED: { bg: 'var(--text-tertiary)', text: '#fff' },
  IN_PROGRESS: { bg: 'var(--accent)', text: 'var(--on-accent)' },
  COMPLETED: { bg: '#22c55e', text: '#fff' },
};

interface MachineGanttProps {
  machines: Machine[];
  plans: ProductionPlan[];
  weekStart: Date;
  selectedOrder: SalesOrderHeader | null;
  onPlanClick: (plan: ProductionPlan) => void;
  onCellClick: (machineNo: string, date: Date) => void;
}

export function MachineGantt({
  machines, plans, weekStart, selectedOrder, onPlanClick, onCellClick,
}: MachineGanttProps) {
  const [expanded, setExpanded] = useState(false);

  // 3 weeks: prev week Monday ~ next week Saturday
  const prevWeekStart = useMemo(() => subWeeks(startOfWeek(weekStart, { weekStartsOn: 1 }), 1), [weekStart]);

  const days = useMemo(() => {
    return Array.from({ length: TOTAL_DAYS }, (_, i) => {
      // Skip Sundays: each "week" is Mon-Sat (6 days)
      const weekIdx = Math.floor(i / DAYS_PER_WEEK);
      const dayInWeek = i % DAYS_PER_WEEK;
      return addDays(prevWeekStart, weekIdx * 7 + dayInWeek);
    });
  }, [prevWeekStart]);

  const today = new Date();
  const currentWeekMonday = startOfWeek(weekStart, { weekStartsOn: 1 });

  // Week labels for group headers (4 weeks: 전주, 금주, 차주, 차차주)
  const weekGroups = useMemo(() => {
    const WEEK_LABELS = ['전주', '금주', '차주', '차차주'];
    const groups: { label: string; isCurrentWeek: boolean; startIdx: number }[] = [];
    for (let w = 0; w < NUM_WEEKS; w++) {
      const wStart = addDays(prevWeekStart, w * 7);
      const wEnd = addDays(wStart, 5);
      const isCurrent = isSameWeek(wStart, currentWeekMonday, { weekStartsOn: 1 });
      groups.push({
        label: `${WEEK_LABELS[w]} (${format(wStart, 'M/d')}~${format(wEnd, 'M/d')})`,
        isCurrentWeek: isCurrent,
        startIdx: w * DAYS_PER_WEEK,
      });
    }
    return groups;
  }, [prevWeekStart, currentWeekMonday]);

  // Group plans by machineNo
  const plansByMachine = useMemo(() => {
    const map = new Map<string, ProductionPlan[]>();
    for (const m of machines) {
      map.set(m.codeName, []);
    }
    for (const plan of plans) {
      if (plan.machineNo) {
        const list = map.get(plan.machineNo);
        if (list) list.push(plan);
      }
    }
    return map;
  }, [machines, plans]);

  const lastDayIdx = TOTAL_DAYS - 1;

  return (
    <div style={containerStyle}>
      <div style={scrollWrapperStyle}>
        {/* Week group header row */}
        <div style={weekGroupRowStyle}>
          <div style={machineLabelHeaderStyle}>
            <button
              type="button"
              style={toggleBtnStyle}
              onClick={() => setExpanded(prev => !prev)}
              title={expanded ? '요약 보기' : '상세 보기'}
            >
              {expanded ? <ListTree size={13} /> : <List size={13} />}
            </button>
            <span>호기</span>
          </div>
          {weekGroups.map((wg, wIdx) => (
            <div
              key={wIdx}
              style={{
                ...weekGroupCellStyle,
                ...(wg.isCurrentWeek ? weekGroupCurrentStyle : {}),
              }}
            >
              {wg.label}
            </div>
          ))}
        </div>

        {/* Day header row */}
        <div style={gridRowStyle}>
          <div style={{ ...machineLabelHeaderStyle, borderTop: 'none' }} />
          {days.map((day, i) => {
            const isToday = isSameDay(day, today);
            const dayInWeek = i % DAYS_PER_WEEK;
            const isWeekBoundary = i > 0 && dayInWeek === 0;
            return (
              <div
                key={i}
                style={{
                  ...dayHeaderStyle,
                  ...(isToday ? todayHeaderStyle : {}),
                  ...(isWeekBoundary ? weekBoundaryStyle : {}),
                }}
              >
                <span style={dayLabelStyle}>{DAY_LABELS[dayInWeek]}</span>
                <span style={dateLabelStyle}>{format(day, 'M/d')}</span>
              </div>
            );
          })}
        </div>

        {/* Machine rows */}
        {machines.map(machine => {
          const machinePlans = plansByMachine.get(machine.codeName) || [];

          /* ── Expanded: group header + individual plan rows ── */
          if (expanded) {
            return (
              <div key={machine.codeId}>
                {/* Group header row */}
                <div style={gridRowStyle}>
                  <div style={machineGroupHeaderLabelStyle}>
                    <span>{machine.codeName}</span>
                    {machinePlans.length > 0 && (
                      <span style={planCountBadgeStyle}>{machinePlans.length}</span>
                    )}
                  </div>
                  {days.map((day, dayIdx) => {
                    const isToday = isSameDay(day, today);
                    const dayInWeek = dayIdx % DAYS_PER_WEEK;
                    const isWeekBoundary = dayIdx > 0 && dayInWeek === 0;
                    return (
                      <div
                        key={dayIdx}
                        style={{
                          ...groupHeaderCellStyle,
                          ...(isToday ? todayCellStyle : {}),
                          ...(isWeekBoundary ? weekBoundaryStyle : {}),
                        }}
                      />
                    );
                  })}
                </div>

                {/* Individual plan detail rows */}
                {machinePlans.map(plan => (
                  <div key={plan.id} style={gridRowStyle}>
                    <div style={planDetailLabelStyle}>
                      {plan.customerNm ? plan.customerNm.substring(0, 6) : plan.planNo}
                      {plan.quantity ? ` · ${plan.quantity}EA` : ''}
                    </div>
                    {days.map((day, dayIdx) => {
                      const isToday = isSameDay(day, today);
                      const dayInWeek = dayIdx % DAYS_PER_WEEK;
                      const isWeekBoundary = dayIdx > 0 && dayInWeek === 0;

                      // Render bar only on start day or first visible day / week boundary
                      let shouldRenderBar = false;
                      if (plan.startDate && plan.endDate) {
                        const s = parseISO(plan.startDate);
                        const e = parseISO(plan.endDate);
                        if (isSameDay(s, day)) shouldRenderBar = true;
                        else if (dayIdx === 0 && s < day && e >= day) shouldRenderBar = true;
                        else if (isWeekBoundary && s < day && e >= day) shouldRenderBar = true;
                      }

                      return (
                        <div
                          key={dayIdx}
                          style={{
                            ...detailCellStyle,
                            ...(isToday ? todayCellStyle : {}),
                            ...(selectedOrder ? cellClickableStyle : {}),
                            ...(isWeekBoundary ? weekBoundaryStyle : {}),
                          }}
                          onClick={() => {
                            if (selectedOrder) onCellClick(machine.codeName, day);
                          }}
                        >
                          {shouldRenderBar && (() => {
                            const s = parseISO(plan.startDate!);
                            const e = parseISO(plan.endDate!);
                            const visibleStart = s < days[0] ? days[0] : s;
                            const visibleEnd = e > days[lastDayIdx] ? days[lastDayIdx] : e;
                            const weekEndIdx = Math.floor(dayIdx / DAYS_PER_WEEK) * DAYS_PER_WEEK + (DAYS_PER_WEEK - 1);
                            const weekEndDay = days[weekEndIdx];
                            const barEnd = e > weekEndDay ? weekEndDay : visibleEnd;
                            const barStart = s < day ? day : visibleStart;
                            const spanDays = differenceInDays(barEnd, barStart) + 1;
                            const offsetFromCell = differenceInDays(barStart, day);
                            const colors = STATUS_COLORS[plan.planStatus] || STATUS_COLORS.REGISTERED;

                            return (
                              <div
                                style={{
                                  ...barStyle,
                                  background: colors.bg,
                                  color: colors.text,
                                  width: `calc(${spanDays * 100}% + ${(spanDays - 1) * 1}px)`,
                                  left: `${offsetFromCell * 100}%`,
                                }}
                                onClick={(ev) => {
                                  ev.stopPropagation();
                                  onPlanClick(plan);
                                }}
                                title={`${plan.planNo} · ${plan.customerNm || ''} · ${plan.siteNm || ''}\n${plan.quantity}EA · ${plan.materialNm || ''}`}
                              >
                                <span style={barTextStyle}>
                                  {plan.customerNm ? plan.customerNm.substring(0, 6) : plan.planNo}
                                  {plan.quantity ? ` · ${plan.quantity}` : ''}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Empty row if no plans for this machine */}
                {machinePlans.length === 0 && (
                  <div style={gridRowStyle}>
                    <div style={planDetailLabelStyle}>-</div>
                    {days.map((_, dayIdx) => (
                      <div key={dayIdx} style={detailCellStyle} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          /* ── Collapsed (default): single row per machine ── */
          return (
            <div key={machine.codeId} style={gridRowStyle}>
              <div style={machineLabelStyle}>{machine.codeName}</div>
              {days.map((day, dayIdx) => {
                const isToday = isSameDay(day, today);
                const dayInWeek = dayIdx % DAYS_PER_WEEK;
                const isWeekBoundary = dayIdx > 0 && dayInWeek === 0;

                // Only render bar on start day (or first visible day of the range)
                const barsToRender = machinePlans.filter(p => {
                  if (!p.startDate || !p.endDate) return false;
                  const s = parseISO(p.startDate);
                  const e = parseISO(p.endDate);
                  if (isSameDay(s, day)) return true;
                  if (dayIdx === 0 && s < day && e >= day) return true;
                  // Also re-render at each week boundary if bar spans across weeks
                  if (isWeekBoundary && s < day && e >= day) return true;
                  return false;
                });

                return (
                  <div
                    key={dayIdx}
                    style={{
                      ...cellStyle,
                      ...(isToday ? todayCellStyle : {}),
                      ...(selectedOrder ? cellClickableStyle : {}),
                      ...(isWeekBoundary ? weekBoundaryStyle : {}),
                    }}
                    onClick={() => {
                      if (selectedOrder) onCellClick(machine.codeName, day);
                    }}
                  >
                    {barsToRender.map(plan => {
                      const s = parseISO(plan.startDate!);
                      const e = parseISO(plan.endDate!);
                      const visibleStart = s < days[0] ? days[0] : s;
                      const visibleEnd = e > days[lastDayIdx] ? days[lastDayIdx] : e;

                      // Clip bar to current week section (don't overflow week boundary)
                      const weekEndIdx = Math.floor(dayIdx / DAYS_PER_WEEK) * DAYS_PER_WEEK + (DAYS_PER_WEEK - 1);
                      const weekEndDay = days[weekEndIdx];
                      const barEnd = e > weekEndDay ? weekEndDay : visibleEnd;
                      const barStart = s < day ? day : visibleStart;

                      const spanDays = differenceInDays(barEnd, barStart) + 1;
                      const offsetFromCell = differenceInDays(barStart, day);
                      const colors = STATUS_COLORS[plan.planStatus] || STATUS_COLORS.REGISTERED;

                      return (
                        <div
                          key={`${plan.id}-${dayIdx}`}
                          style={{
                            ...barStyle,
                            background: colors.bg,
                            color: colors.text,
                            width: `calc(${spanDays * 100}% + ${(spanDays - 1) * 1}px)`,
                            left: `${offsetFromCell * 100}%`,
                          }}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            onPlanClick(plan);
                          }}
                          title={`${plan.planNo} · ${plan.customerNm || ''} · ${plan.siteNm || ''}\n${plan.quantity}EA · ${plan.materialNm || ''}`}
                        >
                          <span style={barTextStyle}>
                            {plan.customerNm ? `${plan.customerNm.substring(0, 6)}` : plan.planNo}
                            {plan.quantity ? ` · ${plan.quantity}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Empty state */}
        {machines.length === 0 && (
          <div style={emptyStyle}>호기 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid var(--border)',
  borderRadius: 12,
  overflow: 'hidden',
  flex: 1,
  minHeight: 0,
};

const scrollWrapperStyle: CSSProperties = {
  overflowX: 'auto',
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
};

const weekGroupRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `80px repeat(${NUM_WEEKS}, ${DAYS_PER_WEEK}fr)`,
  minWidth: 1100,
  position: 'sticky',
  top: 0,
  zIndex: 3,
};

const gridRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `80px repeat(${TOTAL_DAYS}, 1fr)`,
  minWidth: 1100,
  minHeight: 0,
};

const machineLabelHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  padding: '6px 4px',
  position: 'sticky',
  left: 0,
  zIndex: 2,
};

const weekGroupCellStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  padding: '5px 0',
};

const weekGroupCurrentStyle: CSSProperties = {
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 6%, var(--panel-2))',
  fontWeight: 700,
};

const dayHeaderStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
  padding: '4px 0',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  position: 'sticky',
  top: 28,
  zIndex: 2,
};

const todayHeaderStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 10%, var(--panel-2))',
};

const weekBoundaryStyle: CSSProperties = {
  borderLeft: '2px solid var(--border)',
};

const dayLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const dateLabelStyle: CSSProperties = {
  fontSize: 9,
  color: 'var(--text-tertiary)',
};

const machineLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text)',
  background: 'var(--panel)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  padding: '0 6px',
  minHeight: 48,
  position: 'sticky',
  left: 0,
  zIndex: 1,
};

const cellStyle: CSSProperties = {
  position: 'relative',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  minHeight: 48,
  padding: '4px 1px',
  overflow: 'visible',
};

const todayCellStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 4%, transparent)',
};

const cellClickableStyle: CSSProperties = {
  cursor: 'pointer',
};

const barStyle: CSSProperties = {
  position: 'absolute',
  top: 4,
  height: 'calc(100% - 8px)',
  borderRadius: 5,
  display: 'flex',
  alignItems: 'center',
  padding: '0 4px',
  cursor: 'pointer',
  zIndex: 1,
  overflow: 'hidden',
  transition: 'opacity 0.15s',
  minWidth: 0,
};

const barTextStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const toggleBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  padding: 0,
  border: '1px solid var(--accent)',
  borderRadius: 4,
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  color: 'var(--accent)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  flexShrink: 0,
  transition: 'all 0.15s',
};

const machineGroupHeaderLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--text)',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  padding: '0 6px',
  minHeight: 32,
  position: 'sticky',
  left: 0,
  zIndex: 1,
};

const planCountBadgeStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 5px',
  borderRadius: 6,
};

const groupHeaderCellStyle: CSSProperties = {
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  minHeight: 32,
  background: 'var(--panel-2)',
};

const planDetailLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: 10,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--panel)',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  paddingLeft: 12,
  paddingRight: 4,
  minHeight: 40,
  position: 'sticky',
  left: 0,
  zIndex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const detailCellStyle: CSSProperties = {
  position: 'relative',
  borderBottom: '1px solid var(--border)',
  borderRight: '1px solid var(--border)',
  minHeight: 40,
  padding: '3px 1px',
  overflow: 'visible',
};

const emptyStyle: CSSProperties = {
  padding: '32px 16px',
  textAlign: 'center',
  fontSize: 13,
  color: 'var(--text-tertiary)',
};

export default MachineGantt;
