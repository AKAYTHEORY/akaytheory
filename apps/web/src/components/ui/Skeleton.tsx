import type React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          'animate-pulse rounded-md bg-[#161D2A] border border-[#21262D]/40',
          className,
        ),
      )}
      {...props}
    />
  );
}
