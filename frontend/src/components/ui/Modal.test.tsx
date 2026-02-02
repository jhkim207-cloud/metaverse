import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal, ConfirmModal } from './Modal';

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Content
      </Modal>
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    fireEvent.click(screen.getByLabelText('닫기'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdrop={true}>
        Content
      </Modal>
    );

    const backdrop = screen
      .getByRole('dialog')
      .parentElement?.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when backdrop is clicked and closeOnBackdrop is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdrop={false}>
        Content
      </Modal>
    );

    const backdrop = screen
      .getByRole('dialog')
      .parentElement?.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render footer when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} footer={<button>Save</button>}>
        Content
      </Modal>
    );
    expect(screen.getByText('Save')).toBeInTheDocument();
  });
});

describe('ConfirmModal', () => {
  it('should render title and message', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm"
        message="Are you sure?"
      />
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={handleConfirm}
        title="Confirm"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByText('확인'));

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={handleClose}
        onConfirm={() => {}}
        title="Confirm"
        message="Are you sure?"
      />
    );

    fireEvent.click(screen.getByText('취소'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
