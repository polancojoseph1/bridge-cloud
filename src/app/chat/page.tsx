'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import EmptyState from '@/components/chat/EmptyState';

export default function ChatPage() {
  const router = useRouter();
  const conversations = useChatStore(s => s.conversations);

  useEffect(() => {
    if (conversations.length > 0) {
      router.replace('/chat/' + conversations[0].id);
    }
  }, []);

  return <EmptyState />;
}
