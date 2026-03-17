'use client';
import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import ChatView from '@/components/chat/ChatView';

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const setActiveConversation = useChatStore(s => s.setActiveConversation);
  const conversations = useChatStore(s => s.conversations);

  useEffect(() => {
    const exists = conversations.find(c => c.id === id);
    if (!exists) {
      router.replace('/chat');
      return;
    }
    setActiveConversation(id);
  }, [id]);

  return <ChatView />;
}
