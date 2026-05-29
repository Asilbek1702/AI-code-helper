'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';
import { AssistantLayout } from '@/components/AssistantLayout';
import { ChatMessage } from '@/components/ChatMessage';
import { CodeBlock } from '@/components/CodeBlock';
import { ChatInput } from '@/components/ChatInput';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'How can I optimize this React component for performance?',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '2',
    role: 'assistant',
    content: "Here's an optimized version using React.memo and useMemo to prevent unnecessary re-renders:",
    timestamp: new Date(Date.now() - 4 * 60000),
  },
  {
    id: '3',
    role: 'assistant',
    content: '',
    timestamp: new Date(Date.now() - 3 * 60000),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: 'This is a sample response from the AI assistant. You can integrate with a real API here.',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <AssistantLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[800px] space-y-6 px-4 py-8">
            <AnimatePresence>
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'assistant' && message.content === '' ? (
                    // Typing indicator
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(0,212,255,0.1)] text-accent-cyan">
                        <Loader size={14} className="animate-spin" />
                      </div>
                      <div className="flex items-center gap-1 pt-1">
                        <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 rounded-full bg-accent-cyan animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </motion.div>
                  ) : (
                    <ChatMessage
                      role={message.role}
                      content={message.content}
                      timestamp={message.timestamp}
                    />
                  )}
                </div>
              ))}
            </AnimatePresence>

            {/* Sample code block when assistant has content */}
            {messages.some((m) => m.role === 'assistant' && m.content !== '') && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CodeBlock
                  language="typescript"
                  code={`const memoizedComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => transformItem(item));
  }, [data]);

  return (
    <div>
      {processedData.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
});`}
                  onApply={() => console.log('Apply clicked')}
                  onExplain={() => console.log('Explain clicked')}
                />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </AssistantLayout>
  );
}
