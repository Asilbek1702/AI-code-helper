'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
  UserCircle2,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/LogoMark';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/chat', label: 'Optimize React component' },
  { href: '/review', label: 'Review feature branch' },
  { href: '/projects/upload', label: 'Upload workspace' },
  { href: '/chat', label: 'API client refactor' },
];

export function AssistantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar pathname={pathname} className="hidden lg:flex" />

        <AnimatePresence>
          {sidebarOpen ? (
            <>
              <motion.button
                aria-label="Close navigation overlay"
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                className="fixed inset-y-0 left-0 z-50 lg:hidden"
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <Sidebar pathname={pathname} onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.82)] px-4 backdrop-blur-2xl md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-label="Open sidebar"
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={18} />
              </Button>
              <button className="glass inline-flex h-9 items-center gap-2 rounded-[10px] px-3 text-sm text-text-primary transition hover:border-[rgba(0,212,255,0.22)]">
                <span className="text-text-secondary">Model</span>
                <span className="font-medium">qwen2.5-coder:3b</span>
                <ChevronDown size={15} className="text-text-muted" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="New chat">
                <Plus size={17} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings size={17} />
              </Button>
            </div>
          </header>

          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar({
  pathname,
  className,
  onClose,
}: {
  pathname: string;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <aside
      className={cn(
        'h-screen w-[260px] shrink-0 flex-col border-r border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.95)] backdrop-blur-xl',
        className
      )}
    >
      <div className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link href="/chat" className="flex min-w-0 items-center gap-3">
            <LogoMark size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">AI Assistant</p>
              <p className="truncate text-xs text-text-secondary">Developer workspace</p>
            </div>
          </Link>
          {onClose ? (
            <Button variant="ghost" size="icon" aria-label="Close sidebar" onClick={onClose}>
              <X size={17} />
            </Button>
          ) : null}
        </div>

        <Button variant="cyanGhost" size="sm" className="w-full">
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <div className="mb-2 px-3 text-[11px] font-medium uppercase tracking-[0.05em] text-text-muted">
          Recent
        </div>
        <div className="space-y-1">
          {navItems.map((item, index) => {
            const active = pathname === item.href && index < 3;
            return (
              <Link
                key={`${item.label}-${index}`}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'group flex h-10 items-center gap-2 rounded-[8px] px-3 text-sm text-text-secondary transition hover:bg-[rgba(255,255,255,0.04)] hover:text-text-primary',
                  active &&
                    'border-l-2 border-accent-cyan bg-[rgba(0,212,255,0.08)] pl-[10px] text-text-primary'
                )}
              >
                <MessageSquare size={15} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <MoreHorizontal size={15} className="shrink-0 text-text-muted opacity-0 transition group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(0,212,255,0.1)] text-accent-cyan">
            <UserCircle2 size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Dana Lee</p>
            <p className="text-xs text-text-secondary">Pro</p>
          </div>
          <span className="rounded-full border border-[rgba(0,212,255,0.28)] px-2 py-0.5 text-[11px] font-medium text-accent-cyan">
            Pro
          </span>
        </div>
      </div>
    </aside>
  );
}
