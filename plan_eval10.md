Let's prepare the precise `SEARCH` and `REPLACE` blocks.
For `src/store/chatStore.ts`:
```typescript
<<<<<<< SEARCH
      stopGeneration: () => {
        set(s => {
          if (!s.activeConversationId) return { isStreaming: false };
          const convIndex = s.conversations.findIndex(c => c.id === s.activeConversationId);
          if (convIndex === -1) return { isStreaming: false };

          const conv = s.conversations[convIndex];
          if (conv.messages.length === 0) return { isStreaming: false };

          const lastMsgIndex = conv.messages.length - 1;
          const lastMsg = conv.messages[lastMsgIndex];

          if (!lastMsg.isStreaming) return { isStreaming: false };

          const newMessages = [...conv.messages];
          newMessages[lastMsgIndex] = { ...lastMsg, isStreaming: false };

          const newConversations = [...s.conversations];
          newConversations[convIndex] = { ...conv, messages: newMessages };

          return { isStreaming: false, conversations: newConversations };
        });
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
      },
=======
      stopGeneration: () => {
        if (activeAbortController) {
          activeAbortController.abort(new DOMException('Aborted', 'AbortError'));
        }
        set(s => {
          if (!s.activeConversationId) return { isStreaming: false };
          const convIndex = s.conversations.findIndex(c => c.id === s.activeConversationId);
          if (convIndex === -1) return { isStreaming: false };

          const conv = s.conversations[convIndex];
          if (conv.messages.length === 0) return { isStreaming: false };

          const lastMsgIndex = conv.messages.length - 1;
          const lastMsg = conv.messages[lastMsgIndex];

          if (!lastMsg.isStreaming) return { isStreaming: false };

          const newMessages = [...conv.messages];
          newMessages[lastMsgIndex] = { ...lastMsg, isStreaming: false };

          const newConversations = [...s.conversations];
          newConversations[convIndex] = { ...conv, messages: newMessages };

          return { isStreaming: false, conversations: newConversations };
        });
      },
>>>>>>> REPLACE
```

For `src/components/chat/InputBar.tsx`:
```typescript
<<<<<<< SEARCH
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [value, isStreaming, sendMessage, orchestrationMode]);

  const canSend = value.trim().length > 0 && !isStreaming;
=======
  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || orchestrationMode !== 'single') return;
    sendMessage(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  }, [value, isStreaming, sendMessage, orchestrationMode]);

  const canSend = value.trim().length > 0 && !isStreaming && orchestrationMode === 'single';
>>>>>>> REPLACE
```
and
```typescript
<<<<<<< SEARCH
            disabled={isStreaming}
            rows={1}
            placeholder="Message Bridge Cloud…"
            aria-label="Chat input"
            title="Chat input"
            aria-multiline="true"
            className={[
              'flex-1 bg-transparent resize-none outline-none',
              'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
              'leading-[1.6] min-h-[24px] overflow-hidden',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          />
=======
            disabled={isStreaming || orchestrationMode !== 'single'}
            rows={1}
            placeholder={orchestrationMode === 'single' ? "Message Bridge Cloud…" : "Orchestration modes coming soon!"}
            aria-label="Chat input"
            title="Chat input"
            aria-multiline="true"
            className={[
              'flex-1 bg-transparent resize-none outline-none',
              'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
              'leading-[1.6] min-h-[24px] overflow-hidden',
              'disabled:cursor-not-allowed disabled:opacity-50',
            ].join(' ')}
            style={{ maxHeight: `${MAX_HEIGHT}px` }}
          />
>>>>>>> REPLACE
```
and
```typescript
<<<<<<< SEARCH
              disabled={!canSend}
              aria-label="Send message"
              title="Send message"
=======
              disabled={!canSend}
              aria-label="Send message"
              title={orchestrationMode === 'single' ? "Send message" : "Orchestration modes coming soon!"}
>>>>>>> REPLACE
```

