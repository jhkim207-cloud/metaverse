/**
 * LoadingSpinner 컴포넌트 - 로딩 인디케이터
 */

import { Loader2 } from 'lucide-react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  label?: string;
  className?: string;
}

const sizeStyles: Record<SpinnerSize, { icon: number; text: string }> = {
  sm: { icon: 16, text: 'text-xs' },
  md: { icon: 24, text: 'text-sm' },
  lg: { icon: 32, text: 'text-base' },
  xl: { icon: 48, text: 'text-lg' },
};

export function LoadingSpinner({ size = 'md', label, className = '' }: LoadingSpinnerProps) {
  const { icon, text } = sizeStyles[size];

  return (
    <div
      role="status"
      aria-label={label || '로딩 중'}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <Loader2 size={icon} className="animate-spin text-[var(--accent)]" aria-hidden="true" />
      {label && <span className={`${text} text-[var(--text-secondary)]`}>{label}</span>}
      <span className="sr-only">{label || '로딩 중'}</span>
    </div>
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  label?: string;
  blur?: boolean;
}

export function LoadingOverlay({
  visible,
  label = '로딩 중...',
  blur = true,
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/20
        ${blur ? 'backdrop-blur-sm' : ''}
      `}
      role="alert"
      aria-busy="true"
    >
      <div
        className="
          flex flex-col items-center gap-4 p-6
          bg-[var(--panel)] rounded-2xl
          border border-[var(--border)]
          shadow-lg
          backdrop-blur-xl saturate-150
        "
      >
        <LoadingSpinner size="lg" />
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;
