'use client';
import { useState, useRef, useCallback } from 'react';
import { Bot, ArrowUp } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useOrchestrationStore } from '@/store/orchestrationStore';
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
  const orchestrationMode = useOrchestrationStore(s => s.mode);

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startChat = useCallback((text: string) => {
    if (!text.trim() || orchestrationMode !== 'single') return;

    const store = useChatStore.getState();
    const activeConv = store.activeConversation();

    if (activeConv && activeConv.messages.length === 0) {
      sendMessage(text);
    } else {
      const id = newConversation();
      router.push(`/chat/${id}`);
      setTimeout(() => sendMessage(text), 0);
    }
  }, [newConversation, sendMessage, router, orchestrationMode]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || orchestrationMode !== 'single') return;
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
  };

  const canSend = value.trim().length > 0 && !isStreaming && orchestrationMode === 'single';

  return (
    <div className="flex-1 flex flex-col bg-[#0a1410] min-h-0">
      {/* Centered welcome content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-6">
          <Bot size={64} className="text-[#2d4035]" />
        </div>
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#ececec] mb-2 text-center">
          Bridge Cloud
        </h1>
        <p className="text-[15px] text-[#8e8e8e] mb-10 text-center max-w-[320px]">
          Your AI agents, ready to help. Type a message or pick a suggestion.
        </p>
        <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => startChat(s)}
              disabled={orchestrationMode !== 'single'}
              className="px-4 py-3 rounded-xl bg-[#111f15] border border-[#1e3025] hover:border-[#2d4035] hover:bg-[#162a1c] text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

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
              disabled={orchestrationMode !== 'single'}
              rows={1}
              placeholder="Message Bridge Cloud…"
              aria-label="Chat input"
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
