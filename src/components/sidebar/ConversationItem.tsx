'use client';

import { memo, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Check } from 'lucide-react';
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

/**
 * ⚡ Bolt Optimization: Added React.memo()
 * 💡 What: Prevents ConversationItem from re-rendering unless its props (conversation or isActive) change.
 * 🎯 Why: When a new chat is created or the active chat changes, the entire Sidebar re-renders.
 *         Without memo, every single historical chat item re-renders, slowing down navigation.
 * 📊 Impact: O(1) render cost for sidebar items on route changes instead of O(N) where N is total chats.
 */
export const ConversationItem = memo(function ConversationItem({ conversation, isActive }: ConversationItemProps) {
  const router = useRouter();
  const deleteConversation = useChatStore((s) => s.deleteConversation);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(deleteTimeoutRef.current);
  }, []);

  function handleClick() {
    router.push(`/chat/${conversation.id}`);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (isConfirmingDelete) {
      deleteConversation(conversation.id);
    } else {
      setIsConfirmingDelete(true);
      deleteTimeoutRef.current = setTimeout(() => setIsConfirmingDelete(false), 3000);
    }
  }

  function handleMouseLeave() {
    setIsConfirmingDelete(false);
    clearTimeout(deleteTimeoutRef.current);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onMouseLeave={handleMouseLeave}
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
        aria-label={isConfirmingDelete ? "Confirm delete" : "Delete conversation"}
        title={isConfirmingDelete ? "Confirm delete" : "Delete conversation"}
        className={cn(
          'flex-shrink-0 p-1 rounded',
          isConfirmingDelete ? 'opacity-100 text-[#e05c5c]' : 'opacity-0 group-hover:opacity-100 text-[#5c5c5c] hover:text-[#e05c5c]',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-[#6c8cff]'
        )}
      >
        {isConfirmingDelete ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
});
