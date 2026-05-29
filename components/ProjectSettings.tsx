'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectSettingsProps {
  projectName?: string;
  framework?: string;
  onCancel?: () => void;
  onUpload?: () => void;
}

export function ProjectSettings({ projectName = 'my-project', framework = 'react', onCancel, onUpload }: ProjectSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-[10px] p-6 h-[500px] flex flex-col"
    >
      <h3 className="text-lg font-semibold text-text-primary mb-6">Project Settings</h3>

      <div className="space-y-4 flex-1">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wide">Project Name</label>
          <input
            type="text"
            defaultValue={projectName}
            className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition duration-150 focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wide">Framework</label>
          <select className="w-full rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-white/5 px-4 py-3 text-sm text-text-primary outline-none transition duration-150 focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]">
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="svelte">Svelte</option>
            <option value="next">Next.js</option>
            <option value="nuxt">Nuxt</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary uppercase tracking-wide">Description</label>
          <textarea
            placeholder="Add a description..."
            className="w-full h-20 rounded-[10px] border border-[rgba(255,255,255,0.08)] bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition duration-150 focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-white/10">
        <button
          onClick={onCancel}
          className="flex-1 rounded-[10px] border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:text-text-primary hover:border-white/15"
        >
          Cancel
        </button>
        <button
          onClick={onUpload}
          className="flex-1 rounded-[10px] bg-accent-cyan px-4 py-2.5 text-sm font-semibold text-bg-primary transition hover:shadow-[0_4px_20px_rgba(0,212,255,0.3)]"
        >
          Upload Project
        </button>
      </div>
    </motion.div>
  );
}
