/**
 * FormField 컴포넌트 - 폼 필드 래퍼
 */

import { useId, ReactElement, cloneElement } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactElement;
  className?: string;
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
}: FormFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const childWithProps = cloneElement(children, {
    id,
    'aria-invalid': !!error,
    'aria-describedby':
      [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined,
  });

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {required && (
          <span className="ml-1 text-[var(--error)]" aria-label="필수 항목">
            *
          </span>
        )}
      </label>
      {childWithProps}
      {hint && !error && (
        <span id={hintId} className="text-xs text-[var(--text-tertiary)]">
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-xs text-[var(--error)]" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
