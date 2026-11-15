import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border border-violet-400/25 shadow-sm shadow-violet-950/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] focus-visible:ring-violet-500/50',
  secondary:
    'bg-[#161D2A] hover:bg-[#1E2638] text-[#F3F4F6] border border-[#21262D] hover:border-[#30363D] shadow-sm shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] focus-visible:ring-violet-500/40',
  ghost:
    'bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161D2A]/70 border border-transparent focus-visible:ring-violet-500/40',
  outline:
    'bg-transparent text-[#F3F4F6] border border-[#21262D] hover:border-[#30363D] hover:bg-[#161D2A]/40 shadow-sm shadow-black/20 focus-visible:ring-violet-500/40',
  danger:
    'bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/30 shadow-sm shadow-rose-950/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] focus-visible:ring-rose-500/50',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 h-8 min-h-[32px] sm:min-h-[36px] rounded-md gap-1.5',
  md: 'text-sm px-3.5 py-2 h-10 min-h-[40px] rounded-lg gap-2', // WCAG 2.5.8 touch target compatible
  lg: 'text-base px-5 py-2.5 h-12 min-h-[44px] rounded-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium leading-none select-none tracking-tight',
      'transition-all duration-150 ease-out active:scale-[0.98]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]',
      'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
    ].join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(clsx(baseClasses, variantClasses[variant], sizeClasses[size], className))}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        aria-live={isLoading ? 'polite' : undefined}
        {...props}
      >
        {isLoading && (
          <svg
            className="w-4 h-4 animate-spin text-current shrink-0 -ml-0.5 mr-1.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
