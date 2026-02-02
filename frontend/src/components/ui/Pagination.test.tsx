import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('should render page numbers', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByLabelText('1 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('5 페이지')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByLabelText('3 페이지')).toHaveAttribute('aria-current', 'page');
  });

  it('should call onPageChange when page is clicked', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByLabelText('3 페이지'));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange with next page when next button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByLabelText('다음 페이지'));

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange with previous page when prev button is clicked', () => {
    const handlePageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handlePageChange} />);

    fireEvent.click(screen.getByLabelText('이전 페이지'));

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('should disable prev button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByLabelText('이전 페이지')).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);

    expect(screen.getByLabelText('다음 페이지')).toBeDisabled();
  });

  it('should show first/last buttons when showFirstLast is true', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} showFirstLast={true} />
    );

    expect(screen.getByLabelText('첫 페이지')).toBeInTheDocument();
    expect(screen.getByLabelText('마지막 페이지')).toBeInTheDocument();
  });

  it('should hide first/last buttons when showFirstLast is false', () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} showFirstLast={false} />
    );

    expect(screen.queryByLabelText('첫 페이지')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('마지막 페이지')).not.toBeInTheDocument();
  });
});
