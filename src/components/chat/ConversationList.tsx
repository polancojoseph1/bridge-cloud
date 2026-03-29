'use client';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { useChatStore } from '@/store/chatStore';
import { ConversationItem } from '@/components/sidebar/ConversationItem';
import type { Conversation } from '@/types';

/**
 * ⚡ Bolt Optimization: Custom equality function for conversations
 * 💡 What: Compares only the metadata fields (id, title, updatedAt) of the conversations.
 * 🎯 Why: When streaming a new message, the conversations array updates on every chunk because `messages` changes.
 *         By comparing only metadata, ConversationList completely ignores message content updates.
 * 📊 Impact: Prevents ConversationList re-renders during message streaming. O(1) instead of O(chunks) re-renders.
 */
function compareConversationsMetadata(oldVal: Conversation[], newVal: Conversation[]) {
  if (oldVal.length !== newVal.length) return false;
  for (let i = 0; i < oldVal.length; i++) {
    const o = oldVal[i];
    const n = newVal[i];
    if (o.id !== n.id || o.title !== n.title || o.updatedAt !== n.updatedAt) {
      return false;
    }
  }
  return true;
}

export default function ConversationList() {
  const conversations = useStoreWithEqualityFn(useChatStore, s => s.conversations, compareConversationsMetadata);
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
