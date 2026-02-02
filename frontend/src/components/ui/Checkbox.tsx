/**
 * Checkbox 컴포넌트 - Liquid Glass 스타일
 */

import { useId, CSSProperties } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  indeterminate?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  label,
  indeterminate = false,
  className = '',
}: CheckboxProps) {
  const id = useId();

  const isActive = checked || indeterminate;

  const checkboxStyle: CSSProperties = {
    position: 'relative',
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: `2px solid ${isActive ? 'var(--accent)' : 'var(--border-input)'}`,
    background: isActive ? 'var(--accent)' : 'var(--input-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isActive
      ? '0 0 0 3px rgba(30, 58, 95, 0.15), inset 0 1px 2px rgba(0,0,0,0.1)'
      : 'inset 0 1px 2px rgba(0,0,0,0.1)',
  };

  const checkIconStyle: CSSProperties = {
    color: 'white',
    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
  };

  const indeterminateStyle: CSSProperties = {
    width: '10px',
    height: '2px',
    background: 'white',
    borderRadius: '1px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    color: 'var(--text)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    userSelect: 'none',
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }} className={className}>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={checkboxStyle}
      >
        {checked && <Check size={14} style={checkIconStyle} strokeWidth={3} />}
        {indeterminate && !checked && <div style={indeterminateStyle} />}
      </button>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
    </div>
  );
}

export default Checkbox;
