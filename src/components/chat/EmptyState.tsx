'use client';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

const SUGGESTIONS = [
  'Explain a concept',
  'Write some code',
  'Help me plan',
  'Review my work',
];

export default function EmptyState() {
  const router = useRouter();
  const newConversation = useChatStore(s => s.newConversation);
  const sendMessage = useChatStore(s => s.sendMessage);

  const handleSuggestion = async (text: string) => {
    const id = newConversation();
    router.push('/chat/' + id);
    // Small delay to let route settle before sending
    setTimeout(() => sendMessage(text), 100);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
      {/* Icon */}
      <div className="mb-6">
        <Bot size={64} className="text-[#2d4035]" />
      </div>

      {/* Title */}
      <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#ececec] mb-2 text-center">
        Bridge Cloud
      </h1>
      <p className="text-[15px] text-[#8e8e8e] mb-10 text-center max-w-[320px]">
        Your AI agents, ready to help. Pick one from the sidebar and start chatting.
      </p>

      {/* Suggestion chips */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-[400px]">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            className="px-4 py-3 rounded-xl bg-[#111f15] border border-[#1e3025] hover:border-[#2d4035] hover:bg-[#162a1c] text-[13px] text-[#8e8e8e] hover:text-[#ececec] transition-all duration-150 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
