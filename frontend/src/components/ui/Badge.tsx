/**
 * Badge 컴포넌트 - 상태 표시용 배지
 *
 * 2025 UI 트렌드 반영:
 * - Liquid Glass 효과
 * - Dot indicator 옵션
 * - Pulse 애니메이션
 * - 아이콘 지원
 */

import { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
  icon?: ReactNode;
  dot?: boolean;
  pulse?: boolean;
  glass?: boolean;
  outline?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { base: string; glass: string; outline: string }> = {
  default: {
    base: 'bg-[var(--panel-2)] text-[var(--muted)] border-[var(--border)]',
    glass: 'bg-[var(--panel)]/60 text-[var(--text)] border-white/10',
    outline: 'bg-transparent text-[var(--muted)] border-[var(--border)]',
  },
  success: {
    base: 'bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30',
    glass: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    outline: 'bg-transparent text-[var(--success)] border-[var(--success)]',
  },
  warning: {
    base: 'bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30',
    glass: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    outline: 'bg-transparent text-[var(--warning)] border-[var(--warning)]',
  },
  error: {
    base: 'bg-[var(--error)]/15 text-[var(--error)] border-[var(--error)]/30',
    glass: 'bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20',
    outline: 'bg-transparent text-[var(--error)] border-[var(--error)]',
  },
  info: {
    base: 'bg-[var(--info)]/15 text-[var(--info)] border-[var(--info)]/30',
    glass: 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/20',
    outline: 'bg-transparent text-[var(--info)] border-[var(--info)]',
  },
  premium: {
    base: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
    glass: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-400/20',
    outline: 'bg-transparent text-amber-500 border-amber-500',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

const dotColorStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--muted)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  error: 'bg-[var(--error)]',
  info: 'bg-[var(--info)]',
  premium: 'bg-amber-500',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  icon,
  dot = false,
  pulse = false,
  glass = false,
  outline = false,
  className = '',
}: BadgeProps) {
  const styleType = outline ? 'outline' : glass ? 'glass' : 'base';
  const variantStyle = variantStyles[variant][styleType];

  // Dot-only badge (no children)
  if (dot && !children && !icon) {
    return (
      <span
        className={`
          relative inline-flex
          ${dotSizeStyles[size]}
          ${className}
        `}
        role="status"
      >
        <span
          className={`
            absolute inset-0 rounded-full
            ${dotColorStyles[variant]}
            ${pulse ? 'animate-ping opacity-75' : ''}
          `}
        />
        <span
          className={`
            relative inline-flex rounded-full
            ${dotSizeStyles[size]}
            ${dotColorStyles[variant]}
          `}
        />
      </span>
    );
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium rounded-full border
        transition-all duration-200
        ${sizeStyles[size]}
        ${variantStyle}
        ${glass ? 'backdrop-blur-md saturate-150 shadow-sm' : ''}
        ${className}
      `}
      role="status"
    >
      {dot && (
        <span className="relative flex">
          {pulse && (
            <span
              className={`
                absolute inline-flex rounded-full opacity-75 animate-ping
                ${dotSizeStyles[size]}
                ${dotColorStyles[variant]}
              `}
            />
          )}
          <span
            className={`
              relative inline-flex rounded-full
              ${dotSizeStyles[size]}
              ${dotColorStyles[variant]}
            `}
          />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
