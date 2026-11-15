import { useState, useEffect } from 'react';
import {
  Compass,
  Map,
  Code2,
  Clock,
  Bookmark,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
  BookOpen,
  Zap,
} from 'lucide-react';
import type { SessionUser } from '@akaytheory/shared';

export interface AppLayoutProps {
  currentUser: SessionUser | null;
  activeNav: string;
  onNavigate: (route: string) => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function AppLayout({
  currentUser,
  activeNav,
  onNavigate,
  onOpenSearch,
  onLogout,
  children,
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on ESC or route change
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navSections = [
    {
      title: 'Curriculum & Engine',
      items: [
        { id: 'explore', label: 'Learner Dashboard', icon: Compass },
        { id: 'roadmaps', label: 'Engineering Roadmaps', icon: Map },
        { id: 'lessons', label: 'Interactive Lessons', icon: BookOpen },
        { id: 'visualizers', label: 'Algorithm Visualizers', icon: Zap },
        { id: 'practice', label: 'Practice Problems', icon: Code2 },
      ],
    },
    {
      title: 'Memory & Retention',
      items: [
        { id: 'revision', label: 'Spaced Revision Queue', icon: Clock },
        { id: 'notebook', label: 'My Notes & Bookmarks', icon: Bookmark },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { id: 'settings', label: 'Preferences & Security', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar (macOS Pro developer aesthetic) */}
      <aside className="hidden lg:flex flex-col w-64 h-full shrink-0 border-r border-border/80 bg-surface/90 backdrop-blur-2xl select-none z-20">
        {/* macOS Traffic Lights Window Controls */}
        <div className="px-5 pt-3.5 pb-2 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center space-x-2" aria-hidden="true">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-semibold tracking-wider">DARWIN ARM64</span>
        </div>

        {/* Brand Header */}
        <div className="h-14 sm:h-16 px-5 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/10">
              <span className="text-xs font-mono font-bold tracking-tight text-primary">AT</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-semibold tracking-tight text-white">AkayTheory</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">CS & Systems Platform</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs transition-all duration-150 group text-left ${
                      isActive
                        ? 'bg-primary/15 text-white font-medium border border-primary/25 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated/50 font-normal border border-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Card Footer */}
        <div className="p-3 border-t border-border bg-surface-muted/20 shrink-0">
          {currentUser ? (
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-elevated/40 border border-border/60">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-white/5 shrink-0">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-white truncate leading-tight">
                    {currentUser.displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-mono leading-tight">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0 ml-1"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-elevated/30 border border-border/40 text-slate-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-300">Guest Mode</span>
              </div>
              <button
                onClick={onLogout}
                className="text-[10px] text-slate-400 hover:text-white hover:underline transition"
                title="Return to Welcome Gateway"
              >
                Exit
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer (Responsive Navigation) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-64 max-w-[80vw] bg-surface/95 backdrop-blur-2xl border-r border-border h-full flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between">
              <div className="flex items-center space-x-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                          isActive
                            ? 'bg-primary/15 text-white font-medium border border-primary/25'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-surface-elevated/50 font-normal'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-primary' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Drawer User Footer */}
            <div className="p-3 border-t border-border bg-surface-muted/20 shrink-0">
              {currentUser ? (
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-elevated/40 border border-border/60">
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 transition ml-1"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-elevated/30 border border-border/40 text-slate-400">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-300">Guest Mode</span>
                  </div>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white hover:underline transition"
                    title="Return to Welcome Gateway"
                  >
                    Exit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main App Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Top Header (Sticky / Fixed at top, clean z-30, never overlaps main) */}
        <header className="h-14 sm:h-16 shrink-0 border-b border-border bg-surface/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 -ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-elevated transition"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Search Trigger (Linear / Raycast Style) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center justify-between w-52 sm:w-72 md:w-80 px-3 py-1.5 rounded-lg bg-surface-elevated/70 hover:bg-surface-elevated border border-border hover:border-slate-600/80 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-xs group cursor-pointer"
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                <span className="truncate">Search curriculum, lessons, problems...</span>
              </div>
              <div className="hidden sm:flex items-center space-x-1 shrink-0 ml-2">
                <kbd className="px-1.5 py-0.5 text-[10px] bg-surface rounded border border-border font-mono text-slate-400 shadow-2xs">
                  ⌘K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Header Indicators & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Revision Engine Status Badge */}
            <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-surface-elevated/50 border border-border text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>UTC Midnight Revision Active</span>
            </div>

            {/* User Profile / Auth State */}
            {currentUser && (
              <div className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full bg-surface-elevated/40 border border-border/80 text-xs">
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-slate-200 hidden sm:inline-block pr-1 truncate max-w-[120px]">
                  {currentUser.displayName}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content Body: flex-1 overflow-y-auto ensures clean internal scrolling with zero header overlap */}
        <main className="flex-1 overflow-y-auto min-w-0 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
