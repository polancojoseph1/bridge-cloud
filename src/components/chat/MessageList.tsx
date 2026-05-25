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

    // Check if this scroll was programmatic
    if (expectedScrollTop.current !== null && Math.abs(scrollTop - expectedScrollTop.current) <= 1) {
      expectedScrollTop.current = null;
      return;
    }

    const distanceToBottom = scrollHeight - Math.ceil(scrollTop + clientHeight);

    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
  };

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current) return;
    const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;

    if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
      expectedScrollTop.current = targetScrollTop;
      scrollRef.current.scrollTop = targetScrollTop;
    }
  }, []);

  useEffect(() => {
    // If the user just sent a message, force auto-scroll to bottom
    // regardless of whether they were previously scrolled up
    if (messages.length > prevCountRef.current) {
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
    prevCountRef.current = messages.length;

    if (!isUserScrolledRef.current) {
      scrollToBottom();
    }
  }, [messages.length, isStreaming, lastMsg?.role, scrollToBottom]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && !isUserScrolledRef.current) {
      scrollToBottom();
    }
  }, [messages, isStreaming, scrollToBottom]);

  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
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
