/**
 * Header 컴포넌트 - 페이지 헤더
 */

import { ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  leftContent,
  rightContent,
  onMenuClick,
  showMenuButton = false,
  className = '',
}: HeaderProps) {
  return (
    <header
      className={`
        flex items-center justify-between gap-4
        px-4 py-3
        bg-[var(--header)]
        backdrop-blur-xl saturate-150
        border-b border-[var(--border)]
        ${className}
      `}
      style={{ boxShadow: 'inset 0 -1px 0 var(--glass-highlight)' }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {showMenuButton && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="메뉴 열기"
            className="btn-icon w-10 h-10 md:hidden hover:bg-[var(--hover-bg)] rounded-xl"
          >
            <Menu size={20} />
          </button>
        )}

        {leftContent}

        {(title || subtitle) && (
          <div className="flex flex-col">
            {title && (
              <h1 className="text-lg font-semibold text-[var(--text)] leading-tight">{title}</h1>
            )}
            {subtitle && <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right Section */}
      {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
    </header>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {breadcrumb}
      <div className="page-title">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export default Header;
