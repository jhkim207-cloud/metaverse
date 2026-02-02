import { useId, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ className = '', label, error, hint, id: propId, ...props }: InputProps) {
  const generatedId = useId();
  const id = propId || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy =
    [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`input ${error ? 'border-[var(--error)] focus:ring-[var(--error)]' : ''} ${className}`}
        {...props}
      />
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
