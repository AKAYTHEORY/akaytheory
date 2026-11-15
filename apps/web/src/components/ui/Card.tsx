import type React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive';
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const baseClasses =
    'rounded-xl border border-[#21262D] p-6 overflow-hidden transition-all duration-200';
  
  const variantClasses = {
    default:
      'bg-[#111827] shadow-sm shadow-black/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
    elevated:
      'bg-[#161D2A] shadow-elevated shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]',
    interactive:
      'bg-[#111827] hover:bg-[#161D2A]/80 hover:border-[#30363D] cursor-pointer shadow-sm hover:shadow-elevated active:scale-[0.995] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
  };

  return (
    <div className={twMerge(clsx(baseClasses, variantClasses[variant], className))} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx('space-y-1 pb-4 border-b border-[#21262D]/70', className),
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(
        clsx('text-base sm:text-lg font-semibold tracking-tight text-[#F3F4F6]', className),
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge(clsx('text-xs text-[#9CA3AF] leading-relaxed', className))}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('pt-4', className))} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          'pt-4 border-t border-[#21262D]/70 flex items-center justify-between text-xs text-[#9CA3AF]',
          className,
        ),
      )}
      {...props}
    >
      {children}
    </div>
  );
}
