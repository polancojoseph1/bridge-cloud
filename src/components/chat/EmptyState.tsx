'use client';
import { useState, useRef, useCallback } from 'react';
import { Bot, ArrowUp } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { useRouter } from 'next/navigation';
import { useOrchestrationStore } from '@/store/orchestrationStore';
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
  const isStreaming = useChatStore(s => s.isStreaming);
  const router = useRouter();
  const orchestrationMode = useOrchestrationStore(s => s.mode);

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startChat = useCallback((text: string) => {
    if (!text.trim()) return;

    const store = useChatStore.getState();
    const activeConv = store.activeConversation();

    if (activeConv && activeConv.messages.length === 0) {
      sendMessage(text);
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
              title={orchestrationMode === 'single' ? undefined : "Orchestration modes coming soon!"}
              className={[
                "px-4 py-3 rounded-xl bg-[#111f15] border border-[#1e3025] transition-all duration-150 text-left text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]",
                orchestrationMode === 'single'
                  ? "hover:border-[#2d4035] hover:bg-[#162a1c] text-[#8e8e8e] hover:text-[#ececec] cursor-pointer"
                  : "opacity-50 cursor-not-allowed text-[#5c5c5c]"
              ].join(' ')}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Replaced duplicated input with shared InputBar */}
      <InputBar />
    </div>
  );
}
