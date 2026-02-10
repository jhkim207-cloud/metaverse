import { useMemo, CSSProperties } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { SalesOrderHeader } from '../../types/site.types';

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: '대기',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

interface OrderCardListProps {
  orders: SalesOrderHeader[];
  selectedSiteNm: string | null;
  selectedOrder: SalesOrderHeader | null;
  onSelect: (order: SalesOrderHeader) => void;
}

export function OrderCardList({ orders, selectedSiteNm, selectedOrder, onSelect }: OrderCardListProps) {
  const filtered = useMemo(() => {
    if (!selectedSiteNm) return orders;
    return orders.filter(o => o.siteNm === selectedSiteNm);
  }, [orders, selectedSiteNm]);

  if (filtered.length === 0) {
    return (
      <div style={emptyStyle}>
        {selectedSiteNm ? '해당 현장의 주문이 없습니다.' : '주문이 없습니다.'}
      </div>
    );
  }

  return (
    <div style={listStyle}>
      {filtered.map(order => {
        const isActive = selectedOrder?.id === order.id;
        return (
          <button
            key={order.id}
            type="button"
            style={{
              ...cardStyle,
              ...(isActive ? cardActiveStyle : {}),
            }}
            onClick={(e) => { e.currentTarget.blur(); onSelect(order); }}
          >
            <div style={cardTopStyle}>
              <div style={cardOrderNoStyle}>
                <ShoppingCart size={12} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                {order.orderNo}
              </div>
              {order.detailCount != null && order.detailCount > 0 && (
                <span style={badgeStyle}>{order.detailCount}건</span>
              )}
            </div>
            <div style={cardSiteStyle}>
              {order.siteNm || order.customerNm || '-'}
            </div>
            <div style={cardBottomStyle}>
              <span style={cardStatStyle}>
                {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
              </span>
              {order.deliveryDate && (
                <span style={cardDateStyle}>납기 {order.deliveryDate}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  paddingBottom: 8,
};

const emptyStyle: CSSProperties = {
  padding: '16px 12px',
  fontSize: 12,
  color: 'var(--text-tertiary)',
  textAlign: 'center',
};

const cardStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  width: 'calc(100% - 16px)',
  margin: '6px auto 0',
  padding: '8px 10px',
  border: '1px solid var(--border)',
  borderColor: 'var(--border)',
  borderRadius: 8,
  background: 'var(--panel-2)',
  boxShadow: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
  fontFamily: 'inherit',
  outline: 'none',
};

const cardActiveStyle: CSSProperties = {
  borderColor: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  boxShadow: '0 0 0 1px var(--accent)',
};

const cardTopStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
};

const cardOrderNoStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
};

const badgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 6px',
  borderRadius: 8,
  flexShrink: 0,
};

const cardSiteStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-secondary)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const cardBottomStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
};

const cardStatStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const cardDateStyle: CSSProperties = {
  fontSize: 10,
  color: 'var(--text-tertiary)',
};

export default OrderCardList;
