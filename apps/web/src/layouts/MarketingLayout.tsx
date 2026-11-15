import type React from 'react';
import { Button } from '../components/ui/Button';

export interface MarketingLayoutProps {
  children: React.ReactNode;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export function MarketingLayout({ children, onOpenAuth }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation Header (Sticky, clean z-30, Linear/Raycast styling) */}
      <header className="border-b border-border bg-surface/85 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/5">
              <span className="text-xs font-mono font-bold tracking-tight text-primary">AT</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base tracking-tight text-white">AkayTheory</span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-primary/10 text-primary border border-primary/20">
                Foundations
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-medium text-slate-300">
            <a href="#roadmaps" className="hover:text-white transition-colors">Roadmaps</a>
            <a href="#visualizers" className="hover:text-white transition-colors">Visualizers</a>
            <a href="#curriculum" className="hover:text-white transition-colors">Curriculum</a>
            <a href="#philosophy" className="hover:text-white transition-colors">Philosophy</a>
          </nav>

          <div className="flex items-center space-x-2.5">
            <Button variant="ghost" size="sm" onClick={() => onOpenAuth?.('login')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => onOpenAuth?.('register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-bold text-sm tracking-tight text-white">AkayTheory</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-xs text-slate-400">Independent Engineering Education</span>
            </div>
            <p className="text-xs text-slate-500 italic">"The way to a better you is you through you."</p>
          </div>

          <p className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} AkayTheory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
