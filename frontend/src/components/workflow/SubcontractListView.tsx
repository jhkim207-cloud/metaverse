/**
 * SubcontractListView - 임가공(외주발주) 목록 뷰
 *
 * 발주번호별 그룹핑 + 2줄 레이아웃 카드 리스트
 * 1줄: SEQ · 품명 · 두께 · 구분 · 상태
 * 2줄: 수량/완료 · 면적 · 위치 · 입고요청일 · 입고처 · 비고
 */

import { useState, useEffect, useMemo, CSSProperties } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { subcontractApi } from '../../services/subcontractApi';
import type { SubcontractOrder } from '../../types/subcontract.types';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: '대기', color: 'var(--text-tertiary)' },
  PROCESSING: { label: '작업중', color: '#f59e0b' },
  RECEIVED: { label: '입고완료', color: 'var(--accent)' },
  COMPLETED: { label: '완료', color: '#22c55e' },
  CANCELLED: { label: '취소', color: '#ef4444' },
};

const TYPE_MAP: Record<string, string> = {
  PROCESSING: '임가공',
  TEMPERED: '강화',
  ETCHED: '에칭',
  CUTTING: '재단',
};

interface SubcontractGroup {
  subcontractNo: string;
  subcontractDate: string;
  subcontractorNm: string;
  siteNm: string | null;
  items: SubcontractOrder[];
  totalQty: number;
  totalCompleted: number;
  totalArea: number;
}

function num(v: number | null | undefined): string {
  if (v == null || v === 0) return '-';
  return Number(v).toLocaleString();
}

function decimal(v: number | null | undefined, digits = 1): string {
  if (v == null || v === 0) return '-';
  return Number(v).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits + 1 });
}

