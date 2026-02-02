/**
 * Sidebar 컴포넌트 - 사이드바 네비게이션
 */

import { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  activeId?: string;
  onItemClick?: (item: SidebarItem) => void;
  header?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function Sidebar({
  items,
  activeId,
  onItemClick,
  header,
  footer,
  collapsed = false,
  className = '',
}: SidebarProps) {
  const renderItem = (item: SidebarItem, level = 0) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const paddingLeft = level * 12 + 14;

    const handleClick = () => {
      if (item.disabled) return;
      if (item.onClick) item.onClick();
      if (onItemClick) onItemClick(item);
    };

    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={handleClick}
          disabled={item.disabled}
          aria-current={isActive ? 'page' : undefined}
          className={`
            w-full text-left
            py-2.5 px-3.5 rounded-xl
            flex items-center gap-2.5
            text-sm font-medium
            transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${
              isActive
                ? 'bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_4px_12px_var(--accent-glow)]'
                : 'text-[var(--text)] hover:bg-[var(--hover-bg)] hover:translate-x-0.5'
            }
            ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          style={{ paddingLeft: collapsed ? undefined : paddingLeft }}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          {!collapsed && <span className="truncate">{item.label}</span>}
        </button>
        {hasChildren && !collapsed && (
          <ul className="mt-1 space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`
        flex flex-col h-full
        bg-[var(--panel)]
        backdrop-blur-xl saturate-150
        border-r border-[var(--border)]
        ${collapsed ? 'w-16' : 'w-64'}
        transition-all duration-300
        ${className}
      `}
      style={{ boxShadow: 'inset -1px 0 0 var(--glass-highlight)' }}
    >
      {/* Header */}
      {header && <div className="px-4 py-4 border-b border-[var(--border)]">{header}</div>}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3" aria-label="사이드바 네비게이션">
        <ul className="space-y-1">{items.map((item) => renderItem(item))}</ul>
      </nav>

      {/* Footer */}
      {footer && <div className="px-4 py-4 border-t border-[var(--border)]">{footer}</div>}
    </aside>
  );
}

export default Sidebar;
