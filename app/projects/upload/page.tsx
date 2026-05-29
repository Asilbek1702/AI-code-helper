'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { AssistantLayout } from '@/components/AssistantLayout';
import { UploadZone } from '@/components/UploadZone';
import { FileTree } from '@/components/FileTree';
import { ProjectSettings } from '@/components/ProjectSettings';
import type { TreeNode } from '@/components/FileTree';

const DEMO_FILE_TREE: TreeNode = {
  name: 'my-project',
  type: 'folder',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'App.tsx', type: 'file', extension: 'tsx' },
        { name: 'index.tsx', type: 'file', extension: 'tsx' },
        { name: 'utils.ts', type: 'file', extension: 'ts' },
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Button.tsx', type: 'file', extension: 'tsx' },
            { name: 'Card.tsx', type: 'file', extension: 'tsx' },
            { name: 'Header.tsx', type: 'file', extension: 'tsx' },
          ],
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'Home.tsx', type: 'file', extension: 'tsx' },
            { name: 'About.tsx', type: 'file', extension: 'tsx' },
          ],
        },
      ],
    },
    { name: 'package.json', type: 'file', extension: 'json' },
    { name: 'tsconfig.json', type: 'file', extension: 'json' },
    { name: 'README.md', type: 'file', extension: 'md' },
    { name: '.gitignore', type: 'file', extension: 'txt' },
  ],
};

export default function UploadPage() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleDrop = async (files: FileList) => {
    if (files.length === 0) return;

    setUploadState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setUploadProgress(100);
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUploadState('success');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setUploadState('idle');
    setUploadProgress(0);
  };

  return (
    <AssistantLayout>
      <div className="space-y-8 py-8">
        {/* Breadcrumb / Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Projects</span>
          <span className="text-text-muted">/</span>
          <span className="text-accent-cyan font-medium">Upload</span>
        </div>

        {/* Main Content */}
        {uploadState === 'idle' ? (
          <>
            {/* Upload Zone */}
            <UploadZone onDrop={handleDrop} />

            {/* File Tree + Settings */}
            <div className="grid grid-cols-2 gap-6">
              <FileTree data={DEMO_FILE_TREE} onSelect={setSelectedFile} />
              <ProjectSettings />
            </div>
          </>
        ) : uploadState === 'uploading' ? (
          <UploadZone onDrop={handleDrop} isUploading uploadProgress={uploadProgress} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-[600px] rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.02)] p-12"
            style={{ minHeight: '320px' }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, type: 'spring' }}
              >
                <CheckCircle2 size={64} className="text-green-400" />
              </motion.div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">Upload Complete</p>
                <p className="text-sm text-text-secondary mt-1">Your project has been uploaded successfully</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AssistantLayout>
  );
}