export function SubcontractListView() {
  const [data, setData] = useState<SubcontractOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    subcontractApi.findAll().then(res => {
      if (cancelled) return;
      if (res.success && res.data) setData(res.data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const groups = useMemo<SubcontractGroup[]>(() => {
    const map = new Map<string, SubcontractOrder[]>();
    for (const d of data) {
      if (!map.has(d.subcontractNo)) map.set(d.subcontractNo, []);
      map.get(d.subcontractNo)!.push(d);
    }
    const result: SubcontractGroup[] = [];
    for (const [no, items] of map) {
      items.sort((a, b) => a.lineSeq - b.lineSeq);
      const first = items[0];
      result.push({
        subcontractNo: no,
        subcontractDate: first.subcontractDate,
        subcontractorNm: first.subcontractorNm,
        siteNm: first.siteNm,
        items,
        totalQty: items.reduce((s, x) => s + (x.orderQty || 0), 0),
        totalCompleted: items.reduce((s, x) => s + (x.completedQty || 0), 0),
        totalArea: items.reduce((s, x) => s + (x.areaM2 || 0), 0),
      });
    }
    result.sort((a, b) => b.subcontractDate.localeCompare(a.subcontractDate));
    return result;
  }, [data]);

  const summary = useMemo(() => ({
    total: data.length,
    contractors: new Set(data.map(d => d.subcontractorNm)).size,
    sites: new Set(data.filter(d => d.siteNm).map(d => d.siteNm)).size,
  }), [data]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton variant="rounded" width="100%" height={300} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title="임가공 데이터가 없습니다"
        message="등록된 외주발주 항목이 없습니다."
      />
    );
  }

  return (
    <div style={containerStyle}>
      {/* Summary bar */}
      <div style={summaryBarStyle}>
        <span style={summaryLabelStyle}>전체</span>
        <span style={summaryCountStyle}>{summary.total}건</span>
        <span style={summaryDividerStyle}>|</span>
        <span style={summaryLabelStyle}>발주</span>
        <span style={summaryCountStyle}>{groups.length}건</span>
        <span style={summaryDividerStyle}>|</span>
        <span style={summaryLabelStyle}>업체</span>
        <span style={summaryCountStyle}>{summary.contractors}개</span>
        <span style={summaryDividerStyle}>|</span>
        <span style={summaryLabelStyle}>현장</span>
        <span style={summaryCountStyle}>{summary.sites}개</span>
      </div>

      {/* List */}
      <div style={listWrapperStyle}>
        {groups.map(group => (
          <div key={group.subcontractNo}>
            {/* Group header */}
            <div style={groupHeaderStyle}>
              <span style={groupNoStyle}>{group.subcontractNo}</span>
              <span style={groupDateStyle}>{group.subcontractDate}</span>
              <span style={groupDivStyle}>·</span>
              <span style={groupContractorStyle}>{group.subcontractorNm}</span>
              {group.siteNm && (
                <>
                  <span style={groupDivStyle}>·</span>
                  <span style={groupSiteStyle}>{group.siteNm}</span>
                </>
              )}
              <span style={groupSummaryStyle}>
                {group.items.length}건, {num(group.totalQty)}EA, {decimal(group.totalArea)}m²
              </span>
            </div>

            {/* Detail rows */}
            {group.items.map(item => {
              const status = STATUS_MAP[item.subcontractStatus] || { label: item.subcontractStatus, color: 'var(--text-tertiary)' };
              const typeLabel = TYPE_MAP[item.subcontractType] || item.subcontractType;
              const isCompleted = item.subcontractStatus === 'COMPLETED';

              return (
                <div
                  key={item.id}
                  style={{
                    ...rowStyle,
                    ...(isCompleted ? rowCompletedStyle : {}),
                  }}
                >
                  {/* Line 1: seq · materialNm · thickness · type · status */}
                  <div style={rowLine1Style}>
                    <span style={rowSeqStyle}>{item.lineSeq}</span>
                    <span style={rowMaterialStyle}>{item.materialNm || '-'}</span>
                    {item.thickness != null && (
                      <span style={rowTagStyle}>{item.thickness}mm</span>
                    )}
                    <span style={rowTagStyle}>{typeLabel}</span>
                    <span style={{ ...rowStatusStyle, color: status.color }}>
                      {status.label}
                    </span>
                  </div>

                  {/* Line 2: qty/completed · area · location · receipt date · receipt location · remarks */}
                  <div style={rowLine2Style}>
                    <span style={rowQtyStyle}>
                      {num(item.orderQty)}{item.unit || 'EA'}
                      {item.completedQty != null && item.completedQty > 0 && (
                        <span style={rowCompletedQtyStyle}> (완료 {num(item.completedQty)})</span>
                      )}
                    </span>
                    {item.areaM2 != null && item.areaM2 > 0 && (
                      <span style={rowAreaStyle}>{decimal(item.areaM2)}m²</span>
                    )}
                    {item.location && (
                      <span style={rowLocationStyle}>{item.location}</span>
                    )}
                    {item.requestedReceiptDate && (
                      <span style={rowReceiptStyle}>입고요청 {item.requestedReceiptDate}</span>
                    )}
                    {item.actualReceiptDate && (
                      <span style={rowReceiptStyle}>실입고 {item.actualReceiptDate}</span>
                    )}
                    {item.receiptLocation && (
                      <span style={rowReceiptLocStyle}>{item.receiptLocation}</span>
                    )}
                    {item.remarks && (
                      <span style={rowRemarksStyle}>{item.remarks}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Styles ─── */

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

const summaryBarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
  flexShrink: 0,
};

const summaryLabelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const summaryCountStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
};

const summaryDividerStyle: CSSProperties = {
  color: 'var(--border)',
  fontSize: 12,
};

const listWrapperStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
};

/* Group header */
const groupHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '7px 12px',
  background: 'color-mix(in srgb, var(--accent) 4%, var(--panel))',
  borderBottom: '1px solid var(--border)',
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

const groupNoStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--accent)',
};

const groupDateStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
};

const groupDivStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const groupContractorStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text)',
};

const groupSiteStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flex: 1,
  minWidth: 0,
};

const groupSummaryStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 7px',
  borderRadius: 8,
  whiteSpace: 'nowrap',
  flexShrink: 0,
  marginLeft: 'auto',
};

/* Row */
const rowStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  padding: '6px 12px',
  borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)',
};

const rowCompletedStyle: CSSProperties = {
  opacity: 0.55,
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

const rowStatusStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  flexShrink: 0,
  marginLeft: 'auto',
};

const rowLine2Style: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  paddingLeft: 24,
  flexWrap: 'wrap',
};

const rowQtyStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text)',
};

const rowCompletedQtyStyle: CSSProperties = {
  fontWeight: 500,
  color: '#22c55e',
};

const rowAreaStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
};

const rowLocationStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
};

const rowReceiptStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
};

const rowReceiptLocStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
  fontStyle: 'italic',
};

const rowRemarksStyle: CSSProperties = {
  fontSize: 10,
  color: '#f59e0b',
  fontWeight: 500,
};

export default SubcontractListView;
