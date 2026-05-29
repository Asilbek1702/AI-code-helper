'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Zap, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  code: string;
  onApply?: () => void;
  onExplain?: () => void;
}

export function CodeBlock({ language = 'typescript', code, onApply, onExplain }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lines = code.split('\n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="my-4 overflow-hidden rounded-[12px] border border-[rgba(255,255,255,0.06)] bg-[#0d0d14]"
    >
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-5 py-3">
        <span className="font-mono text-xs uppercase text-text-muted">{language}</span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-[8px] px-2.5 py-1.5 text-xs text-text-secondary transition hover:text-accent-cyan hover:bg-[rgba(0,212,255,0.05)]"
            title="Copy code"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
        <div className="flex">
          <div className="mr-4 select-none text-text-muted">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="flex-1 text-text-primary">
            <code>{code}</code>
          </pre>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] px-5 py-3">
        <button
          onClick={onApply}
          className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs uppercase font-medium text-text-secondary transition hover:text-accent-cyan hover:bg-[rgba(0,212,255,0.05)]"
        >
          <Zap size={14} />
          Apply
        </button>
        <button
          onClick={onExplain}
          className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs uppercase font-medium text-text-secondary transition hover:text-accent-cyan hover:bg-[rgba(0,212,255,0.05)]"
        >
          <MessageCircle size={14} />
          Explain
        </button>
      </div>
    </motion.div>
  );
}
