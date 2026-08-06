'use client';
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
  const isStreaming = useChatStore(s => s.isStreaming);
  const router = useRouter();

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
              className="px-4 py-3 rounded-xl bg-[#111f15] border border-[#1e3025] hover:border-[#2d4035] hover:bg-[#162a1c] text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat input pinned to bottom */}
      <InputBar />
    </div>
  );
}
