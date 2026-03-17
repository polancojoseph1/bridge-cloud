'use client';
import { useChatStore } from '@/store/chatStore';
import { ConversationItem } from '@/components/sidebar/ConversationItem';

export default function ConversationList() {
  const conversations = useChatStore(s => s.conversations);
  const activeConversationId = useChatStore(s => s.activeConversationId);

  if (conversations.length === 0) {
    return <p className="px-3 py-4 text-[12px] text-[#5c5c5c]">No conversations yet</p>;
  }

  return (
    <div className="px-1 py-1 flex flex-col gap-0.5">
      {conversations.map(conv => (
        <ConversationItem key={conv.id} conversation={conv} isActive={conv.id === activeConversationId} />
      ))}
    </div>
  );
}
