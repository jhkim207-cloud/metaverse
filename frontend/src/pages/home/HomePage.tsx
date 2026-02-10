import type { LucideIcon } from 'lucide-react';
import { Factory, Package, DollarSign, Activity, MapPin } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { GreetingBanner } from './GreetingBanner';
import { WorkflowSection } from './WorkflowSection';
import { OperationCards } from './OperationCards';
import { SiteTable } from './SiteTable';

function SectionIcon({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 5,
      background: `${color}22`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Icon size={13} color={color} />
    </div>
  );
}

interface HomePageProps {
  userName: string;
  onMenuSelect: (menuCode: string) => void;
  onWidgetSelect: (widgetKey: string) => void;
}

export function HomePage({ userName, onMenuSelect: _onMenuSelect, onWidgetSelect: _onWidgetSelect }: HomePageProps) {
  const {
    productionFlow, materialFlow, salesSummary, operations, siteSummary,
    loading, error, periods, setPeriod,
  } = useDashboard();

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div className="card" style={{ padding: 16, borderLeft: '3px solid var(--error)' }}>
          <p style={{ color: 'var(--error)', fontSize: '0.875rem' }}>
            대시보드 데이터 로드 실패: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      {/* 인사말 */}
      <GreetingBanner userName={userName} />

      {/* Section 1: 생산 업무흐름 */}
      <WorkflowSection
        title="생산 업무 요약"
        icon={<SectionIcon icon={Factory} color="#3b82f6" />}
        steps={productionFlow?.steps ?? []}
        period={periods.production}
        onPeriodChange={p => setPeriod('production', p)}
        loading={loading}
      />

      {/* Section 2: 원자재 업무흐름 */}
      <WorkflowSection
        title="원자재 업무 요약"
        icon={<SectionIcon icon={Package} color="#f59e0b" />}
        steps={materialFlow?.steps ?? []}
        period={periods.material}
        onPeriodChange={p => setPeriod('material', p)}
        loading={loading}
      />

      {/* Section 3: 매출 현황 */}
      <OperationCards
        title="매출 현황"
        icon={<SectionIcon icon={DollarSign} color="#10b981" />}
        cards={salesSummary?.cards ?? []}
        period={periods.sales}
        onPeriodChange={p => setPeriod('sales', p)}
        loading={loading}
      />

      {/* Section 4: 운영 현황 */}
      <OperationCards
        icon={<SectionIcon icon={Activity} color="#ef4444" />}
        cards={operations?.cards ?? []}
        period={periods.operations}
        onPeriodChange={p => setPeriod('operations', p)}
        loading={loading}
      />

      {/* Section 5: 현장별 현황 */}
      <SiteTable
        icon={<SectionIcon icon={MapPin} color="#8b5cf6" />}
        rows={siteSummary?.rows ?? []}
        period={periods.site}
        onPeriodChange={p => setPeriod('site', p)}
        loading={loading}
      />
    </div>
  );
}
