'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItemProps {
  filename: string;
  path: string;
  status: 'clean' | 'issues' | 'critical';
  issueCount?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function FileItem({ filename, path, status, issueCount, isSelected, onClick }: FileItemProps) {
  const statusIcons = {
    clean: <Check size={16} className="text-green-500" />,
    issues: <AlertTriangle size={16} className="text-yellow-500" />,
    critical: <AlertCircle size={16} className="text-red-500" />,
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-colors text-left border-l-2 border-transparent',
        isSelected
          ? 'bg-[rgba(0,212,255,0.08)] border-l-accent-cyan text-text-primary'
          : 'hover:bg-[rgba(255,255,255,0.04)] text-text-primary'
      )}
    >
      {statusIcons[status]}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm text-text-primary truncate">{filename}</p>
        <p className="text-xs text-text-muted truncate">{path}</p>
      </div>
      {issueCount ? (
        <span className="flex-shrink-0 rounded-full bg-[rgba(245,158,11,0.15)] px-2 py-1 text-xs font-medium text-yellow-500">
          {issueCount}
        </span>
      ) : null}
    </motion.button>
  );
}

interface FileNavigatorProps {
  files: Array<{ filename: string; path: string; status: 'clean' | 'issues' | 'critical'; issueCount?: number }>;
  selectedFile?: string;
  onSelectFile?: (filename: string) => void;
  totalIssues?: number;
  criticalCount?: number;
  warningCount?: number;
  suggestionCount?: number;
}

export function FileNavigator({
  files,
  selectedFile,
  onSelectFile,
  totalIssues = 12,
  criticalCount = 2,
  warningCount = 8,
  suggestionCount = 2,
}: FileNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter((f) => f.filename.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-[10px] h-full flex flex-col"
    >
      {/* Search */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.06)]">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-white/5 pl-9 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition duration-150 focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredFiles.map((file) => (
            <FileItem
              key={file.filename}
              filename={file.filename}
              path={file.path}
              status={file.status}
              issueCount={file.issueCount}
              isSelected={selectedFile === file.filename}
              onClick={() => onSelectFile?.(file.filename)}
            />
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-4">
        <p className="text-xs uppercase font-semibold text-text-secondary mb-3">Summary</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xl font-semibold text-text-primary">{totalIssues}</p>
            <p className="text-xs text-text-muted">Total Issues</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-red-500">{criticalCount}</p>
            <p className="text-xs text-text-muted">Critical</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-yellow-500">{warningCount}</p>
            <p className="text-xs text-text-muted">Warnings</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-blue-400">{suggestionCount}</p>
            <p className="text-xs text-text-muted">Suggestions</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
