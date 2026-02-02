import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render label when provided', () => {
    render(<Input label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should associate label with input', () => {
    render(<Input label="Email" />);
    const input = screen.getByRole('textbox');
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('should display error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('should have aria-invalid when error exists', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should display hint text', () => {
    render(<Input hint="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('should hide hint when error is shown', () => {
    render(<Input hint="Hint text" error="Error text" />);
    expect(screen.queryByText('Hint text')).not.toBeInTheDocument();
    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
