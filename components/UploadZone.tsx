'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onDrop: (files: FileList) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export function UploadZone({ onDrop, isUploading = false, uploadProgress = 0 }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onDrop(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onDrop(e.target.files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'mx-auto max-w-[600px] rounded-[20px] border-2 border-dashed transition-all duration-200',
        isDragOver
          ? 'border-accent-cyan bg-[rgba(0,212,255,0.05)] scale-[1.01]'
          : 'border-white/10 bg-[rgba(255,255,255,0.02)]',
        isUploading && 'pointer-events-none'
      )}
      style={{ minHeight: '320px' }}
    >
      <div className="flex flex-col items-center justify-center h-full p-8">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".zip,.tar,.gz"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-4"
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              className="stroke-accent-cyan"
            >
              <circle cx="30" cy="30" r="28" strokeWidth="2" opacity="0.2" />
              <circle
                cx="30"
                cy="30"
                r="28"
                strokeWidth="2"
                strokeDasharray={`${(uploadProgress / 100) * 176} 176`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.3s ease' }}
              />
            </svg>
            <div className="text-center">
              <p className="text-lg font-semibold text-text-primary">{Math.round(uploadProgress)}%</p>
              <p className="text-sm text-text-secondary">Uploading {Math.round(uploadProgress * 24 / 100)}MB...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6"
            onClick={handleClick}
          >
            <motion.div
              animate={isDragOver ? { y: -4 } : { y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Cloud size={48} className={cn('transition-colors', isDragOver ? 'text-accent-cyan' : 'text-text-muted')} />
            </motion.div>

            <div className="text-center">
              <p className="text-lg font-medium text-text-primary">Drop your project here</p>
              <p className="text-sm text-text-secondary mt-1">or click to browse</p>
            </div>

            <div className="flex gap-2 text-xs text-text-muted">
              <span>Supported: .zip, .tar, .gz</span>
              <span>•</span>
              <span>Max 50MB</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
