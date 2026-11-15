import type React from 'react';
import { HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = <HelpCircle className="w-8 h-8 text-[#9CA3AF]" />,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col items-center justify-center p-8 sm:p-10 text-center space-y-4 rounded-xl border border-dashed border-[#21262D] bg-[#111827]/40 shadow-sm shadow-black/30',
          className,
        ),
      )}
    >
      <div className="p-3.5 rounded-full bg-[#161D2A] border border-[#21262D] text-[#9CA3AF] shadow-sm">
        {icon}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-sm sm:text-base font-semibold text-[#F3F4F6] tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-[#9CA3AF] leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
