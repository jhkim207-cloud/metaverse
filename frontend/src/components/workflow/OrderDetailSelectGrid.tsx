/**
 * OrderDetailSelectGrid - 주문 상세 체크박스 선택 리스트
 *
 * 생산계획 화면 중앙 패널: 주문 디테일을 두께별로 그룹핑하여 표시
 * 체크박스 다중선택 → 선택된 항목을 상위로 전달
 * 각 행은 2줄로 표시 (1줄: 자재명/규격, 2줄: 수량/면적/위치)
 */

import { useState, useMemo, useCallback, useEffect, useRef, CSSProperties } from 'react';
import { Package, CheckSquare, Check } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { salesOrderApi } from '../../services/siteApi';
import type { SalesOrderHeader, SalesOrderDetail } from '../../types/site.types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  SCHEDULED: '배정',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--text-tertiary)',
  SCHEDULED: 'var(--accent)',
  IN_PROGRESS: '#f59e0b',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

interface ThicknessGroup {
  thickness: number;
  items: SalesOrderDetail[];
  totalQty: number;
}

interface OrderDetailSelectGridProps {
  selectedOrder: SalesOrderHeader | null;
  onSelectionChange: (selected: SalesOrderDetail[]) => void;
}

export function OrderDetailSelectGrid({ selectedOrder, onSelectionChange }: OrderDetailSelectGridProps) {
  const [details, setDetails] = useState<SalesOrderDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedOrder) {
      setDetails([]);
      setSelectedIds(new Set());
      onSelectionChange([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    salesOrderApi.findDetailsByHeaderId(selectedOrder.id)
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) setDetails(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedOrder]);

  // Reset selection when details change
  useEffect(() => {
    setSelectedIds(new Set());
    onSelectionChange([]);
  }, [details]);

  // Group by thickness
  const groups = useMemo<ThicknessGroup[]>(() => {
    if (details.length === 0) return [];

    const map = new Map<number, SalesOrderDetail[]>();
    for (const d of details) {
      const t = d.thickness ?? 0;
      if (!map.has(t)) map.set(t, []);
      map.get(t)!.push(d);
    }

    const result: ThicknessGroup[] = [];
    for (const [thickness, items] of map) {
      items.sort((a, b) => (a.lineSeq ?? 0) - (b.lineSeq ?? 0));
      const totalQty = items.reduce((s, x) => s + (x.quantity || 0), 0);
      result.push({ thickness, items, totalQty });
    }
    result.sort((a, b) => a.thickness - b.thickness);
    return result;
  }, [details]);

  // Selectable items (PENDING only)
  const selectableIds = useMemo(() => {
    const ids = new Set<number>();
    for (const d of details) {
      if (!d.productionStatus || d.productionStatus === 'PENDING') {
        ids.add(d.id);
      }
    }
    return ids;
  }, [details]);

  const toggleItem = useCallback((id: number) => {
    if (!selectableIds.has(id)) return;
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, [selectableIds]);

  const toggleAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === selectableIds.size && selectableIds.size > 0) {
        return new Set();
      }
      return new Set(selectableIds);
    });
  }, [selectableIds]);

  // Sync selection to parent
  useEffect(() => {
    const selected = details.filter(d => selectedIds.has(d.id));
    onSelectionChange(selected);
  }, [selectedIds, details, onSelectionChange]);

  // Summary
  const summary = useMemo(() => {
    const selected = details.filter(d => selectedIds.has(d.id));
    const qty = selected.reduce((s, d) => s + (d.quantity || 0), 0);
    const area = selected.reduce((s, d) => s + (d.area || 0), 0);
    return { count: selected.length, qty, area };
  }, [selectedIds, details]);

  const allSelected = selectableIds.size > 0 && selectedIds.size === selectableIds.size;
  const someSelected = selectedIds.size > 0 && selectedIds.size < selectableIds.size;

  if (!selectedOrder) {
    return (
      <div style={emptyContainerStyle}>
        <EmptyState
          title="주문을 선택하세요"
          message="좌측에서 주문 카드를 클릭하면 상세 라인이 표시됩니다."
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 12 }}>
        <Skeleton variant="rounded" width="100%" height={200} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Header bar */}
      <div style={headerBarStyle}>
        <div style={headerLeftStyle}>
          {/* Master checkbox */}
          <button
            type="button"
            style={{
              ...checkboxStyle,
              ...(allSelected ? checkboxCheckedStyle : someSelected ? checkboxIndeterminateStyle : {}),
            }}
            onClick={toggleAll}
          >
            {allSelected && <Check size={12} strokeWidth={3} />}
            {someSelected && <span style={indeterminateDash}>-</span>}
          </button>
          <Package size={14} style={{ color: 'var(--accent)' }} />
          <span style={headerOrderNoStyle}>{selectedOrder.orderNo}</span>
          <span style={headerSiteStyle}>{selectedOrder.siteNm}</span>
          <span style={headerCountStyle}>{details.length}건</span>
        </div>
      </div>

      {/* List */}
      {details.length === 0 ? (
        <EmptyState title="디테일이 없습니다" message="이 주문에 등록된 품목이 없습니다." />
      ) : (
        <div ref={listRef} style={listWrapperStyle}>
          {groups.map(group => (
            <div key={group.thickness}>
              {/* Group header */}
              <div style={groupHeaderStyle}>
                <span style={groupThicknessStyle}>{group.thickness}mm</span>
                <span style={groupCountStyle}>
                  {group.items.length}건, {group.totalQty}EA
                </span>
              </div>

              {/* Detail rows */}
              {group.items.map(item => {
                const isSelectable = selectableIds.has(item.id);
                const isSelected = selectedIds.has(item.id);
                const status = item.productionStatus || 'PENDING';

                return (
                  <div
                    key={item.id}
                    style={{
                      ...rowStyle,
                      ...(isSelected ? rowSelectedStyle : {}),
                      ...(!isSelectable ? rowDisabledStyle : {}),
                    }}
                    onClick={() => toggleItem(item.id)}
                  >
                    {/* Checkbox */}
                    <div style={rowCheckboxCol}>
                      <div
                        style={{
                          ...checkboxStyle,
                          ...(isSelected ? checkboxCheckedStyle : {}),
                          ...(!isSelectable ? checkboxDisabledStyle : {}),
                        }}
                      >
                        {isSelected && <Check size={11} strokeWidth={3} />}
                      </div>
                    </div>

                    {/* Content - 2 lines */}
                    <div style={rowContentStyle}>
                      {/* Line 1: seq + material + window type */}
                      <div style={rowLine1Style}>
                        <span style={rowSeqStyle}>{item.lineSeq}</span>
                        <span style={rowMaterialStyle}>{item.materialNm || item.materialCd}</span>
                        {item.windowType && (
                          <span style={rowTagStyle}>{item.windowType}</span>
                        )}
                      </div>

                      {/* Line 2: size + qty + area + location + status */}
                      <div style={rowLine2Style}>
                        <span style={rowDimStyle}>
                          {item.width}x{item.height}
                        </span>
                        <span style={rowQtyStyle}>{item.quantity}EA</span>
                        {item.area != null && (
                          <span style={rowAreaStyle}>{Number(item.area).toFixed(1)}m2</span>
                        )}
                        {(item.dong || item.ho) && (
                          <span style={rowLocationStyle}>
                            {item.dong && `${item.dong}동`}
                            {item.ho && ` ${item.ho}호`}
                          </span>
                        )}
                        <span
                          style={{
                            ...rowStatusStyle,
                            color: STATUS_COLORS[status] || 'var(--text-tertiary)',
                          }}
                        >
                          {STATUS_LABELS[status] || status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Selection summary bar */}
      {summary.count > 0 && (
        <div style={summaryBarStyle}>
          <CheckSquare size={13} style={{ color: 'var(--accent)' }} />
          <span style={summaryTextStyle}>
            선택: <strong>{summary.count}건</strong>
          </span>
          <span style={summaryDivider}>|</span>
          <span style={summaryTextStyle}>
            수량 <strong>{summary.qty}EA</strong>
          </span>
          <span style={summaryDivider}>|</span>
          <span style={summaryTextStyle}>
            면적 <strong>{summary.area.toFixed(1)}m2</strong>
          </span>
        </div>
      )}
    </div>
  );
}

/* --- Styles --- */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  border: '1px solid var(--border)',
  borderRadius: 10,
  overflow: 'hidden',
  background: 'var(--panel)',
};

const emptyContainerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  minHeight: 0,
};

const headerBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const headerLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const headerOrderNoStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--text)',
};

const headerSiteStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const headerCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 6px',
  borderRadius: 8,
};

const listWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
};

const groupHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '6px 12px',
  background: 'color-mix(in srgb, var(--accent) 4%, var(--panel))',
  borderBottom: '1px solid var(--border)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const groupThicknessStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
};

const groupCountStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

// Checkbox
const checkboxStyle: CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 4,
  border: '1.5px solid var(--border)',
  background: 'var(--panel)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'all 0.12s',
  padding: 0,
  fontFamily: 'inherit',
  color: 'white',
};

const checkboxCheckedStyle: CSSProperties = {
  background: 'var(--accent)',
  borderColor: 'var(--accent)',
};

const checkboxIndeterminateStyle: CSSProperties = {
  background: 'var(--accent)',
  borderColor: 'var(--accent)',
};

const checkboxDisabledStyle: CSSProperties = {
  opacity: 0.3,
  cursor: 'default',
};

const indeterminateDash: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1,
  color: 'white',
};

// Row
const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 8,
  padding: '7px 12px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
  cursor: 'pointer',
  transition: 'background 0.1s',
};

const rowSelectedStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
};

const rowDisabledStyle: CSSProperties = {
  opacity: 0.4,
  cursor: 'default',
};

const rowCheckboxCol: CSSProperties = {
  paddingTop: 2,
  flexShrink: 0,
};

const rowContentStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const rowLine1Style: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
};

const rowSeqStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  width: 18,
  textAlign: 'right',
  flexShrink: 0,
};

const rowMaterialStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
};

const rowTagStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  background: 'color-mix(in srgb, var(--text-secondary) 10%, transparent)',
  padding: '0 5px',
  borderRadius: 4,
  flexShrink: 0,
};

const rowLine2Style: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
};

const rowDimStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  fontVariantNumeric: 'tabular-nums',
};

const rowQtyStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text)',
};

const rowAreaStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
};

const rowLocationStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const rowStatusStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  marginLeft: 'auto',
};

const summaryBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderTop: '1px solid var(--border)',
  background: 'color-mix(in srgb, var(--accent) 5%, var(--panel))',
  flexShrink: 0,
};

const summaryTextStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const summaryDivider: CSSProperties = {
  color: 'var(--border)',
  fontSize: 12,
};

export default OrderDetailSelectGrid;
