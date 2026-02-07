/**
 * WorkflowStepper - 모던 수평 파이프라인 스테퍼
 *
 * 레이아웃:
 *   [프로젝트] ──┐
 *                ├→ ①수주 ─ ②주문 ─ ③생산계획 ─ ④작업지시 ─ ⑤생산실적 ─ ⑥포장 ─ ⑦출고
 *   [임가공]  ──┘           ↓발주              ↓작업자배치   ↓불량              ↓제품재고
 *   ═══════════════════════════════ (progress bar)
 */

import { CSSProperties, useMemo, useCallback } from 'react';
import {
  Building2, Handshake, ClipboardList, ShoppingCart, Calendar,
  Wrench, BarChart3, Package, Truck, Receipt, HardHat,
  AlertTriangle, Warehouse, Check, ArrowRight,
} from 'lucide-react';
import type { StageCount } from '../../types/workflow.types';
import { MAIN_STAGES, ENTRY_STAGES, getBranches } from '../../constants/workflow';

const iconComponents: Record<string, React.ComponentType<{ size?: number }>> = {
  Building2, Handshake, ClipboardList, ShoppingCart, Calendar,
  Wrench, BarChart3, Package, Truck, Receipt, HardHat,
  AlertTriangle, Warehouse,
};

interface WorkflowStepperProps {
  activeStage: string;
  onStageClick: (code: string) => void;
  stageCounts?: StageCount[];
}

