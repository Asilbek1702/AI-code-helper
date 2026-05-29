'use client';

import { motion } from 'framer-motion';
import { Copy, ExternalLink } from 'lucide-react';

export interface DiffLine {
  type: 'added' | 'removed' | 'neutral';
  lineNumber?: number;
  content: string;
}

interface DiffViewProps {
  filename: string;
  filepath: string;
  lines: DiffLine[];
}

export function DiffView({ filename, filepath, lines }: DiffViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-[10px] h-full flex flex-col overflow-hidden"
    >
      {/* File Header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-mono text-text-primary">{filename}</p>
          <p className="text-xs text-text-muted">{filepath}</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs text-text-secondary transition hover:text-accent-cyan hover:bg-white/5">
            <Copy size={14} />
            Copy
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs text-text-secondary transition hover:text-accent-cyan hover:bg-white/5">
            <ExternalLink size={14} />
            View Raw
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="font-mono text-sm leading-relaxed">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`flex border-l-2 px-4 py-1 transition-colors ${
                line.type === 'added'
                  ? 'border-green-500 bg-[rgba(34,197,94,0.08)] text-green-100'
                  : line.type === 'removed'
                    ? 'border-red-500 bg-[rgba(239,68,68,0.08)] text-red-100'
                    : 'border-transparent text-text-primary'
              }`}
            >
              <div className="w-12 flex-shrink-0 text-right pr-4 text-text-muted select-none">
                {line.lineNumber}
              </div>
              <div className="flex-1 whitespace-pre-wrap break-words">{line.content}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
