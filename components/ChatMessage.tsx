'use client';

import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(0,212,255,0.1)] text-accent-cyan">
          <span className="text-xs">✨</span>
        </div>
      )}

      <div
        className={`max-w-[85%] ${
          isUser
            ? 'rounded-[16px_16px_4px_16px] border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.08)] px-5 py-4 text-text-primary'
            : 'border-l-2 border-[rgba(0,212,255,0.3)] pl-4 text-text-primary'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
        {timestamp && (
          <p className="mt-2 text-xs text-text-muted">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
