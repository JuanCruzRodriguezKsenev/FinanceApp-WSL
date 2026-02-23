import React from 'react';
import styles from './forms.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input 
      className={`${styles.input} ${className}`} 
      {...props} 
    />
  );
}
