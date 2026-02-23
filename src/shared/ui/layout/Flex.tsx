import React from 'react';
import styles from './layout.module.css';

/**
 * Props for the Flex component.
 */
interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flex direction: row or column */
  direction?: 'row' | 'column';
  /** Alignment of items along the cross axis */
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  /** Justification of items along the main axis */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Gap between items (1-8 based on spacing scale) */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
  /** React children */
  children: React.ReactNode;
}

/**
 * A flexible layout component using CSS Flexbox.
 * Encourages semantic layout over utility classes.
 */
export function Flex({ 
  direction = 'row', 
  align, 
  justify, 
  gap, 
  className = '', 
  children, 
  ...props 
}: FlexProps) {
  const classes = [
    styles.flex,
    direction === 'column' ? styles.column : styles.row,
    align === 'center' ? styles.alignCenter : '',
    justify === 'between' ? styles.justifyBetween : '',
    gap ? styles[`gap${gap}`] : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
