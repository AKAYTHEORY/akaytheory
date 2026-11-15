import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#6B7280] pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={twMerge(
              clsx(
                'w-full px-3.5 py-2 text-sm bg-[#161D2A] text-[#F3F4F6] rounded-lg border border-[#21262D]',
                'transition-all duration-150 ease-out placeholder:text-[#6B7280]',
                'focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] hover:border-[#30363D]',
                'disabled:opacity-40 disabled:cursor-not-allowed',
                'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
                leftIcon && 'pl-9',
                rightIcon && 'pr-9',
                error && 'border-rose-500/80 focus:ring-rose-500/30 focus:border-rose-500',
                className,
              ),
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[#6B7280] pointer-events-none flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={errorId} className="text-xs text-rose-400 font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-xs text-[#9CA3AF]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
