'use client';
import { useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversations = useChatStore(s => s.conversations);
  const isStreaming = useChatStore(s => s.isStreaming);

  const conversation = conversations.find(c => c.id === conversationId);
  const messages = conversation?.messages ?? [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isStreaming]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const lastMsg = messages[messages.length - 1];
  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto py-6 scroll-smooth">
      <div className="flex flex-col">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {showTypingIndicator && (
          <div className="w-full max-w-[720px] mx-auto px-4 mb-6">
            <TypingIndicator />
          </div>
        )}
      </div>
    </div>
  );
}
