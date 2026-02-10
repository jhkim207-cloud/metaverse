import { Settings } from 'lucide-react';

interface GreetingBannerProps {
  userName: string;
}

export function GreetingBanner({ userName }: GreetingBannerProps) {
  const now = new Date();
  const weekOfMonth = Math.ceil(now.getDate() / 7);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
            {userName}님. {now.getFullYear()}년 {now.getMonth() + 1}월 {weekOfMonth}째주예요.
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            수주/구매발주/생산/출고/재고/매출 현황을 한눈에
          </p>
        </div>
        <span
          className="badge"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 12px', borderRadius: 8,
            background: 'var(--panel-2)', color: 'var(--text-secondary)',
            fontSize: '0.75rem', fontWeight: 500,
          }}
        >
          <Settings size={14} />
          {userName}
        </span>
      </div>
    </div>
  );
}
