/**
 * Switch 컴포넌트 - iOS 스타일 토글
 */

import { useId, KeyboardEvent, CSSProperties } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  className = '',
}: SwitchProps) {
  const id = useId();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onChange(!checked);
      }
    }
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    width: '52px',
    height: '32px',
    padding: 0,
    border: 'none',
    borderRadius: '16px',
    background: checked
      ? 'var(--accent)'
      : 'rgba(120, 120, 128, 0.32)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
    boxShadow: checked
      ? '0 0 0 3px rgba(30, 58, 95, 0.15), inset 0 2px 4px rgba(0,0,0,0.1)'
      : 'inset 0 2px 4px rgba(0,0,0,0.15), inset 0 0 0 1px var(--border)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
  };

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: '3px',
    left: '3px',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)',
    transform: checked ? 'translateX(20px)' : 'translateX(0)',
    transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    userSelect: 'none',
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }} className={className}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={handleKeyDown}
        style={trackStyle}
      >
        <span style={thumbStyle} />
      </button>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
    </div>
  );
}

export default Switch;
