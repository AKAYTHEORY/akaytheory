import { useState, useEffect } from 'react';
import { Dialog } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ApiClient } from '../../lib/api';
import type { SessionUser } from '@akaytheory/shared';
import { registerSchema, loginSchema, ZodError } from '@akaytheory/shared';

export interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: SessionUser) => void;
}

export function AuthModal({ isOpen, initialMode = 'login', onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const validated = loginSchema.parse({ email, password });
        const res = await ApiClient.login(validated);
        onSuccess(res.user);
        onClose();
      } else {
        const validated = registerSchema.parse({ email, password, username, displayName });
        const res = await ApiClient.register(validated);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const firstIssue = err.issues[0];
        setError(firstIssue ? firstIssue.message : 'Please check the entered fields.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
      description={
        mode === 'login'
          ? 'Sign in to access your roadmaps, mastery progress, and revision queue.'
          : 'Join AkayTheory to understand, visualize, and practice software engineering.'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium">
            {error}
          </div>
        )}

        {mode === 'register' && (
          <>
            <Input
              label="Full Name / Display Name"
              placeholder="e.g. Akay Developer"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              label="Username"
              placeholder="e.g. akay_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </>
        )}

        <Input
          label="Email Address"
          type="email"
          placeholder="learner@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••••••"
          helperText={mode === 'register' ? 'At least 10 characters with uppercase, digit, and symbol' : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="text-xs text-slate-400 hover:text-primary transition underline"
          >
            {mode === 'login'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
