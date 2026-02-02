/**
 * SegmentedControl 컴포넌트 - 세그먼트 선택 컨트롤
 *
 * 2025 UI 트렌드 반영:
 * - Liquid Glass 효과
 * - 부드러운 슬라이드 애니메이션
 * - 다크/라이트 모드 지원
 */

import { useState, useRef, useEffect, CSSProperties } from 'react';

export interface SegmentOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const sizeStyles: Record<string, { padding: string; fontSize: string; height: string }> = {
  sm: { padding: '4px 12px', fontSize: '12px', height: '28px' },
  md: { padding: '6px 16px', fontSize: '13px', height: '32px' },
  lg: { padding: '8px 20px', fontSize: '14px', height: '40px' },
};

export function SegmentedControl({
  options,
  value,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}: SegmentedControlProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const activeIndex = options.findIndex((opt) => opt.value === value);
    if (activeIndex === -1) return;

    const buttons = containerRef.current.querySelectorAll('button');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setIndicatorStyle({
        width: activeButton.offsetWidth,
        transform: `translateX(${activeButton.offsetLeft - 4}px)`,
      });
    }
  }, [value, options]);

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    position: 'relative',
    padding: '4px',
    background: 'rgba(120, 120, 128, 0.12)',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    gap: '2px',
  };

  const indicatorBaseStyle: CSSProperties = {
    position: 'absolute',
    top: '4px',
    left: '4px',
    height: `calc(100% - 8px)`,
    background: 'var(--accent)',
    borderRadius: '8px',
    transition: 'transform 0.2s cubic-bezier(0.32, 0.72, 0, 1), width 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    ...indicatorStyle,
  };

  const getButtonStyle = (isActive: boolean, isDisabled: boolean): CSSProperties => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: sizeStyles[size].height,
    padding: sizeStyles[size].padding,
    fontSize: sizeStyles[size].fontSize,
    fontWeight: 500,
    color: isActive ? 'var(--on-accent)' : 'var(--text-secondary)',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'color 0.15s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={className}
      role="tablist"
    >
      {/* Active Indicator */}
      <div style={indicatorBaseStyle} aria-hidden="true" />

      {/* Segment Buttons */}
      {options.map((option) => {
        const isActive = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive ? 'true' : 'false'}
            aria-disabled={isDisabled ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={() => !isDisabled && onChange(option.value)}
            style={getButtonStyle(isActive, !!isDisabled)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
