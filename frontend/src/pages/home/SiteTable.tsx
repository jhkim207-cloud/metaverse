import type { ReactNode } from 'react';
import type { PeriodType, SiteSummaryRow } from '../../types/dashboard.types';
import { PeriodTabs } from './PeriodTabs';

interface SiteTableProps {
  icon?: ReactNode;
  rows: SiteSummaryRow[];
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  loading?: boolean;
}

const COLUMNS = [
  { key: 'siteNm', label: '현장명', align: 'left' as const },
  { key: 'order', label: '수주실적', align: 'right' as const },
  { key: 'plan', label: '생산계획', align: 'right' as const },
  { key: 'result', label: '생산실적', align: 'right' as const },
  { key: 'delivery', label: '출고실적', align: 'right' as const },
  { key: 'pending', label: '미출고', align: 'right' as const },
  { key: 'sales', label: '매출현황', align: 'right' as const },
];

function formatAmount(val: number | undefined | null): string {
  if (val == null) return '0만원';
  if (val >= 10000) return `${(val / 10000).toFixed(0)}만원`;
  return `${val.toLocaleString()}만원`;
}

export function SiteTable({ icon, rows, period, onPeriodChange, loading }: SiteTableProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 10px' }}>
        {icon}
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          현장 요약
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <PeriodTabs value={period} onChange={onPeriodChange} />
      </div>

      {/* Table */}
      {loading ? (
        <div className="card" style={{ height: 200, animation: 'pulse 2s infinite' }} />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ background: 'var(--panel-2)' }}>
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    style={{
                      padding: '10px 12px',
                      textAlign: col.align,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr
                  key={row.siteNm}
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--text)' }}>
                    {row.siteNm}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.orderCount}건
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {formatAmount(row.orderAmount)}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.planCount}건
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {row.planQty.toLocaleString()}장
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.resultGoodQty.toLocaleString()}장
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      양품률 {row.resultGoodRate}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.deliveryCount}건
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {row.deliveryQty.toLocaleString()}장
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.pendingCount}건
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {row.pendingArea}평
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text)' }}>
                    {row.salesCount ?? 0}건
                    <br />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      {formatAmount(row.salesAmount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