export function WorkflowStepper({ activeStage, onStageClick, stageCounts = [] }: WorkflowStepperProps) {
  const countsMap = useMemo(() => {
    const map: Record<string, StageCount> = {};
    stageCounts.forEach(c => { map[c.stageCode] = c; });
    return map;
  }, [stageCounts]);

  const getCount = useCallback((code: string) => countsMap[code]?.total ?? 0, [countsMap]);

  // 활성 단계의 메인 흐름 인덱스 (진입점/분기는 -1)
  const activeMainIndex = useMemo(() => {
    const idx = MAIN_STAGES.findIndex(s => s.code === activeStage);
    if (idx >= 0) return idx;
    // 진입점은 수주(0) 기준
    const entry = ENTRY_STAGES.find(s => s.code === activeStage);
    if (entry) return -1;
    // 분기는 부모 메인 단계 인덱스
    const allStages = [...MAIN_STAGES];
    for (const main of allStages) {
      const branches = getBranches(main.code);
      if (branches.some(b => b.code === activeStage)) {
        return MAIN_STAGES.findIndex(s => s.code === main.code);
      }
    }
    return 0;
  }, [activeStage]);

  const progressPercent = useMemo(() => {
    if (activeMainIndex <= 0) return 0;
    return (activeMainIndex / MAIN_STAGES.length) * 100;
  }, [activeMainIndex]);

  return (
    <div style={containerStyle} role="navigation" aria-label="워크플로우 단계">
      <div style={flowAreaStyle}>
        {/* 좌측: 진입점 노드 */}
        <div style={entryColumnStyle}>
          {ENTRY_STAGES.map(stage => {
            const Icon = iconComponents[stage.icon];
            const isActive = activeStage === stage.code;
            return (
              <button
                key={stage.code}
                type="button"
                onClick={() => onStageClick(stage.code)}
                style={getEntryNodeStyle(isActive)}
                onMouseEnter={e => handleEntryHover(e, true, isActive)}
                onMouseLeave={e => handleEntryHover(e, false, isActive)}
                title={stage.name}
              >
                {Icon && <Icon size={14} />}
                <span style={entryLabelStyle}>{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* 진입점 → 수주 커넥터 */}
        <div style={entryConnectorStyle}>
          <svg width="28" height="56" viewBox="0 0 28 56" style={{ flexShrink: 0 }}>
            <path
              d="M0 10 Q14 10 14 28 Q14 46 0 46"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <path d="M14 28 L26 28" fill="none" stroke="var(--border)" strokeWidth="1.5" />
            <polygon points="24,25 28,28 24,31" fill="var(--text-tertiary)" />
          </svg>
        </div>

        {/* 메인 흐름 */}
        <div style={mainFlowStyle}>
          {MAIN_STAGES.map((stage, index) => {
            const isActive = activeStage === stage.code;
            const isCompleted = activeMainIndex > index;
            const count = getCount(stage.code);
            const branches = getBranches(stage.code);
            const stepNumber = index + 1;

            return (
              <div key={stage.code} style={stageColumnStyle}>
                {/* 커넥터 + 원형 스텝 행 */}
                <div style={stepRowStyle}>
                  {/* 왼쪽 커넥터 라인 (첫번째 제외) */}
                  {index > 0 && (
                    <div
                      style={{
                        ...connectorLineStyle,
                        background: activeMainIndex >= index ? 'var(--success)' : 'var(--border)',
                      }}
                    />
                  )}

                  {/* Step Circle */}
                  <button
                    type="button"
                    onClick={() => onStageClick(stage.code)}
                    style={getCircleStyle(isActive, isCompleted)}
                    onMouseEnter={e => handleCircleHover(e, true, isActive, isCompleted)}
                    onMouseLeave={e => handleCircleHover(e, false, isActive, isCompleted)}
                    aria-current={isActive ? 'step' : undefined}
                    title={`${stage.name} (${stage.nameEn})`}
                  >
                    {isCompleted ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      <span style={circleNumberStyle}>{stepNumber}</span>
                    )}
                  </button>

                  {/* 오른쪽 커넥터 라인 (마지막 제외) */}
                  {index < MAIN_STAGES.length - 1 && (
                    <div
                      style={{
                        ...connectorLineStyle,
                        background: activeMainIndex > index ? 'var(--success)' : 'var(--border)',
                      }}
                    />
                  )}
                </div>

                {/* 라벨 영역 */}
                <div style={labelAreaStyle}>
                  <span style={getKorLabelStyle(isActive)}>{stage.name}</span>
                  <span style={engLabelStyle}>{stage.nameEn}</span>
                </div>

                {/* 건수 배지 */}
                {count > 0 && (
                  <span style={getCountBadgeStyle(isActive)}>
                    {count}건
                  </span>
                )}

                {/* 분기 링크 */}
                {branches.length > 0 && (
                  <div style={branchAreaStyle}>
                    {branches.map(branch => {
                      const branchActive = activeStage === branch.code;
                      return (
                        <button
                          key={branch.code}
                          type="button"
                          onClick={() => onStageClick(branch.code)}
                          style={getBranchLinkStyle(branchActive)}
                          onMouseEnter={e => handleBranchHover(e, true, branchActive)}
                          onMouseLeave={e => handleBranchHover(e, false, branchActive)}
                          title={branch.name}
                        >
                          <ArrowRight size={10} style={{ flexShrink: 0 }} />
                          <span>{branch.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={progressTrackStyle} role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100} aria-label="워크플로우 진행률">
        <div
          style={{
            ...progressFillStyle,
            width: `${progressPercent}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Hover handlers ─── */
function handleEntryHover(e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, isActive: boolean) {
  if (isActive) return;
  const el = e.currentTarget;
  el.style.background = isEnter ? 'var(--panel-solid)' : 'var(--panel-2)';
  el.style.transform = isEnter ? 'translateY(-1px)' : 'none';
  el.style.boxShadow = isEnter ? '0 4px 12px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)';
}

function handleCircleHover(
  e: React.MouseEvent<HTMLButtonElement>,
  isEnter: boolean,
  isActive: boolean,
  isCompleted: boolean,
) {
  if (isActive) return;
  const el = e.currentTarget;
  if (isEnter) {
    el.style.transform = 'scale(1.1)';
    el.style.boxShadow = isCompleted
      ? '0 4px 12px rgba(48, 209, 88, 0.35)'
      : '0 4px 12px rgba(0,0,0,0.12)';
  } else {
    el.style.transform = 'scale(1)';
    el.style.boxShadow = isCompleted
      ? '0 2px 8px rgba(48, 209, 88, 0.2)'
      : '0 1px 3px rgba(0,0,0,0.04)';
  }
}

function handleBranchHover(e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean, isActive: boolean) {
  if (isActive) return;
  const el = e.currentTarget;
  el.style.color = isEnter ? 'var(--accent)' : 'var(--text-tertiary)';
  el.style.background = isEnter ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : 'transparent';
}

/* ─── Styles ─── */
const TRANSITION = 'all 0.25s cubic-bezier(0.32, 0.72, 0, 1)';

const containerStyle: CSSProperties = {
  position: 'relative',
  padding: '16px 20px 20px',
  overflowX: 'auto',
  overflowY: 'visible',
};

const flowAreaStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 0,
  minWidth: 'fit-content',
};

const entryColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  paddingTop: 2,
  flexShrink: 0,
};

const entryConnectorStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  paddingTop: 0,
};

const mainFlowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 0,
  flex: 1,
};

const stageColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  flex: 1,
  minWidth: 80,
};

const stepRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'center',
};

const connectorLineStyle: CSSProperties = {
  flex: 1,
  height: 2,
  minWidth: 8,
  transition: 'background 0.3s ease',
};

const labelAreaStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1,
  marginTop: 6,
};

const entryLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

const circleNumberStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1,
};

const engLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 400,
  color: 'var(--text-tertiary)',
  whiteSpace: 'nowrap',
};

const branchAreaStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  marginTop: 4,
};

const progressTrackStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  background: 'rgba(120, 120, 128, 0.08)',
  borderRadius: '0 0 16px 16px',
  overflow: 'hidden',
};

const progressFillStyle: CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, var(--success), #4ade80)',
  borderRadius: '0 0 16px 16px',
  transition: 'width 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
};

/* ─── Dynamic style functions ─── */
function getEntryNodeStyle(isActive: boolean): CSSProperties {
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 10,
    border: '1px solid',
    cursor: 'pointer',
    transition: TRANSITION,
    flexShrink: 0,
  };

  if (isActive) {
    return {
      ...base,
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      borderColor: 'var(--accent)',
      boxShadow: '0 4px 12px var(--accent-glow)',
    };
  }

  return {
    ...base,
    background: 'var(--panel-2)',
    color: 'var(--text-secondary)',
    borderColor: 'var(--border)',
    borderStyle: 'dashed',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };
}

function getCircleStyle(isActive: boolean, isCompleted: boolean): CSSProperties {
  const base: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: TRANSITION,
    flexShrink: 0,
    border: 'none',
    padding: 0,
  };

  if (isCompleted) {
    return {
      ...base,
      background: 'var(--success)',
      color: '#fff',
      boxShadow: '0 2px 8px rgba(48, 209, 88, 0.2)',
    };
  }

  if (isActive) {
    return {
      ...base,
      background: 'var(--accent)',
      color: 'var(--on-accent)',
      boxShadow: '0 4px 14px var(--accent-glow)',
    };
  }

  return {
    ...base,
    background: 'transparent',
    color: 'var(--text-tertiary)',
    border: '2px solid var(--border)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };
}

function getKorLabelStyle(isActive: boolean): CSSProperties {
  return {
    fontSize: 13,
    fontWeight: isActive ? 700 : 600,
    color: isActive ? 'var(--accent)' : 'var(--text)',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease',
  };
}

function getCountBadgeStyle(isActive: boolean): CSSProperties {
  return {
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 100,
    background: isActive
      ? 'color-mix(in srgb, var(--accent) 15%, transparent)'
      : 'color-mix(in srgb, var(--accent) 8%, transparent)',
    color: 'var(--accent)',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  };
}

function getBranchLinkStyle(isActive: boolean): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    padding: '2px 6px',
    fontSize: 11,
    fontWeight: 500,
    color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
    background: isActive ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'transparent',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: TRANSITION,
    whiteSpace: 'nowrap',
  };
}

export default WorkflowStepper;
