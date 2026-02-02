/**
 * 포맷팅 유틸리티
 */

/**
 * 숫자를 천단위 콤마 포맷으로 변환
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '';
  return value.toLocaleString('ko-KR');
}

/**
 * 금액 포맷 (원)
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '';
  return `${formatNumber(value)}원`;
}

/**
 * 날짜 포맷 (YYYY-MM-DD)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * 날짜시간 포맷 (YYYY-MM-DD HH:mm)
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 전화번호 포맷
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}
