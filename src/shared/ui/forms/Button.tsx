import React from 'react';
import { useFormStatus } from 'react-dom';
import styles from './forms.module.css';

/**
 * Props for the Button component.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'error';
  /** Manual loading state. If not provided, it will automatically use useFormStatus() pending state. */
  isLoading?: boolean;
}

/**
 * A semantic Button component with integrated React 19 form status awareness.
 */
export function Button({ 
  variant = 'primary', 
  isLoading, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const { pending } = useFormStatus();
  const loading = isLoading || pending;

  const classes = [
    styles.button,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? '...' : children}
    </button>
  );
}
