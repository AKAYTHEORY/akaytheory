import { AlertTriangle, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={twMerge(
        clsx(
          'flex flex-col items-center justify-center p-8 sm:p-10 text-center space-y-4 rounded-xl border border-rose-500/20 bg-[#161D2A]/60 shadow-sm shadow-black/30',
          className,
        ),
      )}
    >
      <div className="p-3 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 shadow-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm sm:text-base font-semibold text-[#F3F4F6] tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-[#9CA3AF] leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="mt-1"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
