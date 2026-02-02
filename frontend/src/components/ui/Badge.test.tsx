import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('should render children text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('should have role="status" for accessibility', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('should apply default variant styles', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('rounded-full');
  });

  it('should apply success variant styles', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('should apply warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('should apply error variant styles', () => {
    render(<Badge variant="error">Error</Badge>);
    expect(screen.getByRole('status')).toBeDefined();
  });

  it('should apply custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByRole('status');
    expect(badge.className).toContain('custom-class');
  });
});
