"""Example integration with the AI backend from Next.js frontend."""

# This file shows how to use the backend API from the Next.js app

# 1. ENVIRONMENT SETUP (in frontend/.env.local)
"""
NEXT_PUBLIC_API_URL=http://localhost:8000/api
"""

# 2. API CLIENT HOOK (components/hooks/useAIService.ts)
"""
import { useState, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useAIService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = useCallback(async (message: string, context?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error('Chat failed');

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let fullResponse = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        // Update UI with streaming response
      }

      return fullResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debug = useCallback(async (code: string, error: string, language = 'typescript') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/debug`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          error,
          language,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error('Debug analysis failed');
      return response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const review = useCallback(async (code: string, language = 'typescript', focusAreas?: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          focus_areas: focusAreas,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error('Code review failed');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const ragQuery = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/rag-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          top_k: 3,
          stream: true,
        }),
      });

      if (!response.ok) throw new Error('RAG query failed');
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { chat, debug, review, ragQuery, isLoading, error };
}
"""

# 3. USAGE IN CHAT PAGE (app/chat/page.tsx)
"""
'use client';

import { useAIService } from '@/components/hooks/useAIService';

export default function ChatPage() {
  const { chat, isLoading } = useAIService();

  const handleSendMessage = async (message: string) => {
    try {
      const response = await chat(message);
      // Update messages with response
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    // ... rest of component
  );
}
"""

# 4. USAGE IN REVIEW PAGE (app/review/page.tsx)
"""
'use client';

import { useAIService } from '@/components/hooks/useAIService';

export default function ReviewPage() {
  const { review } = useAIService();

  const handleRunReview = async (code: string) => {
    try {
      const response = await review(code, 'typescript', ['performance', 'security']);
      
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // Update UI with streaming review
      }
    } catch (error) {
      console.error('Review failed:', error);
    }
  };

  return (
    // ... rest of component
  );
}
"""

print("✅ Example integration files created!")
print("\nTo use these examples:")
print("1. Create components/hooks/useAIService.ts with the hook code")
print("2. Update your .env.local with NEXT_PUBLIC_API_URL")
print("3. Import and use the hook in your pages")
