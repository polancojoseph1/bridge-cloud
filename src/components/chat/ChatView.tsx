'use client';

import { useChatStore } from '@/store/chatStore';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { useEffect, useRef, use } from 'react';
import EmptyState from './EmptyState';
import InstanceTabBar from '@/components/instance/InstanceTabBar';
import { useInstanceStore } from '@/store/instanceStore';

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
export default function ChatView({ params }: { params?: Promise<{ id: string }> }) {
  const resolvedParams = params ? use(params) : null;
  const conversationIdFromUrl = resolvedParams?.id;

  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const activeConversation = useChatStore((s) => s.activeConversation());
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const activeAgentId = useChatStore((s) => s.activeAgentId);
  const setActiveAgent = useChatStore((s) => s.setActiveAgent);

  const activeInstanceId = useInstanceStore((s) => s.activeInstanceId);
  const activeInstance = useInstanceStore((s) => s.activeInstance());
  const setInstanceConversation = useInstanceStore((s) => s.setInstanceConversation);

  // Keep track of previous active instance ID to know when a tab switch occurred
  const prevInstanceIdRef = useRef<string | null>(null);

  // Sync URL conversation ID to store
  useEffect(() => {
    if (conversationIdFromUrl && conversationIdFromUrl !== activeConversationId) {
      setActiveConversation(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl, activeConversationId, setActiveConversation]);

  useEffect(() => {
    if (!activeInstance || !activeInstanceId) return;

    // SCENARIO 1: Tab switched
    if (prevInstanceIdRef.current !== activeInstanceId) {
      if (activeInstance.conversationId !== activeConversationId) {
        setActiveConversation(activeInstance.conversationId);
      }
      if (activeInstance.agentId !== activeAgentId) {
        setActiveAgent(activeInstance.agentId);
      }
      prevInstanceIdRef.current = activeInstanceId;
    }
    // SCENARIO 2: Still on the same tab, but a new conversation was created in ChatStore
    else if (activeConversationId && activeInstance.conversationId !== activeConversationId) {
      setInstanceConversation(activeInstanceId, activeConversationId);
    }
  }, [
    activeInstance,
    activeInstanceId,
    activeConversationId,
    activeAgentId,
    setActiveConversation,
    setActiveAgent,
    setInstanceConversation
  ]);

  const isEmpty = !activeConversationId || (activeConversation && activeConversation.messages.length === 0);

  // We add an autoFocus prop passed to InputBar to force focus when switching from EmptyState
  return (
    <div className="flex-1 flex flex-col bg-[#0a1410] min-h-0 overflow-hidden relative">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/*
             * MessageList fills all remaining vertical space (flex-1 + overflow-y-auto
             * is handled inside MessageList itself).
             */}
            <MessageList conversationId={activeConversationId} />

            {/*
             * InputBar is sticky-bottom, rendered after the message feed so it
             * naturally sits at the bottom of the column.
             */}
            <InputBar autoFocus={true} />
          </>
        )}
      </div>

      {/* Instance tabs at the very bottom */}
      <InstanceTabBar />
    </div>
  );
}
