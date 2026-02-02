/**
 * Toast 컴포넌트 - 알림 토스트
 *
 * 2025 UI 트렌드 반영:
 * - Liquid Glass 효과
 * - 부드러운 슬라이드 애니메이션
 * - 자동 닫힘 프로그레스 바
 * - 액션 버튼 지원
 */

import { useEffect, useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: ToastAction;
  dismissible?: boolean;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

const typeStyles: Record<ToastType, string> = {
  success: 'border-[var(--success)]/30 text-[var(--success)]',
  error: 'border-[var(--error)]/30 text-[var(--error)]',
  warning: 'border-[var(--warning)]/30 text-[var(--warning)]',
  info: 'border-[var(--info)]/30 text-[var(--info)]',
};

const progressStyles: Record<ToastType, string> = {
  success: 'bg-[var(--success)]',
  error: 'bg-[var(--error)]',
  warning: 'bg-[var(--warning)]',
  info: 'bg-[var(--info)]',
};

export function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  action,
  dismissible = true,
  onDismiss,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => onDismiss(id), 200);
  }, [id, onDismiss]);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (duration === 0 || isPaused) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        handleDismiss();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, isPaused, handleDismiss]);

  return (
    <div
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        relative w-full max-w-sm overflow-hidden
        bg-[var(--panel)]/90 backdrop-blur-xl saturate-150
        border ${typeStyles[type]}
        rounded-2xl shadow-lg
        transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}
      `}
      style={{
        boxShadow: 'var(--shadow-lg), inset 0 1px 0 var(--glass-highlight)',
      }}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <span className={`flex-shrink-0 ${typeStyles[type]}`}>{icons[type]}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-[var(--text)] text-sm mb-0.5">{title}</p>}
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={`
                mt-2 text-sm font-medium
                ${typeStyles[type]}
                hover:underline focus:outline-none
              `}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="닫기"
            className="flex-shrink-0 p-1 rounded-lg hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--border)]">
          <div
            className={`h-full ${progressStyles[type]} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// Toast Container & Context
interface ToastContextValue {
  toast: (data: Omit<ToastData, 'id'>) => void;
  success: (message: string, options?: Partial<ToastData>) => void;
  error: (message: string, options?: Partial<ToastData>) => void;
  warning: (message: string, options?: Partial<ToastData>) => void;
  info: (message: string, options?: Partial<ToastData>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const toast = useCallback(
    (data: Omit<ToastData, 'id'>) => {
      const id = generateId();
      setToasts((prev) => {
        const newToasts = [...prev, { ...data, id }];
        return newToasts.slice(-maxToasts);
      });
    },
    [maxToasts]
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const createToastHelper =
    (type: ToastType) => (message: string, options?: Partial<ToastData>) => {
      toast({ type, message, ...options });
    };

  const value: ToastContextValue = {
    toast,
    success: createToastHelper('success'),
    error: createToastHelper('error'),
    warning: createToastHelper('warning'),
    info: createToastHelper('info'),
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div
        className={`fixed z-[100] flex flex-col gap-2 ${positionStyles[position]}`}
        aria-label="알림"
      >
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default Toast;
