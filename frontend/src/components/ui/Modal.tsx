/**
 * Modal 컴포넌트 - 모달 다이얼로그
 */

import { useEffect, useRef, ReactNode, MouseEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

const sizeWidths: Record<string, string> = {
  sm: '600px',
  md: '760px',
  lg: '920px',
  xl: '1080px',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = '',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        padding: '10vh 16px 16px 16px',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: sizeWidths[size],
          background: 'var(--panel)',
          backdropFilter: 'blur(24px) saturate(150%)',
          WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg), inset 0 1px 0 var(--glass-highlight)',
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <h2
              id="modal-title"
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: 'var(--text)',
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            padding: '20px 24px',
            maxHeight: '72vh',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '16px 24px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
        </>
      }
    >
      <p className="text-[var(--text-secondary)]">{message}</p>
    </Modal>
  );
}

export default Modal;
