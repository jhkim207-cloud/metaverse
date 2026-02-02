/**
 * Radio 컴포넌트 - Liquid Glass 스타일
 */

import { useId, CSSProperties } from 'react';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Radio({
  name,
  value,
  onChange,
  options,
  disabled = false,
  orientation = 'vertical',
  className = '',
}: RadioProps) {
  const groupId = useId();

  const containerStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexDirection: orientation === 'vertical' ? 'column' : 'row',
    flexWrap: orientation === 'horizontal' ? 'wrap' : undefined,
  };

  const getRadioStyle = (isChecked: boolean, isDisabled: boolean): CSSProperties => ({
    position: 'relative',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    border: `2px solid ${isChecked ? 'var(--accent)' : 'var(--border-input)'}`,
    background: 'var(--input-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    transition: 'all 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isChecked
      ? '0 0 0 3px rgba(30, 58, 95, 0.15), inset 0 1px 2px rgba(0,0,0,0.1)'
      : 'inset 0 1px 2px rgba(0,0,0,0.1)',
  });

  const innerDotStyle: CSSProperties = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    animation: 'scaleIn 0.15s ease-out',
  };

  const labelStyle = (isDisabled: boolean): CSSProperties => ({
    fontSize: '14px',
    color: 'var(--text)',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.5 : 1,
    userSelect: 'none',
  });

  return (
    <div role="radiogroup" aria-label={name} style={containerStyle} className={className}>
      {options.map((option) => {
        const optionId = `${groupId}-${option.value}`;
        const isChecked = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <div key={option.value} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <button
              id={optionId}
              type="button"
              role="radio"
              aria-checked={isChecked}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(option.value)}
              style={getRadioStyle(isChecked, isDisabled ?? false)}
            >
              {isChecked && <span style={innerDotStyle} />}
            </button>
            <label htmlFor={optionId} style={labelStyle(isDisabled ?? false)}>
              {option.label}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default Radio;
