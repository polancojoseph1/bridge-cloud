'use client';

import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export function NewChatButton() {
  const router = useRouter();
  const newConversation = useChatStore((s) => s.newConversation);

  function handleClick() {
    const id = newConversation();
    router.push(`/chat/${id}`);
  }

  return (
    <button
      onClick={handleClick}
      className={[
        'w-full flex items-center gap-2 px-3 py-2 rounded-md',
        'text-[13px] font-medium text-[#ececec]',
        'border border-[#1e3025]',
        'hover:bg-[#111f15] hover:border-[#2d4035]',
        'transition-colors duration-150 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff]',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-[#111111]',
      ].join(' ')}
    >
      <SquarePen className="w-4 h-4 text-[#9b9b9b] flex-shrink-0" />
      New Chat
    </button>
  );
}
