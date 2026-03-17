'use client';

import { useChatStore } from '@/store/chatStore';
import MessageList from './MessageList';
import InputBar from './InputBar';
import EmptyState from './EmptyState';

// ─── ChatView ─────────────────────────────────────────────────────────────────

/**
 * Main chat layout component.
 *
 * - Reads `activeConversationId` from the Zustand store.
 * - If null: renders EmptyState (centered agent picker / welcome screen).
 * - If set: renders MessageList + InputBar stacked in a full-height column.
 *
 * This component owns no local state — all state lives in the store.
 * It's intentionally thin so that MessageList and InputBar remain independently
 * testable and reusable.
 */
export default function ChatView() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  if (!activeConversationId) {
    return (
      <div className="flex-1 flex flex-col bg-[#0a1410] min-h-0">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a1410] min-h-0 overflow-hidden">
      {/*
       * MessageList fills all remaining vertical space (flex-1 + overflow-y-auto
       * is handled inside MessageList itself).
       */}
      <MessageList conversationId={activeConversationId} />

      {/*
       * InputBar is sticky-bottom, rendered after the message feed so it
       * naturally sits at the bottom of the column.
       */}
      <InputBar />
    </div>
  );
}
