import type React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'indigo' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    primary: 'bg-[#8B5CF6]/12 text-[#C4B5FD] border-[#8B5CF6]/30',
    indigo: 'bg-indigo-500/12 text-indigo-300 border-indigo-500/30',
    success: 'bg-[#22C55E]/12 text-[#86EFAC] border-[#22C55E]/30',
    warning: 'bg-[#F59E0B]/12 text-[#FDE68A] border-[#F59E0B]/30',
    danger: 'bg-rose-500/12 text-rose-300 border-rose-500/30',
    neutral: 'bg-[#161D2A] text-[#D1D5DB] border-[#21262D]',
    info: 'bg-[#38BDF8]/12 text-[#BAE6FD] border-[#38BDF8]/30',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-semibold rounded-full border tracking-wider uppercase select-none transition-colors duration-150',
          variantClasses[variant] || variantClasses.neutral,
          sizeClasses[size],
          className,
        ),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
