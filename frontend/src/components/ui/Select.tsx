/**
 * Select 컴포넌트 - 드롭다운 선택
 */

import { useId, CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = '선택하세요',
  disabled = false,
  label,
  error,
  className = '',
}: SelectProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '200px',
  };

  const labelStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
  };

  const selectWrapperStyle: CSSProperties = {
    position: 'relative',
  };

  const selectStyle: CSSProperties = {
    width: '100%',
    padding: '10px 40px 10px 12px',
    fontSize: '14px',
    color: 'var(--text)',
    background: 'var(--input-bg)',
    border: `1px solid ${error ? 'var(--error)' : 'var(--border-input)'}`,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    outline: 'none',
  };

  const iconStyle: CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-secondary)',
    pointerEvents: 'none',
  };

  const errorStyle: CSSProperties = {
    fontSize: '12px',
    color: 'var(--error)',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && (
        <label htmlFor={id} style={labelStyle}>
          {label}
        </label>
      )}
      <div style={selectWrapperStyle}>
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          style={selectStyle}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} style={iconStyle} />
      </div>
      {error && (
        <span id={errorId} style={errorStyle} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default Select;
