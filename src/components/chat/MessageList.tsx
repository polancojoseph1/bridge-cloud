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
  const isUserScrolledRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const conversations = useChatStore(s => s.conversations);
  const isStreaming = useChatStore(s => s.isStreaming);

  const conversation = conversations.find(c => c.id === conversationId);
  const messages = conversation?.messages ?? [];

  const lastMsg = messages[messages.length - 1];

  const handleScroll = () => {
    if (!scrollRef.current) return;

    if (isProgrammaticScrollRef.current) {
      isProgrammaticScrollRef.current = false;
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // User is considered at bottom if they are within 30px of the bottom
    isUserScrolledRef.current = Math.ceil(scrollTop + clientHeight) < scrollHeight - 30;
  };

  useEffect(() => {
    // If the user just sent a message, force auto-scroll to bottom
    // regardless of whether they were previously scrolled up
    if (lastMsg?.role === 'user') {
      isUserScrolledRef.current = false;
    }

    if (scrollRef.current && !isUserScrolledRef.current) {
      isProgrammaticScrollRef.current = true;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, isStreaming, lastMsg?.role]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      isProgrammaticScrollRef.current = true;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto py-6 scroll-smooth"
    >
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
