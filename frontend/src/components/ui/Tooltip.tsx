/**
 * Tooltip 컴포넌트 - 도움말 툴팁
 *
 * 2025 UI 트렌드 반영:
 * - Liquid Glass 효과
 * - 부드러운 페이드/스케일 애니메이션
 * - 다양한 위치 지원
 * - 딜레이 옵션
 */

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
  ReactElement,
  MouseEvent,
  FocusEvent,
  cloneElement,
  CSSProperties,
} from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  position?: TooltipPosition;
  align?: TooltipAlign;
  delay?: number;
  disabled?: boolean;
  glass?: boolean;
  className?: string;
}

const positionStyles: Record<TooltipPosition, Record<TooltipAlign, string>> = {
  top: {
    start: 'bottom-full left-0 mb-2',
    center: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    end: 'bottom-full right-0 mb-2',
  },
  bottom: {
    start: 'top-full left-0 mt-2',
    center: 'top-full left-1/2 -translate-x-1/2 mt-2',
    end: 'top-full right-0 mt-2',
  },
  left: {
    start: 'right-full top-0 mr-2',
    center: 'right-full top-1/2 -translate-y-1/2 mr-2',
    end: 'right-full bottom-0 mr-2',
  },
  right: {
    start: 'left-full top-0 ml-2',
    center: 'left-full top-1/2 -translate-y-1/2 ml-2',
    end: 'left-full bottom-0 ml-2',
  },
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--panel)] border-x-transparent border-b-transparent',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--panel)] border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--panel)] border-y-transparent border-r-transparent',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-[var(--panel)] border-y-transparent border-l-transparent',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  align = 'center',
  delay = 200,
  disabled = false,
  glass = true,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const showTooltip = useCallback(() => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(() => setIsAnimating(true));
    }, delay);
  }, [delay, disabled]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const childWithProps = cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: (e: MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: FocusEvent) => {
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: FocusEvent) => {
      hideTooltip();
      children.props.onBlur?.(e);
    },
    'aria-describedby': isVisible ? 'tooltip' : undefined,
  });

  // 위치별 스타일 계산
  const getPositionStyle = (): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      zIndex: 9999,
    };

    switch (position) {
      case 'top':
        return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 };
      case 'bottom':
        return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 };
      case 'left':
        return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 };
      case 'right':
        return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 };
      default:
        return base;
    }
  };

  const tooltipStyle: CSSProperties = {
    ...getPositionStyle(),
    padding: '8px 12px',
    fontSize: '13px',
    color: 'var(--text)',
    background: glass ? 'var(--panel)' : 'var(--panel-solid)',
    backdropFilter: glass ? 'blur(20px) saturate(180%)' : undefined,
    WebkitBackdropFilter: glass ? 'blur(20px) saturate(180%)' : undefined,
    border: '1px solid var(--border)',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
    boxShadow: 'var(--shadow-md), inset 0 1px 0 var(--glass-highlight)',
    opacity: isAnimating ? 1 : 0,
    transform: `${getPositionStyle().transform || ''} scale(${isAnimating ? 1 : 0.95})`,
    transition: 'opacity 0.15s ease, transform 0.15s cubic-bezier(0.32, 0.72, 0, 1)',
    pointerEvents: 'none',
  };

  // 화살표 스타일
  const getArrowStyle = (): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderWidth: 6,
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderColor: 'var(--panel) transparent transparent transparent',
        };
      case 'bottom':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderColor: 'transparent transparent var(--panel) transparent',
        };
      case 'left':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderColor: 'transparent transparent transparent var(--panel)',
        };
      case 'right':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderColor: 'transparent var(--panel) transparent transparent',
        };
      default:
        return base;
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {childWithProps}
      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          style={tooltipStyle}
          className={className}
        >
          {content}
          {/* Arrow */}
          <span style={getArrowStyle()} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

// IconTooltip - 아이콘 버튼용 간편 툴팁
interface IconTooltipProps {
  label: string;
  children: ReactElement;
  position?: TooltipPosition;
}

export function IconTooltip({ label, children, position = 'top' }: IconTooltipProps) {
  return (
    <Tooltip content={label} position={position}>
      {cloneElement(children, {
        'aria-label': label,
      })}
    </Tooltip>
  );
}

export default Tooltip;
