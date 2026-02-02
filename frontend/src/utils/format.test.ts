import { describe, it, expect } from 'vitest';
import { formatNumber, formatCurrency, formatDate, formatPhone } from './format';

describe('formatNumber', () => {
  it('should format number with comma separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should return empty string for null/undefined', () => {
    expect(formatNumber(null)).toBe('');
    expect(formatNumber(undefined)).toBe('');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('should format currency with 원 suffix', () => {
    expect(formatCurrency(1000)).toBe('1,000원');
    expect(formatCurrency(50000)).toBe('50,000원');
  });

  it('should return empty string for null/undefined', () => {
    expect(formatCurrency(null)).toBe('');
    expect(formatCurrency(undefined)).toBe('');
  });
});

describe('formatDate', () => {
  it('should format Date object to YYYY-MM-DD', () => {
    const date = new Date('2024-03-15T10:30:00Z');
    expect(formatDate(date)).toBe('2024-03-15');
  });

  it('should format date string to YYYY-MM-DD', () => {
    expect(formatDate('2024-03-15T10:30:00Z')).toBe('2024-03-15');
  });

  it('should return empty string for null/undefined', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('formatPhone', () => {
  it('should format 11-digit phone number', () => {
    expect(formatPhone('01012345678')).toBe('010-1234-5678');
  });

  it('should format 10-digit phone number', () => {
    // Current implementation uses 3-3-4 pattern for 10-digit numbers
    expect(formatPhone('0311234567')).toBe('031-123-4567');
  });

  it('should return original for other formats', () => {
    expect(formatPhone('123')).toBe('123');
  });

  it('should return empty string for null/undefined', () => {
    expect(formatPhone(null)).toBe('');
    expect(formatPhone(undefined)).toBe('');
  });
});
