/**
 * 공통 API 타입 정의
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  errorCode: string | null;
}

export interface PageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface SelectOption {
  value: string | number;
  label: string;
}
