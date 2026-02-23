import React from 'react';
import styles from './forms.module.css';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label className={`${styles.label} ${className}`} {...props}>
      {children}
    </label>
  );
}
