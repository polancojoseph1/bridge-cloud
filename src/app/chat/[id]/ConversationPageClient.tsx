'use client';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { useInstanceStore } from '@/store/instanceStore';
import ChatView from '@/components/chat/ChatView';

export default function ConversationPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const setActiveConversation = useChatStore(s => s.setActiveConversation);
  // Track length only — the effect uses getState() to avoid stale closure after rehydration.
  const convCount = useChatStore(s => s.conversations.length);

  useEffect(() => {
    // Don't redirect until the store has rehydrated from localStorage.
    // Without this guard, a direct URL load redirects to /chat before
    // persisted conversations are loaded.
    if (!useChatStore.persist.hasHydrated()) return;
    // Use getState() instead of reactive `conversations` to bypass the stale render
    // cycle: hasHydrated() turns true synchronously inside rehydrate(), but React
    // hasn't re-rendered with the new conversations array yet, so the reactive
    // value is still empty and would incorrectly trigger a redirect.
    const exists = useChatStore.getState().conversations.find(c => c.id === id);
    if (!exists) {
      router.replace('/chat');
      return;
    }
    setActiveConversation(id);
    // Also bind to the active instance so ChatView's sync effect doesn't override.
    const { activeInstanceId, setInstanceConversation } = useInstanceStore.getState();
    if (activeInstanceId) {
      setInstanceConversation(activeInstanceId, id);
    }
  }, [id, convCount]);

  return <ChatView />;
}
