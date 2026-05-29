'use client';

import { useRef, useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasContent = message.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!hasContent || isLoading) return;

    onSend(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleSubmit(event);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.8)] px-4 py-4 backdrop-blur-xl md:px-6"
    >
      <div className="mx-auto flex max-w-[800px] gap-3">
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:bg-[rgba(255,255,255,0.05)] hover:text-text-primary"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your code... (Ctrl+K for commands)"
          className="min-h-[52px] max-h-[200px] flex-1 resize-none rounded-[12px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3.5 text-sm text-text-primary outline-none transition duration-150 placeholder:text-text-muted focus:border-[rgba(0,212,255,0.4)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
        />

        <button
          type="submit"
          disabled={!hasContent || isLoading}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition duration-150 hover:scale-105 disabled:hover:scale-100"
          style={{
            background: hasContent ? '#00d4ff' : 'rgba(255, 255, 255, 0.08)',
            color: hasContent ? '#0a0a0f' : '#5a5a6a',
            boxShadow: hasContent ? '0 0 18px rgba(0, 212, 255, 0.2)' : 'none',
          }}
          aria-label="Send message"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </form>
  );
}
