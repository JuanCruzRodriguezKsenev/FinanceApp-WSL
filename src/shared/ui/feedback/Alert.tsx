import React from 'react';
import styles from './feedback.module.css';

/**
 * Props for the Alert component.
 */
interface AlertProps {
  /** Alert type: success for positive feedback, error for problems */
  type: 'success' | 'error';
  /** Optional bold title for the alert */
  title?: string;
  /** Main message or content of the alert */
  children: React.ReactNode;
  /** Optional technical details (e.g. circuit breaker status, error codes) */
  details?: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * A component to display feedback messages to the user.
 * Supports success and error states with a clean, semantic design.
 */
export function Alert({ type, title, children, details, className = '' }: AlertProps) {
  const classes = [
    styles.alert,
    styles[type],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {title && <span className={styles.title}>{title}</span>}
      <div className={styles.content}>{children}</div>
      {details && <div className={styles.details}>{details}</div>}
    </div>
  );
}
