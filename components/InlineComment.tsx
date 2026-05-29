'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Bug, Zap, Palette, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CommentType = 'suggestion' | 'bug' | 'performance' | 'style';

interface InlineCommentProps {
  type: CommentType;
  title: string;
  content: string;
  onAccept?: () => void;
  onIgnore?: () => void;
}

const typeConfig: Record<CommentType, { icon: React.ReactNode; color: string; accentColor: string }> = {
  suggestion: { icon: <Lightbulb size={14} />, color: 'border-l-accent-cyan', accentColor: 'text-accent-cyan' },
  bug: { icon: <Bug size={14} />, color: 'border-l-red-500', accentColor: 'text-red-500' },
  performance: { icon: <Zap size={14} />, color: 'border-l-yellow-500', accentColor: 'text-yellow-500' },
  style: { icon: <Palette size={14} />, color: 'border-l-purple-500', accentColor: 'text-purple-500' },
};

export function InlineComment({ type, title, content, onAccept, onIgnore }: InlineCommentProps) {
  const config = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: 16 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'border rounded-[10px] bg-[rgba(0,212,255,0.05)] border-[rgba(0,212,255,0.15)] p-4 ml-16 my-3',
        config.color
      )}
    >
      <div className="flex items-start gap-3">
        <span className={config.accentColor}>{config.icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-text-primary">{title}</p>
          <p className="text-sm text-text-secondary mt-1">{content}</p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={onAccept}
              className="text-xs uppercase font-medium text-text-muted transition hover:text-green-400 flex items-center gap-1"
            >
              <Check size={12} />
              Accept
            </button>
            <button
              onClick={onIgnore}
              className="text-xs uppercase font-medium text-text-muted transition hover:text-red-400 flex items-center gap-1"
            >
              <X size={12} />
              Ignore
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
