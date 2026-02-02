/**
 * Label 컴포넌트 - 폼 요소 레이블
 */

import { LabelHTMLAttributes, ReactNode } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function Label({ required = false, children, className = '', ...props }: LabelProps) {
  return (
    <label className={`text-sm font-medium text-[var(--text-secondary)] ${className}`} {...props}>
      {children}
      {required && (
        <span className="ml-1 text-[var(--error)]" aria-label="필수 항목">
          *
        </span>
      )}
    </label>
  );
}

export default Label;
