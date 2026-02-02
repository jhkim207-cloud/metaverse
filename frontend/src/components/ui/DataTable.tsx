/**
 * DataTable 컴포넌트 - 데이터 테이블
 */

import { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  sortState?: SortState;
  onSort?: (key: string) => void;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = '데이터가 없습니다.',
  sortState,
  onSort,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  const getCellValue = (row: T, key: keyof T | string): unknown => {
    if (typeof key === 'string' && key.includes('.')) {
      return key.split('.').reduce<unknown>((obj, k) => {
        if (obj && typeof obj === 'object' && k in obj) {
          return (obj as Record<string, unknown>)[k];
        }
        return undefined;
      }, row);
    }
    return row[key as keyof T];
  };

  const renderSortIcon = (columnKey: string) => {
    if (!sortState || sortState.key !== columnKey) {
      return <span className="w-4" />;
    }
    return sortState.direction === 'asc' ? (
      <ChevronUp size={16} className="text-[var(--accent)]" />
    ) : (
      <ChevronDown size={16} className="text-[var(--accent)]" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className={`overflow-x-auto rounded-xl border border-[var(--border)] ${className}`}>
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                style={{ width: column.width }}
                className={column.sortable && onSort ? 'cursor-pointer select-none' : ''}
                onClick={() => column.sortable && onSort?.(String(column.key))}
                aria-sort={
                  sortState?.key === column.key
                    ? sortState.direction === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                <div className="flex items-center gap-1">
                  <span>{column.header}</span>
                  {column.sortable && renderSortIcon(String(column.key))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={keyExtractor(row, rowIndex)}
              onClick={() => onRowClick?.(row, rowIndex)}
              className={onRowClick ? 'cursor-pointer' : ''}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onRowClick(row, rowIndex);
                }
              }}
            >
              {columns.map((column) => {
                const value = getCellValue(row, column.key);
                return (
                  <td key={String(column.key)}>
                    {column.render ? column.render(value, row, rowIndex) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
