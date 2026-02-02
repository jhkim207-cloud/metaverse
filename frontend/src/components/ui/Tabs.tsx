/**
 * Tabs 컴포넌트 - 탭 네비게이션
 *
 * 2025 UI 트렌드 반영:
 * - Liquid Glass 효과
 * - Spatial Depth 그림자
 * - 부드러운 전환 애니메이션
 */

import { ReactNode, CSSProperties } from 'react';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
}: TabsProps) {
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    gap: variant === 'pills' ? '8px' : '4px',
    padding: '6px',
    background: 'var(--panel-2)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    ...(fullWidth && { display: 'flex', width: '100%' }),
  };

  const sizeConfig = {
    sm: { fontSize: '12px', padding: '6px 12px', gap: '6px', iconSize: 14 },
    md: { fontSize: '13px', padding: '8px 16px', gap: '8px', iconSize: 16 },
    lg: { fontSize: '14px', padding: '10px 20px', gap: '10px', iconSize: 18 },
  };

  const config = sizeConfig[size];

  const getTabStyle = (isActive: boolean, isDisabled: boolean): CSSProperties => {
    const baseStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: config.gap,
      padding: config.padding,
      fontSize: config.fontSize,
      fontWeight: 500,
      borderRadius: variant === 'pills' ? '100px' : '12px',
      border: 'none',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.4 : 1,
      transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
      ...(fullWidth && { flex: 1 }),
    };

    if (variant === 'pills') {
      if (isActive) {
        return {
          ...baseStyle,
          background: 'var(--accent)',
          color: 'var(--on-accent)',
          boxShadow: '0 4px 12px rgba(0, 113, 227, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
        };
      }
      return {
        ...baseStyle,
        background: 'transparent',
        color: 'var(--text-secondary)',
      };
    }

    // Default variant
    if (isActive) {
      return {
        ...baseStyle,
        background: 'var(--panel-solid, #ffffff)',
        color: 'var(--text)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      };
    }

    return {
      ...baseStyle,
      background: 'transparent',
      color: 'var(--text-secondary)',
    };
  };

  return (
    <div
      role="tablist"
      aria-label="탭 목록"
      style={containerStyle}
      className={className}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isDisabled = !!tab.disabled;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(tab.id)}
            style={getTabStyle(isActive, isDisabled)}
            onMouseEnter={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                style={{
                  marginLeft: '4px',
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '100px',
                  background: isActive
                    ? variant === 'pills'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 113, 227, 0.1)'
                    : 'var(--panel-2)',
                  color: isActive
                    ? variant === 'pills'
                      ? '#fff'
                      : 'var(--accent)'
                    : 'var(--text-tertiary)',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  activeTab: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, activeTab, children, className = '' }: TabPanelProps) {
  if (activeTab !== id) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={className}
      style={{
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {children}
    </div>
  );
}

export default Tabs;
