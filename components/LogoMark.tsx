import { Code2 } from 'lucide-react';

import { cn } from '@/lib/utils';

type LogoMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'h-8 w-8 rounded-[10px]',
  md: 'h-10 w-10 rounded-[12px]',
  lg: 'h-12 w-12 rounded-[14px]',
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export function LogoMark({ size = 'md', className }: LogoMarkProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center bg-[rgba(0,212,255,0.1)] text-accent-cyan shadow-[0_0_20px_rgba(0,212,255,0.3)] ring-1 ring-[rgba(0,212,255,0.22)]',
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    >
      <Code2 size={iconSizes[size]} strokeWidth={2.2} />
    </span>
  );
}
