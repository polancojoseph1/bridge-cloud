'use client';

import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useChatStore } from '@/store/chatStore';
import type { Conversation } from '@/types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter();
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  function handleClick() {
    router.push(`/chat/${conversation.id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    deleteConversation(conversation.id);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'group relative flex items-center gap-2.5 px-3 py-2.5 rounded-md cursor-pointer',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c8cff] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]',
        isActive
          ? 'bg-[#162a1c]'
          : 'hover:bg-[#111f15]'
      )}
    >
      {/* Title + timestamp — fills available space, truncated */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'truncate text-sm leading-5',
            isActive ? 'text-[#ececec] font-medium' : 'text-[#ececec] font-normal'
          )}
        >
          {conversation.title}
        </p>
        <p className="text-xs text-[#5c5c5c] mt-0.5 truncate">
          {formatRelativeTime(conversation.updatedAt)}
        </p>
      </div>

      {/* Delete button — hidden until group hover */}
      <button
        onClick={handleDelete}
        aria-label="Delete conversation"
        className={cn(
          'flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100',
          'text-[#5c5c5c] hover:text-[#e05c5c]',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[#6c8cff]'
        )}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
