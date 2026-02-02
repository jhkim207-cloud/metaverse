/**
 * ErrorBoundary 컴포넌트 - 에러 경계
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  onReset,
  title = '오류가 발생했습니다',
  description = '예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.',
}: ErrorFallbackProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center p-8 text-center">
      <div
        className="
          w-16 h-16 mb-4
          flex items-center justify-center
          rounded-full
          bg-[var(--error)]/10
        "
      >
        <AlertTriangle size={32} className="text-[var(--error)]" />
      </div>

      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">{description}</p>

      {error && import.meta.env.MODE === 'development' && (
        <details className="mb-4 text-left w-full max-w-md">
          <summary className="text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--text)]">
            오류 상세 정보
          </summary>
          <pre className="mt-2 p-3 bg-[var(--panel-2)] rounded-lg text-xs text-[var(--error)] overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}

      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          <RefreshCw size={16} />
          다시 시도
        </Button>
      )}
    </div>
  );
}

export default ErrorBoundary;
