import { useState, useEffect, useMemo, useCallback, CSSProperties } from 'react';
import { Calendar, CheckCircle, CircleDot, Circle, AlertTriangle, ClipboardList } from 'lucide-react';
import { productionResultApi } from '../../services/productionResultApi';
import { DatePicker } from '../common/DatePicker';
import { WorkOrderResultCard } from './WorkOrderResultCard';
import { ResultEntryPanel } from './ResultEntryPanel';
import type { WorkOrderWithResult, ProductionSummary } from '../../types/productionResult.types';

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d: Date | null): string {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function ProductionResultView() {
  const [productionDate, setProductionDate] = useState('');
  const [workOrders, setWorkOrders] = useState<WorkOrderWithResult[]>([]);
  const [summary, setSummary] = useState<ProductionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  const fetchData = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const [woRes, sumRes] = await Promise.all([
        productionResultApi.findWorkOrders(date),
        productionResultApi.getSummary(date),
      ]);
      if (woRes.success && woRes.data) setWorkOrders(woRes.data);
      else setWorkOrders([]);
      if (sumRes.success && sumRes.data) setSummary(sumRes.data);
      else setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchData(productionDate).then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, [productionDate, fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData(productionDate);
  }, [productionDate, fetchData]);

  const handleFullComplete = useCallback(async (wo: WorkOrderWithResult) => {
    const res = await productionResultApi.fullComplete({
      workRequestId: wo.id,
      productionDate,
    });
    if (res.success) handleRefresh();
  }, [productionDate, handleRefresh]);

  const selectedWorkOrder = useMemo(
    () => workOrders.find(wo => wo.id === selectedId) ?? null,
    [workOrders, selectedId],
  );

  // Group by siteNm
  const grouped = useMemo(() => {
    let filtered = workOrders;
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      filtered = workOrders.filter(wo =>
        (wo.requestNo ?? '').toLowerCase().includes(q) ||
        (wo.materialNm ?? '').toLowerCase().includes(q) ||
        (wo.siteNm ?? '').toLowerCase().includes(q) ||
        (wo.customerNm ?? '').toLowerCase().includes(q)
      );
    }
    const map = new Map<string, WorkOrderWithResult[]>();
    for (const wo of filtered) {
      const key = wo.siteNm || '미분류';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(wo);
    }
    return map;
  }, [workOrders, searchText]);

  const totalFiltered = useMemo(
    () => Array.from(grouped.values()).reduce((s, arr) => s + arr.length, 0),
    [grouped],
  );

  return (
    <div style={containerStyle}>
      {/* LEFT PANEL */}
      <div style={leftPanelStyle}>
        {/* Date picker */}
        <div style={dateBarStyle}>
          <Calendar size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={dateLabelStyle}>생산일자</span>
          <DatePicker
            selected={parseDate(productionDate)}
            onChange={d => {
              setProductionDate(formatDate(d));
              setSelectedId(null);
            }}
            placeholder="생산일자"
            isClearable={false}
          />
          <button
            type="button"
            onClick={() => {
              setProductionDate(todayStr());
              setSelectedId(null);
            }}
            style={todayBtnStyle}
          >
            오늘
          </button>
        </div>

        {/* Summary strip */}
        {summary && (
          <div style={summaryStyle}>
            <div style={summaryItemsStyle}>
              <SumItem icon={<ClipboardList size={12} />} label="총" value={summary.totalCount} color="var(--text)" />
              <SumItem icon={<CheckCircle size={12} />} label="완료" value={summary.completedCount} color="var(--success)" />
              <SumItem icon={<CircleDot size={12} />} label="진행" value={summary.partialCount} color="var(--warning)" />
              <SumItem icon={<Circle size={12} />} label="대기" value={summary.pendingCount} color="var(--text-tertiary)" />
              {summary.defectCount > 0 && (
                <SumItem icon={<AlertTriangle size={12} />} label="불량" value={summary.defectCount} color="var(--error)" />
              )}
            </div>
            {/* Progress bar */}
            <div style={summaryBarBgStyle}>
              <div
                style={{
                  ...summaryBarFillStyle,
                  width: `${summary.completionRate}%`,
                }}
              />
            </div>
            <div style={summaryRateStyle}>{Math.round(summary.completionRate)}%</div>
          </div>
        )}

        {/* Search */}
        <div style={searchBarStyle}>
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="검색 (작업지시번호, 자재, 현장...)"
            style={searchInputStyle}
          />
          {!loading && (
            <span style={filterCountStyle}>{totalFiltered}건</span>
          )}
        </div>

        {/* Work order card list */}
        <div style={cardListStyle}>
          {loading ? (
            <div style={emptyStyle}>로딩 중...</div>
          ) : totalFiltered === 0 ? (
            <div style={emptyStyle}>
              <ClipboardList size={28} style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
              <div style={{ marginTop: 6 }}>작업지시가 없습니다</div>
            </div>
          ) : (
            Array.from(grouped.entries()).map(([siteNm, items]) => (
              <div key={siteNm}>
                <div style={groupHeaderStyle}>
                  {siteNm}
                  <span style={groupCountStyle}>{items.length}건</span>
                </div>
                {items.map(wo => (
                  <WorkOrderResultCard
                    key={wo.id}
                    workOrder={wo}
                    isSelected={wo.id === selectedId}
                    onSelect={w => setSelectedId(w.id)}
                    onFullComplete={handleFullComplete}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={rightPanelStyle}>
        {selectedWorkOrder ? (
          <ResultEntryPanel
            key={selectedWorkOrder.id}
            workOrder={selectedWorkOrder}
            productionDate={productionDate}
            onChanged={handleRefresh}
          />
        ) : (
          <div style={rightEmptyStyle}>
            <ClipboardList size={36} style={{ color: 'var(--text-tertiary)', opacity: 0.25 }} />
            <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>
              작업지시를 선택하세요
            </div>
            <div style={{ marginTop: 4, fontSize: 12 }}>
              좌측에서 작업지시 카드를 클릭하면 실적 등록 화면이 표시됩니다
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Summary Item ─── */

function SumItem({ icon, label, value, color }: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  height: '100%',
  gap: 0,
};

const leftPanelStyle: CSSProperties = {
  width: 400,
  minWidth: 340,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--border)',
  background: 'var(--panel-2)',
};

const dateBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
};

const dateLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const dateInputStyle: CSSProperties = {
  fontSize: 13,
  padding: '6px 10px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--panel)',
  color: 'var(--text)',
  fontFamily: 'inherit',
};

const todayBtnStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  padding: '6px 12px',
  border: '1px solid var(--accent)',
  borderRadius: 6,
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  color: 'var(--accent)',
  cursor: 'pointer',
};

const summaryStyle: CSSProperties = {
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel)',
};

const summaryItemsStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  flexWrap: 'wrap',
};

const summaryBarBgStyle: CSSProperties = {
  height: 4,
  borderRadius: 2,
  background: 'color-mix(in srgb, var(--text-tertiary) 15%, transparent)',
  marginTop: 8,
  overflow: 'hidden',
};

const summaryBarFillStyle: CSSProperties = {
  height: '100%',
  borderRadius: 2,
  background: 'var(--success)',
  transition: 'width 0.3s ease',
};

const summaryRateStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--success)',
  marginTop: 4,
  textAlign: 'right',
};

const searchBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 14px',
  borderBottom: '1px solid var(--border)',
};

const searchInputStyle: CSSProperties = {
  flex: 1,
  fontSize: 13,
  padding: '7px 10px',
  border: '1px solid var(--border)',
  borderRadius: 6,
  background: 'var(--panel)',
  color: 'var(--text)',
  fontFamily: 'inherit',
};

const filterCountStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  whiteSpace: 'nowrap',
};

const cardListStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '6px 0',
};

const emptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 20px',
  fontSize: 13,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
};

const groupHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 14px 4px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text-secondary)',
  position: 'sticky',
  top: 0,
  background: 'var(--panel-2)',
  zIndex: 1,
};

const groupCountStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const rightPanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--panel)',
};

const rightEmptyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
  padding: 20,
};

export default ProductionResultView;
