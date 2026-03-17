'use client';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import type { Conversation } from '@/types';
import { cn } from '@/lib/cn';
import { formatRelativeTime, truncate } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

export default function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter();
  const deleteConversation = useChatStore(s => s.deleteConversation);
  const setSidebarOpen = useChatStore(s => s.setSidebarOpen);

  const handleClick = () => {
    router.push('/chat/' + conversation.id);
    setSidebarOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(conversation.id);
    router.push('/chat');
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-100',
        isActive ? 'bg-[#162a1c]' : 'hover:bg-[#111f15]'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#ececec] truncate leading-snug">
          {truncate(conversation.title, 28)}
        </div>
        <div className="text-[11px] text-[#565656] mt-0.5">
          {formatRelativeTime(conversation.updatedAt)}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-[#565656] hover:text-[#e55] hover:bg-[#1e3025] transition-all duration-150 flex-shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#6c8cff]"
        aria-label="Delete conversation"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
