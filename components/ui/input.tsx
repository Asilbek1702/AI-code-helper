import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'h-11 w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-4 text-sm text-text-primary outline-none transition duration-150 ease-[var(--ease-fast)] placeholder:text-text-muted focus:border-[rgba(0,212,255,0.5)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)]',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';
