import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import * as reactDom from 'react-dom';

// Mock de useFormStatus
vi.mock('react-dom', async () => {
  const actual = await vi.importActual<typeof reactDom>('react-dom');
  return {
    ...actual,
    useFormStatus: vi.fn(() => ({ pending: false })),
  };
});

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('shows loading state when isLoading prop is true', () => {
    render(<Button isLoading={true}>Click me</Button>);
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state when form is pending', () => {
    vi.mocked(reactDom.useFormStatus).mockReturnValue({ 
      pending: true, 
      data: new FormData(), 
      action: '', 
      method: 'post' 
    });
    
    render(<Button>Click me</Button>);
    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="error">Delete</Button>);
    const button = container.firstChild as HTMLElement;
    expect(button.className).toContain('error');
  });
});
