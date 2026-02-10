import { X } from 'lucide-react';

interface DashboardDetailProps {
  widgetKey: string;
  onClose: () => void;
}

const WIDGET_INFO: Record<string, { title: string; description: string }> = {
  'production-flow': { title: '생산 업무흐름 상세', description: '수주 → 작업지시 → 생산계획 → 생산실적 → 출고실적 → 재고현황의 전체 흐름을 표시합니다.' },
  'material-flow': { title: '원자재 업무흐름 상세', description: '원자재 발주 → 입고확인 → 재고현황의 전체 흐름을 표시합니다.' },
  'operations': { title: '운영 현황 상세', description: '외주발주, 미출고, 인원, 재단일보, 호기별 현황을 표시합니다.' },
  'site-summary': { title: '현장별 현황 상세', description: '현장별 수주, 생산, 출고, 미출고 현황을 상세히 표시합니다.' },
};

export function DashboardDetail({ widgetKey, onClose }: DashboardDetailProps) {
  const info = WIDGET_INFO[widgetKey] || { title: '상세 정보', description: '' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          flexShrink: 0,
          padding: '12px 20px',
          background: 'var(--panel)',
          backdropFilter: 'var(--blur-md) var(--saturate)',
          WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
          {info.title}
        </h3>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--btn-bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
        <div className="card" style={{ padding: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            {info.description}
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, opacity: 0.7 }}>
            상세 데이터 테이블은 추후 구현됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
