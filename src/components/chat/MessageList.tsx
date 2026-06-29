'use client';
import { useEffect, useRef, useCallback } from 'react';
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
  const expectedScrollTop = useRef<number | null>(null);

  /**
   * ⚡ Bolt Optimization: Targeted Zustand Selector
   * 💡 What: Replaced subscribing to the entire `conversations` array and finding the specific item with a memoized selector.
   * 🎯 Why: When any conversation updates (e.g., new title, deleted conversation), it changes the `conversations` array reference.
   *         Previously, this caused O(N) re-renders in MessageList even if its specific conversation didn't change.
   *         By using a targeted selector, MessageList only re-renders when its specific conversation's reference changes.
   * 📊 Impact: Prevents unnecessary MessageList re-renders. Reduces O(N) array mapping overhead to O(1) selector lookup.
   */
  const conversation = useChatStore(
    useCallback(s => s.conversations.find(c => c.id === conversationId), [conversationId])
  );
  const isStreaming = useChatStore(s => s.isStreaming);

  const messages = conversation?.messages ?? [];
  const prevCountRef = useRef(messages.length);

  const lastMsg = messages[messages.length - 1];

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (isProgrammaticScrollRef.current && expectedScrollTop.current !== null) {
      if (Math.abs(scrollTop - expectedScrollTop.current) <= 1) {
        isProgrammaticScrollRef.current = false;
        expectedScrollTop.current = null;
      }
      return;
    }

    const distanceToBottom = scrollHeight - Math.ceil(scrollTop + clientHeight);

    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
  };

  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      isUserScrolledRef.current = false;
    }
    prevCountRef.current = messages.length;

    if (scrollRef.current && !isUserScrolledRef.current) {
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
        isProgrammaticScrollRef.current = true;
        expectedScrollTop.current = targetScrollTop;
        scrollRef.current.scrollTop = targetScrollTop;
      }
    }
  }, [messages.length, isStreaming, lastMsg?.role]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
        isProgrammaticScrollRef.current = true;
        expectedScrollTop.current = targetScrollTop;
        scrollRef.current.scrollTop = targetScrollTop;
      }
    }
  }, [messages, isStreaming]);

  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      onWheel={() => {
        isProgrammaticScrollRef.current = false;
        expectedScrollTop.current = null;
      }}
      onTouchMove={() => {
        isProgrammaticScrollRef.current = false;
        expectedScrollTop.current = null;
      }}
      onMouseDown={() => {
        isProgrammaticScrollRef.current = false;
        expectedScrollTop.current = null;
      }}
      onTouchStart={() => {
        isProgrammaticScrollRef.current = false;
        expectedScrollTop.current = null;
      }}
      className="flex-1 overflow-y-auto py-6"
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
