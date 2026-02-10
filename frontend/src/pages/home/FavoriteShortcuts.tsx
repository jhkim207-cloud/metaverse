import {
  ShoppingCart, ClipboardList, Calendar, BarChart3,
  Wrench, Truck, Handshake, AlertTriangle,
} from 'lucide-react';

interface FavoriteShortcutsProps {
  onMenuSelect: (menuCode: string) => void;
}

const FAVORITES = [
  { code: 'PROD_SALES_ORDER', name: '수주 관리', icon: ShoppingCart },
  { code: 'PROD_ORDER', name: '작업 의뢰', icon: ClipboardList },
  { code: 'PROD_PLAN', name: '생산 계획', icon: Calendar },
  { code: 'PROD_RESULT', name: '생산 실적', icon: BarChart3 },
  { code: 'PROD_WORK_ORDER', name: '재단 일보', icon: Wrench },
  { code: 'PROD_SHIPPING', name: '출고 관리', icon: Truck },
  { code: 'PROD_SUBCONTRACT', name: '외주 발주', icon: Handshake },
  { code: 'PROD_DEFECT', name: '미출고현황', icon: AlertTriangle },
];

export function FavoriteShortcuts({ onMenuSelect }: FavoriteShortcutsProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
          즐겨찾기
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          ({FAVORITES.length})
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10 }}>
        {FAVORITES.map(fav => {
          const Icon = fav.icon;
          return (
            <button
              key={fav.code}
              onClick={() => onMenuSelect(fav.code)}
              className="card"
              style={{
                padding: '16px 8px', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'var(--panel)', transition: 'all 0.2s',
                fontSize: '0.75rem', fontWeight: 500, color: 'var(--text)',
                borderRadius: 12, minHeight: 80,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              {fav.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
