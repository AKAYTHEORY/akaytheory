import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={contentRef}
        className="w-full max-w-lg rounded-xl bg-[#111827] border border-[#21262D] shadow-modal p-6 relative space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? 'dialog-description' : undefined}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 id="dialog-title" className="text-base sm:text-lg font-semibold text-[#F3F4F6] tracking-tight">
              {title}
            </h3>
            {description && (
              <p id="dialog-description" className="text-xs text-[#9CA3AF] leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#161D2A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/50"
            aria-label="Close dialog"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-1">{children}</div>
      </div>
    </div>
  );
}
