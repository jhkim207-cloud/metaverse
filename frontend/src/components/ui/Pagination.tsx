/**
 * Pagination 컴포넌트 - 페이지네이션
 */

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  className?: string;
}

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number
): (number | 'ellipsis')[] {
  const totalNumbers = siblingCount * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages <= totalBlocks) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [1, 'ellipsis', ...middleRange, 'ellipsis', totalPages];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  className = '',
}: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages, siblingCount);

  const buttonClass = `
    btn-icon w-9 h-9
    bg-[var(--panel)] border border-[var(--border)]
    rounded-lg transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:bg-[var(--hover-bg)]
  `;

  const activeClass = `
    bg-[var(--accent)] text-[var(--on-accent)]
    border-[var(--accent)] hover:bg-[var(--accent-hover)]
  `;

  return (
    <nav aria-label="페이지 탐색" className={`flex items-center gap-1 ${className}`}>
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="첫 페이지"
          className={buttonClass}
        >
          <ChevronsLeft size={18} />
        </button>
      )}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
        className={buttonClass}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-[var(--text-secondary)]">
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`${page} 페이지`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`${buttonClass} ${currentPage === page ? activeClass : ''}`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
        className={buttonClass}
      >
        <ChevronRight size={18} />
      </button>
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="마지막 페이지"
          className={buttonClass}
        >
          <ChevronsRight size={18} />
        </button>
      )}
    </nav>
  );
}

export default Pagination;
