import { useState, useEffect } from 'react';
import { AppLayout } from './layouts/AppLayout';
import { AuthModal } from './features/auth/AuthModal';
import { ApiClient } from './lib/api';
import type { SessionUser } from '@akaytheory/shared';
import { Button } from './components/ui/Button';
import { Card, CardTitle, CardDescription } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { LessonViewer } from './features/learning';
import { VisualizerWidget } from './features/visualizers';
import { RoadmapView } from './features/roadmaps';
import { ProblemListView, ProblemWorkspace, type ProblemData } from './features/practice';
import { DashboardView } from './features/dashboard';
import { LandingGateway } from './features/landing';
import { CommandPalette } from './components/search/CommandPalette';
import {
  Bookmark,
  Settings as SettingsIcon,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [guestEntered, setGuestEntered] = useState<boolean>(() => {
    return typeof window !== 'undefined' && localStorage.getItem('akaytheory_guest_mode') === 'true';
  });
  const [activeNav, setActiveNav] = useState('explore');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Navigation targets
  const [activeLessonSlug, setActiveLessonSlug] = useState<string>('binary-search-foundations');
  const [activeProblem, setActiveProblem] = useState<ProblemData | null>(null);

  // Command palette state
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Check if user has an existing session cookie
    ApiClient.getCurrentUser()
      .then((res) => {
        if (res.user) setCurrentUser(res.user);
      })
      .catch(() => {
        // Visitor is unauthenticated
      });

    // Global Cmd+K / Ctrl+K shortcut to open command palette
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await ApiClient.logout();
    } catch {
      // Ignored
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('akaytheory_guest_mode');
    }
    setCurrentUser(null);
    setGuestEntered(false);
    setActiveNav('explore');
  };

  const navigateToLesson = (slug: string) => {
    setActiveLessonSlug(slug);
    setActiveNav('lessons');
  };

  const navigateToTopic = (slug: string) => {
    setActiveLessonSlug(`${slug}-foundations`);
    setActiveNav('lessons');
  };

  const navigateToProblem = (_slug: string) => {
    setActiveNav('practice');
  };

  const isInsideApp = Boolean(currentUser || guestEntered);

  // If user is not authenticated and has not entered as guest, render the standalone Login / Gateway page
  if (!isInsideApp) {
    return (
      <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
        {/* macOS Top Status / Menu Bar */}
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/[0.06] select-none">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] block" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/30 flex items-center justify-center font-bold text-white text-[10px] font-mono">
                AT
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">AkayTheory</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-surface-elevated border border-white/[0.06] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Platform Online</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold">
              Track Engine Active
            </div>
          </div>
        </header>

        {/* Dedicated Login / Welcome Gateway Canvas */}
        <main className="flex-1 flex flex-col justify-center py-6 sm:py-10">
          <LandingGateway
            onSignIn={() => {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }}
            onSignUp={() => {
              setAuthModalMode('register');
              setAuthModalOpen(true);
            }}
            onContinueGuest={(targetNav = 'explore') => {
              if (typeof window !== 'undefined') {
                localStorage.setItem('akaytheory_guest_mode', 'true');
              }
              setGuestEntered(true);
              setActiveNav(targetNav);
            }}
          />
        </main>

        {/* Minimal macOS Pro Footer */}
        <footer className="max-w-6xl w-full mx-auto pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 select-none">
          <p className="font-mono text-[11px]">
            AkayTheory • CS & Systems Engineering Mastery Platform
          </p>
          <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400">
            <span>BR-021 Enforced</span>
            <span>•</span>
            <span>HttpOnly Cookies</span>
            <span>•</span>
            <span>Darwin ARM64</span>
          </div>
        </footer>

        {/* Auth Modal Dialog for Sign In / Register */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setGuestEntered(false);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('akaytheory_guest_mode');
            }
          }}
        />
      </div>
    );
  }

  return (
    <AppLayout
      currentUser={currentUser}
      activeNav={activeNav}
      onNavigate={(nav) => {
        setActiveNav(nav);
        if (nav === 'practice') {
          setActiveProblem(null);
        }
      }}
      onOpenSearch={() => setSearchOpen(true)}
      onLogout={handleLogout}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-6">
        {/* Top Header / Account Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <span>Dual-Domain Anchor Launch</span>
              <span className="text-primary/40">•</span>
              <span className="text-slate-300">DSA + System Design Foundations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {activeNav === 'explore' && 'Learner Dashboard'}
              {activeNav === 'roadmaps' && 'Master Engineering Roadmap'}
              {activeNav === 'lessons' && 'Interactive Technical Lessons'}
              {activeNav === 'visualizers' && 'Interactive Algorithm Visualizer'}
              {activeNav === 'practice' && (activeProblem ? 'Practice Workspace' : 'Practice Problems')}
              {activeNav === 'revision' && 'Spaced Revision Queue'}
              {activeNav === 'notebook' && 'Personal Notes & Bookmarks'}
              {activeNav === 'settings' && 'Account & Security Preferences'}
            </h1>
          </div>
        </div>

        {/* View 1: Learner Dashboard & Overview */}
        {activeNav === 'explore' && (
          <DashboardView
            currentUser={currentUser}
            onNavigateLesson={navigateToLesson}
            onNavigateRoadmaps={() => setActiveNav('roadmaps')}
          />
        )}

        {/* View 2: Roadmaps & Prerequisite Topology */}
        {activeNav === 'roadmaps' && (
          <RoadmapView
            initialSlug="dsa-fundamentals"
            onNavigateLesson={navigateToLesson}
          />
        )}

        {/* View 3: Interactive Lesson Viewer with Visualizer & Knowledge Quiz */}
        {activeNav === 'lessons' && (
          <LessonViewer
            lessonSlug={activeLessonSlug}
            onNavigateTopic={navigateToTopic}
          />
        )}

        {/* View 4: Algorithm Visualizers */}
        {activeNav === 'visualizers' && <VisualizerWidget />}

        {/* View 5: Practice & Interview Prep */}
        {activeNav === 'practice' && (
          <div>
            {activeProblem ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveProblem(null)}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back to Problem Catalog
                </Button>
                <ProblemWorkspace problem={activeProblem} onSolved={() => {}} />
              </div>
            ) : (
              <ProblemListView onSelectProblem={(problem) => setActiveProblem(problem)} />
            )}
          </div>
        )}

        {/* View 6: Spaced Revision Queue */}
        {activeNav === 'revision' && (
          <DashboardView
            currentUser={currentUser}
            onNavigateLesson={navigateToLesson}
            onNavigateRoadmaps={() => setActiveNav('roadmaps')}
          />
        )}

        {/* View 7: Notes & Bookmarks */}
        {activeNav === 'notebook' && (
          <Card className="p-8 text-center space-y-4 bg-surface border-border max-w-2xl mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-white">Personal Notebook & Bookmarks</CardTitle>
              <CardDescription className="max-w-md mx-auto text-xs text-slate-400">
                Save key insights, mental checkpoints, and bookmark challenging algorithm patterns as you study.
              </CardDescription>
            </div>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setActiveNav('lessons')}>
                Browse Lessons to Add Notes
              </Button>
            </div>
          </Card>
        )}

        {/* View 8: Account Preferences & Security */}
        {activeNav === 'settings' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6 bg-surface border-border space-y-4 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Account Information</h3>
                  <p className="text-xs text-slate-400">Manage your profile identity and credentials</p>
                </div>
              </div>
              {currentUser ? (
                <div className="space-y-3 text-sm divide-y divide-border/60">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-400">Display Name</span>
                    <span className="text-xs font-semibold text-white">{currentUser.displayName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-400">Email Address</span>
                    <span className="text-xs font-mono text-primary font-medium">{currentUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-400">Account Role</span>
                    <Badge variant="indigo" size="sm">{currentUser.role}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-xs text-slate-400">Email Verification</span>
                    <span className="inline-flex items-center text-xs text-emerald-400 font-semibold gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentUser.isEmailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Guest Session Active
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Full curriculum, roadmaps, and visualizers are unlocked. Session progress is stored locally in this browser.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('akaytheory_guest_mode');
                      }
                      setGuestEntered(false);
                      setActiveNav('explore');
                    }}
                    className="text-xs text-slate-300 hover:text-white"
                  >
                    Return to Welcome Gateway
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-surface border-border space-y-3 shadow-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Security & Password Safeguards</h3>
                  <p className="text-xs text-slate-400">Enforced by Business Rule BR-021</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                AkayTheory implements strict password credential safeguards (BR-021). You cannot unlink an OAuth provider without setting a verified local password. All authentication tokens utilize HttpOnly secure cookies.
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectLesson={navigateToLesson}
        onSelectTopic={navigateToTopic}
        onSelectProblem={navigateToProblem}
      />

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </AppLayout>
  );
}
