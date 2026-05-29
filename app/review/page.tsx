'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { AssistantLayout } from '@/components/AssistantLayout';
import { FileNavigator } from '@/components/FileNavigator';
import { DiffView } from '@/components/DiffView';
import { InlineComment } from '@/components/InlineComment';
import type { DiffLine } from '@/components/DiffView';

const DEMO_FILES = [
  { filename: 'src/App.tsx', path: 'src/', status: 'critical' as const, issueCount: 3 },
  { filename: 'src/utils.ts', path: 'src/', status: 'clean' as const },
  { filename: 'src/api/client.ts', path: 'src/api/', status: 'issues' as const, issueCount: 1 },
  { filename: 'src/components/Button.tsx', path: 'src/components/', status: 'clean' as const },
  { filename: 'package.json', path: './', status: 'issues' as const, issueCount: 2 },
];

const DEMO_DIFF_LINES: DiffLine[] = [
  { type: 'neutral', lineNumber: 10, content: 'export interface AppProps {' },
  { type: 'neutral', lineNumber: 11, content: '  title: string;' },
  { type: 'neutral', lineNumber: 12, content: '  children?: React.ReactNode;' },
  { type: 'neutral', lineNumber: 13, content: '}' },
  { type: 'neutral', lineNumber: 14, content: '' },
  { type: 'removed', lineNumber: 15, content: 'const value = null;' },
  { type: 'added', lineNumber: 16, content: 'const value = undefined;' },
  { type: 'neutral', lineNumber: 17, content: '' },
  { type: 'neutral', lineNumber: 18, content: 'export const App = ({ title, children }: AppProps) => {' },
  { type: 'neutral', lineNumber: 19, content: '  return (' },
  { type: 'neutral', lineNumber: 20, content: '    <div className="container">' },
  { type: 'removed', lineNumber: 21, content: '      <h1>{value || title}</h1>' },
  { type: 'added', lineNumber: 22, content: '      <h1>{value ?? title}</h1>' },
];

export default function ReviewPage() {
  const [selectedFile, setSelectedFile] = useState('src/App.tsx');
  const [currentIssue, setCurrentIssue] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);

  const issues = [
    { file: 'src/App.tsx', type: 'bug' as const, title: 'Potential NPE', content: 'null check missing before accessing object properties' },
    { file: 'src/App.tsx', type: 'suggestion' as const, title: 'Use strict null checks', content: 'Enable strict null checking in tsconfig for better type safety' },
    { file: 'src/App.tsx', type: 'style' as const, title: 'Naming convention', content: 'Variable name should be camelCase' },
  ];

  const totalIssues = 12;
  const nextIssue = () => {
    if (currentIssue < issues.length - 1) {
      setCurrentIssue(currentIssue + 1);
    }
  };

  const prevIssue = () => {
    if (currentIssue > 0) {
      setCurrentIssue(currentIssue - 1);
    }
  };

  return (
    <AssistantLayout>
      <div className="space-y-6 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-text-primary">Code Review</h1>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>Branch:</span>
              <span className="font-mono text-accent-cyan">main -&gt; feature/xyz</span>
            </div>
          </div>
          <button
            onClick={() => setIsReviewing(!isReviewing)}
            disabled={isReviewing}
            className="inline-flex items-center gap-2 rounded-[10px] bg-accent-cyan px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:shadow-[0_4px_20px_rgba(0,212,255,0.3)] disabled:opacity-70"
          >
            <Play size={14} />
            {isReviewing ? 'Reviewing...' : 'Run Review'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[280px_1fr] gap-6 h-[calc(100vh-280px)]">
          {/* Left Panel - File Navigator */}
          <FileNavigator
            files={DEMO_FILES}
            selectedFile={selectedFile}
            onSelectFile={setSelectedFile}
            totalIssues={totalIssues}
            criticalCount={2}
            warningCount={8}
            suggestionCount={2}
          />

          {/* Right Panel - Review Content */}
          <div className="flex flex-col gap-6">
            <DiffView
              filename="src/App.tsx"
              filepath="src/App.tsx (main)"
              lines={DEMO_DIFF_LINES}
            />

            {/* Inline Comments */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                {issues.map((issue, idx) => (
                  currentIssue === idx && (
                    <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <InlineComment
                        type={issue.type}
                        title={issue.title}
                        content={issue.content}
                        onAccept={() => console.log('accepted')}
                        onIgnore={() => console.log('ignored')}
                      />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="sticky bottom-0 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.9)] backdrop-blur-xl px-6 py-4 flex items-center justify-between rounded-b-[10px]">
              <button
                onClick={prevIssue}
                disabled={currentIssue === 0}
                className="inline-flex items-center gap-2 rounded-[10px] border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-secondary transition hover:border-white/15 hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="text-sm text-text-secondary">
                Issue <span className="font-semibold text-text-primary">{currentIssue + 1}</span> of{' '}
                <span className="font-semibold text-text-primary">{issues.length}</span>
              </div>

              <button
                onClick={nextIssue}
                disabled={currentIssue === issues.length - 1}
                className="inline-flex items-center gap-2 rounded-[10px] bg-accent-cyan px-3 py-2 text-sm font-semibold text-bg-primary transition hover:shadow-[0_4px_20px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-text-muted"
              >
                Next Issue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
}
