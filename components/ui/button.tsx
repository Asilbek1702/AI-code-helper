import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'cyanGhost';
type ButtonSize = 'sm' | 'md' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-cyan text-bg-primary font-semibold hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(0,212,255,0.3)] active:translate-y-0',
  secondary:
    'border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-text-primary hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.08)]',
  ghost:
    'bg-transparent text-text-secondary hover:bg-[rgba(255,255,255,0.05)] hover:text-text-primary',
  cyanGhost:
    'border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.1)] text-accent-cyan hover:border-[rgba(0,212,255,0.3)] hover:bg-[rgba(0,212,255,0.15)]',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-[10px] px-3 text-sm',
  md: 'h-11 rounded-[10px] px-4 text-sm',
  icon: 'h-9 w-9 rounded-[10px] p-0',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition duration-150 ease-[var(--ease-fast)] disabled:pointer-events-none disabled:opacity-80',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';