For `src/components/chat/EmptyState.tsx`:
```typescript
<<<<<<< SEARCH
import { useState, useRef, useCallback } from 'react';
import { Bot, ArrowUp } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'next/navigation';

const SUGGESTIONS = [
  'Explain a concept',
  'Write some code',
  'Help me plan',
  'Review my work',
];

export default function EmptyState() {
  const newConversation = useChatStore(s => s.newConversation);
  const sendMessage = useChatStore(s => s.sendMessage);
  const isStreaming = useChatStore(s => s.isStreaming);
  const router = useRouter();

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startChat = useCallback((text: string) => {
=======
import { useCallback } from 'react';
import { Bot } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'next/navigation';
import InputBar from './InputBar';

const SUGGESTIONS = [
  'Explain a concept',
  'Write some code',
  'Help me plan',
  'Review my work',
];

export default function EmptyState() {
  const newConversation = useChatStore(s => s.newConversation);
  const sendMessage = useChatStore(s => s.sendMessage);
  const router = useRouter();

  const startChat = useCallback((text: string) => {
>>>>>>> REPLACE
```
and
```typescript
<<<<<<< SEARCH
    } else {
      const id = newConversation();
      router.push(`/chat/${id}`);
      setTimeout(() => sendMessage(text), 0);
    }
  }, [newConversation, sendMessage, router]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    startChat(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    el.style.overflowY = el.scrollHeight > 120 ? 'auto' : 'hidden';
  };

  const canSend = value.trim().length > 0 && !isStreaming;

  return (
=======
    } else {
      const id = newConversation();
      router.push(`/chat/${id}`);
      setTimeout(() => sendMessage(text), 0);
    }
  }, [newConversation, sendMessage, router]);

  return (
>>>>>>> REPLACE
```
and
```typescript
<<<<<<< SEARCH
      {/* Chat input pinned to bottom */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0a1410] via-[#0a1410] to-transparent pt-6 pb-2 px-4">
        <div className="w-full max-w-[720px] mx-auto">
          <div className={[
            'flex items-end gap-2 px-4 py-3',
            'bg-[#111f15] border rounded-xl transition-colors duration-150',
            'border-[#1e3025] focus-within:border-[#2d4035] focus-within:bg-[#1a2a1f]',
            'focus-within:shadow-[0_0_0_1px_rgba(108,140,255,0.15)]',
          ].join(' ')}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => { setValue(e.target.value); resizeTextarea(); }}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message Bridge Cloud…"
              aria-label="Chat input"
              title="Chat input"
              className={[
                'flex-1 bg-transparent resize-none outline-none',
                'text-sm text-[#ececec] placeholder:text-[#5c5c5c]',
                'leading-[1.6] min-h-[24px] overflow-hidden',
              ].join(' ')}
              style={{ maxHeight: '120px' }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              title="Send message"
              className={[
                'w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 self-end mb-0.5',
                'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]',
                canSend
                  ? 'bg-[#6c8cff] hover:bg-[#5a7aee] cursor-pointer'
                  : 'bg-[#1e3025] cursor-not-allowed',
              ].join(' ')}
            >
              <ArrowUp className={`w-4 h-4 ${canSend ? 'text-[#0a1410]' : 'text-[#5c5c5c]'}`} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-[11px] text-[#5c5c5c] mt-2 select-none">
            Bridge Cloud can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
=======
      {/* Chat input pinned to bottom */}
      <InputBar />
    </div>
  );
}
>>>>>>> REPLACE
```

For `src/components/chat/MessageList.tsx`:
```typescript
<<<<<<< SEARCH
export default function MessageList({ conversationId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolledRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
=======
export default function MessageList({ conversationId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolledRef = useRef(false);

  /**
>>>>>>> REPLACE
```
and
```typescript
<<<<<<< SEARCH
  const handleScroll = () => {
    if (!scrollRef.current) return;

    // If we recently programmatically scrolled, ignore this scroll event
    if (isProgrammaticScrollRef.current) {
      // Don't clear it immediately because smooth scrolling fires multiple times.
      // The timeout below will clear it.
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Fix: Using Math.ceil(scrollTop + clientHeight) can sometimes be slightly off on different zoom levels,
    // ensuring precision within the threshold
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
  };

  useEffect(() => {
    // If the user just sent a message, force auto-scroll to bottom
    // regardless of whether they were previously scrolled up
    if (messages.length > prevCountRef.current) {
      // The store currently appends BOTH user and assistant messages at the same time,
      // so `lastMsg` is the assistant message. We need to check if the user just sent a message.
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
    prevCountRef.current = messages.length;

    if (scrollRef.current && !isUserScrolledRef.current) {
      // Only set programmatic true if we actually move it
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
        isProgrammaticScrollRef.current = true;
        scrollRef.current.scrollTop = targetScrollTop;

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 150); // 150ms covers most smooth scroll animations
      }
    }
  }, [messages.length, isStreaming, lastMsg?.role]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      const targetScrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
      if (Math.abs(scrollRef.current.scrollTop - targetScrollTop) > 1) {
        isProgrammaticScrollRef.current = true;
        scrollRef.current.scrollTop = targetScrollTop;

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 150);
      }
    }
  }, [messages, isStreaming]);

  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      onWheel={() => { isProgrammaticScrollRef.current = false; }}
      onTouchMove={() => { isProgrammaticScrollRef.current = false; }}
      className="flex-1 overflow-y-auto py-6"
    >
=======
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // Fix: Using Math.ceil(scrollTop + clientHeight) can sometimes be slightly off on different zoom levels,
    // ensuring precision within the threshold
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    if (distanceToBottom > 30) {
      isUserScrolledRef.current = true;
    } else {
      isUserScrolledRef.current = false;
    }
  };

  useEffect(() => {
    // If the user just sent a message, force auto-scroll to bottom
    // regardless of whether they were previously scrolled up
    if (messages.length > prevCountRef.current) {
      // The store currently appends BOTH user and assistant messages at the same time,
      // so `lastMsg` is the assistant message. We need to check if the user just sent a message.
      const justAddedUserMsg = messages[messages.length - 1]?.role === 'user' || messages[messages.length - 2]?.role === 'user';
      if (justAddedUserMsg) {
        isUserScrolledRef.current = false;
      }
    }
    prevCountRef.current = messages.length;

    if (scrollRef.current && !isUserScrolledRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
  }, [messages.length, isStreaming, lastMsg?.role]);

  // Also scroll when streaming content updates
  useEffect(() => {
    if (isStreaming && scrollRef.current && !isUserScrolledRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    }
  }, [messages, isStreaming]);

  const showTypingIndicator = isStreaming && lastMsg?.role === 'assistant' && lastMsg?.content === '';

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto py-6"
    >
>>>>>>> REPLACE
```
