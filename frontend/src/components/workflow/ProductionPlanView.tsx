/**
 * ProductionPlanView - 생산계획 메인 뷰 (3패널)
 *
 * 좌측: 현장 카드 + 주문 카드 (240px)
 * 중앙: 주문 상세 체크박스 그리드 (주문 선택 시 표시)
 * 우측: 주간 네비게이션 + 호기별 간트차트
 */

import { useState, useEffect, useCallback, useMemo, CSSProperties } from 'react';
import { Building2 } from 'lucide-react';
import { startOfWeek, format } from 'date-fns';
import { WeekNavigation } from './WeekNavigation';
import { OrderCardList } from './OrderCardList';
import { OrderDetailSelectGrid } from './OrderDetailSelectGrid';
import { MachineGantt } from './MachineGantt';
import { AssignmentModal } from './AssignmentModal';
import { Skeleton } from '../ui/Skeleton';
import { siteApi, salesOrderApi } from '../../services/siteApi';
import { productionPlanApi, codeApi } from '../../services/productionPlanApi';
import type { SiteMaster, SalesOrderHeader, SalesOrderDetail } from '../../types/site.types';
import type { ProductionPlan, Machine } from '../../types/productionPlan.types';

export function ProductionPlanView() {
  // Data state
  const [sites, setSites] = useState<SiteMaster[]>([]);
  const [orders, setOrders] = useState<SalesOrderHeader[]>([]);
  const [plans, setPlans] = useState<ProductionPlan[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection state
  const [selectedSiteNm, setSelectedSiteNm] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrderHeader | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<SalesOrderDetail[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(
    () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMachineNo, setModalMachineNo] = useState('');
  const [modalDate, setModalDate] = useState<Date>(new Date());

  // Initial data load: sites + orders + machines
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      siteApi.findAll(),
      salesOrderApi.findAll(),
      codeApi.findByGroupCode('MACHINE_NO'),
    ]).then(([siteRes, orderRes, machineRes]) => {
      if (cancelled) return;
      if (siteRes.success && siteRes.data) setSites(siteRes.data);
      if (orderRes.success && orderRes.data) setOrders(orderRes.data);
      if (machineRes.success && machineRes.data) setMachines(machineRes.data);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // Fetch plans when weekStart changes
  const fetchPlans = useCallback(async () => {
    const weekStr = format(weekStart, 'yyyy-MM-dd');
    try {
      const res = await productionPlanApi.findByWeek(weekStr);
      if (res.success && res.data) {
        setPlans(res.data);
      }
    } catch {
      // silent
    }
  }, [weekStart]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Site cards with order counts
  const siteCards = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const o of orders) {
      if (o.siteNm) {
        countMap.set(o.siteNm, (countMap.get(o.siteNm) || 0) + 1);
      }
    }
    return sites.map(s => ({
      ...s,
      orderCount: countMap.get(s.siteNm) || 0,
    }));
  }, [sites, orders]);

  const handleSiteClick = useCallback((siteNm: string | null) => {
    setSelectedSiteNm(prev => prev === siteNm ? null : siteNm);
    setSelectedOrder(null);
    setSelectedDetails([]);
  }, []);

  const handleOrderSelect = useCallback((order: SalesOrderHeader) => {
    setSelectedOrder(prev => {
      if (prev?.id === order.id) {
        setSelectedDetails([]);
        return null;
      }
      setSelectedDetails([]);
      return order;
    });
  }, []);

  const handleDetailSelectionChange = useCallback((selected: SalesOrderDetail[]) => {
    setSelectedDetails(selected);
  }, []);

  const handlePlanClick = useCallback((_plan: ProductionPlan) => {
    // future: open detail panel
  }, []);

  const handleCellClick = useCallback((machineNo: string, date: Date) => {
    // Guard: need selected details
    if (selectedDetails.length === 0) return;
    setModalMachineNo(machineNo);
    setModalDate(date);
    setModalOpen(true);
  }, [selectedDetails]);

  const handleModalSuccess = useCallback(() => {
    fetchPlans();
    // Clear selection after successful assignment
    setSelectedDetails([]);
  }, [fetchPlans]);

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton variant="rounded" width="100%" height={300} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Left panel: site + order cards */}
      <div style={leftPanelStyle}>
        {/* Site cards */}
        <div style={siteSectionStyle}>
          <div style={sectionHeaderStyle}>
            <Building2 size={13} style={{ color: 'var(--accent)' }} />
            <span>현장</span>
            <span style={countBadgeStyle}>{sites.length}</span>
          </div>
          <div style={siteListStyle}>
            {/* "전체" card */}
            <button
              type="button"
              style={{
                ...siteCardStyle,
                ...(!selectedSiteNm ? siteCardActiveStyle : {}),
              }}
              onClick={(e) => { e.currentTarget.blur(); handleSiteClick(null); }}
            >
              <span style={siteNameStyle}>전체</span>
              <span style={siteCountStyle}>{orders.length}</span>
            </button>
            {siteCards.map(site => (
              <button
                key={site.id}
                type="button"
                style={{
                  ...siteCardStyle,
                  ...(selectedSiteNm === site.siteNm ? siteCardActiveStyle : {}),
                }}
                onClick={(e) => { e.currentTarget.blur(); handleSiteClick(site.siteNm); }}
              >
                <span style={siteNameStyle}>{site.siteNm}</span>
                <span style={siteCountStyle}>{site.orderCount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={dividerStyle} />

        {/* Order cards */}
        <div style={orderSectionStyle}>
          <div style={sectionHeaderStyle}>
            <span>주문</span>
          </div>
          <div style={orderListScrollStyle}>
            <OrderCardList
              orders={orders}
              selectedSiteNm={selectedSiteNm}
              selectedOrder={selectedOrder}
              onSelect={handleOrderSelect}
            />
          </div>
        </div>
      </div>

      {/* Center panel: order detail select grid (shown when order is selected) */}
      {selectedOrder && (
        <div style={centerPanelStyle}>
          <OrderDetailSelectGrid
            selectedOrder={selectedOrder}
            onSelectionChange={handleDetailSelectionChange}
          />
        </div>
      )}

      {/* Right panel: week nav + gantt */}
      <div style={rightPanelStyle}>
        {/* Week navigation */}
        <div style={weekNavRowStyle}>
          <WeekNavigation weekStart={weekStart} onChange={setWeekStart} />
          {selectedOrder && (
            <div style={selectedBadgeStyle}>
              선택: {selectedOrder.orderNo}
              {selectedDetails.length > 0 && ` (${selectedDetails.length}건)`}
            </div>
          )}
        </div>

        {/* Gantt chart */}
        <MachineGantt
          machines={machines}
          plans={plans}
          weekStart={weekStart}
          selectedOrder={selectedOrder}
          onPlanClick={handlePlanClick}
          onCellClick={handleCellClick}
        />
      </div>

      {/* Assignment modal */}
      {selectedOrder && (
        <AssignmentModal
          isOpen={modalOpen}
          order={selectedOrder}
          selectedDetails={selectedDetails}
          machines={machines}
          defaultMachineNo={modalMachineNo}
          defaultDate={modalDate}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  gap: 0,
  flex: 1,
  minHeight: 0,
  height: '100%',
};

const leftPanelStyle: CSSProperties = {
  width: 240,
  minWidth: 240,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid var(--border)',
  background: 'var(--panel)',
  borderRadius: '12px 0 0 12px',
  border: '1px solid var(--border)',
  overflow: 'hidden',
};

const siteSectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '0',
};

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '10px 12px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--text)',
  background: 'var(--panel-2)',
  borderBottom: '1px solid var(--border)',
};

const countBadgeStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
  padding: '1px 6px',
  borderRadius: 8,
};

const siteListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  padding: '6px 8px',
  maxHeight: 200,
  overflowY: 'auto',
};

const siteCardStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '7px 10px',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text)',
  background: 'transparent',
  border: '1px solid transparent',
  borderColor: 'transparent',
  borderRadius: 6,
  boxShadow: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'inherit',
  transition: 'all 0.15s',
  outline: 'none',
};

const siteCardActiveStyle: CSSProperties = {
  background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
  borderColor: 'var(--accent)',
  color: 'var(--accent)',
  fontWeight: 600,
};

const siteNameStyle: CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const siteCountStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: 'var(--text-tertiary)',
  flexShrink: 0,
};

const dividerStyle: CSSProperties = {
  height: 1,
  background: 'var(--border)',
  margin: '0',
};

const orderSectionStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
};

const orderListScrollStyle: CSSProperties = {
  flex: 1,
  overflowY: 'auto',
};

const centerPanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 300,
  maxWidth: 500,
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 12,
};

const rightPanelStyle: CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  paddingLeft: 12,
};

const weekNavRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
};

const selectedBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  padding: '4px 10px',
  borderRadius: 6,
  whiteSpace: 'nowrap',
};

export default ProductionPlanView;
