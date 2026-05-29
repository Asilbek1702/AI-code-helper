'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Loader2, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/LogoMark';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const tabs = [
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Register' },
] as const;

type AuthMode = (typeof tabs)[number]['id'];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowError(false);

    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 850));
    setSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 180));
    router.push('/chat');
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-4 py-10 text-text-primary">
      <div className="ambient-mesh absolute inset-[-12%]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,15,0.2),#0a0a0f_82%)]" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={
          showError
            ? { opacity: 1, y: 0, x: [-4, 4, -3, 3, 0] }
            : success
              ? { opacity: 0, scale: 0.98, y: 0 }
              : { opacity: 1, y: 0, x: 0, scale: 1 }
        }
        transition={{
          duration: showError ? 0.3 : success ? 0.2 : 0.4,
          ease: showError ? 'easeInOut' : [0.16, 1, 0.3, 1],
        }}
        className={cn(
          'glass relative w-full max-w-[400px] rounded-[16px] p-7 sm:p-8',
          showError && 'border-[rgba(239,68,68,0.45)]'
        )}
      >
        <div className="mb-7 text-center">
          <LogoMark size="md" className="mx-auto mb-4" />
          <h1 className="text-xl font-medium leading-snug text-text-primary">AI Assistant</h1>
        </div>

        <div className="mb-6 rounded-full bg-[rgba(255,255,255,0.05)] p-1">
          <div className="relative grid grid-cols-2">
            <motion.div
              className="absolute inset-y-0 w-1/2 rounded-full bg-bg-tertiary"
              animate={{ x: mode === 'login' ? '0%' : '100%' }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            />
            {tabs.map((tab) => {
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setMode(tab.id);
                    setShowError(false);
                  }}
                  className={cn(
                    'relative z-10 h-8 rounded-full text-sm font-medium transition-colors duration-150',
                    active ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-secondary">Email</span>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-secondary">Password</span>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                {mode === 'login' ? 'Signing in' : 'Creating account'}
              </>
            ) : mode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-text-secondary">
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.08)]" />
          <span>or continue</span>
          <span className="h-px flex-1 bg-[rgba(255,255,255,0.08)]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="sm" aria-label="Continue with GitHub">
            <Github size={17} />
            GitHub
          </Button>
          <Button variant="secondary" size="sm" aria-label="Continue with Google">
            <Mail size={17} />
            Google
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-text-secondary">
          {mode === 'login' ? (
            <span>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-medium text-accent-cyan transition hover:text-text-primary"
              >
                Create account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-medium text-accent-cyan transition hover:text-text-primary"
              >
                Sign in
              </button>
            </span>
          )}
        </div>

        <AnimatePresence>
          {showError ? (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 rounded-[10px] border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] px-4 py-3 text-sm text-red-200"
            >
              Enter an email and password to continue.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.section>
    </main>
  );
}
