export const BUTTON_VARIANTS = { 
  PRIMARY: 'primary', 
  SECONDARY: 'secondary', 
  DANGER: 'danger', 
  OUTLINE: 'outline', 
  GHOST: 'ghost' 
} as const; 

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
