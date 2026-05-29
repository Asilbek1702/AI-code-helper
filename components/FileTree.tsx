'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  extension?: string;
}

interface FileTreeProps {
  data: TreeNode;
  onSelect?: (path: string) => void;
}

const EXTENSION_COLORS: Record<string, string> = {
  ts: '#61afef',
  tsx: '#61afef',
  js: '#f59e0b',
  jsx: '#f59e0b',
  css: '#c678dd',
  scss: '#c678dd',
  json: '#22c55e',
  md: '#8a8a9a',
};

function TreeItem({ node, depth = 0, onSelect }: { node: TreeNode; depth?: number; onSelect?: (path: string) => void }) {
  const [isOpen, setIsOpen] = useState(depth === 0);
  const isFolder = node.type === 'folder';
  const color = EXTENSION_COLORS[node.extension || ''] || '#8a8a9a';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
    onSelect?.(node.name);
  };

  return (
    <div>
      <motion.button
        onClick={handleClick}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-[8px] text-sm text-text-primary hover:bg-white/3 transition-colors group"
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {isFolder ? (
          <>
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronRight size={14} className="text-text-muted" />
            </motion.div>
            <Folder size={14} className="text-text-secondary" />
          </>
        ) : (
          <>
            <div className="w-[14px]" />
            <FileText size={14} style={{ color }} />
          </>
        )}
        <span className="font-mono flex-1 text-left">{node.name}</span>
      </motion.button>

      {isFolder && isOpen && node.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children.map((child) => (
            <TreeItem key={child.name} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function FileTree({ data, onSelect }: FileTreeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-[10px] h-[500px] overflow-y-auto"
    >
      <div className="p-4">
        <TreeItem node={data} onSelect={onSelect} />
      </div>
    </motion.div>
  );
}
