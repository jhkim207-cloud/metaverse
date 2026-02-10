import type { CSSProperties } from 'react';
import { Building2, Landmark, Castle, Home, Trees } from 'lucide-react';

interface TodaySiteData {
  siteNm: string;
  orderCount: number;
  orderAmount: number;
  workRequestCount: number;
  planTotal: number;
  planInProgress: number;
  planCompleted: number;
  resultCompletedQty: number;
  resultInProgressQty: number;
  packTotal: number;
  packInProgress: number;
  packCompleted: number;
  deliveryCompleted: number;
  deliveryInProgress: number;
}

const SITE_ICONS = [
  { icon: Building2, color: '#3b82f6' },
  { icon: Landmark, color: '#ef4444' },
  { icon: Castle, color: '#10b981' },
  { icon: Home, color: '#f59e0b' },
  { icon: Trees, color: '#8b5cf6' },
];

const MOCK_DATA: TodaySiteData[] = [
  {
    siteNm: '힐스테이트 위버필드',
    orderCount: 1, orderAmount: 1200,
    workRequestCount: 2,
    planTotal: 3, planInProgress: 2, planCompleted: 1,
    resultCompletedQty: 75, resultInProgressQty: 12,
    packTotal: 2, packInProgress: 1, packCompleted: 1,
    deliveryCompleted: 1, deliveryInProgress: 0,
  },
  {
    siteNm: '래미안 원베일리',
    orderCount: 2, orderAmount: 2400,
    workRequestCount: 3,
    planTotal: 4, planInProgress: 3, planCompleted: 1,
    resultCompletedQty: 110, resultInProgressQty: 25,
    packTotal: 3, packInProgress: 2, packCompleted: 1,
    deliveryCompleted: 1, deliveryInProgress: 1,
  },
  {
    siteNm: '디에이치 라클라스',
    orderCount: 0, orderAmount: 0,
    workRequestCount: 1,
    planTotal: 2, planInProgress: 1, planCompleted: 1,
    resultCompletedQty: 55, resultInProgressQty: 8,
    packTotal: 1, packInProgress: 0, packCompleted: 1,
    deliveryCompleted: 0, deliveryInProgress: 1,
  },
  {
    siteNm: '자이 르네시떼',
    orderCount: 1, orderAmount: 800,
    workRequestCount: 2,
    planTotal: 3, planInProgress: 2, planCompleted: 1,
    resultCompletedQty: 85, resultInProgressQty: 15,
    packTotal: 2, packInProgress: 1, packCompleted: 1,
    deliveryCompleted: 1, deliveryInProgress: 0,
  },
  {
    siteNm: '아크로 리버파크',
    orderCount: 0, orderAmount: 0,
    workRequestCount: 1,
    planTotal: 2, planInProgress: 2, planCompleted: 0,
    resultCompletedQty: 40, resultInProgressQty: 20,
    packTotal: 1, packInProgress: 1, packCompleted: 0,
    deliveryCompleted: 0, deliveryInProgress: 0,
  },
];

function formatAmount(val: number): string {
  if (val === 0) return '0원';
  if (val >= 10000) return `${(val / 10000).toFixed(0)}억원`;
  return `${val.toLocaleString()}만원`;
}

const titleRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  margin: '20px 0 12px',
};

const titleTextStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap',
};

const dividerStyle: CSSProperties = {
  flex: 1,
  height: 1,
  background: 'var(--border)',
};

const siteNameRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
};

const siteNameStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const rowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '3px 0',
};

const labelStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-secondary)',
};

const valueStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text)',
};

const subValueStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  fontWeight: 400,
};

export function TodaySitePanel() {
  return (
    <div>
      {/* 제목행 */}
      <div style={titleRowStyle}>
        <div style={dividerStyle} />
        <span style={titleTextStyle}>오늘의 현장</span>
        <div style={dividerStyle} />
      </div>

      {/* 현장 카드 */}
      {MOCK_DATA.map((site, idx) => {
        const { icon: Icon, color } = SITE_ICONS[idx % SITE_ICONS.length];
        return (
        <div key={site.siteNm} className="card" style={{ padding: '12px 14px', marginBottom: 8 }}>
          <div style={siteNameRowStyle}>
            <div style={{
              width: 24, height: 24, borderRadius: 6,
              background: `${color}22`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={14} color={color} />
            </div>
            <span style={siteNameStyle}>{site.siteNm}</span>
          </div>

          {/* 수주등록 */}
          <div style={rowStyle}>
            <span style={labelStyle}>수주등록</span>
            <span style={valueStyle}>
              {site.orderCount}건
              {site.orderCount > 0 && (
                <span style={subValueStyle}> · {formatAmount(site.orderAmount)}</span>
              )}
            </span>
          </div>

          {/* 작업지시 */}
          <div style={rowStyle}>
            <span style={labelStyle}>작업지시</span>
            <span style={valueStyle}>{site.workRequestCount}건</span>
          </div>

          {/* 생산계획 */}
          <div style={rowStyle}>
            <span style={labelStyle}>생산계획</span>
            <span style={valueStyle}>
              {site.planTotal}건
              <span style={subValueStyle}> (진행 {site.planInProgress} / 완료 {site.planCompleted})</span>
            </span>
          </div>

          {/* 생산실적 */}
          <div style={rowStyle}>
            <span style={labelStyle}>생산실적</span>
            <span style={valueStyle}>
              완료 {site.resultCompletedQty}장
              <span style={subValueStyle}> · 진행 중 {site.resultInProgressQty}장</span>
            </span>
          </div>

          {/* 포장지시 */}
          <div style={rowStyle}>
            <span style={labelStyle}>포장지시</span>
            <span style={valueStyle}>
              {site.packTotal}건
              <span style={subValueStyle}> (진행 {site.packInProgress} / 완료 {site.packCompleted})</span>
            </span>
          </div>

          {/* 출고실적 */}
          <div style={rowStyle}>
            <span style={labelStyle}>출고실적</span>
            <span style={valueStyle}>
              완료 {site.deliveryCompleted}건
              <span style={subValueStyle}> · 진행 중 {site.deliveryInProgress}건</span>
            </span>
          </div>
        </div>
        );
      })}
    </div>
  );
}
