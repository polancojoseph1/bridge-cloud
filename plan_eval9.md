Wait, let's verify `ChatInputBar.tsx` isn't used anywhere, so I don't need to change it, but it already has orchestrationMode stuff. I will ignore it as per the memory ("ChatInputBar.tsx is an unused component").

Let's check `src/components/chat/EmptyState.tsx`.
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
And removing the hooks:
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
Wait, let's verify what `EmptyState` returns exactly:
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
