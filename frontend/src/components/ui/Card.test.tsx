import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeDefined();
  });

  it('should render title when provided', () => {
    render(<Card title="Card Title">Content</Card>);
    expect(screen.getByText('Card Title')).toBeDefined();
  });
});
